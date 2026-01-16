// ============================================
// AUDIO CONFIGURATION
// ============================================

export type SampleRate = 8000 | 16000 | 22050 | 44100 | 48000;
export type BitDepth = 8 | 16 | 32;
export type ChannelCount = 1 | 2;

export interface AudioConfig {
  /** Sample rate in Hz. Default: 16000 (speech-optimized) */
  sampleRate: SampleRate;

  /** Number of audio channels. Default: 1 (mono) */
  channels: ChannelCount;

  /** Bits per sample. Default: 16 */
  bitDepth: BitDepth;

  /**
   * Buffer size for audio processing (samples per callback).
   * Lower = more responsive, higher CPU. Higher = less CPU, more latency.
   * Web: Must be power of 2 (256, 512, 1024, 2048, 4096).
   * Native: Approximate target, actual may vary.
   * Default: 4096
   */
  bufferSize: number;
}

// ============================================
// PCM DATA TYPES
// ============================================

export interface PCMData {
  /** Raw PCM samples as ArrayBuffer */
  buffer: ArrayBuffer;

  /** TypedArray view for easy sample access based on bit depth */
  samples: Int8Array | Int16Array | Float32Array;

  /** Timestamp when this buffer was captured (ms since epoch) */
  timestamp: number;

  /** Audio configuration this data was captured with */
  config: AudioConfig;

  /**
   * Get the audio data as a Blob (cross-platform).
   * On web, creates a Blob directly from ArrayBuffer.
   * On native, uses fetch with data URI to create Blob.
   * @param mimeType MIME type for the blob. Default: 'application/octet-stream'
   */
  toBlob(mimeType?: string): Promise<Blob>;

  /**
   * Get the audio data as a base64 string (cross-platform).
   * Useful for sending audio data over APIs or storing.
   */
  toBase64(): string;

  /**
   * Get the audio data as a data URI (cross-platform).
   * Useful for audio playback or display.
   * @param mimeType MIME type for the data URI. Default: 'application/octet-stream'
   */
  toDataUri(mimeType?: string): string;
}

export interface AudioLevel {
  /** Current audio level (0.0 - 1.0, normalized) */
  current: number;

  /** Peak audio level since last reset (0.0 - 1.0) */
  peak: number;

  /** RMS (root mean square) level for more accurate metering */
  rms: number;

  /** Decibel value (-Infinity to 0) */
  db: number;
}

// ============================================
// PERMISSION TYPES
// ============================================

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'blocked' // User denied and "don't ask again" on native
  | 'unavailable'; // No microphone hardware/not supported

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

// ============================================
// MICROPHONE STATE
// ============================================

export type MicrophoneState =
  | 'idle' // Not started
  | 'starting' // Initializing
  | 'recording' // Actively capturing
  | 'paused' // Paused (native only - web must stop/start)
  | 'stopping' // Cleaning up
  | 'danger'; // Error state

export interface MicrophoneStatus {
  state: MicrophoneState;

  /** Current permission status */
  permission: PermissionStatus;

  /** Whether recording is active */
  isRecording: boolean;

  /** Duration of current recording session in milliseconds */
  duration: number;

  /** Current audio level metrics */
  level: AudioLevel;

  /** Error if state is 'error' */
  error?: MicrophoneError;

  /** Current audio configuration */
  config: AudioConfig;
}

// ============================================
// ERROR HANDLING
// ============================================

export type MicrophoneErrorCode =
  | 'PERMISSION_DENIED'
  | 'PERMISSION_BLOCKED'
  | 'DEVICE_NOT_FOUND'
  | 'DEVICE_IN_USE'
  | 'NOT_SUPPORTED'
  | 'INITIALIZATION_FAILED'
  | 'RECORDING_FAILED'
  | 'INVALID_CONFIG'
  | 'UNKNOWN';

export interface MicrophoneError {
  code: MicrophoneErrorCode;
  message: string;
  originalError?: Error;
}

// ============================================
// CALLBACK TYPES
// ============================================

export type AudioDataCallback = (data: PCMData) => void;
export type AudioLevelCallback = (level: AudioLevel) => void;
export type StateChangeCallback = (status: MicrophoneStatus) => void;
export type ErrorCallback = (error: MicrophoneError) => void;

