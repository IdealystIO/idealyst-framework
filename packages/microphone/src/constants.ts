import type {
  AudioConfig,
  SampleRate,
  BitDepth,
  ChannelCount,
  AudioLevel,
} from './types';

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  sampleRate: 16000, // Optimal for speech recognition
  channels: 1, // Mono
  bitDepth: 16, // Standard CD quality per sample
  bufferSize: 4096, // Balance between latency and CPU
};

export const DEFAULT_AUDIO_LEVEL: AudioLevel = {
  current: 0,
  peak: 0,
  rms: 0,
  db: -Infinity,
};

/**
 * Pre-configured audio profiles for common use cases.
 */
export const AUDIO_PROFILES = {
  /** Optimized for speech recognition (Whisper, Google STT, etc.) */
  speech: {
    sampleRate: 16000 as SampleRate,
    channels: 1 as ChannelCount,
    bitDepth: 16 as BitDepth,
    bufferSize: 4096,
  } satisfies AudioConfig,

  /** Higher quality for music/audio visualization */
  highQuality: {
    sampleRate: 44100 as SampleRate,
    channels: 2 as ChannelCount,
    bitDepth: 16 as BitDepth,
    bufferSize: 2048,
  } satisfies AudioConfig,

  /** Low latency for real-time feedback */
  lowLatency: {
    sampleRate: 16000 as SampleRate,
    channels: 1 as ChannelCount,
    bitDepth: 16 as BitDepth,
    bufferSize: 256,
  } satisfies AudioConfig,

  /** Minimal bandwidth (voice calls, basic recording) */
  minimal: {
    sampleRate: 8000 as SampleRate,
    channels: 1 as ChannelCount,
    bitDepth: 8 as BitDepth,
    bufferSize: 4096,
  } satisfies AudioConfig,
} as const;

/**
 * Maximum values for different bit depths.
 * Used for normalization calculations.
 */
export const BIT_DEPTH_MAX_VALUES = {
  8: 128,
  16: 32768,
  32: 1.0,
} as const;

/**
 * Default level update interval in milliseconds.
 */
export const DEFAULT_LEVEL_UPDATE_INTERVAL = 100;
