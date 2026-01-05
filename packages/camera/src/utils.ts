import type {
  CameraConfig,
  CameraDevice,
  CameraPosition,
  CameraError,
  CameraErrorCode,
  PhotoFormat,
  VideoFormat,
  Resolution,
  VideoQuality,
} from './types';
import { DEFAULT_CAMERA_CONFIG, VIDEO_QUALITY_RESOLUTIONS } from './constants';

/**
 * Merge partial config with defaults.
 */
export function mergeConfig(
  partial?: Partial<CameraConfig>
): CameraConfig {
  return {
    ...DEFAULT_CAMERA_CONFIG,
    ...partial,
  };
}

/**
 * Create a CameraError object.
 */
export function createError(
  code: CameraErrorCode,
  message: string,
  originalError?: Error
): CameraError {
  return {
    code,
    message,
    originalError,
  };
}

/**
 * Map browser/native error to CameraErrorCode.
 */
export function mapErrorToCode(error: Error): CameraErrorCode {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  if (name === 'notallowederror' || message.includes('permission')) {
    return 'PERMISSION_DENIED';
  }
  if (name === 'notfounderror' || message.includes('not found')) {
    return 'DEVICE_NOT_FOUND';
  }
  if (name === 'notreadableerror' || message.includes('in use')) {
    return 'DEVICE_IN_USE';
  }
  if (name === 'notsupportederror' || message.includes('not supported')) {
    return 'NOT_SUPPORTED';
  }
  if (message.includes('storage') || message.includes('quota')) {
    return 'STORAGE_FULL';
  }

  return 'UNKNOWN';
}

/**
 * Find a device by ID or position.
 */
export function findDevice(
  devices: CameraDevice[],
  deviceOrPosition: string | CameraPosition
): CameraDevice | undefined {
  // Check if it's a position
  if (deviceOrPosition === 'front' || deviceOrPosition === 'back' || deviceOrPosition === 'external') {
    return devices.find((d) => d.position === deviceOrPosition && d.isDefault) ||
           devices.find((d) => d.position === deviceOrPosition);
  }

  // It's a device ID
  return devices.find((d) => d.id === deviceOrPosition);
}

/**
 * Get the opposite camera position.
 */
export function getOppositePosition(position: CameraPosition): CameraPosition {
  if (position === 'front') return 'back';
  if (position === 'back') return 'front';
  return position;
}

/**
 * Get resolution for video quality preset.
 */
export function getResolutionForQuality(quality: VideoQuality): Resolution {
  return VIDEO_QUALITY_RESOLUTIONS[quality];
}

/**
 * Clamp zoom level to device bounds.
 */
export function clampZoom(
  zoom: number,
  device: CameraDevice | null
): number {
  const min = device?.minZoom ?? 1;
  const max = device?.maxZoom ?? 10;
  return Math.max(min, Math.min(max, zoom));
}

/**
 * Normalize a point to 0-1 range.
 */
export function normalizePoint(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(1, x / width)),
    y: Math.max(0, Math.min(1, y / height)),
  };
}

/**
 * Format duration in milliseconds to MM:SS string.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Generate a unique filename for captured media.
 */
export function generateFilename(
  type: 'photo' | 'video',
  format: PhotoFormat | VideoFormat
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const prefix = type === 'photo' ? 'IMG' : 'VID';
  return `${prefix}_${timestamp}.${format}`;
}

/**
 * Convert Blob to ArrayBuffer.
 */
export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer();
}

/**
 * Convert ArrayBuffer to base64 string.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Get file extension from format.
 */
export function getExtension(format: PhotoFormat | VideoFormat): string {
  return format === 'jpeg' ? 'jpg' : format;
}

/**
 * Check if the current environment supports camera access.
 */
export function isCameraSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Check if MediaRecorder is available for video recording.
 */
export function isMediaRecorderSupported(): boolean {
  return typeof MediaRecorder !== 'undefined';
}

/**
 * Get preferred video codec for MediaRecorder.
 */
export function getPreferredVideoCodec(): string {
  if (typeof MediaRecorder === 'undefined') return 'video/mp4';

  const codecs = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];

  for (const codec of codecs) {
    if (MediaRecorder.isTypeSupported(codec)) {
      return codec;
    }
  }

  return 'video/webm';
}
