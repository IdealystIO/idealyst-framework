// ============================================
// AUDIO CONFIGURATION
// ============================================

export type SampleRate = 8000 | 16000 | 22050 | 24000 | 44100 | 48000;
export type BitDepth = 8 | 16 | 32;
export type ChannelCount = 1 | 2;

/**
 * Audio configuration for recording and playback.
 */
export interface AudioConfig {
  /** Sample rate in Hz. Default: 16000 */
  sampleRate: SampleRate;

  /** Number of audio channels. Default: 1 (mono) */
  channels: ChannelCount;

  /** Bits per sample. Default: 16 */
  bitDepth: BitDepth;
}

// ============================================
// AUDIO SESSION (iOS/Android)
// ============================================

/**
 * iOS AVAudioSession categories
 */
export type AudioSessionCategory =
  | 'ambient'
  | 'soloAmbient'
  | 'playback'
  | 'record'
  | 'playAndRecord'
  | 'multiRoute';

/**
 * iOS AVAudioSession category options
 */
export type AudioSessionCategoryOption =
  | 'mixWithOthers'
  | 'duckOthers'
  | 'allowBluetooth'
  | 'allowBluetoothA2DP'
  | 'allowAirPlay'
  | 'defaultToSpeaker'
  | 'interruptSpokenAudioAndMixWithOthers';

/**
 * iOS AVAudioSession modes
 */
export type AudioSessionMode =
  | 'default'
  | 'voiceChat'
  | 'gameChat'
  | 'videoRecording'
  | 'measurement'
  | 'moviePlayback'
  | 'videoChat'
  | 'spokenAudio';

/**
 * Audio session configuration
 */
export interface AudioSessionConfig {
  category: AudioSessionCategory;
  categoryOptions?: AudioSessionCategoryOption[];
  mode?: AudioSessionMode;
  active?: boolean;
}

/**
 * Audio session state
 */
export interface AudioSessionState {
  isActive: boolean;
  category: AudioSessionCategory;
  mode: AudioSessionMode;
  categoryOptions: AudioSessionCategoryOption[];
}

/**
 * Audio session interruption info
 */
export interface AudioSessionInterruption {
  type: 'began' | 'ended';
  shouldResume?: boolean;
}

/**
 * Audio session route change info
 */
export interface AudioSessionRouteChange {
  reason: string;
  previousOutputs: string[];
  currentOutputs: string[];
}

// ============================================
// PCM DATA
// ============================================

/**
 * PCM audio data packet
 */
export interface PCMData {
  /** Raw audio buffer */
  buffer: ArrayBufferLike;

  /** Typed array of samples */
  samples: Int8Array | Int16Array | Float32Array;

  /** Capture/playback timestamp */
  timestamp: number;

  /** Audio configuration */
  config: AudioConfig;

  /** Convert to Base64 string */
  toBase64(): string;
}

/**
 * Audio level information
 */
export interface AudioLevel {
  /** Current level (0.0 - 1.0) */
  current: number;

  /** Peak level since last reset (0.0 - 1.0) */
  peak: number;

  /** RMS (root mean square) */
  rms: number;

  /** Decibel value (-Infinity to 0) */
  db: number;
}

// ============================================
// RECORDER TYPES
// ============================================

export type RecorderState =
  | 'idle'
  | 'requesting_permission'
  | 'starting'
  | 'recording'
  | 'paused'
  | 'stopping'
  | 'error';

export type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';

export interface RecorderStatus {
  state: RecorderState;
  isRecording: boolean;
  isPaused: boolean;
  permission: PermissionStatus;
  duration: number;
  level: AudioLevel;
  config: AudioConfig;
  error?: AudioError;
}

export type RecorderDataCallback = (data: PCMData) => void;
export type RecorderLevelCallback = (level: AudioLevel) => void;
export type RecorderStateCallback = (status: RecorderStatus) => void;

/**
 * Recorder interface
 */
export interface IRecorder {
  readonly status: RecorderStatus;

  checkPermission(): Promise<PermissionStatus>;
  requestPermission(): Promise<PermissionStatus>;

  start(config?: Partial<AudioConfig>): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;

  onData(callback: RecorderDataCallback): () => void;
  onLevel(callback: RecorderLevelCallback, intervalMs?: number): () => void;
  onStateChange(callback: RecorderStateCallback): () => void;

  resetPeakLevel(): void;
  dispose(): void;
}

// ============================================
// PLAYER TYPES
// ============================================

export type PlayerState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'error';

export interface PlayerStatus {
  state: PlayerState;
  isPlaying: boolean;
  isPaused: boolean;
  duration: number;
  position: number;
  buffered: number;
  volume: number;
  muted: boolean;
  error?: AudioError;
}

export type PlayerStateCallback = (status: PlayerStatus) => void;
export type PlayerPositionCallback = (position: number) => void;
export type PlayerBufferCallback = (buffered: number) => void;
export type PlayerEndedCallback = () => void;

/**
 * Player interface
 */
export interface IPlayer {
  readonly status: PlayerStatus;

  // File playback
  loadFile(uri: string): Promise<void>;
  unload(): void;

