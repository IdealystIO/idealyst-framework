/**
 * @idealyst/audio
 *
 * Unified audio package for recording and playback on web and native.
 * Web implementation using Web Audio API.
 */

// Types
export type {
  // Audio configuration
  SampleRate,
  BitDepth,
  ChannelCount,
  AudioConfig,

  // Audio session (native)
  AudioSessionCategory,
  AudioSessionCategoryOption,
  AudioSessionMode,
  AudioSessionConfig,
  AudioSessionState,
  AudioSessionInterruption,
  AudioSessionRouteChange,

  // PCM data
  PCMData,
  AudioLevel,

  // Recorder
  RecorderState,
  PermissionStatus,
  RecorderStatus,
  RecorderDataCallback,
  RecorderLevelCallback,
  RecorderStateCallback,
  IRecorder,

  // Player
  PlayerState,
  PlayerStatus,
  PlayerStateCallback,
  PlayerPositionCallback,
  PlayerBufferCallback,
  PlayerEndedCallback,
  IPlayer,

  // Audio context
  IAudioContext,
  IAudioSessionManager,

  // Errors
  AudioErrorCode,
  AudioError,

  // Hook types
  UseAudioOptions,
  UseAudioResult,
  UseRecorderOptions,
  UseRecorderResult,
  UsePlayerOptions,
  UsePlayerResult,

  // Presets
  AudioProfiles,
  SessionPresets,

  // Background recorder
  AppStateStatus,
  BackgroundRecorderStatus,
  BackgroundLifecycleEvent,
  BackgroundLifecycleInfo,
  BackgroundLifecycleCallback,
  BackgroundStatusCallback,
  BackgroundRecorderConfig,
  IBackgroundRecorder,
  UseBackgroundRecorderOptions,
  UseBackgroundRecorderResult,
} from './types';

// Constants
export {
  // Audio profiles
  AUDIO_PROFILES,

  // Session presets
  SESSION_PRESETS,

  // Defaults
  DEFAULT_AUDIO_CONFIG,
  DEFAULT_AUDIO_LEVEL,
  DEFAULT_RECORDER_STATUS,
  DEFAULT_PLAYER_STATUS,
  DEFAULT_SESSION_STATE,
  DEFAULT_LEVEL_UPDATE_INTERVAL,
  DEFAULT_POSITION_UPDATE_INTERVAL,
  DEFAULT_BACKGROUND_RECORDER_STATUS,
} from './constants';

// Context
export { getAudioContext, WebAudioContextManager } from './context';

// Session
export { getAudioSessionManager, WebAudioSessionManager } from './session';

// Recording
export { createRecorder, WebRecorder } from './recording';

// Playback
export { createPlayer, WebPlayer } from './playback';

// Background Recording (web)
export { createBackgroundRecorder, WebBackgroundRecorder } from './background';

// Hooks
export { useAudio, useRecorder, usePlayer, useBackgroundRecorder } from './hooks';

// Utilities
export {
  createAudioError,
  pcmToFloat32,
  float32ToInt16,
  resampleLinear,
  calculateAudioLevels,
  clamp,
  durationToSamples,
  samplesToDuration,
  createWavHeader,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from './utils';
