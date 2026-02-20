import type { RefObject } from 'react';
import type { ViewStyle, StyleProp } from 'react-native';

// ============================================
// FILE TYPES
// ============================================

/**
 * Supported file type categories for filtering.
 */
export type FileType =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'any';

/**
 * Represents a picked file.
 */
export interface PickedFile {
  /** Unique identifier for this file */
  id: string;

  /** Original file name */
  name: string;

  /** File size in bytes */
  size: number;

  /** MIME type */
  type: string;

  /** File URI (file:// on native, blob: or data: on web) */
  uri: string;

  /** File extension (without dot) */
  extension: string;

  /** Last modified timestamp (if available) */
  lastModified?: number;

  /** Image/video dimensions (if applicable) */
  dimensions?: { width: number; height: number };

  /** Duration in ms for audio/video (if applicable) */
  duration?: number;

  /** Thumbnail URI for images/videos (native only) */
  thumbnailUri?: string;

  /** Get file as ArrayBuffer */
  getArrayBuffer(): Promise<ArrayBufferLike>;

  /** Get file as Blob (web) or base64 (native) */
  getData(): Promise<Blob | string>;
}

// ============================================
// FILE PICKER CONFIGURATION
// ============================================

/**
 * File picker configuration.
 */
export interface FilePickerConfig {
  /** Allowed file types. Default: ['any'] */
  allowedTypes: FileType[];

  /** Custom MIME types to accept (overrides allowedTypes) */
  customMimeTypes?: string[];

  /** Custom file extensions to accept (e.g., ['.json', '.csv']) */
  customExtensions?: string[];

  /** Allow multiple file selection. Default: false */
  multiple: boolean;

  /** Maximum number of files (when multiple=true). Default: unlimited */
  maxFiles?: number;

  /** Maximum file size in bytes. Default: unlimited */
  maxFileSize?: number;

  /** Maximum total size for all files. Default: unlimited */
  maxTotalSize?: number;

  /** For images: allow camera capture (native). Default: true */
  allowCamera?: boolean;

  /** For images: include from photo library (native). Default: true */
  allowLibrary?: boolean;

  /** Image quality for camera captures (0-100). Default: 80 */
  imageQuality?: number;

  /** Max image dimensions (will resize if larger) */
  maxImageDimensions?: { width: number; height: number };

  /** Include file thumbnails (for images/videos). Default: false */
  includeThumbnails?: boolean;
}

/**
 * Reason why a file was rejected.
 */
export type RejectionReason = 'size' | 'type' | 'count' | 'total_size' | 'dimensions';

/**
 * Information about a rejected file.
 */
export interface RejectedFile {
  name: string;
  reason: RejectionReason;
  message: string;
}

/**
 * Result of file picking operation.
 */
export interface FilePickerResult {
  /** Whether user cancelled the picker */
  cancelled: boolean;

  /** Picked files (empty if cancelled) */
  files: PickedFile[];

  /** Any files that were rejected (size limit, type, etc.) */
  rejected: RejectedFile[];

  /** Error if picker failed */
  error?: FilePickerError;
}

/**
 * Result of file validation.
 */
export interface ValidationResult {
  /** Valid files */
  accepted: PickedFile[];

  /** Invalid files with reasons */
  rejected: RejectedFile[];

  /** Whether all files passed validation */
  isValid: boolean;
}

// ============================================
// CAMERA OPTIONS (for native capture)
// ============================================

/**
 * Media type for camera capture.
 */
export type CameraMediaType = 'photo' | 'video' | 'mixed';

/**
 * Options for camera capture.
 */
export interface CameraOptions {
  /** Media type to capture. Default: 'photo' */
  mediaType?: CameraMediaType;

  /** JPEG quality (0-100). Default: 80 */
  quality?: number;

  /** Maximum video duration in seconds */
  maxDuration?: number;

  /** Save captured media to photo library. Default: true */
  saveToLibrary?: boolean;

  /** Use front camera. Default: false */
  useFrontCamera?: boolean;
}

// ============================================
// FILE PICKER STATE
// ============================================

/**
 * File picker state machine states.
 */
export type FilePickerState = 'idle' | 'picking' | 'processing' | 'error';

/**
 * Comprehensive file picker status.
 */
export interface FilePickerStatus {
  /** Current state */
  state: FilePickerState;

