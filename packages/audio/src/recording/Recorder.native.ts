/**
 * Native Recorder
 *
 * Uses react-native-audio-api AudioRecorder for recording on React Native.
 */

import {
  AudioRecorder,
  AudioManager,
} from 'react-native-audio-api';
import type {
  IRecorder,
  RecorderStatus,
  RecorderState,
  PermissionStatus,
  AudioConfig,
  AudioLevel,
  PCMData,
  RecorderDataCallback,
  RecorderLevelCallback,
  RecorderStateCallback,
  IAudioContext,
} from '../types';
import {
  DEFAULT_AUDIO_CONFIG,
  DEFAULT_AUDIO_LEVEL,
  DEFAULT_RECORDER_STATUS,
  DEFAULT_LEVEL_UPDATE_INTERVAL,
} from '../constants';
import {
  createAudioError,
  calculateAudioLevels,
  mergeConfig,
  arrayBufferToBase64,
  float32ToInt16,
} from '../utils';

export class NativeRecorder implements IRecorder {
  private audioContext: IAudioContext;
  private audioRecorder: AudioRecorder | null = null;

  private config: AudioConfig = DEFAULT_AUDIO_CONFIG;
  private _status: RecorderStatus = { ...DEFAULT_RECORDER_STATUS };
  private peakLevel: number = 0;
  private startTime: number = 0;
  private levelIntervalId: ReturnType<typeof setInterval> | null = null;
  private lastLevel: AudioLevel = DEFAULT_AUDIO_LEVEL;

  // Callbacks
  private dataCallbacks: Set<RecorderDataCallback> = new Set();
  private levelCallbacks: Map<RecorderLevelCallback, number> = new Map();
  private stateCallbacks: Set<RecorderStateCallback> = new Set();

  constructor(audioContext: IAudioContext) {
    this.audioContext = audioContext;
  }

  get status(): RecorderStatus {
    return { ...this._status };
  }

  async checkPermission(): Promise<PermissionStatus> {
    try {
      const granted = await AudioManager.checkRecordingPermissions();
      const status = granted ? 'granted' : 'undetermined';
      this.updateStatus({ permission: status });
      return status;
    } catch {
      return 'undetermined';
    }
  }

  async requestPermission(): Promise<PermissionStatus> {
    try {
      const granted = await AudioManager.requestRecordingPermissions();
      const status = granted ? 'granted' : 'denied';
      this.updateStatus({ permission: status });
      return status;
    } catch (error: any) {
      this.updateStatus({ permission: 'denied' });
      return 'denied';
    }
  }

  async start(configOverride?: Partial<AudioConfig>): Promise<void> {
    if (this._status.state === 'recording') {
      return;
    }

    this.updateState('requesting_permission');

    try {
      // Request microphone permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw createAudioError('PERMISSION_DENIED', 'Microphone permission denied');
      }

      this.updateState('starting');
      this.config = mergeConfig(configOverride, DEFAULT_AUDIO_CONFIG);

      // Ensure audio context is initialized (for audio session management)
      if (!this.audioContext.isInitialized) {
        await this.audioContext.initialize();
      }

      // Create AudioRecorder from react-native-audio-api
      this.audioRecorder = new AudioRecorder();

      // Set up audio data callback with config options
      this.audioRecorder.onAudioReady(
        {
          sampleRate: this.config.sampleRate,
          bufferLength: 4096,
          channelCount: this.config.channels,
        },
        (event) => {
          if (this._status.state !== 'recording') return;

          // Get audio data from the event buffer
          const float32Samples = event.buffer.getChannelData(0);
          this.handleAudioData(new Float32Array(float32Samples));
        }
      );

      // Set up error callback
      this.audioRecorder.onError((error) => {
        this.handleError(createAudioError('RECORDING_ERROR', error.message || 'Recording error'));
      });

      // Start recording
      this.audioRecorder.start();

      // Start level metering
      this.startLevelMetering();

      // Update state
      this.startTime = Date.now();
      this.peakLevel = 0;
      this.updateState('recording');
      this.updateStatus({ config: this.config });
    } catch (error: any) {
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

    if (this.audioRecorder) {
      this.audioRecorder.pause();
    }
    this.updateState('paused');
  }

