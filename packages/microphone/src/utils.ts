import type { AudioConfig, AudioLevel, BitDepth } from './types';
import { BIT_DEPTH_MAX_VALUES } from './constants';

/**
 * Decode Base64 string to ArrayBuffer.
 * Works in both web and React Native environments.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Use atob for web, Buffer for React Native
  const binaryString =
    typeof atob !== 'undefined'
      ? atob(base64)
      : Buffer.from(base64, 'base64').toString('binary');

  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encode ArrayBuffer to Base64 string.
 * Works in both web and React Native environments.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof btoa !== 'undefined'
    ? btoa(binary)
    : Buffer.from(binary, 'binary').toString('base64');
}

/**
 * A Blob-like object for React Native that wraps an ArrayBuffer.
 * Provides the essential Blob interface methods needed for our use case.
 */
class ArrayBufferBlob implements Blob {
  private buffer: ArrayBuffer;
  readonly size: number;
  readonly type: string;

  constructor(buffer: ArrayBuffer, mimeType: string) {
    this.buffer = buffer;
    this.size = buffer.byteLength;
    this.type = mimeType;
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return this.buffer;
  }

  async text(): Promise<string> {
    // TextDecoder may not be available in React Native
    if (typeof TextDecoder !== 'undefined') {
      const decoder = new TextDecoder();
      return decoder.decode(this.buffer);
    }
    // Fallback: convert bytes to string manually
    const bytes = new Uint8Array(this.buffer);
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes[i]);
    }
    return result;
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    const sliced = this.buffer.slice(start, end);
    return new ArrayBufferBlob(sliced, contentType || this.type);
  }

  stream(): ReadableStream<Uint8Array> {
    // ReadableStream may not be available in React Native
    if (typeof ReadableStream === 'undefined') {
      throw new Error('ReadableStream not supported in this environment');
    }
    const buffer = this.buffer;
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });
  }
}

/**
 * Convert ArrayBuffer to Blob (cross-platform).
 * On web, creates Blob directly.
 * On React Native, creates a Blob-like wrapper since RN doesn't support Blob([ArrayBuffer]).
 * @param buffer - The ArrayBuffer to convert
 * @param mimeType - MIME type for the blob. Default: 'application/octet-stream'
 */
export async function arrayBufferToBlob(
  buffer: ArrayBuffer,
  mimeType = 'application/octet-stream'
): Promise<Blob> {
  // Check if we're in an environment where Blob([ArrayBuffer]) works
  // This is a runtime check since React Native's Blob doesn't support ArrayBuffer
  try {
    // Try the direct approach first (works on web)
    const blob = new Blob([buffer], { type: mimeType });
    // Verify it actually worked by checking size
    if (blob.size === buffer.byteLength) {
      return blob;
    }
  } catch {
    // Fall through to wrapper approach
  }

  // React Native path: use our ArrayBufferBlob wrapper
  // This provides a Blob-like interface that works with arrayBuffer() calls
  return new ArrayBufferBlob(buffer, mimeType) as Blob;
}

/**
 * Create appropriate TypedArray for PCM data based on bit depth.
 */
export function createPCMTypedArray(
  buffer: ArrayBuffer,
  bitDepth: BitDepth
): Int8Array | Int16Array | Float32Array {
  switch (bitDepth) {
    case 8:
      return new Int8Array(buffer);
    case 16:
      return new Int16Array(buffer);
    case 32:
      return new Float32Array(buffer);
    default:
      return new Int16Array(buffer);
  }
}

/**
 * Calculate audio levels from PCM samples.
 * @param samples - PCM sample data
 * @param bitDepth - Bit depth of the samples
 * @param previousPeak - Previous peak value to maintain peak hold
 * @returns Audio level metrics
 */
export function calculateAudioLevels(
  samples: Int8Array | Int16Array | Float32Array,
  bitDepth: BitDepth,
  previousPeak: number = 0
): AudioLevel {
  const maxValue = BIT_DEPTH_MAX_VALUES[bitDepth];

  let sum = 0;
  let peak = previousPeak;
  let current = 0;

  for (let i = 0; i < samples.length; i++) {
    const normalized = Math.abs(samples[i]) / maxValue;
    sum += normalized * normalized;
    if (normalized > current) {
      current = normalized;
    }
    if (normalized > peak) {
      peak = normalized;
    }
  }

  const rms = Math.sqrt(sum / samples.length);
  const db = rms > 0 ? 20 * Math.log10(rms) : -Infinity;

  return { current, peak, rms, db };
}

/**
 * Convert Float32 samples (-1.0 to 1.0) to Int16 samples.
 */
export function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    // Clamp and convert
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16Array;
}

/**
 * Convert Float32 samples (-1.0 to 1.0) to Int8 samples.
 */
export function float32ToInt8(float32Array: Float32Array): Int8Array {
  const int8Array = new Int8Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int8Array[i] = s < 0 ? s * 0x80 : s * 0x7f;
  }
  return int8Array;
}

/**
 * Write a string to a DataView at a specific offset.
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Generate WAV file header.
 * @param dataLength - Length of audio data in bytes
 * @param config - Audio configuration
 * @returns ArrayBuffer containing the 44-byte WAV header
 */
export function createWavHeader(
  dataLength: number,
  config: AudioConfig
): ArrayBuffer {
  const headerLength = 44;
  const header = new ArrayBuffer(headerLength);
  const view = new DataView(header);

  const bytesPerSample = config.bitDepth / 8;
  const blockAlign = config.channels * bytesPerSample;
  const byteRate = config.sampleRate * blockAlign;

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, config.bitDepth === 32 ? 3 : 1, true); // AudioFormat (1=PCM, 3=IEEE float)
  view.setUint16(22, config.channels, true);
  view.setUint32(24, config.sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, config.bitDepth, true);

  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  return header;
}

/**
 * Concatenate multiple ArrayBuffers into one.
 */
export function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return result.buffer;
}

/**
 * Create a complete WAV file from PCM data.
 * @param pcmData - Raw PCM audio data
 * @param config - Audio configuration
 * @returns ArrayBuffer containing complete WAV file
 */
export function createWavFile(
  pcmData: ArrayBuffer,
  config: AudioConfig
): ArrayBuffer {
  const header = createWavHeader(pcmData.byteLength, config);
  return concatArrayBuffers([header, pcmData]);
}

/**
 * Create a MicrophoneError object.
 */
export function createMicrophoneError(
  code: import('./types').MicrophoneErrorCode,
  message: string,
  originalError?: Error
): import('./types').MicrophoneError {
  return { code, message, originalError };
}

/**
 * Merge partial config with defaults.
 */
export function mergeConfig(
  partial: Partial<AudioConfig> | undefined,
  defaults: AudioConfig
): AudioConfig {
  return {
    ...defaults,
    ...partial,
  };
}