  /** Current permission status */
  permission: PermissionStatus;

  /** Error if state is 'error' */
  error?: FilePickerError;
}

// ============================================
// FILE PICKER INTERFACE
// ============================================

/**
 * Core file picker interface implemented by platform-specific classes.
 */
export interface IFilePicker {
  /** Current status */
  readonly status: FilePickerStatus;

  /** Check permission status (native only - photos/media access) */
  checkPermission(): Promise<PermissionStatus>;

  /** Request permission (native only) */
  requestPermission(): Promise<PermissionStatus>;

  /** Open file picker dialog */
  pick(config?: Partial<FilePickerConfig>): Promise<FilePickerResult>;

  /** Open camera to capture image/video (native) */
  captureFromCamera(options?: CameraOptions): Promise<FilePickerResult>;

  /** Validate files against config without picking */
  validateFiles(files: File[] | PickedFile[], config?: Partial<FilePickerConfig>): ValidationResult;

  /** Subscribe to state changes */
  onStateChange(callback: (status: FilePickerStatus) => void): () => void;

  /** Clean up resources */
  dispose(): void;
}

// ============================================
// UPLOAD CONFIGURATION
// ============================================

/**
 * HTTP method for uploads.
 */
export type UploadMethod = 'POST' | 'PUT' | 'PATCH';

/**
 * Retry delay strategy.
 */
export type RetryDelayStrategy = 'fixed' | 'exponential';

/**
 * Upload configuration.
 */
export interface UploadConfig {
  /** Target URL for upload */
  url: string;

  /** HTTP method. Default: 'POST' */
  method: UploadMethod;

  /** Custom headers */
  headers?: Record<string, string>;

  /** Form field name for file. Default: 'file' */
  fieldName: string;

  /** Additional form data to send */
  formData?: Record<string, string | number | boolean>;

  /** Use multipart form data. Default: true */
  multipart: boolean;

  /** Number of concurrent uploads. Default: 3 */
  concurrency: number;

  /** Request timeout in ms. Default: 30000 */
  timeout: number;

  /** Enable retry on failure. Default: true */
  retryEnabled: boolean;

  /** Maximum retry attempts. Default: 3 */
  maxRetries: number;

  /** Retry delay strategy */
  retryDelay: RetryDelayStrategy;

  /** Base retry delay in ms. Default: 1000 */
  retryDelayMs: number;

  /** Enable chunked upload for large files. Default: false */
  chunkedUpload: boolean;

  /** Chunk size in bytes. Default: 10MB */
  chunkSize: number;

  /** File size threshold for auto-enabling chunked upload. Default: 50MB */
  chunkedUploadThreshold: number;

  /** Enable background upload (native only). Default: false */
  backgroundUpload: boolean;

  /** Custom request transformer */
  transformRequest?: (file: PickedFile, formData: FormData) => FormData | Promise<FormData>;

  /** Custom response parser */
  parseResponse?: <T = unknown>(response: Response) => Promise<T>;

  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

// ============================================
// UPLOAD STATE
// ============================================

/**
 * Upload state machine states.
 */
export type UploadState =
  | 'pending'
  | 'uploading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Upload progress information.
 */
export interface UploadProgressInfo {
  /** Upload ID */
  id: string;

  /** File being uploaded */
  file: PickedFile;

  /** Current state */
  state: UploadState;

  /** Bytes uploaded */
  bytesUploaded: number;

  /** Total bytes */
  bytesTotal: number;

  /** Progress percentage (0-100) */
  percentage: number;

  /** Upload speed in bytes/second */
  speed: number;

  /** Estimated time remaining in ms */
  estimatedTimeRemaining: number;

  /** Number of retry attempts made */
  retryCount: number;

  /** For chunked uploads: current chunk index */
  currentChunk?: number;

  /** For chunked uploads: total chunks */
  totalChunks?: number;

  /** Error if failed */
  error?: UploadError;

  /** Timestamp when upload started */
  startedAt?: number;

  /** Timestamp when upload completed */
  completedAt?: number;

  /** Upload configuration used */
  config: UploadConfig;
}

/**
 * Result of a completed upload.
 */
export interface UploadResult {
  /** Upload ID */
  id: string;

  /** Whether upload was successful */
  success: boolean;

