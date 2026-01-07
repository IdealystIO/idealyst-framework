import { NativeEventEmitter, NativeModules } from 'react-native';
import LiveAudioStream from 'react-native-live-audio-stream';
import type {
  IMicrophone,
  AudioConfig,
  AudioLevel,
  MicrophoneStatus,
  MicrophoneState,
  PermissionResult,
  PCMData,
  AudioDataCallback,
  AudioLevelCallback,
  StateChangeCallback,
  ErrorCallback,
  MicrophoneError,
} from './types';
import {
  DEFAULT_AUDIO_CONFIG,
  DEFAULT_AUDIO_LEVEL,
  DEFAULT_LEVEL_UPDATE_INTERVAL,
} from './constants';
import {
  base64ToArrayBuffer,
  createPCMTypedArray,
  calculateAudioLevels,
  createMicrophoneError,
  mergeConfig,
} from './utils';
import { checkPermission, requestPermission } from './permissions/permissions.native';

export class NativeMicrophone implements IMicrophone {
  private eventEmitter: NativeEventEmitter;
  private subscription: ReturnType<NativeEventEmitter['addListener']> | null = null;

  private config: AudioConfig = DEFAULT_AUDIO_CONFIG;
  private _status: MicrophoneStatus;
  private peakLevel: number = 0;
  private startTime: number = 0;
  private levelIntervalId: ReturnType<typeof setInterval> | null = null;
  private lastLevel: AudioLevel = DEFAULT_AUDIO_LEVEL;

  // Callbacks
  private audioDataCallbacks: Set<AudioDataCallback> = new Set();
  private audioLevelCallbacks: Map<AudioLevelCallback, number> = new Map();
  private stateChangeCallbacks: Set<StateChangeCallback> = new Set();
  private errorCallbacks: Set<ErrorCallback> = new Set();

  constructor() {
    this._status = this.createInitialStatus();

    // Create event emitter for LiveAudioStream
    this.eventEmitter = new NativeEventEmitter(
      NativeModules.LiveAudioStream || NativeModules.RNLiveAudioStream
    );
  }

  get status(): MicrophoneStatus {
    return { ...this._status };
  }

  async checkPermission(): Promise<PermissionResult> {
    const result = await checkPermission();
    this.updateStatus({ permission: result.status });
    return result;
  }

  async requestPermission(): Promise<PermissionResult> {
    const result = await requestPermission();
    this.updateStatus({ permission: result.status });
    return result;
  }

