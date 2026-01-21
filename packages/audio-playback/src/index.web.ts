// Types
export type {
  // Audio config types
  SampleRate,
  BitDepth,
  ChannelCount,
  PlaybackConfig,

  // Audio source types
  PCMSource,
  FileSource,
  AudioSource,

  // Player state types
  PlayerState,
  PlayerStatus,

  // Error types
  PlayerErrorCode,
  PlayerError,

  // Callback types
  StateChangeCallback,
  ErrorCallback,
  PositionCallback,
  BufferCallback,
  EndedCallback,

  // Interface types
  IAudioPlayer,

  // Hook types
  UseAudioPlayerOptions,
  UseAudioPlayerResult,
} from './types';

// Constants
export {
  DEFAULT_PLAYBACK_CONFIG,
  DEFAULT_PLAYER_STATUS,
  PLAYBACK_PROFILES,
  BIT_DEPTH_MAX_VALUES,
  DEFAULT_VOLUME,
  DEFAULT_POSITION_UPDATE_INTERVAL,
  DEFAULT_BUFFER_SIZE,
  MIN_BUFFER_THRESHOLD_MS,
} from './constants';

// Utilities
export {
  createPlayerError,
  int8ToFloat32,
  int16ToFloat32,
  float32ToInt16,
  bufferToTypedArray,
  pcmToFloat32,
  resampleLinear,
  monoToStereo,
  stereoToMono,
  deinterleave,
  interleave,
  concatFloat32Arrays,
  concatArrayBuffers,
  samplesToDuration,
  durationToSamples,
  clamp,
  calculateRMS,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from './utils';

// Hooks
export { useAudioPlayer } from './hooks/index.web';
export { createUseAudioPlayerHook } from './hooks/createUseAudioPlayerHook';
export type { CreatePlayerFactory } from './hooks/createUseAudioPlayerHook';

// Player class
export { WebAudioPlayer, createPlayer } from './player.web';