  /** Server response (if successful) */
  response?: unknown;

  /** HTTP status code */
  statusCode?: number;

  /** Error (if failed) */
  error?: UploadError;

  /** Final progress state */
  progress: UploadProgressInfo;
}

// ============================================
// UPLOAD QUEUE
// ============================================

/**
 * Queue status information.
 */
export interface QueueStatus {
  /** Total files in queue */
  total: number;

  /** Pending uploads */
  pending: number;

  /** Currently uploading */
  uploading: number;

  /** Completed uploads */
  completed: number;

  /** Failed uploads */
  failed: number;

  /** Whether queue is processing */
  isProcessing: boolean;

  /** Whether queue is paused */
  isPaused: boolean;

  /** Overall progress percentage */
  overallProgress: number;

  /** Total bytes uploaded across all files */
  totalBytesUploaded: number;

  /** Total bytes to upload */
  totalBytes: number;
}

// ============================================
// FILE UPLOADER INTERFACE
// ============================================

/**
 * Core file uploader interface implemented by platform-specific classes.
 */
export interface IFileUploader {
  /** Current queue status */
  readonly queueStatus: QueueStatus;

  /** All uploads */
  readonly uploads: Map<string, UploadProgressInfo>;

  /** Add file(s) to upload queue */
  add(files: PickedFile | PickedFile[], config: UploadConfig): string[];

  /** Start processing the queue */
  start(): void;

  /** Pause all uploads */
  pause(): void;

  /** Resume paused uploads */
  resume(): void;

  /** Cancel specific upload */
  cancel(uploadId: string): void;

  /** Cancel all uploads */
  cancelAll(): void;

  /** Retry failed upload */
  retry(uploadId: string): void;

  /** Retry all failed uploads */
  retryAll(): void;

  /** Remove completed/failed upload from queue */
  remove(uploadId: string): void;

  /** Clear completed uploads from queue */
  clearCompleted(): void;

  /** Get upload by ID */
  getUpload(uploadId: string): UploadProgressInfo | undefined;

  /** Subscribe to queue status changes */
  onQueueChange(callback: (status: QueueStatus) => void): () => void;

  /** Subscribe to individual upload progress */
  onProgress(uploadId: string, callback: (progress: UploadProgressInfo) => void): () => void;

  /** Subscribe to upload completion */
  onComplete(callback: (result: UploadResult) => void): () => void;

  /** Subscribe to upload errors */
  onError(callback: (error: UploadError, uploadId: string) => void): () => void;

  /** Clean up resources */
  dispose(): void;
}

// ============================================
// ERROR TYPES
// ============================================

/**
 * File picker error codes.
 */
export type FilePickerErrorCode =
  | 'PERMISSION_DENIED'
  | 'PERMISSION_BLOCKED'
  | 'CANCELLED'
  | 'INVALID_TYPE'
  | 'SIZE_EXCEEDED'
  | 'COUNT_EXCEEDED'
  | 'NOT_SUPPORTED'
  | 'UNKNOWN';

/**
 * File picker error object.
 */
export interface FilePickerError {
  code: FilePickerErrorCode;
  message: string;
  originalError?: Error;
}

/**
 * Upload error codes.
 */
export type UploadErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'ABORTED'
  | 'INVALID_RESPONSE'
  | 'FILE_NOT_FOUND'
  | 'CHUNK_FAILED'
  | 'UNKNOWN';

/**
 * Upload error object.
 */
export interface UploadError {
  code: UploadErrorCode;
  message: string;
  statusCode?: number;
  originalError?: Error;
}

// ============================================
// PERMISSION TYPES
// ============================================

/**
 * Permission status values.
 */
export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'blocked'
  | 'unavailable';

/**
 * Result of a permission check or request.
 */
export interface PermissionResult {
  /** Photo library access (for image picking) */
  photoLibrary: PermissionStatus;

  /** Camera access (for capture) */
  camera: PermissionStatus;

  /** Whether permission can be requested again */
  canAskAgain: boolean;
}

// ============================================
// HOOK TYPES
// ============================================

/**
 * Options for the useFilePicker hook.
 */
export interface UseFilePickerOptions {
  /** Default picker configuration */
  config?: Partial<FilePickerConfig>;

