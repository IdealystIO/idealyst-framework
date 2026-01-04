// Types
export type {
  // Audio config types
  SampleRate,
  BitDepth,
  ChannelCount,
  AudioConfig,

  // PCM data types
  PCMData,
  AudioLevel,

  // Permission types
  PermissionStatus,
  PermissionResult,

  // Microphone state types
  MicrophoneState,
  MicrophoneStatus,

  // Error types
  MicrophoneErrorCode,
  MicrophoneError,

  // Callback types
  AudioDataCallback,
  AudioLevelCallback,
  StateChangeCallback,
  ErrorCallback,

  // Interface types
  IMicrophone,
  IRecorder,

  // Recording types
  RecordingFormat,
  RecordingOptions,
  RecordingResult,

  // Hook types
  UseMicrophoneOptions,
  UseMicrophoneResult,
  UseRecorderOptions,
  UseRecorderResult,
} from './types';

// Constants
export {
  DEFAULT_AUDIO_CONFIG,
  DEFAULT_AUDIO_LEVEL,
  DEFAULT_LEVEL_UPDATE_INTERVAL,
  AUDIO_PROFILES,
  BIT_DEPTH_MAX_VALUES,
} from './constants';

// Utilities
export {
  base64ToArrayBuffer,
  arrayBufferToBase64,
  createPCMTypedArray,
  calculateAudioLevels,
  float32ToInt16,
  float32ToInt8,
  createWavHeader,
  createWavFile,
  concatArrayBuffers,
} from './utils';

// Hooks
export { useMicrophone, useRecorder } from './hooks/index.web';

// Microphone class
export { WebMicrophone, createMicrophone } from './microphone.web';

// Recorder class
export { WebRecorder, createRecorder } from './recorder/recorder.web';

// Permissions
export { checkPermission, requestPermission } from './permissions/permissions.web';
