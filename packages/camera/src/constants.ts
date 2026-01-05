import type {
  CameraConfig,
  CameraStatus,
  Resolution,
  VideoQuality,
  PhotoQuality,
  PhotoOptions,
  VideoOptions,
} from './types';

/**
 * Default camera configuration.
 */
export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  position: 'back',
  videoQuality: 'high',
  photoQuality: 'high',
  enableAudio: true,
  torch: false,
  zoom: 1.0,
  autoFocus: true,
};

/**
 * Initial camera status.
 */
export const INITIAL_CAMERA_STATUS: CameraStatus = {
  state: 'idle',
  permission: 'undetermined',
  isActive: false,
  isRecording: false,
  recordingDuration: 0,
  activeDevice: null,
  availableDevices: [],
  config: DEFAULT_CAMERA_CONFIG,
  zoom: 1.0,
  torchActive: false,
};

/**
 * Resolution presets for video quality.
 */
export const VIDEO_QUALITY_RESOLUTIONS: Record<VideoQuality, Resolution> = {
  low: { width: 640, height: 480 },
  medium: { width: 1280, height: 720 },
  high: { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
};

/**
 * JPEG quality mapping for photo quality presets.
 */
export const PHOTO_QUALITY_MAP: Record<PhotoQuality, number> = {
  low: 50,
  medium: 75,
  high: 90,
  maximum: 100,
};

/**
 * Pre-configured camera profiles for common use cases.
 */
export const CAMERA_PROFILES = {
  /** Standard photo/video capture */
  standard: {
    position: 'back',
    videoQuality: 'high',
    photoQuality: 'high',
    enableAudio: true,
  } as Partial<CameraConfig>,

  /** Selfie/video call mode */
  selfie: {
    position: 'front',
    videoQuality: 'medium',
    photoQuality: 'high',
    enableAudio: true,
    mirrorPreview: true,
  } as Partial<CameraConfig>,

  /** Document/QR scanning */
  scanning: {
    position: 'back',
    videoQuality: 'medium',
    photoQuality: 'maximum',
    enableAudio: false,
    autoFocus: true,
  } as Partial<CameraConfig>,

  /** Video recording optimized */
  video: {
    position: 'back',
    videoQuality: '4k',
    enableAudio: true,
  } as Partial<CameraConfig>,

  /** Low bandwidth / minimal resource usage */
  minimal: {
    position: 'back',
    videoQuality: 'low',
    photoQuality: 'medium',
    enableAudio: false,
  } as Partial<CameraConfig>,
} as const;

/**
 * Default photo capture options.
 */
export const DEFAULT_PHOTO_OPTIONS: Required<PhotoOptions> = {
  format: 'jpeg',
  quality: 90,
  flash: false,
  skipSound: false,
};

/**
 * Default video recording options.
 */
export const DEFAULT_VIDEO_OPTIONS: Required<VideoOptions> = {
  format: 'mp4',
  maxDuration: 0,
  audio: true,
  torch: false,
};

/**
 * Mime types for photo formats.
 */
export const PHOTO_MIME_TYPES: Record<string, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  heic: 'image/heic',
};

/**
 * Mime types for video formats.
 */
export const VIDEO_MIME_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
};

/**
 * Recording progress update interval in milliseconds.
 */
export const RECORDING_PROGRESS_INTERVAL = 100;
