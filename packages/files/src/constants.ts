import type {
  FilePickerConfig,
  UploadConfig,
  FilePickerStatus,
  QueueStatus,
  FilePickerPresets,
  UploadPresets,
  FileType,
} from './types';

// ============================================
// FILE TYPE MAPPINGS
// ============================================

/**
 * MIME types for each file type category.
 */
export const FILE_TYPE_MIME_TYPES: Record<FileType, string[]> = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],
  video: [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo',
    'video/x-matroska',
    'video/mpeg',
    'video/3gpp',
  ],
  audio: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/webm',
    'audio/x-m4a',
    'audio/aac',
    'audio/flac',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/markdown',
    'application/rtf',
  ],
  archive: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-tar',
    'application/gzip',
    'application/x-7z-compressed',
  ],
  any: ['*/*'],
};

/**
 * File extensions for each file type category.
 */
export const FILE_TYPE_EXTENSIONS: Record<FileType, string[]> = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.svg', '.bmp', '.tiff'],
  video: ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.mpeg', '.3gp'],
  audio: ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.md', '.rtf'],
  archive: ['.zip', '.rar', '.tar', '.gz', '.7z'],
  any: ['*'],
};

/**
 * Document picker type mappings for react-native-document-picker.
 */
export const DOCUMENT_PICKER_TYPES: Record<FileType, string[]> = {
  image: ['public.image'],
  video: ['public.movie'],
  audio: ['public.audio'],
  document: ['public.content', 'public.data'],
  archive: ['public.archive'],
  any: ['public.item'],
};

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

/**
 * Default file picker configuration.
 */
export const DEFAULT_FILE_PICKER_CONFIG: FilePickerConfig = {
  allowedTypes: ['any'],
  multiple: false,
  allowCamera: true,
  allowLibrary: true,
  imageQuality: 80,
  includeThumbnails: false,
};

/**
 * Default upload configuration.
 */
export const DEFAULT_UPLOAD_CONFIG: Omit<UploadConfig, 'url'> = {
  method: 'POST',
  fieldName: 'file',
  multipart: true,
  concurrency: 3,
  timeout: 30000,
  retryEnabled: true,
  maxRetries: 3,
  retryDelay: 'exponential',
  retryDelayMs: 1000,
  chunkedUpload: false,
  chunkSize: 10 * 1024 * 1024, // 10MB
  chunkedUploadThreshold: 50 * 1024 * 1024, // 50MB
  backgroundUpload: false,
};

// ============================================
// INITIAL STATES
// ============================================

/**
 * Initial file picker status.
 */
export const INITIAL_FILE_PICKER_STATUS: FilePickerStatus = {
  state: 'idle',
  permission: 'undetermined',
};

/**
 * Initial queue status.
 */
export const INITIAL_QUEUE_STATUS: QueueStatus = {
  total: 0,
  pending: 0,
  uploading: 0,
  completed: 0,
  failed: 0,
  isProcessing: false,
  isPaused: false,
  overallProgress: 0,
  totalBytesUploaded: 0,
  totalBytes: 0,
};

// ============================================
// PRESETS
// ============================================

/**
 * File picker presets for common use cases.
 */
export const FILE_PICKER_PRESETS: FilePickerPresets = {
  avatar: {
    allowedTypes: ['image'],
    multiple: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxImageDimensions: { width: 1024, height: 1024 },
    imageQuality: 85,
    allowCamera: true,
    includeThumbnails: true,
  },

  document: {
    allowedTypes: ['document'],
    multiple: false,
    maxFileSize: 25 * 1024 * 1024, // 25MB
  },

  documents: {
    allowedTypes: ['document'],
    multiple: true,
    maxFiles: 10,
    maxFileSize: 25 * 1024 * 1024,
    maxTotalSize: 100 * 1024 * 1024, // 100MB total
  },

  image: {
    allowedTypes: ['image'],
    multiple: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    imageQuality: 85,
    includeThumbnails: true,
  },

  images: {
    allowedTypes: ['image'],
    multiple: true,
    maxFiles: 20,
    maxFileSize: 10 * 1024 * 1024,
    maxTotalSize: 50 * 1024 * 1024,
    imageQuality: 80,
    includeThumbnails: true,
  },

  video: {
    allowedTypes: ['video'],
    multiple: false,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    includeThumbnails: true,
  },

  files: {
    allowedTypes: ['any'],
    multiple: true,
    maxFiles: 50,
    maxFileSize: 50 * 1024 * 1024,
  },
};

