import type { RefObject } from 'react';
import type { ViewStyle, StyleProp } from 'react-native';

// ============================================
// CAMERA DEVICE TYPES
// ============================================

/**
 * Camera position relative to the device.
 */
export type CameraPosition = 'front' | 'back' | 'external';

/**
 * Resolution specification.
 */
export interface Resolution {
  width: number;
  height: number;
}

/**
 * Represents a camera device available on the system.
 */
export interface CameraDevice {
  /** Unique device identifier */
  id: string;

  /** Human-readable device name */
  name: string;

  /** Camera position (front, back, external) */
  position: CameraPosition;

  /** Whether this is the default device for its position */
  isDefault: boolean;

  /** Whether device supports torch/flash */
  hasTorch: boolean;

  /** Whether device supports zoom */
  hasZoom: boolean;

  /** Minimum zoom level if supported */
  minZoom?: number;

  /** Maximum zoom level if supported */
  maxZoom?: number;

  /** Supported resolutions (if available) */
  supportedResolutions?: Resolution[];

  /** Platform-specific native device reference (internal use) */
  _nativeDevice?: unknown;
}

// ============================================
// CAMERA CONFIGURATION
// ============================================

/**
 * Video quality presets.
 */
export type VideoQuality = 'low' | 'medium' | 'high' | '4k';

/**
 * Photo quality presets.
 */
export type PhotoQuality = 'low' | 'medium' | 'high' | 'maximum';

/**
 * Camera configuration options.
 */
export interface CameraConfig {
  /** Preferred camera position. Default: 'back' */
  position: CameraPosition;

  /** Specific device ID to use (overrides position) */
  deviceId?: string;

  /** Video quality preset. Default: 'high' */
  videoQuality: VideoQuality;

  /** Photo quality preset. Default: 'high' */
  photoQuality: PhotoQuality;

  /** Target resolution (best effort) */
  resolution?: Resolution;

  /** Enable audio for video recording. Default: true */
  enableAudio: boolean;

  /** Enable torch/flash. Default: false */
  torch: boolean;

  /** Zoom level (1.0 = no zoom). Default: 1.0 */
  zoom: number;

  /** Auto-focus enabled. Default: true */
  autoFocus: boolean;

  /** Mirror preview (typically for front camera). Default: auto based on position */
  mirrorPreview?: boolean;
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
  | 'blocked' // User denied and "don't ask again" (native)
  | 'unavailable'; // No camera hardware/not supported

/**
 * Result of a permission check or request.
 */
export interface PermissionResult {
  /** Camera permission status */
  camera: PermissionStatus;

  /** Microphone permission status (for video recording) */
  microphone: PermissionStatus;

  /** Whether user can be asked again */
  canAskAgain: boolean;
}

// ============================================
// CAMERA STATE
// ============================================

/**
 * Camera state machine states.
 */
export type CameraState =
  | 'idle' // Not initialized
  | 'initializing' // Starting up
  | 'ready' // Preview active, ready to capture
  | 'recording' // Video recording in progress
  | 'capturing' // Photo capture in progress
  | 'stopping' // Cleaning up
  | 'error'; // Error state

/**
 * Comprehensive camera status.
 */
export interface CameraStatus {
  /** Current camera state */
  state: CameraState;

  /** Current permission status */
  permission: PermissionStatus;

  /** Whether camera preview is active */
  isActive: boolean;

  /** Whether video recording is in progress */
  isRecording: boolean;

  /** Video recording duration in milliseconds */
  recordingDuration: number;

  /** Currently active device */
  activeDevice: CameraDevice | null;

  /** All available camera devices */
  availableDevices: CameraDevice[];

  /** Current configuration */
  config: CameraConfig;

  /** Current zoom level */
  zoom: number;

  /** Whether torch is currently on */
  torchActive: boolean;

  /** Error if state is 'error' */
  error?: CameraError;
}

// ============================================
// CAPTURE OUTPUT TYPES
// ============================================

/**
 * Photo file format.
 */
export type PhotoFormat = 'jpeg' | 'png' | 'heic';

/**
 * Video file format.
 */
export type VideoFormat = 'mp4' | 'mov';

/**
 * Photo capture metadata.
 */
export interface PhotoMetadata {
  /** Timestamp when photo was taken */
  timestamp: number;

  /** GPS coordinates (if permission granted) */
  location?: { latitude: number; longitude: number };

  /** Device orientation when captured */
  orientation?: number;
}

/**
 * Result of a photo capture.
 */
export interface PhotoResult {
  /** File path (native) or Blob URL (web) */
  uri: string;

  /** Image width in pixels */
  width: number;

  /** Image height in pixels */
  height: number;

  /** File size in bytes */
  size: number;

  /** Photo format */
  format: PhotoFormat;

