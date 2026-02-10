// Types - re-export everything from main types
export type {
  // File types
  FileType,
  PickedFile,
  FilePickerConfig,
  FilePickerResult,
  ValidationResult,
  RejectedFile,
  RejectionReason,

  // Camera types
  CameraMediaType,
  CameraOptions,

  // Picker types
  FilePickerState,
  FilePickerStatus,
  IFilePicker,

  // Upload types
  UploadMethod,
  RetryDelayStrategy,
  UploadConfig,
  UploadState,
  UploadProgress,
  UploadResult,
  QueueStatus,
  IFileUploader,

  // Error types
  FilePickerErrorCode,
  FilePickerError,
  UploadErrorCode,
  UploadError,

  // Permission types
  PermissionStatus,
  PermissionResult,

  // Hook types
  UseFilePickerOptions,
  UseFilePickerResult,
  UseFileUploadOptions,
  UseFileUploadResult,

  // Component types
  ButtonVariant,
  Size,
  Intent,
  FilePickerButtonProps,
  DropZoneState,
  DropZoneProps,
  ProgressVariant,
  UploadProgressProps,

  // Preset types
  FilePickerPresets,
  UploadPresets,

  // Factory types
  CreateFilePickerFactory,
  CreateFileUploaderFactory,
  CreateFileUploaderOptions,

  // Chunked upload types
  ChunkProgress,
  ChunkUploadConfig,
  ChunkUploadResponse,
} from './types';

// Constants
export {
  FILE_TYPE_MIME_TYPES,
  FILE_TYPE_EXTENSIONS,
  DOCUMENT_PICKER_TYPES,
  DEFAULT_FILE_PICKER_CONFIG,
  DEFAULT_UPLOAD_CONFIG,
  INITIAL_FILE_PICKER_STATUS,
  INITIAL_QUEUE_STATUS,
  FILE_PICKER_PRESETS,
  UPLOAD_PRESETS,
  SIZE_LIMITS,
  TIMING,
  FILE_PICKER_ERROR_MESSAGES,
  UPLOAD_ERROR_MESSAGES,
} from './constants';

// Utilities
export {
  generateId,
  formatBytes,
  parseSize,
  formatDuration,
  getMimeTypes,
  getExtensions,
  buildAcceptString,
  getFileExtension,
  getFileTypeFromMime,
  isMimeTypeAllowed,
  validateFiles,
  createPickedFileFromFile,
  revokeFileUri,
  revokeFileUris,
  createFilePickerError,
  createUploadError,
  mergeFilePickerConfig,
  mergeUploadConfig,
  SpeedCalculator,
  calculateETA,
  calculateRetryDelay,
  isRetryableError,
  calculateChunkCount,
  getChunkBoundaries,
  shouldUseChunkedUpload,
  EventEmitter,
} from './utils';

// Permissions (web-specific)
export {
  checkPhotoLibraryPermission,
  requestPhotoLibraryPermission,
  checkCameraPermission,
  requestCameraPermission,
  checkPermissions,
  requestPermissions,
} from './permissions/index.web';

// Picker (web-specific)
export { createFilePicker, WebFilePicker } from './picker/index.web';

// Uploader (web-specific)
export { UploadQueue, ChunkedUploader, createChunkedUploader, createFileUploader, WebFileUploader } from './uploader/index.web';

// Hooks (web-specific)
export { useFilePicker, useFileUpload, createUseFilePickerHook, createUseFileUploadHook } from './hooks/index.web';

// Components (web-specific)
export { FilePickerButton, DropZone, UploadProgress } from './components/index.web';

// Styles
export { filePickerButtonStyles, dropZoneStyles, uploadProgressStyles } from './components/index.web';