  async start(config?: Partial<AudioConfig>): Promise<void> {
    if (this._status.state === 'recording') {
      return;
    }

    this.updateState('starting');
    this.config = mergeConfig(config, DEFAULT_AUDIO_CONFIG);

    try {
      // Check/request permission
      const permResult = await this.requestPermission();
      if (permResult.status === 'blocked') {
        throw createMicrophoneError(
          'PERMISSION_BLOCKED',
          'Microphone permission blocked. Please enable in settings.'
        );
      }
      if (permResult.status === 'denied') {
        throw createMicrophoneError(
          'PERMISSION_DENIED',
          'Microphone permission denied'
        );
      }

      // Initialize LiveAudioStream
      // audioSource values (Android):
      //   0 = DEFAULT, 1 = MIC, 6 = VOICE_RECOGNITION, 7 = VOICE_COMMUNICATION
      // Using VOICE_COMMUNICATION (7) for speakerphone mode with better gain
      LiveAudioStream.init({
        sampleRate: this.config.sampleRate,
        channels: this.config.channels,
        bitsPerSample: this.config.bitDepth === 32 ? 16 : this.config.bitDepth, // Native doesn't support 32-bit
        audioSource: 7, // VOICE_COMMUNICATION - speakerphone mode with better gain
        bufferSize: this.config.bufferSize,
        wavFile: '', // Empty string = streaming mode (no file output)
      });

      // Subscribe to audio data events
      this.subscription = this.eventEmitter.addListener(
        'data',
        (base64Data) => {
          this.handleAudioData(base64Data as string);
        }
      );

      // Start recording
      LiveAudioStream.start();

      // Start level metering/duration tracking
      this.startLevelMetering();

      // Update state
      this.startTime = Date.now();
      this.peakLevel = 0;
      this.updateState('recording');
      this.updateStatus({
        config: this.config,
        permission: 'granted', // If we got here, permission was granted
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this._status.state === 'idle' || this._status.state === 'stopping') {
      return;
    }

    this.updateState('stopping');
    this.cleanup();
    this.updateState('idle');
  }

  async pause(): Promise<void> {
    if (this._status.state !== 'recording') {
      return;
    }

    try {
      // Stop the stream but don't cleanup fully
      LiveAudioStream.stop();
      this.updateState('paused');
    } catch (error) {
      this.handleError(error);
    }
  }

  async resume(): Promise<void> {
    if (this._status.state !== 'paused') {
      return;
    }

    try {
      // Restart the stream with same config
      LiveAudioStream.start();
      this.updateState('recording');
    } catch (error) {
      this.handleError(error);
    }
  }

  onAudioData(callback: AudioDataCallback): () => void {
    this.audioDataCallbacks.add(callback);
    return () => {
      this.audioDataCallbacks.delete(callback);
    };
  }

  onAudioLevel(
    callback: AudioLevelCallback,
    intervalMs: number = DEFAULT_LEVEL_UPDATE_INTERVAL
  ): () => void {
    this.audioLevelCallbacks.set(callback, intervalMs);
    return () => {
      this.audioLevelCallbacks.delete(callback);
    };
  }

  onStateChange(callback: StateChangeCallback): () => void {
    this.stateChangeCallbacks.add(callback);
    return () => {
      this.stateChangeCallbacks.delete(callback);
    };
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback);
    return () => {
      this.errorCallbacks.delete(callback);
    };
  }

  resetPeakLevel(): void {
    this.peakLevel = 0;
    this.lastLevel = { ...this.lastLevel, peak: 0 };
  }

  dispose(): void {
    this.cleanup();
    this.audioDataCallbacks.clear();
    this.audioLevelCallbacks.clear();
    this.stateChangeCallbacks.clear();
    this.errorCallbacks.clear();
  }

  // Private methods

  private createInitialStatus(): MicrophoneStatus {
    return {
      state: 'idle',
      permission: 'undetermined',
      isRecording: false,
      duration: 0,
      level: DEFAULT_AUDIO_LEVEL,
      config: DEFAULT_AUDIO_CONFIG,
    };
  }

  private handleAudioData(base64Data: string): void {
    try {
      // Decode Base64 to ArrayBuffer
      const buffer = base64ToArrayBuffer(base64Data);

      // Create typed array based on bit depth
      const effectiveBitDepth = this.config.bitDepth === 32 ? 16 : this.config.bitDepth;
      const samples = createPCMTypedArray(buffer, effectiveBitDepth);

      const pcmData: PCMData = {
        buffer,
        samples,
        timestamp: Date.now(),
        config: {
          ...this.config,
          bitDepth: effectiveBitDepth, // Actual bit depth used
        },
        async toBlob(mimeType = 'application/octet-stream'): Promise<Blob> {
          // React Native can't create Blob from ArrayBuffer/Uint8Array directly
          // The only reliable way is to use fetch with a data URI
          const dataUri = `data:${mimeType};base64,${base64Data}`;
          const response = await fetch(dataUri);
          return response.blob();
        },
        toBase64(): string {
          // Native already has the base64 data, so just return it
          return base64Data;
        },
        toDataUri(mimeType = 'application/octet-stream'): string {
          return `data:${mimeType};base64,${base64Data}`;
        },
      };

      // Calculate levels from samples
      const level = calculateAudioLevels(samples, effectiveBitDepth, this.peakLevel);
      this.peakLevel = level.peak;
      this.lastLevel = level;

      // Notify all audio data listeners
      this.audioDataCallbacks.forEach((callback) => {
        try {
          callback(pcmData);
        } catch (e) {
          console.error('Error in audio data callback:', e);
        }
      });
    } catch (error) {
      console.error('Error processing audio data:', error);
    }
  }

  private startLevelMetering(): void {
    if (this.levelIntervalId) {
      clearInterval(this.levelIntervalId);
    }

    // Use the smallest interval from all registered callbacks
    let minInterval = DEFAULT_LEVEL_UPDATE_INTERVAL;
    this.audioLevelCallbacks.forEach((interval) => {
      if (interval < minInterval) {
        minInterval = interval;
      }
    });

    this.levelIntervalId = setInterval(() => {
      // Notify level callbacks with last calculated level
      this.audioLevelCallbacks.forEach((_, callback) => {
        try {
          callback(this.lastLevel);
        } catch (e) {
          console.error('Error in audio level callback:', e);
        }
      });

      // Update duration
      if (this._status.state === 'recording') {
        this.updateStatus({
          duration: Date.now() - this.startTime,
          level: this.lastLevel,
        });
      }
    }, minInterval);
  }

  private cleanup(): void {
    if (this.levelIntervalId) {
      clearInterval(this.levelIntervalId);
      this.levelIntervalId = null;
    }

    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }

    try {
      LiveAudioStream.stop();
    } catch {
      // Ignore errors on stop
    }
  }

  private updateState(state: MicrophoneState): void {
    this.updateStatus({
      state,
      isRecording: state === 'recording',
    });
  }

  private updateStatus(partial: Partial<MicrophoneStatus>): void {
    this._status = { ...this._status, ...partial };

    // Notify state change listeners
    this.stateChangeCallbacks.forEach((callback) => {
      try {
        callback(this._status);
      } catch (e) {
        console.error('Error in state change callback:', e);
      }
    });
  }

  private handleError(error: unknown): void {
    let micError: MicrophoneError;

    if (error && typeof error === 'object' && 'code' in error) {
      micError = error as MicrophoneError;
    } else if (error instanceof Error) {
      micError = createMicrophoneError(
        'INITIALIZATION_FAILED',
        error.message,
        error
      );
    } else {
      micError = createMicrophoneError('UNKNOWN', String(error));
    }

    this.updateStatus({ state: 'error', error: micError });
    this.cleanup();

    // Notify error listeners
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(micError);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });
  }
}

/**
 * Create a new NativeMicrophone instance.
 */
export function createMicrophone(): IMicrophone {
  return new NativeMicrophone();
}
