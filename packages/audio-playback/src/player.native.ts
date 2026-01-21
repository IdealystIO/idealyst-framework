import {
  AudioContext,
  AudioBuffer,
  AudioBufferSourceNode,
  GainNode,
} from 'react-native-audio-api';
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
  base64ToArrayBuffer,
} from './utils';

export class NativeAudioPlayer implements IAudioPlayer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;

  private _status: PlayerStatus = { ...DEFAULT_PLAYER_STATUS };
  private pcmConfig: PlaybackConfig | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startTime: number = 0;
  private pausePosition: number = 0;

  // PCM streaming buffer
  private pcmBuffer: Float32Array[] = [];
  private isStreaming: boolean = false;
  private streamScheduleInterval: ReturnType<typeof setInterval> | null = null;
  private nextScheduleTime: number = 0;

  // Position tracking
  private positionIntervalId: ReturnType<typeof setInterval> | null = null;

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
      await this.ensureAudioContext();

      // Fetch the audio file
      const response = await fetch(uri);
      if (!response.ok) {
        throw createPlayerError('SOURCE_NOT_FOUND', `Failed to fetch audio: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Decode audio data using react-native-audio-api
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

      this.pcmConfig = { ...config };
      this._status.source = { type: 'pcm', config: this.pcmConfig };
      this._status.duration = 0;
      this.pcmBuffer = [];
      this.isStreaming = false;
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
    this.pcmBuffer = [];
    this.notifyStateChange();
  }

  feedPCMData(data: ArrayBuffer | Int16Array): void {
    if (!this.pcmConfig || !this.audioContext) {
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
    if (this.pcmConfig.sampleRate !== this.audioContext.sampleRate) {
      float32Samples = resampleLinear(
        float32Samples,
        this.pcmConfig.sampleRate,
        this.audioContext.sampleRate
      );
    }

    // Add to buffer
    this.pcmBuffer.push(float32Samples);

    // Update buffered status
    const totalSamples = this.pcmBuffer.reduce((sum, arr) => sum + arr.length, 0);
    const bufferedMs = samplesToDuration(totalSamples, this.audioContext.sampleRate);
    this._status.buffered = bufferedMs;
    this.notifyBufferChange(bufferedMs);

    // If playing, schedule the new samples
    if (this.isStreaming && this._status.state === 'playing') {
      this.scheduleNextBuffer();
    }
  }

  async flush(): Promise<void> {
    // Wait for all buffered samples to play
    if (this.isStreaming && this._status.state === 'playing') {
      return new Promise((resolve) => {
        const checkBuffer = () => {
          const totalSamples = this.pcmBuffer.reduce((sum, arr) => sum + arr.length, 0);
          if (totalSamples === 0 || this._status.state !== 'playing') {
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

    if (this._status.source?.type === 'pcm') {
      // PCM streaming playback
      this.isStreaming = true;
      this.nextScheduleTime = this.audioContext.currentTime;
      this.startTime = this.audioContext.currentTime;
      this.startStreamScheduler();
      this.startPositionTracking();
      this.updateState('playing');
    } else if (this.audioBuffer) {
      // File playback
      this.stopSourceNode();

      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.gainNode!);

      // Note: react-native-audio-api may not support onended
      // We'll track position and detect end manually
      const offset = this.pausePosition / 1000;
      this.sourceNode.start(0, offset);
      this.startTime = this.audioContext.currentTime - offset;
      this.startPositionTracking();
      this.updateState('playing');
    }
  }

  pause(): void {
    if (this._status.state !== 'playing') return;

    if (this._status.source?.type === 'pcm') {
      this.isStreaming = false;
      this.stopStreamScheduler();
    } else if (this.sourceNode) {
      this.pausePosition = this._status.position;
      this.stopSourceNode();
    }

    this.stopPositionTracking();
    this.updateState('paused');
  }

  stop(): void {
    if (this._status.state === 'idle') return;

    if (this._status.source?.type === 'pcm') {
      this.isStreaming = false;
      this.stopStreamScheduler();
      this.pcmBuffer = [];
    } else if (this.sourceNode) {
      this.stopSourceNode();
    }

    this.stopPositionTracking();
    this._status.position = 0;
    this.pausePosition = 0;
    this._status.buffered = 0;
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

    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(
        this._status.muted ? 0 : clampedVolume,
        this.audioContext.currentTime
      );
    }

    this.notifyStateChange();
  }

  setMuted(muted: boolean): void {
    this._status.muted = muted;

    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(
        muted ? 0 : this._status.volume,
        this.audioContext.currentTime
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

    if (this.audioContext) {
      // Close the audio context
      this.audioContext = null;
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

  private scheduleNextBuffer(): void {
    if (!this.audioContext || !this.gainNode || this.pcmBuffer.length === 0) {
      return;
    }

    // Get next chunk from buffer
    const chunk = this.pcmBuffer.shift();
    if (!chunk) return;

    // Create AudioBuffer from the chunk
    const audioBuffer = this.audioContext.createBuffer(
      1, // mono
      chunk.length,
      this.audioContext.sampleRate
    );

    // Copy samples to the buffer
    const channelData = audioBuffer.getChannelData(0);
    channelData.set(chunk);

    // Create source node and schedule playback
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.gainNode);

    // Schedule at the next available time
    const scheduleTime = Math.max(this.nextScheduleTime, this.audioContext.currentTime);
    source.start(scheduleTime);

    // Update next schedule time
    this.nextScheduleTime = scheduleTime + audioBuffer.duration;

    // Update buffered status
    const totalSamples = this.pcmBuffer.reduce((sum, arr) => sum + arr.length, 0);
    const bufferedMs = samplesToDuration(totalSamples, this.audioContext.sampleRate);
    this._status.buffered = bufferedMs;
    this.notifyBufferChange(bufferedMs);
  }

  private startStreamScheduler(): void {
    this.stopStreamScheduler();

    // Schedule buffers periodically
    this.streamScheduleInterval = setInterval(() => {
      if (this.isStreaming && this.pcmBuffer.length > 0) {
        this.scheduleNextBuffer();
      }
    }, 50); // Check every 50ms
  }

  private stopStreamScheduler(): void {
    if (this.streamScheduleInterval) {
      clearInterval(this.streamScheduleInterval);
      this.streamScheduleInterval = null;
    }
  }

  private stopSourceNode(): void {
    if (this.sourceNode) {
      try {
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
    this.stopStreamScheduler();
    this.stopSourceNode();
    this.isStreaming = false;
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

      // Check if file playback ended
      if (
        this._status.source?.type === 'file' &&
        this._status.duration > 0 &&
        position >= this._status.duration
      ) {
        this.updateState('stopped');
        this._status.position = 0;
        this.pausePosition = 0;
        this.stopPositionTracking();
        this.notifyEnded();
        return;
      }

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
 * Create a new NativeAudioPlayer instance.
 */
export function createPlayer(): IAudioPlayer {
  return new NativeAudioPlayer();
}
