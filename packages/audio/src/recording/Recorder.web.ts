/**
 * Web Recorder
 *
 * Uses Web Audio API with AudioWorklet for recording on web.
 */

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

// AudioWorklet processor code as a string (will be loaded as blob URL)
const PROCESSOR_CODE = `
class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = [];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];

      // Copy samples to buffer
      for (let i = 0; i < channelData.length; i++) {
        this.buffer.push(channelData[i]);
      }

      // Send buffer when full
      if (this.buffer.length >= this.bufferSize) {
        const samples = new Float32Array(this.buffer.splice(0, this.bufferSize));
        this.port.postMessage({ samples });
      }
    }
    return true;
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
`;

export class WebRecorder implements IRecorder {
  private audioContext: IAudioContext;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private processorUrl: string | null = null;

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
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      const status = this.mapPermissionState(result.state);
      this.updateStatus({ permission: status });
      return status;
    } catch {
      // Firefox doesn't support permissions.query for microphone
      return 'undetermined';
    }
  }

  async requestPermission(): Promise<PermissionStatus> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      this.updateStatus({ permission: 'granted' });
      return 'granted';
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        this.updateStatus({ permission: 'denied' });
        return 'denied';
      }
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
      // Request microphone access
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw createAudioError('PERMISSION_DENIED', 'Microphone permission denied');
      }

      this.updateState('starting');
      this.config = mergeConfig(configOverride, DEFAULT_AUDIO_CONFIG);

      // Ensure audio context is initialized
      if (!this.audioContext.isInitialized) {
        await this.audioContext.initialize();
      }

      const ctx = this.audioContext.getContext() as AudioContext;
      if (!ctx) {
        throw createAudioError('INITIALIZATION_FAILED', 'AudioContext not available');
      }

      // Get microphone stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Create source node
      this.sourceNode = ctx.createMediaStreamSource(this.mediaStream);

      // Create and load AudioWorklet processor
      if (!this.processorUrl) {
        const blob = new Blob([PROCESSOR_CODE], { type: 'application/javascript' });
        this.processorUrl = URL.createObjectURL(blob);
      }

      try {
        await ctx.audioWorklet.addModule(this.processorUrl);
      } catch {
        // Module might already be loaded
      }

      // Create worklet node
      this.workletNode = new AudioWorkletNode(ctx, 'recorder-processor');

      // Handle audio data from worklet
      this.workletNode.port.onmessage = (event) => {
        this.handleAudioData(event.data.samples);
      };

      // Connect nodes
      this.sourceNode.connect(this.workletNode);
      // Don't connect to destination (we don't want to hear ourselves)

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

    // Web Audio doesn't have native pause, we just stop processing
    if (this.workletNode) {
      this.workletNode.disconnect();
    }
    this.updateState('paused');
  }

  async resume(): Promise<void> {
    if (this._status.state !== 'paused') {
      return;
    }

    // Reconnect the worklet
    if (this.sourceNode && this.workletNode) {
      this.sourceNode.connect(this.workletNode);
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

    if (this.processorUrl) {
      URL.revokeObjectURL(this.processorUrl);
      this.processorUrl = null;
    }
  }

  // Private methods

  private mapPermissionState(state: PermissionState): PermissionStatus {
    switch (state) {
      case 'granted':
        return 'granted';
      case 'denied':
        return 'denied';
      default:
        return 'undetermined';
    }
  }

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
      // Notify level callbacks
      this.levelCallbacks.forEach((_, callback) => {
        try {
          callback(this.lastLevel);
        } catch (e) {
          console.error('Error in level callback:', e);
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

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
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
  return new WebRecorder(audioContext);
}
