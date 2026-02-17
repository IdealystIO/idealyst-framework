// ============================================
// AUDIO CONFIGURATION
// ============================================

export type SampleRate = 8000 | 16000 | 22050 | 44100 | 48000;
export type BitDepth = 8 | 16 | 32;
export type ChannelCount = 1 | 2;

export interface PlaybackConfig {
  /** Sample rate in Hz. Default: 16000 */
  sampleRate: SampleRate;

  /** Number of audio channels. Default: 1 (mono) */
  channels: ChannelCount;

  /** Bits per sample. Default: 16 */
  bitDepth: BitDepth;
}

// ============================================
// AUDIO SOURCE TYPES
// ============================================

export interface PCMSource {
  type: 'pcm';
  config: PlaybackConfig;
}

export interface FileSource {
  type: 'file';
  /** File path (native) or blob URL (web) */
  uri: string;
}

export type AudioSource = PCMSource | FileSource;

// ============================================
// PLAYER STATE
// ============================================

export type PlayerState =
  | 'idle' // Not initialized
  | 'loading' // Loading source
  | 'ready' // Ready to play
  | 'playing' // Actively playing
  | 'paused' // Paused
  | 'stopped' // Stopped (can restart)
  | 'error'; // Error state

export interface PlayerStatus {
  /** Current player state */
  state: PlayerState;

  /** Whether audio is currently playing */
  isPlaying: boolean;

  /** Whether audio is paused */
  isPaused: boolean;

  /** Total duration in milliseconds (0 for streams) */
  duration: number;

  /** Current playback position in milliseconds */
  position: number;

  /** Buffered duration in milliseconds */
  buffered: number;

  /** Current volume (0.0 - 1.0) */
  volume: number;

  /** Whether audio is muted */
  muted: boolean;

  /** Error if state is 'error' */
  error?: PlayerError;

  /** Current audio source */
  source?: AudioSource;
}

// ============================================
// ERROR HANDLING
// ============================================

export type PlayerErrorCode =
  | 'SOURCE_NOT_FOUND'
  | 'FORMAT_NOT_SUPPORTED'
  | 'DECODE_ERROR'
  | 'PLAYBACK_ERROR'
  | 'BUFFER_UNDERRUN'
  | 'INITIALIZATION_FAILED'
  | 'INVALID_STATE'
  | 'UNKNOWN';

export interface PlayerError {
  code: PlayerErrorCode;
  message: string;
  originalError?: Error;
}

// ============================================
// CALLBACK TYPES
// ============================================

export type StateChangeCallback = (status: PlayerStatus) => void;
export type ErrorCallback = (error: PlayerError) => void;
export type PositionCallback = (position: number) => void;
export type BufferCallback = (buffered: number) => void;
export type EndedCallback = () => void;

// ============================================
// PLAYER INTERFACE
// ============================================

export interface IAudioPlayer {
  /** Current player status */
  readonly status: PlayerStatus;

  // Source management

  /**
   * Load an audio file for playback.
   * @param uri File path (native) or URL/blob URL (web)
   */
  loadFile(uri: string): Promise<void>;

  /**
   * Initialize for PCM streaming playback.
   * @param config Audio configuration for the PCM stream
   */
  loadPCMStream(config: PlaybackConfig): Promise<void>;

  /** Unload the current source and reset player */
  unload(): void;

  // PCM streaming

  /**
   * Feed PCM audio data for streaming playback.
   * Must call loadPCMStream() first.
   * @param data Raw PCM samples as ArrayBuffer or Int16Array
   */
  feedPCMData(data: ArrayBufferLike | Int16Array): void;

  /**
   * Flush remaining buffered PCM data.
   * Call this when done feeding data to ensure all audio plays.
   */
  flush(): Promise<void>;

  // Playback control

  /** Start or resume playback */
  play(): Promise<void>;

  /** Pause playback */
  pause(): void;

  /** Stop playback and reset position to 0 */
  stop(): void;

  /**
   * Seek to a specific position.
   * Only works for file sources, not PCM streams.
   * @param positionMs Position in milliseconds
   */
  seek(positionMs: number): Promise<void>;

  // Volume control

  /**
   * Set playback volume.
   * @param volume Volume level (0.0 to 1.0)
   */
  setVolume(volume: number): void;

  /**
   * Set muted state.
   * @param muted Whether to mute audio
   */
  setMuted(muted: boolean): void;

  // Subscriptions

  /**
   * Subscribe to player state changes.
   * @returns Unsubscribe function
   */
  onStateChange(callback: StateChangeCallback): () => void;

