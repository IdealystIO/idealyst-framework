import type {
  PickedFile,
  UploadConfig,
  UploadProgressInfo,
  UploadState,
  UploadResult,
  QueueStatus,
  UploadError,
} from '../types';
import { INITIAL_QUEUE_STATUS, TIMING } from '../constants';
import {
  generateId,
  EventEmitter,
  SpeedCalculator,
  calculateETA,
  calculateRetryDelay,
  isRetryableError,
} from '../utils';

type QueueEvents = {
  queueChange: [QueueStatus];
  progress: [string, UploadProgressInfo];
  complete: [UploadResult];
  error: [UploadError, string];
};

/**
 * Manages upload queue with concurrency control, retry logic, and progress tracking.
 */
export class UploadQueue {
  private _uploads = new Map<string, UploadProgressInfo>();
  private _queue: string[] = [];
  private _activeUploads = new Set<string>();
  private _speedCalculators = new Map<string, SpeedCalculator>();
  private _events = new EventEmitter<QueueEvents>();
  private _status: QueueStatus = { ...INITIAL_QUEUE_STATUS };
  private _concurrency: number;
  private _isPaused = false;
  private _isProcessing = false;
  private _disposed = false;

  constructor(concurrency = 3) {
    this._concurrency = concurrency;
  }

  get queueStatus(): QueueStatus {
    return { ...this._status };
  }

  get uploads(): Map<string, UploadProgressInfo> {
    return new Map(this._uploads);
  }

  /**
   * Add file(s) to the upload queue.
   */
  add(files: PickedFile | PickedFile[], config: UploadConfig): string[] {
    const fileArray = Array.isArray(files) ? files : [files];
    const ids: string[] = [];

    for (const file of fileArray) {
      const id = generateId('upload');

      const progress: UploadProgressInfo = {
        id,
        file,
        state: 'pending',
        bytesUploaded: 0,
        bytesTotal: file.size,
        percentage: 0,
        speed: 0,
        estimatedTimeRemaining: 0,
        retryCount: 0,
        config,
      };

      this._uploads.set(id, progress);
      this._queue.push(id);
      this._speedCalculators.set(id, new SpeedCalculator(TIMING.SPEED_CALCULATION_WINDOW));
      ids.push(id);
    }

    this._updateQueueStatus();
    return ids;
  }

  /**
   * Start processing the queue.
   */
  start(): void {
    if (this._disposed || this._isProcessing) return;

    this._isPaused = false;
    this._isProcessing = true;
    this._processQueue();
  }

  /**
   * Pause all uploads.
   */
  pause(): void {
    this._isPaused = true;

    // Mark active uploads as paused
    for (const id of this._activeUploads) {
      this._updateUploadState(id, 'paused');
    }

    this._updateQueueStatus();
  }

  /**
   * Resume paused uploads.
   */
  resume(): void {
    this._isPaused = false;

    // Mark paused uploads as pending to be reprocessed
    for (const [id, upload] of this._uploads) {
      if (upload.state === 'paused') {
        this._updateUploadState(id, 'pending');
        if (!this._queue.includes(id)) {
          this._queue.push(id);
        }
      }
    }

    this._updateQueueStatus();
    this._processQueue();
  }

  /**
   * Cancel a specific upload.
   */
  cancel(uploadId: string): void {
    const upload = this._uploads.get(uploadId);
    if (!upload) return;

    this._updateUploadState(uploadId, 'cancelled');
    this._activeUploads.delete(uploadId);
    this._queue = this._queue.filter(id => id !== uploadId);
    this._speedCalculators.delete(uploadId);

    this._updateQueueStatus();
    this._processQueue();
  }

  /**
   * Cancel all uploads.
   */
  cancelAll(): void {
    for (const [id] of this._uploads) {
      this._updateUploadState(id, 'cancelled');
    }

    this._activeUploads.clear();
    this._queue = [];
    this._speedCalculators.clear();

    this._updateQueueStatus();
  }

