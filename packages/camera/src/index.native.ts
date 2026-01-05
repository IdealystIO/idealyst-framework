// Types
export type {
  // Camera device types
  CameraPosition,
  Resolution,
  CameraDevice,
  // Configuration
  VideoQuality,
  PhotoQuality,
  CameraConfig,
  // Permission types
  PermissionStatus,
  PermissionResult,
  // State types
  CameraState,
  CameraStatus,
  // Capture types
  PhotoFormat,
  VideoFormat,
  PhotoMetadata,
  PhotoResult,
  VideoResult,
  PhotoOptions,
  VideoOptions,
  // Error types
  CameraErrorCode,
  CameraError,
  // Callback types
  StateChangeCallback,
  ErrorCallback,
  DeviceChangeCallback,
  RecordingProgressCallback,
  // Interface
  ICamera,
  // Hook types
  UseCameraOptions,
  UseCameraResult,
  // Component types
  FocusPoint,
  CameraPreviewProps,
  // Factory type
  CreateCameraFactory,
} from './types';

// Constants
export {
  DEFAULT_CAMERA_CONFIG,
  INITIAL_CAMERA_STATUS,
  VIDEO_QUALITY_RESOLUTIONS,
  PHOTO_QUALITY_MAP,
  CAMERA_PROFILES,
  DEFAULT_PHOTO_OPTIONS,
  DEFAULT_VIDEO_OPTIONS,
  PHOTO_MIME_TYPES,
  VIDEO_MIME_TYPES,
  RECORDING_PROGRESS_INTERVAL,
} from './constants';

// Utilities
export {
  mergeConfig,
  createError,
  mapErrorToCode,
  findDevice,
  getOppositePosition,
  getResolutionForQuality,
  clampZoom,
  normalizePoint,
  formatDuration,
  generateFilename,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  getExtension,
} from './utils';

// Native-specific exports
export { useCamera } from './hooks/index.native';
export { CameraPreview } from './components/index.native';
export { NativeCamera, createCamera } from './camera.native';
export { checkPermission, requestPermission } from './permissions/index.native';
