import type {
  IFileUploader,
  PickedFile,
  UploadConfig,
  UploadProgress,
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

// Lazy load react-native-blob-util
let BlobUtil: typeof import('react-native-blob-util') | null = null;

async function getBlobUtil() {
  if (!BlobUtil) {
    BlobUtil = await import('react-native-blob-util');
  }
  return BlobUtil.default;
}

interface UploadTask {
  cancel: () => void;
}

/**
 * Native implementation of IFileUploader using react-native-blob-util.
 */
export class NativeFileUploader implements IFileUploader {
  private _queue: UploadQueue;
  private _uploadTasks = new Map<string, UploadTask>();
  private _chunkedUploaders = new Map<string, ChunkedUploader>();
  private _abortControllers = new Map<string, AbortController>();
  private _disposed = false;

  constructor(options?: CreateFileUploaderOptions) {
    this._queue = new UploadQueue(options?.concurrency || 3);
  }

  get queueStatus(): QueueStatus {
    return this._queue.queueStatus;
  }

  get uploads(): Map<string, UploadProgress> {
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

    // Cancel active uploads (they'll be retried on resume)
    for (const [id, task] of this._uploadTasks) {
      task.cancel();
    }
  }

  resume(): void {
    this._queue.resume();
    this._processQueue();
  }

  cancel(uploadId: string): void {
    this._cancelUpload(uploadId);
    this._queue.cancel(uploadId);
  }

  cancelAll(): void {
    for (const [id] of this._uploadTasks) {
      this._cancelUpload(id);
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
    this._cancelUpload(uploadId);
    this._queue.remove(uploadId);
  }

  clearCompleted(): void {
    this._queue.clearCompleted();
  }

  getUpload(uploadId: string): UploadProgress | undefined {
    return this._queue.getUpload(uploadId);
  }

  onQueueChange(callback: (status: QueueStatus) => void): () => void {
    return this._queue.onQueueChange(callback);
  }

  onProgress(uploadId: string, callback: (progress: UploadProgress) => void): () => void {
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
    this._uploadTasks.clear();
    this._chunkedUploaders.clear();
    this._abortControllers.clear();
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

  private async _startUpload(upload: UploadProgress): Promise<void> {
    const { id, file, config } = upload;

    this._queue.markStarted(id);

    // Check if we should use chunked upload
    if (shouldUseChunkedUpload(file.size, config)) {
      await this._startChunkedUpload(upload);
    } else if (config.backgroundUpload) {
      await this._startBackgroundUpload(upload);
    } else {
      await this._startSimpleUpload(upload);
    }
  }

  private async _startSimpleUpload(upload: UploadProgress): Promise<void> {
    const { id, file, config } = upload;

    try {
      const RNBlobUtil = await getBlobUtil();

      // Get file path
      const filePath = file.uri.replace('file://', '');

      // Build multipart data
      const multipartData: Array<{ name: string; filename?: string; type?: string; data: string }> = [
        {
          name: config.fieldName,
          filename: file.name,
          type: file.type,
          data: RNBlobUtil.wrap(filePath),
        },
      ];

      // Add additional form data
      if (config.formData) {
        for (const [key, value] of Object.entries(config.formData)) {
          multipartData.push({
            name: key,
            data: String(value),
          });
        }
      }

      // Create upload task
      const task = RNBlobUtil.fetch(
        config.method,
        config.url,
        {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
        multipartData
      );

      // Store task for cancellation
      this._uploadTasks.set(id, {
        cancel: () => task.cancel(),
      });

      // Track progress
      task.uploadProgress((written: number, total: number) => {
        this._queue.updateProgress(id, written);
      });

      // Wait for completion
      const response = await task;
      const statusCode = response.respInfo.status;

      this._cleanup(id);

      if (statusCode >= 200 && statusCode < 300) {
        let responseData: unknown;
        try {
          responseData = response.json();
        } catch {
          responseData = response.text();
        }

        this._queue.markCompleted(id, responseData, statusCode);
      } else {
        this._queue.markFailed(
          id,
          createUploadError('SERVER_ERROR', `Server returned ${statusCode}`, statusCode)
        );
      }
    } catch (error) {
      this._cleanup(id);

      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('cancel')) {
        // Upload was cancelled, don't mark as failed
        return;
      }

      this._queue.markFailed(
        id,
        createUploadError(
          'NETWORK_ERROR',
          errorMessage,
          undefined,
          error instanceof Error ? error : undefined
        )
      );
    }

    this._processQueue();
  }

  private async _startBackgroundUpload(upload: UploadProgress): Promise<void> {
    const { id, file, config } = upload;

    try {
      const RNBlobUtil = await getBlobUtil();

      // Get file path
      const filePath = file.uri.replace('file://', '');

      // Configure for background upload
      const sessionConfig = RNBlobUtil.config({
        IOSBackgroundTask: true,
        indicator: true,
        timeout: config.timeout,
      });

      // Build multipart data
      const multipartData: Array<{ name: string; filename?: string; type?: string; data: string }> = [
        {
          name: config.fieldName,
          filename: file.name,
          type: file.type,
          data: RNBlobUtil.wrap(filePath),
        },
      ];

      // Add additional form data
      if (config.formData) {
        for (const [key, value] of Object.entries(config.formData)) {
          multipartData.push({
            name: key,
            data: String(value),
          });
        }
      }

      // Create upload task with background support
      const task = sessionConfig.fetch(
        config.method,
        config.url,
        {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
        multipartData
      );

      // Store task for cancellation
      this._uploadTasks.set(id, {
        cancel: () => task.cancel(),
      });

      // Track progress (may be delayed until app returns to foreground)
      task.uploadProgress((written: number, total: number) => {
        this._queue.updateProgress(id, written);
      });

      // Wait for completion
      const response = await task;
      const statusCode = response.respInfo.status;

      this._cleanup(id);

      if (statusCode >= 200 && statusCode < 300) {
        let responseData: unknown;
        try {
          responseData = response.json();
        } catch {
          responseData = response.text();
        }

        this._queue.markCompleted(id, responseData, statusCode);
      } else {
        this._queue.markFailed(
          id,
          createUploadError('SERVER_ERROR', `Server returned ${statusCode}`, statusCode)
        );
      }
    } catch (error) {
      this._cleanup(id);

      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('cancel')) {
        return;
      }

      this._queue.markFailed(
        id,
        createUploadError(
          'NETWORK_ERROR',
          errorMessage,
          undefined,
          error instanceof Error ? error : undefined
        )
      );
    }

    this._processQueue();
  }

  private async _startChunkedUpload(upload: UploadProgress): Promise<void> {
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

  private _cancelUpload(uploadId: string): void {
    // Cancel upload task
    const task = this._uploadTasks.get(uploadId);
    if (task) {
      task.cancel();
    }

    // Abort controller for chunked uploads
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
    this._uploadTasks.delete(uploadId);
    this._abortControllers.delete(uploadId);
    this._chunkedUploaders.delete(uploadId);
  }
}

/**
 * Create a new NativeFileUploader instance.
 */
export function createFileUploader(options?: CreateFileUploaderOptions): IFileUploader {
  return new NativeFileUploader(options);
}