  /**
   * Subscribe to errors.
   * @returns Unsubscribe function
   */
  onError(callback: ErrorCallback): () => void;

  /**
   * Subscribe to position updates.
   * @param callback Position callback
   * @param intervalMs Update interval in milliseconds. Default: 100
   * @returns Unsubscribe function
   */
  onPosition(callback: PositionCallback, intervalMs?: number): () => void;

  /**
   * Subscribe to buffer changes.
   * @returns Unsubscribe function
   */
  onBufferChange(callback: BufferCallback): () => void;

  /**
   * Subscribe to playback ended event.
   * @returns Unsubscribe function
   */
  onEnded(callback: EndedCallback): () => void;

  /** Clean up resources */
  dispose(): void;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseAudioPlayerOptions {
  /** Automatically start playing when source is loaded. Default: false */
  autoPlay?: boolean;

  /** Initial volume (0.0 to 1.0). Default: 1.0 */
  volume?: number;

  /** Position update interval in milliseconds. Default: 100 */
  positionUpdateInterval?: number;
}

// ============================================
// AUDIO SESSION TYPES (iOS/Android)
// ============================================

/**
 * iOS AVAudioSession categories
 * @see https://developer.apple.com/documentation/avfaudio/avaudiosession/category
 */
export type AudioSessionCategory =
  | 'ambient' // Playback mixes with other audio, silenced by lock/silent switch
  | 'soloAmbient' // Default. Silences other audio, silenced by lock/silent switch
  | 'playback' // Audio continues in background, ignores silent switch
  | 'record' // For recording audio input
  | 'playAndRecord' // Simultaneous recording and playback
  | 'multiRoute'; // Route audio to multiple outputs

/**
 * iOS AVAudioSession category options
 * @see https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions
 */
export type AudioSessionCategoryOption =
  | 'mixWithOthers' // Allow mixing with other audio
  | 'duckOthers' // Lower other audio volume
  | 'allowBluetooth' // Enable Bluetooth audio devices
  | 'allowBluetoothA2DP' // Enable Bluetooth A2DP
  | 'allowAirPlay' // Enable AirPlay
  | 'defaultToSpeaker' // Route to speaker instead of receiver
  | 'interruptSpokenAudioAndMixWithOthers'; // Interrupt spoken audio

/**
 * iOS AVAudioSession modes
 * @see https://developer.apple.com/documentation/avfaudio/avaudiosession/mode
 */
export type AudioSessionMode =
  | 'default' // Default mode
  | 'voiceChat' // Optimized for voice chat (VoIP)
  | 'gameChat' // Optimized for game chat
  | 'videoRecording' // For video recording
  | 'measurement' // For audio measurement apps
  | 'moviePlayback' // For movie playback
  | 'videoChat' // For video chat
  | 'spokenAudio'; // For spoken audio (podcasts, audiobooks)

/**
 * Audio session configuration
 */
export interface AudioSessionConfig {
  /** Audio session category. Default: 'playAndRecord' */
  category: AudioSessionCategory;

  /** Additional category options */
  categoryOptions?: AudioSessionCategoryOption[];

  /** Audio session mode. Default: 'default' */
  mode?: AudioSessionMode;

  /** Whether to activate the session immediately. Default: true */
  active?: boolean;
}

/**
 * Audio session state
 */
export interface AudioSessionState {
  /** Whether the audio session is active */
  isActive: boolean;

  /** Current category */
  category: AudioSessionCategory;

  /** Current mode */
  mode: AudioSessionMode;

  /** Current category options */
  categoryOptions: AudioSessionCategoryOption[];

  /** Whether another app is playing audio */
  otherAudioPlaying: boolean;
}

/**
 * Audio session interruption info
 */
export interface AudioSessionInterruption {
  /** Type of interruption */
  type: 'began' | 'ended';

  /** Whether playback should resume (only for 'ended') */
  shouldResume?: boolean;
}

/**
 * Audio session route change info
 */
export interface AudioSessionRouteChange {
  /** Reason for the route change */
  reason:
    | 'unknown'
    | 'newDeviceAvailable'
    | 'oldDeviceUnavailable'
    | 'categoryChange'
    | 'override'
    | 'wakeFromSleep'
    | 'noSuitableRouteForCategory'
    | 'routeConfigurationChange';

  /** Previous route outputs */
  previousOutputs: string[];