  /** EXIF metadata (if available) */
  metadata?: PhotoMetadata;

  /** Get photo as ArrayBuffer */
  getArrayBuffer(): Promise<ArrayBuffer>;

  /** Get photo as Blob (web) or base64 string (native) */
  getData(): Promise<Blob | string>;
}

/**
 * Result of a video recording.
 */
export interface VideoResult {
  /** File path (native) or Blob URL (web) */
  uri: string;

  /** Video duration in milliseconds */
  duration: number;

  /** Video width in pixels */
  width: number;

  /** Video height in pixels */
  height: number;

  /** File size in bytes */
  size: number;

  /** Video format */
  format: VideoFormat;

  /** Whether video includes audio */
  hasAudio: boolean;

  /** Get video as ArrayBuffer */
  getArrayBuffer(): Promise<ArrayBuffer>;

  /** Get video as Blob (web) or file path (native) */
  getData(): Promise<Blob | string>;
}

/**
 * Options for taking a photo.
 */
export interface PhotoOptions {
  /** Photo format. Default: 'jpeg' */
  format?: PhotoFormat;

  /** JPEG quality (0-100). Default: 90 */
  quality?: number;

  /** Enable flash for this photo. Default: false */
  flash?: boolean;

  /** Skip shutter sound (native only). Default: false */
  skipSound?: boolean;
}

/**
 * Options for recording a video.
 */
export interface VideoOptions {
  /** Video format. Default: 'mp4' */
  format?: VideoFormat;

  /** Maximum duration in seconds (0 = unlimited). Default: 0 */
  maxDuration?: number;

  /** Enable audio recording. Default: true */
  audio?: boolean;

  /** Enable flash/torch during recording. Default: false */
  torch?: boolean;
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Camera error codes.
 */
export type CameraErrorCode =
  | 'PERMISSION_DENIED'
  | 'PERMISSION_BLOCKED'
  | 'DEVICE_NOT_FOUND'
  | 'DEVICE_IN_USE'
  | 'NOT_SUPPORTED'
  | 'INITIALIZATION_FAILED'
  | 'CAPTURE_FAILED'
  | 'RECORDING_FAILED'
  | 'INVALID_CONFIG'
  | 'STORAGE_FULL'
  | 'UNKNOWN';

/**
 * Camera error object.
 */
export interface CameraError {
  code: CameraErrorCode;
  message: string;
  originalError?: Error;
}

// ============================================
// CALLBACK TYPES
// ============================================

/**
 * Callback for camera state changes.
 */
export type StateChangeCallback = (status: CameraStatus) => void;

/**
 * Callback for camera errors.
 */
export type ErrorCallback = (error: CameraError) => void;

/**
 * Callback for device list changes.
 */
export type DeviceChangeCallback = (devices: CameraDevice[]) => void;

/**
 * Callback for recording progress updates.
 */
export type RecordingProgressCallback = (duration: number) => void;

// ============================================
// CAMERA INTERFACE
// ============================================

/**
 * Core camera interface implemented by platform-specific classes.
 */
export interface ICamera {
  /** Current status */
  readonly status: CameraStatus;

  // === Permission Management ===

  /** Check camera and microphone permission status */
  checkPermission(): Promise<PermissionResult>;

  /** Request camera and microphone permissions */
  requestPermission(): Promise<PermissionResult>;

  // === Camera Lifecycle ===

  /**
   * Initialize camera and start preview.
   * @param config Optional camera configuration
   */
  start(config?: Partial<CameraConfig>): Promise<void>;

  /** Stop camera and release resources */
  stop(): Promise<void>;

  // === Device Management ===

  /** Get list of available camera devices */
  getDevices(): Promise<CameraDevice[]>;

  /**
   * Switch to a different camera device.
   * @param deviceOrPosition Device ID or position ('front' | 'back')
   */
  switchDevice(deviceOrPosition: string | CameraPosition): Promise<void>;

  // === Photo Capture ===

  /**
   * Take a photo.
   * @param options Photo capture options
   */
  takePhoto(options?: PhotoOptions): Promise<PhotoResult>;

  // === Video Recording ===

  /**
   * Start video recording.
   * @param options Video recording options
   */
  startRecording(options?: VideoOptions): Promise<void>;

  /**
   * Stop video recording and get result.
   */
  stopRecording(): Promise<VideoResult>;

  /**
   * Cancel video recording without saving.
   */
  cancelRecording(): Promise<void>;

  // === Camera Controls ===

  /**
   * Set zoom level.
   * @param level Zoom level (1.0 = no zoom)
   */
  setZoom(level: number): void;

  /**
   * Toggle torch/flash.
   * @param enabled Whether torch should be on
   */
  setTorch(enabled: boolean): void;

