import type {
  FileType,
  PickedFile,
  FilePickerConfig,
  UploadConfig,
  ValidationResult,
  RejectedFile,
  FilePickerError,
  FilePickerErrorCode,
  UploadError,
  UploadErrorCode,
} from './types';
import {
  FILE_TYPE_MIME_TYPES,
  FILE_TYPE_EXTENSIONS,
  DEFAULT_FILE_PICKER_CONFIG,
  DEFAULT_UPLOAD_CONFIG,
  FILE_PICKER_ERROR_MESSAGES,
  UPLOAD_ERROR_MESSAGES,
} from './constants';

// ============================================
// ID GENERATION
// ============================================

/**
 * Generate a unique ID for files and uploads.
 */
export function generateId(prefix = 'file'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

// ============================================
// FILE SIZE FORMATTING
// ============================================

/**
 * Format bytes to human-readable string.
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(dm)} ${sizes[i]}`;
}

/**
 * Parse size string to bytes (e.g., "10MB" -> 10485760).
 */
export function parseSize(size: string): number {
  const match = size.match(/^(\d+(?:\.\d+)?)\s*(bytes?|kb?|mb?|gb?|tb?)?$/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = (match[2] || 'b').toLowerCase();

  const multipliers: Record<string, number> = {
    b: 1,
    byte: 1,
    bytes: 1,
    k: 1024,
    kb: 1024,
    m: 1024 * 1024,
    mb: 1024 * 1024,
    g: 1024 * 1024 * 1024,
    gb: 1024 * 1024 * 1024,
    t: 1024 * 1024 * 1024 * 1024,
    tb: 1024 * 1024 * 1024 * 1024,
  };

  return Math.floor(value * (multipliers[unit] || 1));
}

// ============================================
// DURATION FORMATTING
// ============================================

/**
 * Format milliseconds to human-readable duration string.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return 'less than a second';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  return `${seconds}s`;
}

// ============================================
// MIME TYPE UTILITIES
// ============================================

/**
 * Get MIME types for the given file types.
 */
export function getMimeTypes(fileTypes: FileType[]): string[] {
  const mimeTypes = new Set<string>();

  for (const fileType of fileTypes) {
    const types = FILE_TYPE_MIME_TYPES[fileType] || [];
    for (const type of types) {
      mimeTypes.add(type);
    }
  }

  return Array.from(mimeTypes);
}

/**
 * Get file extensions for the given file types.
 */
export function getExtensions(fileTypes: FileType[]): string[] {
  const extensions = new Set<string>();

  for (const fileType of fileTypes) {
    const exts = FILE_TYPE_EXTENSIONS[fileType] || [];
    for (const ext of exts) {
      extensions.add(ext);
    }
  }

  return Array.from(extensions);
}

/**
 * Build accept string for HTML input element.
 */
export function buildAcceptString(config: Partial<FilePickerConfig>): string {
  if (config.customMimeTypes?.length) {
    return config.customMimeTypes.join(',');
  }

  if (config.customExtensions?.length) {
    return config.customExtensions.join(',');
  }

  const types = config.allowedTypes || ['any'];

  if (types.includes('any')) {
    return '*/*';
  }

  const mimeTypes = getMimeTypes(types);
  const extensions = getExtensions(types);

  return [...mimeTypes, ...extensions].join(',');
}

/**
 * Get file extension from file name.
 */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return '';
  return fileName.substring(lastDot + 1).toLowerCase();
}

/**
 * Determine file type from MIME type.
 */
export function getFileTypeFromMime(mimeType: string): FileType {
  for (const [type, mimes] of Object.entries(FILE_TYPE_MIME_TYPES)) {
    if (type === 'any') continue;
    if (mimes.some(mime => mimeType.startsWith(mime.replace('/*', '')))) {
      return type as FileType;
    }
  }
  return 'any';
}

/**
 * Check if a MIME type matches allowed types.
 */
export function isMimeTypeAllowed(mimeType: string, config: Partial<FilePickerConfig>): boolean {
  // Custom MIME types take precedence
  if (config.customMimeTypes?.length) {
    return config.customMimeTypes.some(allowed => {
      if (allowed === '*/*') return true;
      if (allowed.endsWith('/*')) {
        return mimeType.startsWith(allowed.replace('/*', '/'));
      }
      return mimeType === allowed;
    });
  }

  const allowedTypes = config.allowedTypes || ['any'];

  if (allowedTypes.includes('any')) {
    return true;
  }

  const allowedMimes = getMimeTypes(allowedTypes);
  return allowedMimes.some(allowed => {
    if (allowed === '*/*') return true;
    if (allowed.endsWith('/*')) {
      return mimeType.startsWith(allowed.replace('/*', '/'));
    }
    return mimeType === allowed;
  });
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate files against picker configuration.
 */
export function validateFiles(
  files: Array<File | PickedFile>,
  config: Partial<FilePickerConfig>
): ValidationResult {
  const finalConfig = { ...DEFAULT_FILE_PICKER_CONFIG, ...config };
  const accepted: PickedFile[] = [];
  const rejected: RejectedFile[] = [];

  let totalSize = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const name = 'name' in file ? file.name : (file as File).name;
    const size = 'size' in file ? file.size : (file as File).size;
    const type = 'type' in file ? file.type : (file as File).type;

    // Check file count
    if (finalConfig.maxFiles && accepted.length >= finalConfig.maxFiles) {
      rejected.push({
        name,
        reason: 'count',
        message: `Maximum of ${finalConfig.maxFiles} files allowed`,
      });
      continue;
    }

    // Check file type
    if (!isMimeTypeAllowed(type, finalConfig)) {
      rejected.push({
        name,
        reason: 'type',
        message: `File type '${type}' is not allowed`,
      });
      continue;
    }

    // Check file size
    if (finalConfig.maxFileSize && size > finalConfig.maxFileSize) {
      rejected.push({
        name,
        reason: 'size',
        message: `File size (${formatBytes(size)}) exceeds maximum (${formatBytes(finalConfig.maxFileSize)})`,
      });
      continue;
    }

    // Check total size
    if (finalConfig.maxTotalSize && totalSize + size > finalConfig.maxTotalSize) {
      rejected.push({
        name,
        reason: 'total_size',
        message: `Total size would exceed maximum (${formatBytes(finalConfig.maxTotalSize)})`,
      });
      continue;
    }

    totalSize += size;

    // Convert File to PickedFile if needed
    if ('id' in file) {
      accepted.push(file as PickedFile);
    } else {
      accepted.push(createPickedFileFromFile(file as File));
    }
  }

  return {
    accepted,
    rejected,
    isValid: rejected.length === 0,
  };
}

// ============================================
// FILE CONVERSION
// ============================================

/**
 * Create a PickedFile from a browser File object.
 */
export function createPickedFileFromFile(file: File): PickedFile {
  const uri = URL.createObjectURL(file);
  const extension = getFileExtension(file.name);

  return {
    id: generateId(),
    name: file.name,
    size: file.size,
    type: file.type,
    uri,
    extension,
    lastModified: file.lastModified,
    getArrayBuffer: () => file.arrayBuffer(),
    getData: () => Promise.resolve(file),
  };
}

/**
 * Clean up blob URLs to prevent memory leaks.
 */
export function revokeFileUri(uri: string): void {
  if (uri.startsWith('blob:')) {
    URL.revokeObjectURL(uri);
  }
}

/**
 * Clean up multiple file URIs.
 */
export function revokeFileUris(files: PickedFile[]): void {
  for (const file of files) {
    revokeFileUri(file.uri);
    if (file.thumbnailUri) {
      revokeFileUri(file.thumbnailUri);
    }
  }
}

// ============================================
// ERROR CREATION
// ============================================

/**
 * Create a file picker error.
 */
export function createFilePickerError(
  code: FilePickerErrorCode,
  message?: string,
  originalError?: Error
): FilePickerError {
  return {
    code,
    message: message || FILE_PICKER_ERROR_MESSAGES[code] || 'Unknown error',
    originalError,
  };
}

/**
 * Create an upload error.
 */
export function createUploadError(
  code: UploadErrorCode,
  message?: string,
  statusCode?: number,
  originalError?: Error
): UploadError {
  return {
    code,
    message: message || UPLOAD_ERROR_MESSAGES[code] || 'Unknown error',
    statusCode,
    originalError,
  };
}

// ============================================
// CONFIG MERGING
// ============================================

/**
 * Merge partial file picker config with defaults.
 */
export function mergeFilePickerConfig(config?: Partial<FilePickerConfig>): FilePickerConfig {
  return { ...DEFAULT_FILE_PICKER_CONFIG, ...config };
}

/**
 * Merge partial upload config with defaults.
 */
export function mergeUploadConfig(config: Partial<UploadConfig> & { url: string }): UploadConfig {
  return { ...DEFAULT_UPLOAD_CONFIG, ...config } as UploadConfig;
}

// ============================================
// SPEED CALCULATION
// ============================================

/**
 * Calculate upload speed using a sliding window of samples.
 */
export class SpeedCalculator {
  private samples: Array<{ bytes: number; timestamp: number }> = [];
  private windowMs: number;

  constructor(windowMs = 2000) {
    this.windowMs = windowMs;
  }

  addSample(bytes: number, timestamp = Date.now()): void {
    this.samples.push({ bytes, timestamp });
    this.pruneOldSamples(timestamp);
  }

  getSpeed(): number {
    if (this.samples.length < 2) return 0;

    const now = Date.now();
    this.pruneOldSamples(now);

    if (this.samples.length < 2) return 0;

    const oldest = this.samples[0];
    const newest = this.samples[this.samples.length - 1];
    const timeDiff = (newest.timestamp - oldest.timestamp) / 1000; // Convert to seconds

    if (timeDiff <= 0) return 0;

    const bytesDiff = newest.bytes - oldest.bytes;
    return bytesDiff / timeDiff;
  }

  reset(): void {
    this.samples = [];
  }

  private pruneOldSamples(now: number): void {
    const cutoff = now - this.windowMs;
    this.samples = this.samples.filter(s => s.timestamp > cutoff);
  }
}

/**
 * Calculate estimated time remaining.
 */
export function calculateETA(bytesRemaining: number, speed: number): number {
  if (speed <= 0 || bytesRemaining <= 0) return 0;
  return Math.ceil((bytesRemaining / speed) * 1000); // Return in milliseconds
}

// ============================================
// RETRY LOGIC
// ============================================

/**
 * Calculate retry delay based on strategy.
 */
export function calculateRetryDelay(
  attempt: number,
  strategy: 'fixed' | 'exponential',
  baseDelay: number,
  maxDelay = 30000
): number {
  if (strategy === 'fixed') {
    return baseDelay;
  }

  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Determine if an error is retryable.
 */
export function isRetryableError(error: UploadError): boolean {
  const retryableCodes: UploadErrorCode[] = [
    'NETWORK_ERROR',
    'TIMEOUT',
    'SERVER_ERROR',
    'CHUNK_FAILED',
  ];

  // Don't retry client errors (4xx) except 429 (rate limit)
  if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
    return false;
  }

  return retryableCodes.includes(error.code);
}

// ============================================
// CHUNKED UPLOAD UTILITIES
// ============================================

/**
 * Calculate the number of chunks for a file.
 */
export function calculateChunkCount(fileSize: number, chunkSize: number): number {
  return Math.ceil(fileSize / chunkSize);
}

/**
 * Get chunk boundaries (start and end byte offsets).
 */
export function getChunkBoundaries(
  fileSize: number,
  chunkSize: number,
  chunkIndex: number
): { start: number; end: number } {
  const start = chunkIndex * chunkSize;
  const end = Math.min(start + chunkSize, fileSize);
  return { start, end };
}

/**
 * Determine if a file should use chunked upload.
 */
export function shouldUseChunkedUpload(
  fileSize: number,
  config: Partial<UploadConfig>
): boolean {
  if (config.chunkedUpload === true) {
    return true;
  }

  if (config.chunkedUpload === false) {
    return false;
  }

  const threshold = config.chunkedUploadThreshold || DEFAULT_UPLOAD_CONFIG.chunkedUploadThreshold;
  return fileSize > threshold;
}

// ============================================
// SUBSCRIPTION UTILITIES
// ============================================

/**
 * Simple event emitter for subscriptions.
 */
export class EventEmitter<T extends Record<string, unknown[]>> {
  private listeners = new Map<keyof T, Set<(...args: unknown[]) => void>>();

  on<K extends keyof T>(event: K, callback: (...args: T[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback as (...args: unknown[]) => void);

    return () => {
      this.listeners.get(event)?.delete(callback as (...args: unknown[]) => void);
    };
  }

  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(...args);
      }
    }
  }

  removeAllListeners(event?: keyof T): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
