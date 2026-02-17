import type {
  IFileUploader,
  PickedFile,
  UploadConfig,
  UploadProgressInfo,
  QueueStatus,
  UploadResult,
  UploadError,
  CreateFileUploaderOptions,
} from '../types';
import { DEFAULT_UPLOAD_CONFIG } from '../constants';
import {
  createUploadError,
  shouldUseChunkedUpload,
  generateId,
} from '../utils';
import { UploadQueue } from './UploadQueue';
import { ChunkedUploader } from './ChunkedUploader';

/**
 * Web implementation of IFileUploader using XMLHttpRequest.
 */
export class WebFileUploader implements IFileUploader {
  private _queue: UploadQueue;
  private _abortControllers = new Map<string, AbortController>();
  private _xhrs = new Map<string, XMLHttpRequest>();
  private _chunkedUploaders = new Map<string, ChunkedUploader>();
  private _disposed = false;

  constructor(options?: CreateFileUploaderOptions) {
    this._queue = new UploadQueue(options?.concurrency || 3);
  }

  get queueStatus(): QueueStatus {
    return this._queue.queueStatus;
  }

  get uploads(): Map<string, UploadProgressInfo> {
    return this._queue.uploads;
  }

  add(files: PickedFile | PickedFile[], config: UploadConfig): string[] {
    const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config } as UploadConfig;
    return this._queue.add(files, finalConfig);
  }

  start(): void {
    this._queue.start();
    this._processQueue();
  }

  pause(): void {
    this._queue.pause();

    // Abort active uploads
    for (const [id] of this._xhrs) {
      this._abortUpload(id);
    }
  }

  resume(): void {
    this._queue.resume();
    this._processQueue();
  }

  cancel(uploadId: string): void {
    this._abortUpload(uploadId);
    this._queue.cancel(uploadId);
  }

  cancelAll(): void {
    for (const [id] of this._xhrs) {
      this._abortUpload(id);
    }
    this._queue.cancelAll();
  }

  retry(uploadId: string): void {
    this._queue.retry(uploadId);
    this._processQueue();
  }

  retryAll(): void {
    this._queue.retryAll();
    this._processQueue();
  }

  remove(uploadId: string): void {
    this._abortUpload(uploadId);
    this._queue.remove(uploadId);
  }

  clearCompleted(): void {
    this._queue.clearCompleted();
  }

  getUpload(uploadId: string): UploadProgressInfo | undefined {
    return this._queue.getUpload(uploadId);
  }

  onQueueChange(callback: (status: QueueStatus) => void): () => void {
    return this._queue.onQueueChange(callback);
  }

  onProgress(uploadId: string, callback: (progress: UploadProgressInfo) => void): () => void {
    return this._queue.onProgress(uploadId, callback);
  }

  onComplete(callback: (result: UploadResult) => void): () => void {
    return this._queue.onComplete(callback);
  }

  onError(callback: (error: UploadError, uploadId: string) => void): () => void {
    return this._queue.onError(callback);
  }

  dispose(): void {
    this._disposed = true;
    this.cancelAll();
    this._queue.dispose();
    this._abortControllers.clear();
    this._xhrs.clear();
    this._chunkedUploaders.clear();
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private _processQueue(): void {
    if (this._disposed) return;

    let nextUpload = this._queue.getNextUpload();

    while (nextUpload) {
      this._startUpload(nextUpload);
      nextUpload = this._queue.getNextUpload();
    }
  }

  private async _startUpload(upload: UploadProgressInfo): Promise<void> {
    const { id, file, config } = upload;

    this._queue.markStarted(id);

    // Check if we should use chunked upload
    if (shouldUseChunkedUpload(file.size, config)) {
      await this._startChunkedUpload(upload);
    } else {
      await this._startSimpleUpload(upload);
    }
  }

  private async _startSimpleUpload(upload: UploadProgressInfo): Promise<void> {
    const { id, file, config } = upload;

    const xhr = new XMLHttpRequest();
    this._xhrs.set(id, xhr);

    const abortController = new AbortController();
    this._abortControllers.set(id, abortController);

    return new Promise((resolve) => {
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          this._queue.updateProgress(id, event.loaded);
        }
      };

      // Handle completion
      xhr.onload = async () => {
        this._cleanup(id);

        if (xhr.status >= 200 && xhr.status < 300) {
          let response: unknown;
          try {
            response = JSON.parse(xhr.responseText);
          } catch {
            response = xhr.responseText;
          }

          this._queue.markCompleted(id, response, xhr.status);
        } else {
          this._queue.markFailed(
            id,
            createUploadError('SERVER_ERROR', `Server returned ${xhr.status}`, xhr.status)
          );
        }

        this._processQueue();
        resolve();
      };

      // Handle errors
      xhr.onerror = () => {
        this._cleanup(id);
        this._queue.markFailed(id, createUploadError('NETWORK_ERROR', 'Network error occurred'));
        this._processQueue();
        resolve();
      };

      xhr.ontimeout = () => {
        this._cleanup(id);
        this._queue.markFailed(id, createUploadError('TIMEOUT', 'Upload timed out'));
        this._processQueue();
        resolve();
      };

      xhr.onabort = () => {
        this._cleanup(id);
        // Don't mark as failed - already handled by cancel/pause
        resolve();
      };

      // Open connection
      xhr.open(config.method, config.url, true);
      xhr.timeout = config.timeout;

      // Set headers
      if (config.headers) {
        for (const [key, value] of Object.entries(config.headers)) {
          xhr.setRequestHeader(key, value);
        }
      }

      // Build and send request
      this._buildAndSendRequest(xhr, file, config);
    });
  }

  private async _buildAndSendRequest(
    xhr: XMLHttpRequest,
    file: PickedFile,
    config: UploadConfig
  ): Promise<void> {
    if (config.multipart) {
      const formData = new FormData();

      // Get file data
      const data = await file.getData();
      const blob = data instanceof Blob ? data : this._base64ToBlob(data as string, file.type);

      formData.append(config.fieldName, blob, file.name);

      // Add additional form data
      if (config.formData) {
        for (const [key, value] of Object.entries(config.formData)) {
          formData.append(key, String(value));
        }
      }

      // Apply custom transform if provided
      if (config.transformRequest) {
        const transformed = await config.transformRequest(file, formData);
        xhr.send(transformed);
      } else {
        xhr.send(formData);
      }
    } else {
      // Send raw file data
      const data = await file.getData();
      const blob = data instanceof Blob ? data : this._base64ToBlob(data as string, file.type);

      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(blob);
    }
  }

  private async _startChunkedUpload(upload: UploadProgressInfo): Promise<void> {
    const { id, file, config } = upload;

    const chunkedUploader = new ChunkedUploader(config.chunkSize);
    this._chunkedUploaders.set(id, chunkedUploader);

    const abortController = new AbortController();
    this._abortControllers.set(id, abortController);

    const result = await chunkedUploader.uploadFile(
      file,
      {
        ...config,
        fileId: generateId('file'),
      },
      {
        onProgress: (progress) => {
          this._queue.updateProgress(id, progress.bytesUploaded, {
            currentChunk: progress.currentChunk,
            totalChunks: progress.totalChunks,
          });
        },
        abortSignal: abortController.signal,
      }
    );

    this._cleanup(id);

    if (result.success) {
      this._queue.markCompleted(id, result.response);
    } else if (result.error) {
      this._queue.markFailed(id, result.error);
    }

    this._processQueue();
  }

  private _abortUpload(uploadId: string): void {
    // Abort XHR
    const xhr = this._xhrs.get(uploadId);
    if (xhr) {
      xhr.abort();
    }

    // Abort controller
    const controller = this._abortControllers.get(uploadId);
    if (controller) {
      controller.abort();
    }

    // Abort chunked uploader
    const chunkedUploader = this._chunkedUploaders.get(uploadId);
    if (chunkedUploader) {
      chunkedUploader.abort();
    }
  }

  private _cleanup(uploadId: string): void {
    this._xhrs.delete(uploadId);
    this._abortControllers.delete(uploadId);
    this._chunkedUploaders.delete(uploadId);
  }

  private _base64ToBlob(base64: string, type: string): Blob {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type });
  }
}

/**
 * Create a new WebFileUploader instance.
 */
export function createFileUploader(options?: CreateFileUploaderOptions): IFileUploader {
  return new WebFileUploader(options);
}