  /** Auto request permission on mount */
  autoRequestPermission?: boolean;
}

/**
 * Result returned by the useFilePicker hook.
 */
export interface UseFilePickerResult {
  // State
  /** Current status */
  status: FilePickerStatus;

  /** Whether picker is open */
  isPicking: boolean;

  /** Permission result */
  permission: PermissionResult | null;

  /** Current error (if any) */
  error: FilePickerError | null;

  /** Last picked files */
  files: PickedFile[];

  // Actions
  /** Open file picker */
  pick: (config?: Partial<FilePickerConfig>) => Promise<FilePickerResult>;

  /** Open camera to capture */
  captureFromCamera: (options?: CameraOptions) => Promise<FilePickerResult>;

  /** Clear picked files */
  clear: () => void;

  // Permissions
  /** Check permission status */
  checkPermission: () => Promise<PermissionResult>;

  /** Request permission */
  requestPermission: () => Promise<PermissionResult>;

  // Validation
  /** Validate files against current config */
  validateFiles: (files: File[] | PickedFile[]) => ValidationResult;

  // Ref
  /** File picker instance ref */
  pickerRef: RefObject<IFilePicker | null>;
}

/**
 * Options for the useFileUpload hook.
 */
export interface UseFileUploadOptions {
  /** Default upload configuration (url is required when adding files) */
  config?: Partial<Omit<UploadConfig, 'url'>>;

  /** Auto-start uploads when files are added */
  autoStart?: boolean;

  /** Maximum concurrent uploads */
  concurrency?: number;
}

/**
 * Result returned by the useFileUpload hook.
 */
export interface UseFileUploadResult {
  // Queue state
  /** Current queue status */
  queueStatus: QueueStatus;

  /** All uploads as array */
  uploads: UploadProgressInfo[];

  // Derived state
  /** Whether any upload is in progress */
  isUploading: boolean;

  /** Whether queue is paused */
  isPaused: boolean;

  /** Whether there are failed uploads */
  hasFailedUploads: boolean;

  // Actions
  /** Add files to upload queue */
  addFiles: (files: PickedFile | PickedFile[], config: Pick<UploadConfig, 'url'> & Partial<Omit<UploadConfig, 'url'>>) => string[];

  /** Start processing queue */
  start: () => void;

  /** Pause all uploads */
  pause: () => void;

  /** Resume paused uploads */
  resume: () => void;

  /** Cancel specific upload */
  cancel: (uploadId: string) => void;

  /** Cancel all uploads */
  cancelAll: () => void;

  /** Retry failed upload */
  retry: (uploadId: string) => void;

  /** Retry all failed uploads */
  retryAll: () => void;

  /** Remove upload from queue */
  remove: (uploadId: string) => void;

  /** Clear completed uploads */
  clearCompleted: () => void;

  /** Get specific upload */
  getUpload: (uploadId: string) => UploadProgressInfo | undefined;

  // Ref
  /** File uploader instance ref */
  uploaderRef: RefObject<IFileUploader | null>;
}

// ============================================
// COMPONENT PROPS
// ============================================

/**
 * Button variants.
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost';

/**
 * Size options.
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Intent/color options.
 */
export type Intent = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

/**
 * Props for the FilePickerButton component.
 */
export interface FilePickerButtonProps {
  /** Button label */
  children?: React.ReactNode;

  /** Picker configuration */
  pickerConfig?: Partial<FilePickerConfig>;

  /** Called when files are picked */
  onPick?: (result: FilePickerResult) => void;

  /** Called on error */
  onError?: (error: FilePickerError) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Button variant */
  variant?: ButtonVariant;

  /** Button size */
  size?: Size;

  /** Intent/color */
  intent?: Intent;

  /** Left icon name (Material Design Icons) */
  leftIcon?: string;

  /** Custom styles */
  style?: StyleProp<ViewStyle>;

  /** Test ID */
  testID?: string;
}

/**
 * DropZone state information.
 */
export interface DropZoneState {
  /** Whether a file is being dragged over the zone */
  isDragActive: boolean;

  /** Whether the dragged file is invalid */
  isDragReject: boolean;

  /** Whether files are being processed */
  isProcessing: boolean;
}

/**
 * Props for the DropZone component.
 */
export interface DropZoneProps {
  /** Called when files are dropped/selected */
  onDrop?: (files: PickedFile[]) => void;

