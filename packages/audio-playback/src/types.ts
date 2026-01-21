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
  feedPCMData(data: ArrayBuffer | Int16Array): void;

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
  feedPCMData: (data: ArrayBuffer | Int16Array) => void;

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
