import type {
  PickedFile,
  UploadConfig,
  ChunkProgress,
  ChunkUploadConfig,
  UploadError,
} from '../types';
import {
  generateId,
  calculateChunkCount,
  getChunkBoundaries,
  createUploadError,
} from '../utils';
import { SIZE_LIMITS } from '../constants';

export interface ChunkedUploadOptions {
  onProgress?: (progress: ChunkProgress) => void;
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
  abortSignal?: AbortSignal;
}

/**
 * Handles chunked uploads for large files.
 * Supports resume by tracking uploaded chunks.
 */
export class ChunkedUploader {
  private _chunkSize: number;
  private _uploadedChunks = new Set<number>();
  private _aborted = false;

  constructor(chunkSize: number = SIZE_LIMITS.DEFAULT_CHUNK_SIZE) {
    this._chunkSize = Math.max(
      SIZE_LIMITS.MIN_CHUNK_SIZE,
      Math.min(chunkSize, SIZE_LIMITS.MAX_CHUNK_SIZE)
    );
  }

  /**
   * Upload a file in chunks.
   */
  async uploadFile(
    file: PickedFile,
    config: ChunkUploadConfig,
    options: ChunkedUploadOptions = {}
  ): Promise<{ success: boolean; response?: unknown; error?: UploadError }> {
    const { onProgress, onChunkComplete, abortSignal } = options;

    this._aborted = false;
    this._uploadedChunks.clear();

    const totalChunks = calculateChunkCount(file.size, this._chunkSize);
    const fileId = config.fileId || generateId('chunked');

    let uploadedBytes = 0;

    // Listen for abort
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        this._aborted = true;
      });
    }

    try {
      // Upload each chunk sequentially
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (this._aborted) {
          return {
            success: false,
            error: createUploadError('ABORTED', 'Upload was cancelled'),
          };
        }

        // Skip already uploaded chunks (for resume)
        if (this._uploadedChunks.has(chunkIndex)) {
          const { end, start } = getChunkBoundaries(file.size, this._chunkSize, chunkIndex);
          uploadedBytes += end - start;
          continue;
        }

        const result = await this._uploadChunk(
          file,
          chunkIndex,
          totalChunks,
          fileId,
          config
        );

        if (!result.success) {
          return {
            success: false,
            error: result.error,
          };
        }

        this._uploadedChunks.add(chunkIndex);
        const { end, start } = getChunkBoundaries(file.size, this._chunkSize, chunkIndex);
        uploadedBytes += end - start;

        // Report progress
        if (onProgress) {
          onProgress({
            currentChunk: chunkIndex + 1,
            totalChunks,
            bytesUploaded: uploadedBytes,
            bytesTotal: file.size,
            percentage: (uploadedBytes / file.size) * 100,
          });
        }

        if (onChunkComplete) {
          onChunkComplete(chunkIndex, totalChunks);
        }
      }

      // Finalize the upload if a finalize URL is provided
      if (config.finalizeUrl) {
        return await this._finalizeUpload(fileId, file, config);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: createUploadError(
          'CHUNK_FAILED',
          error instanceof Error ? error.message : 'Chunk upload failed',
          undefined,
          error instanceof Error ? error : undefined
        ),
      };
    }
  }

  /**
   * Get uploaded chunk indices (for resume).
   */
  getUploadedChunks(): number[] {
    return Array.from(this._uploadedChunks);
  }

  /**
   * Set uploaded chunks (for resume from saved state).
   */
  setUploadedChunks(chunks: number[]): void {
    this._uploadedChunks = new Set(chunks);
  }

  /**
   * Abort the current upload.
   */
  abort(): void {
    this._aborted = true;
  }

  /**
   * Reset the uploader state.
   */
  reset(): void {
    this._aborted = false;
    this._uploadedChunks.clear();
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private async _uploadChunk(
    file: PickedFile,
    chunkIndex: number,
    totalChunks: number,
    fileId: string,
    config: ChunkUploadConfig
  ): Promise<{ success: boolean; error?: UploadError }> {
    const { start, end } = getChunkBoundaries(file.size, this._chunkSize, chunkIndex);

    // Get chunk data
    const chunk = await this._getChunkData(file, start, end);

    // Build form data
    const formData = new FormData();
    formData.append(config.fieldName, chunk, file.name);
    formData.append('fileId', fileId);
    formData.append('chunkIndex', String(chunkIndex));
    formData.append('totalChunks', String(totalChunks));
    formData.append('fileName', file.name);
    formData.append('fileSize', String(file.size));
    formData.append('chunkSize', String(this._chunkSize));

    // Add additional form data
    if (config.formData) {
      for (const [key, value] of Object.entries(config.formData)) {
        formData.append(key, String(value));
      }
    }

    // Upload the chunk
    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: formData,
        signal: this._aborted ? AbortSignal.abort() : undefined,
      });

      if (!response.ok) {
        return {
          success: false,
          error: createUploadError(
            'SERVER_ERROR',
            `Server returned ${response.status}`,
            response.status
          ),
        };
      }

      return { success: true };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          success: false,
          error: createUploadError('ABORTED', 'Chunk upload was cancelled'),
        };
      }

      return {
        success: false,
        error: createUploadError(
          'NETWORK_ERROR',
          error instanceof Error ? error.message : 'Network error',
          undefined,
          error instanceof Error ? error : undefined
        ),
      };
    }
  }

  private async _getChunkData(file: PickedFile, start: number, end: number): Promise<Blob> {
    const data = await file.getData();

    if (data instanceof Blob) {
      return data.slice(start, end);
    }

    // For native (base64), convert to Blob
    const base64 = data as string;
    const binaryString = atob(base64);

    // Slice the relevant portion
    const chunkBinaryString = binaryString.slice(start, end);
    const bytes = new Uint8Array(chunkBinaryString.length);

    for (let i = 0; i < chunkBinaryString.length; i++) {
      bytes[i] = chunkBinaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: file.type });
  }

  private async _finalizeUpload(
    fileId: string,
    file: PickedFile,
    config: ChunkUploadConfig
  ): Promise<{ success: boolean; response?: unknown; error?: UploadError }> {
    try {
      const response = await fetch(config.finalizeUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify({
          fileId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          totalChunks: calculateChunkCount(file.size, this._chunkSize),
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: createUploadError(
            'SERVER_ERROR',
            `Failed to finalize upload: ${response.status}`,
            response.status
          ),
        };
      }

      const result = await response.json();
      return { success: true, response: result };
    } catch (error) {
      return {
        success: false,
        error: createUploadError(
          'NETWORK_ERROR',
          'Failed to finalize upload',
          undefined,
          error instanceof Error ? error : undefined
        ),
      };
    }
  }
}

/**
 * Create a new ChunkedUploader instance.
 */
export function createChunkedUploader(chunkSize?: number): ChunkedUploader {
  return new ChunkedUploader(chunkSize);
}
