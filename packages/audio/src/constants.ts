import type {
  AudioConfig,
  AudioLevel,
  RecorderStatus,
  PlayerStatus,
  AudioSessionState,
  BackgroundRecorderStatus,
  AudioProfiles,
  SessionPresets,
} from './types';

// ============================================
// AUDIO CONFIGURATION DEFAULTS
// ============================================

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  sampleRate: 16000,
  channels: 1,
  bitDepth: 16,
};

/**
 * Pre-configured audio profiles for common use cases.
 */
export const AUDIO_PROFILES: AudioProfiles = {
  /** Optimized for speech/voice (AI assistants, TTS, STT) */
  speech: {
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
  },

  /** Higher quality for music playback */
  highQuality: {
    sampleRate: 44100,
    channels: 2,
    bitDepth: 16,
  },

  /** Professional audio quality */
  studio: {
    sampleRate: 48000,
    channels: 2,
    bitDepth: 16,
  },

  /** Low bandwidth (phone calls, basic voice) */
  phone: {
    sampleRate: 8000,
    channels: 1,
    bitDepth: 16,
  },
};

// ============================================
// AUDIO SESSION DEFAULTS
// ============================================

export const DEFAULT_SESSION_STATE: AudioSessionState = {
  isActive: false,
  category: 'soloAmbient',
  mode: 'default',
  categoryOptions: [],
};

/**
 * Pre-configured audio session presets for common use cases.
 */
export const SESSION_PRESETS: SessionPresets = {
  /** For apps that only play audio (music players, podcasts) */
  playback: {
    category: 'playback',
    mode: 'default',
    categoryOptions: [],
    active: true,
  },

  /** For apps that only record audio */
  record: {
    category: 'record',
    mode: 'default',
    categoryOptions: [],
    active: true,
  },

  /** For voice chat / VoIP applications */
  voiceChat: {
    category: 'playAndRecord',
    mode: 'voiceChat',
    categoryOptions: ['defaultToSpeaker', 'allowBluetooth', 'allowBluetoothA2DP'],
    active: true,
  },

  /** For apps that mix with other audio (games with sound effects) */
  ambient: {
    category: 'ambient',
    mode: 'default',
    categoryOptions: ['mixWithOthers'],
    active: true,
  },

  /** Default for simultaneous playback and recording (AI assistants) */
  default: {
    category: 'playAndRecord',
    mode: 'default',
    categoryOptions: ['defaultToSpeaker', 'allowBluetooth', 'allowBluetoothA2DP', 'mixWithOthers'],
    active: true,
  },

  /** For background audio recording (STT, voice memos, transcription) */
  backgroundRecord: {
    category: 'playAndRecord',
    mode: 'spokenAudio',
    categoryOptions: ['defaultToSpeaker', 'allowBluetooth', 'allowBluetoothA2DP', 'mixWithOthers'],
    active: true,
  },
};

// ============================================
// RECORDER DEFAULTS
// ============================================

export const DEFAULT_AUDIO_LEVEL: AudioLevel = {
  current: 0,
  peak: 0,
  rms: 0,
  db: -Infinity,
};

export const DEFAULT_RECORDER_STATUS: RecorderStatus = {
  state: 'idle',
  isRecording: false,
  isPaused: false,
  permission: 'undetermined',
  duration: 0,
  level: DEFAULT_AUDIO_LEVEL,
  config: DEFAULT_AUDIO_CONFIG,
};

export const DEFAULT_LEVEL_UPDATE_INTERVAL = 100;
export const DEFAULT_BUFFER_SIZE = 4096;

// ============================================
// PLAYER DEFAULTS
// ============================================

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

export const DEFAULT_VOLUME = 1.0;
export const DEFAULT_POSITION_UPDATE_INTERVAL = 100;
export const MIN_BUFFER_THRESHOLD_MS = 100;

// ============================================
// UTILITY CONSTANTS
// ============================================

export const BIT_DEPTH_MAX_VALUES = {
  8: 128,
  16: 32768,
  32: 1.0,
} as const;

// ============================================
// BACKGROUND RECORDER DEFAULTS
// ============================================

export const DEFAULT_BACKGROUND_RECORDER_STATUS: BackgroundRecorderStatus = {
  ...DEFAULT_RECORDER_STATUS,
  appState: 'active',
  isInBackground: false,
  wasInterrupted: false,
  backgroundSince: null,
  backgroundDuration: 0,
};
