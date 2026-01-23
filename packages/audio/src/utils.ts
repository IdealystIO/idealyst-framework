import type { AudioError, AudioErrorCode, BitDepth, AudioConfig, AudioLevel } from './types';
import { BIT_DEPTH_MAX_VALUES } from './constants';

/**
 * Create an AudioError object.
 */
export function createAudioError(
  code: AudioErrorCode,
  message: string,
  originalError?: Error
): AudioError {
  return { code, message, originalError };
}

/**
 * Convert Int8 samples to Float32 samples (-1.0 to 1.0).
 */
export function int8ToFloat32(int8Array: Int8Array): Float32Array {
  const float32Array = new Float32Array(int8Array.length);
  for (let i = 0; i < int8Array.length; i++) {
    float32Array[i] = int8Array[i] / 128;
  }
  return float32Array;
}

/**
 * Convert Int16 samples to Float32 samples (-1.0 to 1.0).
 */
export function int16ToFloat32(int16Array: Int16Array): Float32Array {
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768;
  }
  return float32Array;
}

/**
 * Convert Float32 samples (-1.0 to 1.0) to Int16 samples.
 */
export function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16Array;
}

/**
 * Convert ArrayBuffer to appropriate TypedArray based on bit depth.
 */
export function bufferToTypedArray(
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
 * Convert PCM samples to Float32 based on bit depth.
 */
export function pcmToFloat32(
  samples: ArrayBuffer | Int8Array | Int16Array | Float32Array,
  bitDepth: BitDepth
): Float32Array {
  if (samples instanceof ArrayBuffer) {
    samples = bufferToTypedArray(samples, bitDepth);
  }

  if (samples instanceof Float32Array) {
    return samples;
  }

  if (samples instanceof Int8Array) {
    return int8ToFloat32(samples);
  }

  if (samples instanceof Int16Array) {
    return int16ToFloat32(samples);
  }

  return new Float32Array(0);
}

/**
 * Simple linear interpolation resampling.
 */
export function resampleLinear(
  samples: Float32Array,
  fromRate: number,
  toRate: number
): Float32Array {
  if (fromRate === toRate) {
    return samples;
  }

  const ratio = fromRate / toRate;
  const newLength = Math.round(samples.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, samples.length - 1);
    const fraction = srcIndex - srcIndexFloor;

    result[i] =
      samples[srcIndexFloor] * (1 - fraction) +
      samples[srcIndexCeil] * fraction;
  }

  return result;
}

/**
 * Interleave mono samples to stereo.
 */
export function monoToStereo(mono: Float32Array): Float32Array {
  const stereo = new Float32Array(mono.length * 2);
  for (let i = 0; i < mono.length; i++) {
    stereo[i * 2] = mono[i];
    stereo[i * 2 + 1] = mono[i];
  }
  return stereo;
}

/**
 * Convert stereo samples to mono (average).
 */
export function stereoToMono(stereo: Float32Array): Float32Array {
  const mono = new Float32Array(stereo.length / 2);
  for (let i = 0; i < mono.length; i++) {
    mono[i] = (stereo[i * 2] + stereo[i * 2 + 1]) / 2;
  }
  return mono;
}

/**
 * Deinterleave stereo samples into separate channels.
 */
export function deinterleave(stereo: Float32Array): [Float32Array, Float32Array] {
  const length = stereo.length / 2;
  const left = new Float32Array(length);
  const right = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    left[i] = stereo[i * 2];
    right[i] = stereo[i * 2 + 1];
  }

  return [left, right];
}

/**
 * Interleave separate channels into stereo.
 */
export function interleave(left: Float32Array, right: Float32Array): Float32Array {
  const stereo = new Float32Array(left.length * 2);
  for (let i = 0; i < left.length; i++) {
    stereo[i * 2] = left[i];
    stereo[i * 2 + 1] = right[i];
  }
  return stereo;
}

/**
 * Concatenate multiple Float32Arrays into one.
 */
export function concatFloat32Arrays(arrays: Float32Array[]): Float32Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Float32Array(totalLength);

  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
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
 * Calculate duration in milliseconds from sample count and sample rate.
 */
export function samplesToDuration(sampleCount: number, sampleRate: number): number {
  return (sampleCount / sampleRate) * 1000;
}

/**
 * Calculate sample count from duration in milliseconds.
 */
export function durationToSamples(durationMs: number, sampleRate: number): number {
  return Math.round((durationMs / 1000) * sampleRate);
}

/**
 * Merge partial config with defaults.
 */
export function mergeConfig<T extends object>(
  partial: Partial<T> | undefined,
  defaults: T
): T {
  return {
    ...defaults,
    ...partial,
  };
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate RMS (Root Mean Square) level from samples.
 */
export function calculateRMS(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

/**
 * Calculate audio levels from samples.
 */
export function calculateAudioLevels(
  samples: Int8Array | Int16Array | Float32Array,
  bitDepth: BitDepth,
  currentPeak: number = 0
): AudioLevel {
  const maxValue = BIT_DEPTH_MAX_VALUES[bitDepth];
  let sum = 0;
  let max = 0;

  for (let i = 0; i < samples.length; i++) {
    const normalized = Math.abs(samples[i]) / maxValue;
    sum += normalized * normalized;
    if (normalized > max) max = normalized;
  }

  const rms = Math.sqrt(sum / samples.length);
  const peak = Math.max(currentPeak, max);
  const db = rms > 0 ? 20 * Math.log10(rms) : -Infinity;

  return {
    current: max,
    peak,
    rms,
    db,
  };
}

/**
 * Create a typed array for PCM samples based on bit depth.
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
 * Convert ArrayBuffer to base64 string.
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
 * Convert base64 string to ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
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
 * Create a WAV file header.
 */
export function createWavHeader(
  dataLength: number,
  config: AudioConfig
): ArrayBuffer {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  const bytesPerSample = config.bitDepth / 8;
  const blockAlign = config.channels * bytesPerSample;
  const byteRate = config.sampleRate * blockAlign;

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, config.channels, true);
  view.setUint32(24, config.sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, config.bitDepth, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  return header;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Create a WAV file from PCM data.
 */
export function createWavFile(pcmData: ArrayBuffer, config: AudioConfig): Blob {
  const header = createWavHeader(pcmData.byteLength, config);
  return new Blob([header, pcmData], { type: 'audio/wav' });
}