  async resume(): Promise<void> {
    if (this._status.state !== 'paused') {
      return;
    }

    if (this.audioRecorder) {
      this.audioRecorder.resume();
    }
    this.updateState('recording');
  }

  onData(callback: RecorderDataCallback): () => void {
    this.dataCallbacks.add(callback);
    return () => {
      this.dataCallbacks.delete(callback);
    };
  }

  onLevel(callback: RecorderLevelCallback, intervalMs = DEFAULT_LEVEL_UPDATE_INTERVAL): () => void {
    this.levelCallbacks.set(callback, intervalMs);
    return () => {
      this.levelCallbacks.delete(callback);
    };
  }

  onStateChange(callback: RecorderStateCallback): () => void {
    this.stateCallbacks.add(callback);
    return () => {
      this.stateCallbacks.delete(callback);
    };
  }

  resetPeakLevel(): void {
    this.peakLevel = 0;
    this.lastLevel = { ...this.lastLevel, peak: 0 };
  }

  dispose(): void {
    this.cleanup();
    this.dataCallbacks.clear();
    this.levelCallbacks.clear();
    this.stateCallbacks.clear();
  }

  // Private methods

  private handleAudioData(float32Samples: Float32Array): void {
    // Convert to Int16 for PCM data
    const int16Samples = float32ToInt16(float32Samples);
    const buffer = int16Samples.buffer;

    // Calculate levels
    const level = calculateAudioLevels(int16Samples, 16, this.peakLevel);
    this.peakLevel = level.peak;
    this.lastLevel = level;

    // Create PCM data object
    const pcmData: PCMData = {
      buffer,
      samples: int16Samples,
      timestamp: Date.now(),
      config: this.config,
      toBase64: () => arrayBufferToBase64(buffer),
    };

    // Notify callbacks
    this.dataCallbacks.forEach((callback) => {
      try {
        callback(pcmData);
      } catch (e) {
        console.error('Error in data callback:', e);
      }
    });
  }

  private startLevelMetering(): void {
    if (this.levelIntervalId) {
      clearInterval(this.levelIntervalId);
    }

    let minInterval = DEFAULT_LEVEL_UPDATE_INTERVAL;
    this.levelCallbacks.forEach((interval) => {
      if (interval < minInterval) minInterval = interval;
    });

    this.levelIntervalId = setInterval(() => {
      this.levelCallbacks.forEach((_, callback) => {
        try {
          callback(this.lastLevel);
        } catch (e) {
          console.error('Error in level callback:', e);
        }
      });

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

    if (this.audioRecorder) {
      this.audioRecorder.clearOnAudioReady();
      this.audioRecorder.clearOnError();
      this.audioRecorder.stop();
      this.audioRecorder = null;
    }
  }

  private updateState(state: RecorderState): void {
    this.updateStatus({
      state,
      isRecording: state === 'recording',
      isPaused: state === 'paused',
    });
  }

  private updateStatus(partial: Partial<RecorderStatus>): void {
    this._status = { ...this._status, ...partial };

    this.stateCallbacks.forEach((callback) => {
      try {
        callback(this._status);
      } catch (e) {
        console.error('Error in state callback:', e);
      }
    });
  }

  private handleError(error: any): void {
    const audioError = createAudioError(
      error.code || 'UNKNOWN',
      error.message || String(error),
      error instanceof Error ? error : undefined
    );

    this.updateStatus({ state: 'error', error: audioError });
    this.cleanup();
  }
}

export function createRecorder(audioContext: IAudioContext): IRecorder {
  return new NativeRecorder(audioContext);
}