  /**
   * Retry a failed upload.
   */
  retry(uploadId: string): void {
    const upload = this._uploads.get(uploadId);
    if (!upload || upload.state !== 'failed') return;

    // Reset upload state
    this._uploads.set(uploadId, {
      ...upload,
      state: 'pending',
      bytesUploaded: 0,
      percentage: 0,
      speed: 0,
      estimatedTimeRemaining: 0,
      error: undefined,
      currentChunk: undefined,
    });

    this._speedCalculators.set(uploadId, new SpeedCalculator(TIMING.SPEED_CALCULATION_WINDOW));
    this._queue.push(uploadId);

    this._updateQueueStatus();
    this._processQueue();
  }

  /**
   * Retry all failed uploads.
   */
  retryAll(): void {
    for (const [id, upload] of this._uploads) {
      if (upload.state === 'failed') {
        this.retry(id);
      }
    }
  }

  /**
   * Remove an upload from the queue.
   */
  remove(uploadId: string): void {
    this._uploads.delete(uploadId);
    this._activeUploads.delete(uploadId);
    this._queue = this._queue.filter(id => id !== uploadId);
    this._speedCalculators.delete(uploadId);

    this._updateQueueStatus();
  }

  /**
   * Clear completed uploads.
   */
  clearCompleted(): void {
    for (const [id, upload] of this._uploads) {
      if (upload.state === 'completed' || upload.state === 'cancelled') {
        this._uploads.delete(id);
        this._speedCalculators.delete(id);
      }
    }

    this._updateQueueStatus();
  }

  /**
   * Get a specific upload.
   */
  getUpload(uploadId: string): UploadProgressInfo | undefined {
    return this._uploads.get(uploadId);
  }

  /**
   * Update upload progress.
   */
  updateProgress(
    uploadId: string,
    bytesUploaded: number,
    additionalData?: Partial<Pick<UploadProgressInfo, 'currentChunk' | 'totalChunks'>>
  ): void {
    const upload = this._uploads.get(uploadId);
    if (!upload) return;

    const speedCalc = this._speedCalculators.get(uploadId);
    if (speedCalc) {
      speedCalc.addSample(bytesUploaded);
    }

    const speed = speedCalc?.getSpeed() || 0;
    const bytesRemaining = upload.bytesTotal - bytesUploaded;
    const eta = calculateETA(bytesRemaining, speed);
    const percentage = upload.bytesTotal > 0 ? (bytesUploaded / upload.bytesTotal) * 100 : 0;

    this._uploads.set(uploadId, {
      ...upload,
      bytesUploaded,
      percentage,
      speed,
      estimatedTimeRemaining: eta,
      ...additionalData,
    });

    this._events.emit('progress', uploadId, this._uploads.get(uploadId)!);
    this._updateQueueStatus();
  }

  /**
   * Mark an upload as started.
   */
  markStarted(uploadId: string): void {
    const upload = this._uploads.get(uploadId);
    if (!upload) return;

    this._uploads.set(uploadId, {
      ...upload,
      state: 'uploading',
      startedAt: Date.now(),
    });

    this._activeUploads.add(uploadId);
    this._events.emit('progress', uploadId, this._uploads.get(uploadId)!);
    this._updateQueueStatus();
  }

  /**
   * Mark an upload as completed.
   */
  markCompleted(uploadId: string, response?: unknown, statusCode?: number): void {
    const upload = this._uploads.get(uploadId);
    if (!upload) return;

    const updatedUpload: UploadProgressInfo = {
      ...upload,
      state: 'completed',
      bytesUploaded: upload.bytesTotal,
      percentage: 100,
      speed: 0,
      estimatedTimeRemaining: 0,
      completedAt: Date.now(),
    };

    this._uploads.set(uploadId, updatedUpload);
    this._activeUploads.delete(uploadId);
    this._speedCalculators.delete(uploadId);

    const result: UploadResult = {
      id: uploadId,
      success: true,
      response,
      statusCode,
      progress: updatedUpload,
    };

    this._events.emit('complete', result);
    this._updateQueueStatus();
    this._processQueue();
  }

