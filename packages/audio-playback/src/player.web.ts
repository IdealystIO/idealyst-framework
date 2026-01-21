import type {
  IAudioPlayer,
  PlaybackConfig,
  PlayerStatus,
  PlayerState,
  PlayerError,
  StateChangeCallback,
  ErrorCallback,
  PositionCallback,
  BufferCallback,
  EndedCallback,
  AudioSource,
} from './types';
import {
  DEFAULT_PLAYBACK_CONFIG,
  DEFAULT_PLAYER_STATUS,
  DEFAULT_POSITION_UPDATE_INTERVAL,
} from './constants';
import {
  createPlayerError,
  pcmToFloat32,
  resampleLinear,
  clamp,
  concatFloat32Arrays,
  samplesToDuration,
} from './utils';

// AudioWorklet processor code for PCM streaming playback
const WORKLET_PROCESSOR_CODE = `
class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.isPlaying = false;

    this.port.onmessage = (event) => {
      const { type, samples } = event.data;

      if (type === 'feed') {
        // Add samples to buffer
        this.buffer.push(...samples);
        // Notify main thread of buffer size
        this.port.postMessage({ type: 'buffer', size: this.buffer.length });
      } else if (type === 'play') {
        this.isPlaying = true;
      } else if (type === 'pause') {
        this.isPlaying = false;
      } else if (type === 'clear') {
        this.buffer = [];
        this.port.postMessage({ type: 'buffer', size: 0 });
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channel = output[0];

    if (!this.isPlaying || !channel) {
      // Output silence when not playing
      if (channel) {
        channel.fill(0);
      }
      return true;
    }

    const samplesToWrite = channel.length;

    if (this.buffer.length >= samplesToWrite) {
      // We have enough samples
      const samples = this.buffer.splice(0, samplesToWrite);
      for (let i = 0; i < samplesToWrite; i++) {
        channel[i] = samples[i];
      }
      this.port.postMessage({ type: 'buffer', size: this.buffer.length });
    } else if (this.buffer.length > 0) {
      // Partial buffer - play what we have and pad with silence
      const available = this.buffer.length;
      const samples = this.buffer.splice(0, available);
      for (let i = 0; i < available; i++) {
        channel[i] = samples[i];
      }
      for (let i = available; i < samplesToWrite; i++) {
        channel[i] = 0;
      }
      this.port.postMessage({ type: 'buffer', size: 0 });
      this.port.postMessage({ type: 'underrun' });
    } else {
      // No samples - output silence
      channel.fill(0);
    }

    return true;
  }
}

registerProcessor('pcm-player-processor', PCMPlayerProcessor);
`;

