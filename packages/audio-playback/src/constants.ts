import type { PlaybackConfig, SampleRate, ChannelCount, BitDepth, PlayerStatus } from './types';

/**
 * Default playback configuration.
 * Optimized for speech/voice playback.
 */
export const DEFAULT_PLAYBACK_CONFIG: PlaybackConfig = {
  sampleRate: 16000,
  channels: 1,
  bitDepth: 16,
};

/**
 * Default initial player status.
 */
export const DEFAULT_PLAYER_STATUS: PlayerStatus = {
  state: 'idle',
  isPlaying: false,
  isPaused: false,
  duration: 0,
  position: 0,
  buffered: 0,
  volume: 1.0,
  muted: false,
};

/**
 * Pre-configured playback profiles for common use cases.
 */
export const PLAYBACK_PROFILES = {
  /** Optimized for speech/voice (AI assistants, TTS, etc.) */
  speech: {
    sampleRate: 16000 as SampleRate,
    channels: 1 as ChannelCount,
    bitDepth: 16 as BitDepth,
  } satisfies PlaybackConfig,

  /** Higher quality for music playback */
  highQuality: {
    sampleRate: 44100 as SampleRate,
    channels: 2 as ChannelCount,
    bitDepth: 16 as BitDepth,
  } satisfies PlaybackConfig,

  /** Professional audio quality */
  studio: {
    sampleRate: 48000 as SampleRate,
    channels: 2 as ChannelCount,
    bitDepth: 16 as BitDepth,
  } satisfies PlaybackConfig,

  /** Low bandwidth (phone calls, basic voice) */
  phone: {
    sampleRate: 8000 as SampleRate,
    channels: 1 as ChannelCount,
    bitDepth: 16 as BitDepth,
  } satisfies PlaybackConfig,
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
 * Default volume level.
 */
export const DEFAULT_VOLUME = 1.0;

/**
 * Default position update interval in milliseconds.
 */
export const DEFAULT_POSITION_UPDATE_INTERVAL = 100;

/**
 * Default buffer size for PCM streaming (in samples).
 * This determines how many samples are buffered before playback.
 */
export const DEFAULT_BUFFER_SIZE = 4096;

/**
 * Minimum buffer threshold (in ms) before playback can start.
 * Helps prevent buffer underruns.
 */
export const MIN_BUFFER_THRESHOLD_MS = 100;