  /** Called on validation errors */
  onReject?: (rejected: RejectedFile[]) => void;

  /** Picker configuration for validation */
  config?: Partial<FilePickerConfig>;

  /** Children to render inside dropzone */
  children?: React.ReactNode | ((state: DropZoneState) => React.ReactNode);

  /** Disabled state */
  disabled?: boolean;

  /** Custom styles */
  style?: StyleProp<ViewStyle>;

  /** Active/hover style */
  activeStyle?: StyleProp<ViewStyle>;

  /** Reject/invalid style */
  rejectStyle?: StyleProp<ViewStyle>;

  /** Test ID */
  testID?: string;
}

/**
 * Progress bar variants.
 */
export type ProgressVariant = 'linear' | 'circular';

/**
 * Props for the UploadProgress component.
 */
export interface UploadProgressProps {
  /** Upload progress data */
  upload: UploadProgressInfo;

  /** Show file name */
  showFileName?: boolean;

  /** Show file size */
  showFileSize?: boolean;

  /** Show speed */
  showSpeed?: boolean;

  /** Show ETA */
  showETA?: boolean;

  /** Allow cancel */
  showCancel?: boolean;

  /** Allow retry (when failed) */
  showRetry?: boolean;

  /** Called when cancel is clicked */
  onCancel?: () => void;

  /** Called when retry is clicked */
  onRetry?: () => void;

  /** Progress bar variant */
  variant?: ProgressVariant;

  /** Size */
  size?: Size;

  /** Custom styles */
  style?: StyleProp<ViewStyle>;

  /** Test ID */
  testID?: string;
}

// ============================================
// PRESETS
// ============================================

/**
 * File picker presets for common use cases.
 */
export interface FilePickerPresets {
  /** Avatar/profile image upload */
  avatar: Partial<FilePickerConfig>;

  /** Single document upload */
  document: Partial<FilePickerConfig>;

  /** Multiple documents */
  documents: Partial<FilePickerConfig>;

  /** Image upload with optimization */
  image: Partial<FilePickerConfig>;

  /** Multiple images */
  images: Partial<FilePickerConfig>;

  /** Video upload */
  video: Partial<FilePickerConfig>;

  /** Any file type */
  files: Partial<FilePickerConfig>;
}

/**
 * Upload presets for common use cases.
 */
export interface UploadPresets {
  /** Simple single file upload */
  simple: Partial<UploadConfig>;

  /** Large file with chunking */
  largeFile: Partial<UploadConfig>;

  /** Background upload (native) */
  background: Partial<UploadConfig>;

  /** High reliability with retries */
  reliable: Partial<UploadConfig>;
}

// ============================================
// FACTORY TYPES
// ============================================

/**
 * Factory function type for creating file picker instances.
 */
export type CreateFilePickerFactory = () => IFilePicker;

/**
 * Options for creating file uploader instances.
 */
export interface CreateFileUploaderOptions {
  /** Maximum concurrent uploads */
  concurrency?: number;
}

/**
 * Factory function type for creating file uploader instances.
 */
export type CreateFileUploaderFactory = (options?: CreateFileUploaderOptions) => IFileUploader;

// ============================================
// CHUNKED UPLOAD TYPES
// ============================================

/**
 * Chunk progress information.
 */
export interface ChunkProgress {
  /** Current chunk index (1-based) */
  currentChunk: number;

  /** Total number of chunks */
  totalChunks: number;

  /** Bytes uploaded so far */
  bytesUploaded: number;

  /** Total bytes to upload */
  bytesTotal: number;

  /** Progress percentage (0-100) */
  percentage: number;
}

/**
 * Chunk upload configuration.
 */
export interface ChunkUploadConfig extends UploadConfig {
  /** Unique file identifier for chunk assembly */
  fileId: string;

  /** Endpoint for finalizing chunked upload */
  finalizeUrl?: string;
}

/**
 * Server response for chunk upload.
 */
export interface ChunkUploadResponse {
  /** Whether chunk was accepted */
  success: boolean;

  /** Chunk index received */
  chunkIndex: number;

  /** Whether all chunks have been received */
  complete?: boolean;

  /** Final file URL (if complete) */
  fileUrl?: string;

  /** Error message */
  error?: string;
}
