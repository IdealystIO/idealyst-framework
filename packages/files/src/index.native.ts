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
  UploadProgressInfo,
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

// Permissions (native-specific)
export {
  checkPhotoLibraryPermission,
  requestPhotoLibraryPermission,
  checkCameraPermission,
  requestCameraPermission,
  checkPermissions,
  requestPermissions,
} from './permissions/index.native';

// Picker (native-specific)
export { createFilePicker, NativeFilePicker } from './picker/index.native';

// Uploader (native-specific)
export { UploadQueue, ChunkedUploader, createChunkedUploader, createFileUploader, NativeFileUploader } from './uploader/index.native';

// Hooks (native-specific)
export { useFilePicker, useFileUpload, createUseFilePickerHook, createUseFileUploadHook } from './hooks/index.native';

// Components (native-specific)
export { FilePickerButton, DropZone, UploadProgress } from './components/index.native';

// Styles
export { filePickerButtonStyles, dropZoneStyles, uploadProgressStyles } from './components/index.native';