  /**
   * Mark an upload as failed.
   */
  markFailed(uploadId: string, error: UploadError): void {
    const upload = this._uploads.get(uploadId);
    if (!upload) return;

    const shouldRetry = upload.config.retryEnabled &&
      upload.retryCount < upload.config.maxRetries &&
      isRetryableError(error);

    if (shouldRetry) {
      // Schedule retry
      const delay = calculateRetryDelay(
        upload.retryCount + 1,
        upload.config.retryDelay,
        upload.config.retryDelayMs
      );

      this._uploads.set(uploadId, {
        ...upload,
        state: 'pending',
        retryCount: upload.retryCount + 1,
      });

      this._activeUploads.delete(uploadId);

      // Add back to queue after delay
      setTimeout(() => {
        if (!this._disposed && this._uploads.has(uploadId)) {
          this._queue.push(uploadId);
          this._processQueue();
        }
      }, delay);
    } else {
      // Mark as failed permanently
      this._uploads.set(uploadId, {
        ...upload,
        state: 'failed',
        error,
      });

      this._activeUploads.delete(uploadId);
      this._speedCalculators.delete(uploadId);

      const result: UploadResult = {
        id: uploadId,
        success: false,
        error,
        statusCode: error.statusCode,
        progress: this._uploads.get(uploadId)!,
      };

      this._events.emit('complete', result);
      this._events.emit('error', error, uploadId);
    }

    this._updateQueueStatus();
    this._processQueue();
  }

  /**
   * Get the next upload to process.
   */
  getNextUpload(): UploadProgressInfo | undefined {
    if (this._isPaused || this._disposed) return undefined;
    if (this._activeUploads.size >= this._concurrency) return undefined;

    while (this._queue.length > 0) {
      const id = this._queue.shift()!;
      const upload = this._uploads.get(id);

      if (upload && upload.state === 'pending') {
        return upload;
      }
    }

    return undefined;
  }

  /**
   * Subscribe to queue status changes.
   */
  onQueueChange(callback: (status: QueueStatus) => void): () => void {
    return this._events.on('queueChange', callback);
  }

  /**
   * Subscribe to individual upload progress.
   */
  onProgress(uploadId: string, callback: (progress: UploadProgressInfo) => void): () => void {
    return this._events.on('progress', (id, progress) => {
      if (id === uploadId) {
        callback(progress);
      }
    });
  }

  /**
   * Subscribe to upload completion.
   */
  onComplete(callback: (result: UploadResult) => void): () => void {
    return this._events.on('complete', callback);
  }

  /**
   * Subscribe to upload errors.
   */
  onError(callback: (error: UploadError, uploadId: string) => void): () => void {
    return this._events.on('error', callback);
  }

  /**
   * Clean up resources.
   */
  dispose(): void {
    this._disposed = true;
    this._uploads.clear();
    this._queue = [];
    this._activeUploads.clear();
    this._speedCalculators.clear();
    this._events.removeAllListeners();
  }

  // ============================================
  // PROTECTED METHODS (for subclass extension)
  // ============================================

  /**
   * Process the queue - to be called after state changes.
   * Override in subclasses to implement actual upload logic.
   */
  protected _processQueue(): void {
    // Base implementation just updates status
    // Subclasses should override to implement actual upload processing
    this._updateQueueStatus();
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private _updateUploadState(uploadId: string, state: UploadState): void {
    const upload = this._uploads.get(uploadId);
    if (!upload) return;

    this._uploads.set(uploadId, {
      ...upload,
      state,
    });

    this._events.emit('progress', uploadId, this._uploads.get(uploadId)!);
  }

  private _updateQueueStatus(): void {
    let pending = 0;
    let uploading = 0;
    let completed = 0;
    let failed = 0;
    let totalBytes = 0;
    let totalBytesUploaded = 0;

    for (const [, upload] of this._uploads) {
      totalBytes += upload.bytesTotal;
      totalBytesUploaded += upload.bytesUploaded;

      switch (upload.state) {
        case 'pending':
          pending++;
          break;
        case 'uploading':
          uploading++;
          break;
        case 'completed':
          completed++;
          break;
        case 'failed':
          failed++;
          break;
      }
    }

    const total = this._uploads.size;
    const overallProgress = totalBytes > 0 ? (totalBytesUploaded / totalBytes) * 100 : 0;

    this._status = {
      total,
      pending,
      uploading,
      completed,
      failed,
      isProcessing: this._isProcessing && !this._isPaused && uploading > 0,
      isPaused: this._isPaused,
      overallProgress,
      totalBytesUploaded,
      totalBytes,
    };

    this._events.emit('queueChange', this._status);
  }
}
