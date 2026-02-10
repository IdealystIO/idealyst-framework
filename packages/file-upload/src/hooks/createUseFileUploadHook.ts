import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseFileUploadOptions,
  UseFileUploadResult,
  QueueStatus,
  UploadProgress,
  PickedFile,
  UploadConfig,
  IFileUploader,
  CreateFileUploaderFactory,
} from '../types';
import { INITIAL_QUEUE_STATUS, DEFAULT_UPLOAD_CONFIG } from '../constants';

/**
 * Create a useFileUpload hook with the given file uploader factory.
 */
export function createUseFileUploadHook(createFileUploader: CreateFileUploaderFactory) {
  return function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadResult {
    const { config = {}, autoStart = true, concurrency = 3 } = options;

    const uploaderRef = useRef<IFileUploader | null>(null);
    const configRef = useRef<Partial<Omit<UploadConfig, 'url'>>>(config);

    const [queueStatus, setQueueStatus] = useState<QueueStatus>(INITIAL_QUEUE_STATUS);
    const [uploads, setUploads] = useState<UploadProgress[]>([]);

    // Update config ref when it changes
    useEffect(() => {
      configRef.current = config;
    }, [config]);

    // Initialize uploader
    useEffect(() => {
      const uploader = createFileUploader({ concurrency });
      uploaderRef.current = uploader;

      // Subscribe to queue changes
      const unsubscribeQueue = uploader.onQueueChange((status) => {
        setQueueStatus(status);
        setUploads(Array.from(uploader.uploads.values()));
      });

      // Subscribe to completion for final update
      const unsubscribeComplete = uploader.onComplete(() => {
        setUploads(Array.from(uploader.uploads.values()));
      });

      return () => {
        unsubscribeQueue();
        unsubscribeComplete();
        uploader.dispose();
        uploaderRef.current = null;
      };
    }, [concurrency]);

    /**
     * Add files to upload queue.
     */
    const addFiles = useCallback((
      files: PickedFile | PickedFile[],
      uploadConfig: UploadConfig
    ): string[] => {
      if (!uploaderRef.current) return [];

      const finalConfig: UploadConfig = {
        ...DEFAULT_UPLOAD_CONFIG,
        ...configRef.current,
        ...uploadConfig,
      } as UploadConfig;

      const ids = uploaderRef.current.add(files, finalConfig);

      if (autoStart) {
        uploaderRef.current.start();
      }

      // Update uploads state
      setUploads(Array.from(uploaderRef.current.uploads.values()));

      return ids;
    }, [autoStart]);

    /**
     * Start processing queue.
     */
    const start = useCallback(() => {
      uploaderRef.current?.start();
    }, []);

    /**
     * Pause all uploads.
     */
    const pause = useCallback(() => {
      uploaderRef.current?.pause();
    }, []);

    /**
     * Resume paused uploads.
     */
    const resume = useCallback(() => {
      uploaderRef.current?.resume();
    }, []);

    /**
     * Cancel specific upload.
     */
    const cancel = useCallback((uploadId: string) => {
      uploaderRef.current?.cancel(uploadId);
    }, []);

    /**
     * Cancel all uploads.
     */
    const cancelAll = useCallback(() => {
      uploaderRef.current?.cancelAll();
    }, []);

    /**
     * Retry failed upload.
     */
    const retry = useCallback((uploadId: string) => {
      uploaderRef.current?.retry(uploadId);
    }, []);

    /**
     * Retry all failed uploads.
     */
    const retryAll = useCallback(() => {
      uploaderRef.current?.retryAll();
    }, []);

    /**
     * Remove upload from queue.
     */
    const remove = useCallback((uploadId: string) => {
      uploaderRef.current?.remove(uploadId);
    }, []);

    /**
     * Clear completed uploads.
     */
    const clearCompleted = useCallback(() => {
      uploaderRef.current?.clearCompleted();
    }, []);

    /**
     * Get specific upload.
     */
    const getUpload = useCallback((uploadId: string): UploadProgress | undefined => {
      return uploaderRef.current?.getUpload(uploadId);
    }, []);

    return {
      queueStatus,
      uploads,
      isUploading: queueStatus.isProcessing,
      isPaused: queueStatus.isPaused,
      hasFailedUploads: queueStatus.failed > 0,
      addFiles,
      start,
      pause,
      resume,
      cancel,
      cancelAll,
      retry,
      retryAll,
      remove,
      clearCompleted,
      getUpload,
      uploaderRef,
    };
  };
}