  /**
   * Focus on a specific point (normalized 0-1).
   * @param x Horizontal position (0 = left, 1 = right)
   * @param y Vertical position (0 = top, 1 = bottom)
   */
  focusOnPoint(x: number, y: number): Promise<void>;

  // === Subscriptions ===

  /**
   * Subscribe to state changes.
   * @returns Unsubscribe function
   */
  onStateChange(callback: StateChangeCallback): () => void;

  /**
   * Subscribe to errors.
   * @returns Unsubscribe function
   */
  onError(callback: ErrorCallback): () => void;

  /**
   * Subscribe to device changes (devices added/removed).
   * @returns Unsubscribe function
   */
  onDeviceChange(callback: DeviceChangeCallback): () => void;

  /**
   * Subscribe to recording progress updates.
   * @returns Unsubscribe function
   */
  onRecordingProgress(callback: RecordingProgressCallback): () => void;

  // === Internal (for CameraPreview) ===

  /**
   * Get the underlying media stream (web) or camera ref (native).
   * @internal
   */
  _getPreviewSource(): unknown;

  // === Lifecycle ===

  /** Clean up all resources */
  dispose(): void;
}

// ============================================
// HOOK TYPES
// ============================================

/**
 * Options for the useCamera hook.
 */
export interface UseCameraOptions {
  /** Initial camera configuration */
  config?: Partial<CameraConfig>;

  /** Auto-request permission on mount. Default: false */
  autoRequestPermission?: boolean;

  /** Auto-start camera on mount (requires autoRequestPermission). Default: false */
  autoStart?: boolean;
}

/**
 * Result returned by the useCamera hook.
 */
export interface UseCameraResult {
  // === State ===

  /** Current camera status */
  status: CameraStatus;

  /** Whether camera preview is active */
  isActive: boolean;

  /** Whether video recording is in progress */
  isRecording: boolean;

  /** Video recording duration in milliseconds */
  recordingDuration: number;

  /** Currently active device */
  activeDevice: CameraDevice | null;

  /** All available camera devices */
  availableDevices: CameraDevice[];

  /** Permission result */
  permission: PermissionResult | null;

  /** Current error (if any) */
  error: CameraError | null;

  /** Current zoom level */
  zoom: number;

  /** Whether torch is active */
  torchActive: boolean;

  // === Actions ===

  /** Start camera preview */
  start: (config?: Partial<CameraConfig>) => Promise<void>;

  /** Stop camera */
  stop: () => Promise<void>;

  /** Switch camera device */
  switchDevice: (deviceOrPosition: string | CameraPosition) => Promise<void>;

  /** Take a photo */
  takePhoto: (options?: PhotoOptions) => Promise<PhotoResult>;

  /** Start video recording */
  startRecording: (options?: VideoOptions) => Promise<void>;

  /** Stop video recording */
  stopRecording: () => Promise<VideoResult>;

  /** Cancel video recording */
  cancelRecording: () => Promise<void>;

  /** Set zoom level */
  setZoom: (level: number) => void;

  /** Set torch on/off */
  setTorch: (enabled: boolean) => void;

  /** Focus on point */
  focusOnPoint: (x: number, y: number) => Promise<void>;

  /** Request permissions */
  requestPermission: () => Promise<PermissionResult>;

  // === Ref for CameraPreview ===

  /** Camera instance ref for CameraPreview component */
  cameraRef: RefObject<ICamera | null>;
}

// ============================================
// COMPONENT TYPES
// ============================================

/**
 * Focus point for tap-to-focus.
 */
export interface FocusPoint {
  x: number;
  y: number;
}

/**
 * Props for the CameraPreview component.
 */
export interface CameraPreviewProps {
  /** Camera instance from useCamera hook */
  camera: ICamera | null;

  /** Preview style */
  style?: StyleProp<ViewStyle>;

  /** Aspect ratio (e.g., 16/9, 4/3). Default: auto */
  aspectRatio?: number;

  /** How to resize content. Default: 'cover' */
  resizeMode?: 'cover' | 'contain';

  /** Mirror the preview (for selfie mode). Default: auto based on camera position */
  mirror?: boolean;

  /** Enable tap-to-focus. Default: true */
  enableTapToFocus?: boolean;

  /** Enable pinch-to-zoom. Default: true */
  enablePinchToZoom?: boolean;

  /** Callback when preview is ready */
  onReady?: () => void;

  /** Callback when user taps to focus */
  onFocus?: (point: FocusPoint) => void;

  /** Test ID for testing */
  testID?: string;

  /** Element ID */
  id?: string;
}

// ============================================
// FACTORY TYPES
// ============================================

/**
 * Factory function type for creating camera instances.
 */
export type CreateCameraFactory = () => ICamera;