export class WebAudioPlayer implements IAudioPlayer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;

  private _status: PlayerStatus = { ...DEFAULT_PLAYER_STATUS };
  private pcmConfig: PlaybackConfig | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startTime: number = 0;
  private pausePosition: number = 0;
  private workletUrl: string | null = null;

  // Position tracking
  private positionIntervalId: ReturnType<typeof setInterval> | null = null;
  private bufferedSamples: number = 0;

  // Callbacks
  private stateChangeCallbacks: Set<StateChangeCallback> = new Set();
  private errorCallbacks: Set<ErrorCallback> = new Set();
  private positionCallbacks: Map<PositionCallback, number> = new Map();
  private bufferCallbacks: Set<BufferCallback> = new Set();
  private endedCallbacks: Set<EndedCallback> = new Set();

  get status(): PlayerStatus {
    return { ...this._status };
  }

  async loadFile(uri: string): Promise<void> {
    this.cleanup();
    this.updateState('loading');

    try {
      // Create audio context if needed
      await this.ensureAudioContext();

      // Fetch and decode the audio file
      const response = await fetch(uri);
      if (!response.ok) {
        throw createPlayerError('SOURCE_NOT_FOUND', `Failed to fetch audio: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);

      this._status.source = { type: 'file', uri };
      this._status.duration = this.audioBuffer.duration * 1000;
      this.updateState('ready');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async loadPCMStream(config: PlaybackConfig): Promise<void> {
    this.cleanup();
    this.updateState('loading');

    try {
      await this.ensureAudioContext();
      await this.setupWorklet();

      this.pcmConfig = { ...config };
      this._status.source = { type: 'pcm', config: this.pcmConfig };
      this._status.duration = 0; // Streams have unknown duration
      this.bufferedSamples = 0;
      this.updateState('ready');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  unload(): void {
    this.cleanup();
    this._status = { ...DEFAULT_PLAYER_STATUS };
    this.pcmConfig = null;
    this.audioBuffer = null;
    this.notifyStateChange();
  }

  feedPCMData(data: ArrayBuffer | Int16Array): void {
    if (!this.workletNode || !this.pcmConfig) {
      console.warn('Cannot feed PCM data: stream not loaded');
      return;
    }

    // Convert to Float32
    let float32Samples: Float32Array;
    if (data instanceof Int16Array) {
      float32Samples = pcmToFloat32(data, 16);
    } else {
      float32Samples = pcmToFloat32(data, this.pcmConfig.bitDepth);
    }

    // Resample if needed
    if (this.pcmConfig.sampleRate !== this.audioContext!.sampleRate) {
      float32Samples = resampleLinear(
        float32Samples,
        this.pcmConfig.sampleRate,
        this.audioContext!.sampleRate
      );
    }

    // Send to worklet
    this.workletNode.port.postMessage({
      type: 'feed',
      samples: Array.from(float32Samples),
    });
  }

  async flush(): Promise<void> {
    // For worklet-based streaming, wait for buffer to drain
    if (this.workletNode && this._status.state === 'playing') {
      return new Promise((resolve) => {
        const checkBuffer = () => {
          if (this.bufferedSamples === 0 || this._status.state !== 'playing') {
            resolve();
          } else {
            setTimeout(checkBuffer, 50);
          }
        };
        checkBuffer();
      });
    }
  }

  async play(): Promise<void> {
    if (!this.audioContext) {
      throw createPlayerError('INVALID_STATE', 'No audio source loaded');
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (this._status.source?.type === 'pcm') {
      // PCM streaming playback
      if (this.workletNode) {
        this.workletNode.port.postMessage({ type: 'play' });
        this.startTime = this.audioContext.currentTime;
        this.startPositionTracking();
        this.updateState('playing');
      }
    } else if (this.audioBuffer) {
      // File playback
      this.stopSourceNode();

      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.gainNode!);

      this.sourceNode.onended = () => {
        if (this._status.state === 'playing') {
          this.updateState('stopped');
          this._status.position = 0;
          this.pausePosition = 0;
          this.notifyEnded();
        }
      };

      const offset = this.pausePosition / 1000;
      this.sourceNode.start(0, offset);
      this.startTime = this.audioContext.currentTime - offset;
      this.startPositionTracking();
      this.updateState('playing');
    }
  }

  pause(): void {
    if (this._status.state !== 'playing') return;

    if (this._status.source?.type === 'pcm' && this.workletNode) {
      this.workletNode.port.postMessage({ type: 'pause' });
    } else if (this.sourceNode) {
      this.pausePosition = this._status.position;
      this.stopSourceNode();
    }

    this.stopPositionTracking();
    this.updateState('paused');
  }

  stop(): void {
    if (this._status.state === 'idle') return;

    if (this._status.source?.type === 'pcm' && this.workletNode) {
      this.workletNode.port.postMessage({ type: 'pause' });
      this.workletNode.port.postMessage({ type: 'clear' });
    } else if (this.sourceNode) {
      this.stopSourceNode();
    }

    this.stopPositionTracking();
    this._status.position = 0;
    this.pausePosition = 0;
    this.bufferedSamples = 0;
    this.updateState('stopped');
  }

  async seek(positionMs: number): Promise<void> {
    if (this._status.source?.type === 'pcm') {
      throw createPlayerError('INVALID_STATE', 'Cannot seek in PCM stream');
    }

    if (!this.audioBuffer) {
      throw createPlayerError('INVALID_STATE', 'No audio loaded');
    }

    const wasPlaying = this._status.state === 'playing';
    const clampedPosition = clamp(positionMs, 0, this._status.duration);

    if (wasPlaying) {
      this.stopSourceNode();
    }

    this.pausePosition = clampedPosition;
    this._status.position = clampedPosition;
    this.notifyStateChange();

    if (wasPlaying) {
      await this.play();
    }
  }

  setVolume(volume: number): void {
    const clampedVolume = clamp(volume, 0, 1);
    this._status.volume = clampedVolume;

    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        this._status.muted ? 0 : clampedVolume,
        this.audioContext!.currentTime
      );
    }

    this.notifyStateChange();
  }

  setMuted(muted: boolean): void {
    this._status.muted = muted;

    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        muted ? 0 : this._status.volume,
        this.audioContext!.currentTime
      );
    }

    this.notifyStateChange();
  }

  onStateChange(callback: StateChangeCallback): () => void {
    this.stateChangeCallbacks.add(callback);
    return () => this.stateChangeCallbacks.delete(callback);
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback);
    return () => this.errorCallbacks.delete(callback);
  }

  onPosition(callback: PositionCallback, intervalMs = DEFAULT_POSITION_UPDATE_INTERVAL): () => void {
    this.positionCallbacks.set(callback, intervalMs);
    return () => this.positionCallbacks.delete(callback);
  }

  onBufferChange(callback: BufferCallback): () => void {
    this.bufferCallbacks.add(callback);
    return () => this.bufferCallbacks.delete(callback);
  }

  onEnded(callback: EndedCallback): () => void {
    this.endedCallbacks.add(callback);
    return () => this.endedCallbacks.delete(callback);
  }

  dispose(): void {
    this.cleanup();
    this.stateChangeCallbacks.clear();
    this.errorCallbacks.clear();
    this.positionCallbacks.clear();
    this.bufferCallbacks.clear();
    this.endedCallbacks.clear();

    if (this.workletUrl) {
      URL.revokeObjectURL(this.workletUrl);
      this.workletUrl = null;
    }
  }

  // Private methods

  private async ensureAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(this._status.volume, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);
    }
  }

  private async setupWorklet(): Promise<void> {
    if (!this.audioContext) return;

    // Create worklet blob URL if not exists
    if (!this.workletUrl) {
      const blob = new Blob([WORKLET_PROCESSOR_CODE], { type: 'application/javascript' });
      this.workletUrl = URL.createObjectURL(blob);
    }

    // Load worklet module
    await this.audioContext.audioWorklet.addModule(this.workletUrl);

    // Create worklet node
    this.workletNode = new AudioWorkletNode(this.audioContext, 'pcm-player-processor');
    this.workletNode.connect(this.gainNode!);

    // Handle messages from worklet
    this.workletNode.port.onmessage = (event) => {
      const { type, size } = event.data;

      if (type === 'buffer') {
        this.bufferedSamples = size;
        const bufferedMs = samplesToDuration(size, this.audioContext!.sampleRate);
        this._status.buffered = bufferedMs;
        this.notifyBufferChange(bufferedMs);
      } else if (type === 'underrun') {
        // Buffer underrun - could notify or auto-pause
        console.debug('PCM buffer underrun');
      }
    };
  }

  private stopSourceNode(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.onended = null;
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch {
        // Ignore errors when stopping
      }
      this.sourceNode = null;
    }
  }

  private cleanup(): void {
    this.stopPositionTracking();
    this.stopSourceNode();

    if (this.workletNode) {
      this.workletNode.port.onmessage = null;
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    // Don't close audio context - reuse it
  }

  private updateState(state: PlayerState): void {
    this._status.state = state;
    this._status.isPlaying = state === 'playing';
    this._status.isPaused = state === 'paused';
    this.notifyStateChange();
  }

  private notifyStateChange(): void {
    const status = this.status;
    this.stateChangeCallbacks.forEach((callback) => {
      try {
        callback(status);
      } catch (e) {
        console.error('Error in state change callback:', e);
      }
    });
  }

  private notifyBufferChange(buffered: number): void {
    this.bufferCallbacks.forEach((callback) => {
      try {
        callback(buffered);
      } catch (e) {
        console.error('Error in buffer change callback:', e);
      }
    });
  }

  private notifyEnded(): void {
    this.endedCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (e) {
        console.error('Error in ended callback:', e);
      }
    });
  }

  private startPositionTracking(): void {
    this.stopPositionTracking();

    // Get minimum interval from all registered callbacks
    let minInterval = DEFAULT_POSITION_UPDATE_INTERVAL;
    this.positionCallbacks.forEach((interval) => {
      if (interval < minInterval) {
        minInterval = interval;
      }
    });

    this.positionIntervalId = setInterval(() => {
      if (this._status.state !== 'playing' || !this.audioContext) return;

      const currentTime = this.audioContext.currentTime;
      const position = (currentTime - this.startTime) * 1000;

      this._status.position = position;

      // Notify position callbacks
      this.positionCallbacks.forEach((_, callback) => {
        try {
          callback(position);
        } catch (e) {
          console.error('Error in position callback:', e);
        }
      });
    }, minInterval);
  }

  private stopPositionTracking(): void {
    if (this.positionIntervalId) {
      clearInterval(this.positionIntervalId);
      this.positionIntervalId = null;
    }
  }

  private handleError(error: unknown): void {
    let playerError: PlayerError;

    if (error && typeof error === 'object' && 'code' in error) {
      playerError = error as PlayerError;
    } else if (error instanceof Error) {
      playerError = createPlayerError('UNKNOWN', error.message, error);
    } else {
      playerError = createPlayerError('UNKNOWN', String(error));
    }

    this._status.state = 'error';
    this._status.error = playerError;
    this.notifyStateChange();

    this.errorCallbacks.forEach((callback) => {
      try {
        callback(playerError);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });
  }
}

/**
 * Create a new WebAudioPlayer instance.
 */
export function createPlayer(): IAudioPlayer {
  return new WebAudioPlayer();
}