// ============================================
// MICROPHONE INTERFACE
// ============================================

export interface IMicrophone {
  /** Current status */
  readonly status: MicrophoneStatus;

  /** Check microphone permission status */
  checkPermission(): Promise<PermissionResult>;

  /** Request microphone permission */
  requestPermission(): Promise<PermissionResult>;

  /**
   * Start recording/streaming audio.
   * @param config Optional audio configuration (uses defaults if not provided)
   */
  start(config?: Partial<AudioConfig>): Promise<void>;

  /** Stop recording/streaming */
  stop(): Promise<void>;

  /**
   * Pause recording (native only).
   * On web, this will stop - use start() to resume.
   */
  pause(): Promise<void>;

  /** Resume recording after pause (native only) */
  resume(): Promise<void>;

  /**
   * Subscribe to PCM audio data chunks.
   * @returns Unsubscribe function
   */
  onAudioData(callback: AudioDataCallback): () => void;

  /**
   * Subscribe to audio level updates (for visualization).
   * @param intervalMs Update interval in milliseconds. Default: 100
   * @returns Unsubscribe function
   */
  onAudioLevel(callback: AudioLevelCallback, intervalMs?: number): () => void;

  /**
   * Subscribe to state changes.
   * @returns Unsubscribe function
   */
  onStateChange(callback: StateChangeCallback): () => void;

  /**
   * Subscribe to errors.
   * @returns Unsubscribe function
   */
  onError(callback: ErrorCallback): () => void;

  /** Reset peak level meter */
  resetPeakLevel(): void;

  /** Clean up resources */
  dispose(): void;
}

// ============================================
// RECORDER INTERFACE (File Recording)
// ============================================

export type RecordingFormat = 'wav' | 'raw';

export interface RecordingOptions {
  /** Output format. Default: 'wav' */
  format: RecordingFormat;

  /** Audio configuration */
  audioConfig?: Partial<AudioConfig>;

  /** Maximum recording duration in seconds. 0 = unlimited */
  maxDuration?: number;
}

export interface RecordingResult {
  /** File path (native) or Blob URL (web) */
  uri: string;

  /** Duration in milliseconds */
  duration: number;

  /** File size in bytes */
  size: number;

  /** Audio configuration used */
  config: AudioConfig;

  /** Format of the recording */
  format: RecordingFormat;

  /** Get the recording as ArrayBuffer (for upload, processing, etc.) */
  getArrayBuffer(): Promise<ArrayBuffer>;

  /** Get the recording as Blob (web) or base64 string (native) */
  getData(): Promise<Blob | string>;
}

export interface IRecorder {
  /** Whether currently recording to file */
  readonly isRecording: boolean;

  /** Current recording duration in milliseconds */
  readonly duration: number;

  /** Start recording to file */
  startRecording(options?: RecordingOptions): Promise<void>;

  /** Stop recording and get result */
  stopRecording(): Promise<RecordingResult>;

  /** Cancel recording without saving */
  cancelRecording(): Promise<void>;

  /** Clean up resources */
  dispose(): void;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseMicrophoneOptions {
  /** Audio configuration */
  config?: Partial<AudioConfig>;

  /** Auto-request permission on mount. Default: false */
  autoRequestPermission?: boolean;

  /** Audio level update interval in ms. Default: 100 */
  levelUpdateInterval?: number;
}

export interface UseMicrophoneResult {
  // State
  status: MicrophoneStatus;
  isRecording: boolean;
  isPaused: boolean;
  level: AudioLevel;
  error: MicrophoneError | null;
  permission: PermissionStatus;

  // Actions
  start: (config?: Partial<AudioConfig>) => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  requestPermission: () => Promise<PermissionResult>;
  resetPeakLevel: () => void;

  // Data subscription (for custom processing)
  subscribeToAudioData: (callback: AudioDataCallback) => () => void;
}

export interface UseRecorderOptions {
  /** Recording options */
  options?: RecordingOptions;
}

export interface UseRecorderResult {
  // State
  isRecording: boolean;
  duration: number;
  error: MicrophoneError | null;

  // Actions
  startRecording: (options?: RecordingOptions) => Promise<void>;
  stopRecording: () => Promise<RecordingResult>;
  cancelRecording: () => Promise<void>;
}