  // PCM streaming
  loadPCMStream(config: AudioConfig): Promise<void>;
  feedPCMData(data: ArrayBufferLike | Int16Array): void;
  flush(): Promise<void>;
  clearBuffer(): void;

  // Playback control
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  seek(positionMs: number): Promise<void>;

  // Volume
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;

  // Events
  onStateChange(callback: PlayerStateCallback): () => void;
  onPosition(callback: PlayerPositionCallback, intervalMs?: number): () => void;
  onBufferChange(callback: PlayerBufferCallback): () => void;
  onEnded(callback: PlayerEndedCallback): () => void;

  dispose(): void;
}

// ============================================
// AUDIO CONTEXT
// ============================================

/**
 * Shared audio context interface
 */
export interface IAudioContext {
  /** Native sample rate of the audio context */
  readonly sampleRate: number;

  /** Current time in seconds */
  readonly currentTime: number;

  /** Whether the context is initialized */
  readonly isInitialized: boolean;

  /** Initialize the audio context (call before using recorder/player) */
  initialize(): Promise<void>;

  /** Get the underlying platform audio context */
  getContext(): AudioContext | null;

  /** Suspend the audio context */
  suspend(): Promise<void>;

  /** Resume the audio context */
  resume(): Promise<void>;

  /** Close and dispose the audio context */
  close(): Promise<void>;
}

/**
 * Audio session manager interface
 */
export interface IAudioSessionManager {
  readonly state: AudioSessionState;

  configure(config: Partial<AudioSessionConfig>): Promise<void>;
  activate(): Promise<void>;
  deactivate(notifyOthers?: boolean): Promise<void>;

  onInterruption(callback: (interruption: AudioSessionInterruption) => void): () => void;
  onRouteChange(callback: (change: AudioSessionRouteChange) => void): () => void;

  getCurrentOutputs(): string[];
}

// ============================================
// ERROR TYPES
// ============================================

export type AudioErrorCode =
  // Permission errors
  | 'PERMISSION_DENIED'
  | 'PERMISSION_BLOCKED'
  // Device errors
  | 'DEVICE_NOT_FOUND'
  | 'DEVICE_IN_USE'
  | 'NOT_SUPPORTED'
  // Playback errors
  | 'SOURCE_NOT_FOUND'
  | 'FORMAT_NOT_SUPPORTED'
  | 'DECODE_ERROR'
  | 'PLAYBACK_ERROR'
  | 'BUFFER_UNDERRUN'
  // Recording errors
  | 'RECORDING_ERROR'
  // Background errors
  | 'BACKGROUND_NOT_SUPPORTED'
  | 'BACKGROUND_MAX_DURATION'
  // General errors
  | 'INITIALIZATION_FAILED'
  | 'INVALID_STATE'
  | 'INVALID_CONFIG'
  | 'UNKNOWN';

export interface AudioError {
  code: AudioErrorCode;
  message: string;
  originalError?: Error;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseAudioOptions {
  /** Audio session configuration (native only) */
  session?: Partial<AudioSessionConfig>;

  /** Whether to initialize on mount. Default: true */
  initializeOnMount?: boolean;
}

export interface UseAudioResult {
  /** Whether the audio context is initialized */
  isInitialized: boolean;

  /** Audio session state (native) */
  sessionState: AudioSessionState;

  /** Current audio outputs */
  outputs: string[];

  /** Initialize audio (call before using recorder/player) */
  initialize: () => Promise<void>;

  /** Configure audio session (native) */
  configureSession: (config: Partial<AudioSessionConfig>) => Promise<void>;

  /** Suspend audio context */
  suspend: () => Promise<void>;

  /** Resume audio context */
  resume: () => Promise<void>;
}

export interface UseRecorderOptions {
  /** Audio configuration */
  config?: Partial<AudioConfig>;

  /** Auto request permission on mount */
  autoRequestPermission?: boolean;

  /** Level update interval in ms. Default: 100 */
  levelUpdateInterval?: number;
}

export interface UseRecorderResult {
  // State
  status: RecorderStatus;
  isRecording: boolean;
  isPaused: boolean;
  permission: PermissionStatus;
  duration: number;
  level: AudioLevel;
  error: AudioError | null;

  // Actions
  start: (config?: Partial<AudioConfig>) => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;

  // Permissions
  checkPermission: () => Promise<PermissionStatus>;
  requestPermission: () => Promise<PermissionStatus>;

  // Data subscription
  subscribeToData: (callback: RecorderDataCallback) => () => void;

  // Utilities
  resetPeakLevel: () => void;
}

export interface UsePlayerOptions {
  /** Auto play when source is loaded */
  autoPlay?: boolean;

  /** Initial volume (0.0 - 1.0) */
  volume?: number;

  /** Position update interval in ms. Default: 100 */
  positionUpdateInterval?: number;
}

export interface UsePlayerResult {
  // State
  status: PlayerStatus;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  volume: number;
  error: AudioError | null;

  // File playback
  loadFile: (uri: string) => Promise<void>;
  unload: () => void;

  // PCM streaming
  loadPCMStream: (config: AudioConfig) => Promise<void>;
  feedPCMData: (data: ArrayBufferLike | Int16Array) => void;
  flush: () => Promise<void>;
  clearBuffer: () => void;