  /** Current route outputs */
  currentOutputs: string[];
}

export type AudioSessionInterruptionCallback = (interruption: AudioSessionInterruption) => void;
export type AudioSessionRouteChangeCallback = (change: AudioSessionRouteChange) => void;

/**
 * Audio session manager interface
 */
export interface IAudioSessionManager {
  /** Current audio session state */
  readonly state: AudioSessionState;

  /**
   * Configure and optionally activate the audio session.
   * @param config Audio session configuration
   */
  configure(config: Partial<AudioSessionConfig>): Promise<void>;

  /**
   * Activate the audio session with current configuration.
   */
  activate(): Promise<void>;

  /**
   * Deactivate the audio session.
   * @param notifyOthers Whether to notify other apps they can resume. Default: true
   */
  deactivate(notifyOthers?: boolean): Promise<void>;

  /**
   * Subscribe to audio interruption events (e.g., phone call).
   * @returns Unsubscribe function
   */
  onInterruption(callback: AudioSessionInterruptionCallback): () => void;

  /**
   * Subscribe to audio route change events (e.g., headphones plugged/unplugged).
   * @returns Unsubscribe function
   */
  onRouteChange(callback: AudioSessionRouteChangeCallback): () => void;

  /**
   * Get current audio route outputs.
   */
  getCurrentOutputs(): string[];
}

/**
 * Preset configurations for common use cases
 */
export interface AudioSessionPresets {
  /** For apps that only play audio (music, podcasts) */
  playback: AudioSessionConfig;

  /** For apps that only record audio */
  record: AudioSessionConfig;

  /** For voice chat / VoIP applications */
  voiceChat: AudioSessionConfig;

  /** For apps that mix with other audio (games with sound effects) */
  ambient: AudioSessionConfig;

  /** Default for simultaneous playback and recording */
  default: AudioSessionConfig;
}

// ============================================
// HOOK TYPES (useAudioSession)
// ============================================

export interface UseAudioSessionOptions {
  /** Initial configuration to apply. If not provided, uses default preset. */
  config?: Partial<AudioSessionConfig>;

  /** Whether to activate on mount. Default: false */
  activateOnMount?: boolean;

  /** Whether to deactivate on unmount. Default: true */
  deactivateOnUnmount?: boolean;
}

export interface UseAudioSessionResult {
  /** Current audio session state */
  state: AudioSessionState;

  /** Whether the session is active */
  isActive: boolean;

  /** Configure the audio session */
  configure: (config: Partial<AudioSessionConfig>) => Promise<void>;

  /** Activate the audio session */
  activate: () => Promise<void>;

  /** Deactivate the audio session */
  deactivate: (notifyOthers?: boolean) => Promise<void>;

  /** Current route outputs (e.g., ['Speaker'], ['Headphones']) */
  outputs: string[];
}

// ============================================
// HOOK TYPES (useAudioPlayer)
// ============================================

export interface UseAudioPlayerResult {
  // State
  /** Full player status object */
  status: PlayerStatus;

  /** Whether audio is currently playing */
  isPlaying: boolean;

  /** Whether audio is paused */
  isPaused: boolean;

  /** Whether a source is loading */
  isLoading: boolean;

  /** Current playback position in milliseconds */
  position: number;

  /** Total duration in milliseconds (0 for streams) */
  duration: number;

  /** Current volume (0.0 to 1.0) */
  volume: number;

  /** Current error if any */
  error: PlayerError | null;

  // Source loading

  /**
   * Load an audio file for playback.
   * @param uri File path (native) or URL/blob URL (web)
   */
  loadFile: (uri: string) => Promise<void>;

  /**
   * Initialize for PCM streaming playback.
   * @param config Audio configuration for the PCM stream
   */
  loadPCMStream: (config: PlaybackConfig) => Promise<void>;

  /** Unload the current source */
  unload: () => void;

  // PCM streaming

  /**
   * Feed PCM audio data for streaming playback.
   * @param data Raw PCM samples as ArrayBuffer or Int16Array
   */
  feedPCMData: (data: ArrayBufferLike | Int16Array) => void;

  /**
   * Flush remaining buffered PCM data.
   */
  flush: () => Promise<void>;

  // Controls

  /** Start or resume playback */
  play: () => Promise<void>;

  /** Pause playback */
  pause: () => void;

  /** Stop playback */
  stop: () => void;

  /**
   * Seek to a specific position.
   * @param positionMs Position in milliseconds
   */
  seek: (positionMs: number) => Promise<void>;

  /**
   * Set playback volume.
   * @param volume Volume level (0.0 to 1.0)
   */
  setVolume: (volume: number) => void;

  /** Toggle mute state */
  toggleMute: () => void;
}