/**
 * Upload presets for common use cases.
 */
export const UPLOAD_PRESETS: UploadPresets = {
  simple: {
    concurrency: 1,
    retryEnabled: false,
    chunkedUpload: false,
  },

  largeFile: {
    chunkedUpload: true,
    chunkSize: 10 * 1024 * 1024, // 10MB chunks
    timeout: 120000, // 2 minutes per chunk
    retryEnabled: true,
    maxRetries: 5,
  },

  background: {
    backgroundUpload: true,
    retryEnabled: true,
    maxRetries: 5,
    retryDelay: 'exponential',
  },

  reliable: {
    retryEnabled: true,
    maxRetries: 5,
    retryDelay: 'exponential',
    retryDelayMs: 2000,
    timeout: 60000,
  },
};

// ============================================
// SIZE LIMITS
// ============================================

/**
 * Size limit constants.
 */
export const SIZE_LIMITS = {
  /** Default max file size: 100MB */
  DEFAULT_MAX_FILE_SIZE: 100 * 1024 * 1024,

  /** Large file threshold for chunked upload: 50MB */
  LARGE_FILE_THRESHOLD: 50 * 1024 * 1024,

  /** Default chunk size: 10MB */
  DEFAULT_CHUNK_SIZE: 10 * 1024 * 1024,

  /** Min chunk size: 1MB */
  MIN_CHUNK_SIZE: 1 * 1024 * 1024,

  /** Max chunk size: 100MB */
  MAX_CHUNK_SIZE: 100 * 1024 * 1024,
} as const;

// ============================================
// TIMING
// ============================================

/**
 * Timing constants.
 */
export const TIMING = {
  /** Progress update interval in ms */
  PROGRESS_UPDATE_INTERVAL: 100,

  /** Speed calculation window in ms */
  SPEED_CALCULATION_WINDOW: 2000,

  /** Default request timeout */
  DEFAULT_TIMEOUT: 30000,

  /** Base retry delay */
  BASE_RETRY_DELAY: 1000,

  /** Max retry delay */
  MAX_RETRY_DELAY: 30000,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

/**
 * Error messages for file picker errors.
 */
export const FILE_PICKER_ERROR_MESSAGES: Record<string, string> = {
  PERMISSION_DENIED: 'Permission to access files was denied',
  PERMISSION_BLOCKED: 'Permission to access files is blocked. Please enable it in settings.',
  CANCELLED: 'File selection was cancelled',
  INVALID_TYPE: 'Selected file type is not allowed',
  SIZE_EXCEEDED: 'File size exceeds the maximum limit',
  COUNT_EXCEEDED: 'Maximum number of files exceeded',
  NOT_SUPPORTED: 'File picker is not supported on this platform',
  UNKNOWN: 'An unknown error occurred',
};

/**
 * Error messages for upload errors.
 */
export const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'Network error occurred during upload',
  TIMEOUT: 'Upload timed out',
  SERVER_ERROR: 'Server returned an error',
  ABORTED: 'Upload was cancelled',
  INVALID_RESPONSE: 'Server returned an invalid response',
  FILE_NOT_FOUND: 'File not found',
  CHUNK_FAILED: 'Failed to upload file chunk',
  UNKNOWN: 'An unknown error occurred during upload',
};