  // Playback control
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (positionMs: number) => Promise<void>;

  // Volume
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

// ============================================
// PRESET TYPES
// ============================================

export interface AudioProfiles {
  speech: AudioConfig;
  highQuality: AudioConfig;
  studio: AudioConfig;
  phone: AudioConfig;
}

export interface SessionPresets {
  playback: AudioSessionConfig;
  record: AudioSessionConfig;
  voiceChat: AudioSessionConfig;
  ambient: AudioSessionConfig;
  default: AudioSessionConfig;
  backgroundRecord: AudioSessionConfig;
}

// ============================================
// BACKGROUND RECORDER TYPES
// ============================================

export type AppStateStatus = 'active' | 'background' | 'inactive' | 'unknown' | 'extension';

/**
 * Extended recorder status with background lifecycle state.
 */
export interface BackgroundRecorderStatus extends RecorderStatus {
  /** Current app state */
  appState: AppStateStatus;

  /** Whether the recorder is currently operating in background */
  isInBackground: boolean;

  /** Whether the recording was interrupted by the OS (phone call, Siri, etc.) */
  wasInterrupted: boolean;

  /** Timestamp when the app last entered background, or null */
  backgroundSince: number | null;

  /** Total time spent recording in background (ms) */
  backgroundDuration: number;
}

/** Lifecycle event types fired by the background recorder */
export type BackgroundLifecycleEvent =
  | 'backgrounded'
  | 'foregrounded'
  | 'interrupted'
  | 'interruptionEnded'
  | 'maxDurationReached'
  | 'stopped';

export interface BackgroundLifecycleInfo {
  event: BackgroundLifecycleEvent;
  timestamp: number;
  /** Duration spent in background when foregrounded (ms) */
  backgroundDuration?: number;
  /** Whether the OS suggested resuming after interruption */
  shouldResume?: boolean;
}

export type BackgroundLifecycleCallback = (info: BackgroundLifecycleInfo) => void;
export type BackgroundStatusCallback = (status: BackgroundRecorderStatus) => void;

export interface BackgroundRecorderConfig {
  /** Audio configuration for recording */
  audio?: Partial<AudioConfig>;

  /** Audio session configuration for background recording.
   *  Defaults to SESSION_PRESETS.backgroundRecord */
  session?: Partial<AudioSessionConfig>;

  /** Maximum duration to record in background (ms). undefined = no limit */
  maxBackgroundDuration?: number;

  /** Whether to automatically configure the audio session for background.
   *  Default: true */
  autoConfigureSession?: boolean;
}

/**
 * Background-aware recorder interface.
 * Composes an IRecorder with AppState lifecycle management.
 */
export interface IBackgroundRecorder {
  /** The wrapped recorder instance */
  readonly recorder: IRecorder;

  /** Background-aware status */
  readonly status: BackgroundRecorderStatus;

  // Recording control (proxied to inner recorder)
  start(config?: Partial<AudioConfig>): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;

  // Permission (proxied)
  checkPermission(): Promise<PermissionStatus>;
  requestPermission(): Promise<PermissionStatus>;

  // Data streaming (proxied)
  onData(callback: RecorderDataCallback): () => void;
  onLevel(callback: RecorderLevelCallback, intervalMs?: number): () => void;

  // Background-specific
  onLifecycle(callback: BackgroundLifecycleCallback): () => void;
  onStatusChange(callback: BackgroundStatusCallback): () => void;

  // Cleanup
  resetPeakLevel(): void;
  dispose(): void;
}

// ============================================
// BACKGROUND RECORDER HOOK TYPES
// ============================================

export interface UseBackgroundRecorderOptions {
  /** Audio configuration */
  config?: Partial<AudioConfig>;

  /** Audio session configuration for background recording */
  session?: Partial<AudioSessionConfig>;

  /** Auto request permission on mount */
  autoRequestPermission?: boolean;

  /** Level update interval in ms. Default: 100 */
  levelUpdateInterval?: number;

  /** Maximum background recording duration (ms). undefined = no limit */
  maxBackgroundDuration?: number;

  /** Whether to auto-configure audio session. Default: true */
  autoConfigureSession?: boolean;

  /** Called on background lifecycle events */
  onLifecycleEvent?: BackgroundLifecycleCallback;
}

export interface UseBackgroundRecorderResult {
  // Standard recorder state
  status: BackgroundRecorderStatus;
  isRecording: boolean;
  isPaused: boolean;
  permission: PermissionStatus;
  duration: number;
  level: AudioLevel;
  error: AudioError | null;

  // Background-specific state
  isInBackground: boolean;
  wasInterrupted: boolean;
  backgroundDuration: number;
  appState: AppStateStatus;

  // Actions
  start: (config?: Partial<AudioConfig>) => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;

  // Permissions
  checkPermission: () => Promise<PermissionStatus>;
  requestPermission: () => Promise<PermissionStatus>;

  // Data subscription
  subscribeToData: (callback: RecorderDataCallback) => () => void;

  // Utilities
  resetPeakLevel: () => void;
}
