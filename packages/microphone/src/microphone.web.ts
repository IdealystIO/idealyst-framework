import type {
  IMicrophone,
  AudioConfig,
  AudioLevel,
  MicrophoneStatus,
  MicrophoneState,
  PermissionResult,
  PermissionStatus,
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
  createPCMTypedArray,
  calculateAudioLevels,
  float32ToInt16,
  float32ToInt8,
  createMicrophoneError,
  mergeConfig,
} from './utils';
import { checkPermission, requestPermission } from './permissions/permissions.web';

// AudioWorklet processor code as a string (will be created as a Blob URL)
const WORKLET_PROCESSOR_CODE = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.bufferSize = options.processorOptions?.bufferSize || 4096;
    this.buffer = [];
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    // Get mono or interleaved data
    const channelData = input[0];

    // Accumulate samples
    for (let i = 0; i < channelData.length; i++) {
      this.buffer.push(channelData[i]);
    }

    // When buffer is full, send to main thread
    while (this.buffer.length >= this.bufferSize) {
      const samples = this.buffer.splice(0, this.bufferSize);
      const float32Array = new Float32Array(samples);
      this.port.postMessage({ samples: float32Array }, [float32Array.buffer]);
    }

    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
`;

export class WebMicrophone implements IMicrophone {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;

  private config: AudioConfig = DEFAULT_AUDIO_CONFIG;
  private _status: MicrophoneStatus;
  private peakLevel: number = 0;
  private startTime: number = 0;
  private levelIntervalId: ReturnType<typeof setInterval> | null = null;

  // Callbacks
  private audioDataCallbacks: Set<AudioDataCallback> = new Set();
  private audioLevelCallbacks: Map<AudioLevelCallback, number> = new Map();
  private stateChangeCallbacks: Set<StateChangeCallback> = new Set();
  private errorCallbacks: Set<ErrorCallback> = new Set();

  constructor() {
    this._status = this.createInitialStatus();
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
      if (permResult.status !== 'granted') {
        throw createMicrophoneError(
          permResult.status === 'blocked' ? 'PERMISSION_BLOCKED' : 'PERMISSION_DENIED',
          'Microphone permission not granted'
        );
      }

      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: this.config.channels,
          sampleRate: this.config.sampleRate,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Create audio context with specified sample rate
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate,
      });

      // Create and load AudioWorklet
      const workletBlob = new Blob([WORKLET_PROCESSOR_CODE], {
        type: 'application/javascript',
      });
      const workletUrl = URL.createObjectURL(workletBlob);

      await this.audioContext.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);

      // Create worklet node
      this.workletNode = new AudioWorkletNode(
        this.audioContext,
        'pcm-processor',
        {
          processorOptions: {
            bufferSize: this.config.bufferSize,
          },
        }
      );

      // Create source from microphone stream
      this.sourceNode = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );

      // Create analyser for level metering
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;

      // Connect nodes: source -> worklet (for PCM data)
      //               source -> analyser (for level metering)
      this.sourceNode.connect(this.workletNode);
      this.sourceNode.connect(this.analyserNode);

      // Handle audio data from worklet
      this.workletNode.port.onmessage = (event) => {
        const float32Samples: Float32Array = event.data.samples;
        this.handleAudioData(float32Samples);
      };

      // Start level metering
      this.startLevelMetering();

      // Update state
      this.startTime = Date.now();
      this.peakLevel = 0;
      this.updateState('recording');
      this.updateStatus({ config: this.config });
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
    // Web doesn't support true pause - just stop
    // Users should stop and restart
    await this.stop();
  }

  async resume(): Promise<void> {
    // Web doesn't support resume - need to start fresh
    if (this._status.state === 'idle') {
      await this.start(this.config);
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

  private handleAudioData(float32Samples: Float32Array): void {
    // Convert to appropriate bit depth
    let buffer: ArrayBuffer;
    let samples: Int8Array | Int16Array | Float32Array;

    switch (this.config.bitDepth) {
      case 8:
        samples = float32ToInt8(float32Samples);
        buffer = samples.buffer;
        break;
      case 16:
        samples = float32ToInt16(float32Samples);
        buffer = samples.buffer;
        break;
      case 32:
      default:
        samples = float32Samples;
        buffer = float32Samples.buffer.slice(0);
        break;
    }

    const pcmData: PCMData = {
      buffer,
      samples,
      timestamp: Date.now(),
      config: this.config,
    };

    // Notify all audio data listeners
    this.audioDataCallbacks.forEach((callback) => {
      try {
        callback(pcmData);
      } catch (e) {
        console.error('Error in audio data callback:', e);
      }
    });

    // Update levels from samples
    const level = calculateAudioLevels(samples, this.config.bitDepth, this.peakLevel);
    this.peakLevel = level.peak;
    this.updateStatus({ level });
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
      if (!this.analyserNode) return;

      const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.analyserNode.getByteTimeDomainData(dataArray);

      // Calculate level from time-domain data
      let sum = 0;
      let current = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const normalized = Math.abs(dataArray[i] - 128) / 128;
        sum += normalized * normalized;
        if (normalized > current) {
          current = normalized;
        }
      }

      const rms = Math.sqrt(sum / dataArray.length);
      const db = rms > 0 ? 20 * Math.log10(rms) : -Infinity;

      if (current > this.peakLevel) {
        this.peakLevel = current;
      }

      const level: AudioLevel = {
        current,
        peak: this.peakLevel,
        rms,
        db,
      };

      // Notify level callbacks
      this.audioLevelCallbacks.forEach((_, callback) => {
        try {
          callback(level);
        } catch (e) {
          console.error('Error in audio level callback:', e);
        }
      });

      // Update duration
      if (this._status.state === 'recording') {
        this.updateStatus({
          duration: Date.now() - this.startTime,
          level,
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
      this.workletNode.port.onmessage = null;
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
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
      micError = this.mapWebError(error);
    } else {
      micError = createMicrophoneError(
        'UNKNOWN',
        String(error),
        error instanceof Error ? error : undefined
      );
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

  private mapWebError(error: Error): MicrophoneError {
    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return createMicrophoneError(
          'PERMISSION_DENIED',
          'Microphone access denied',
          error
        );
      case 'NotFoundError':
        return createMicrophoneError(
          'DEVICE_NOT_FOUND',
          'No microphone found',
          error
        );
      case 'NotReadableError':
      case 'TrackStartError':
        return createMicrophoneError(
          'DEVICE_IN_USE',
          'Microphone is in use by another application',
          error
        );
      case 'OverconstrainedError':
        return createMicrophoneError(
          'INVALID_CONFIG',
          'Audio configuration not supported',
          error
        );
      default:
        return createMicrophoneError(
          'INITIALIZATION_FAILED',
          error.message,
          error
        );
    }
  }
}

/**
 * Create a new WebMicrophone instance.
 */
export function createMicrophone(): IMicrophone {
  return new WebMicrophone();
}
