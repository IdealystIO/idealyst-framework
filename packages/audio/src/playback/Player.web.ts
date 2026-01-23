/**
 * Web Player
 *
 * Uses Web Audio API for playback on web.
 */

import type {
  IPlayer,
  PlayerStatus,
  PlayerState,
  AudioConfig,
  PlayerStateCallback,
  PlayerPositionCallback,
  PlayerBufferCallback,
  PlayerEndedCallback,
  IAudioContext,
} from '../types';
import {
  DEFAULT_PLAYER_STATUS,
  DEFAULT_POSITION_UPDATE_INTERVAL,
} from '../constants';
import {
  createAudioError,
  pcmToFloat32,
  resampleLinear,
  clamp,
  samplesToDuration,
} from '../utils';

export class WebPlayer implements IPlayer {
  private audioContext: IAudioContext;
  private gainNode: GainNode | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;

  private _status: PlayerStatus = { ...DEFAULT_PLAYER_STATUS };
  private pcmConfig: AudioConfig | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startTime: number = 0;
  private pausePosition: number = 0;

  // PCM streaming
  private pcmBuffer: Float32Array[] = [];
  private isStreaming: boolean = false;
  private streamScheduleInterval: ReturnType<typeof setInterval> | null = null;
  private nextScheduleTime: number = 0;

  // Position tracking
  private positionIntervalId: ReturnType<typeof setInterval> | null = null;

  // Callbacks
  private stateCallbacks: Set<PlayerStateCallback> = new Set();
  private positionCallbacks: Map<PlayerPositionCallback, number> = new Map();
  private bufferCallbacks: Set<PlayerBufferCallback> = new Set();
  private endedCallbacks: Set<PlayerEndedCallback> = new Set();

  constructor(audioContext: IAudioContext) {
    this.audioContext = audioContext;
  }

  get status(): PlayerStatus {
    return { ...this._status };
  }

  async loadFile(uri: string): Promise<void> {
    this.cleanup();
    this.updateState('loading');

    try {
      if (!this.audioContext.isInitialized) {
        await this.audioContext.initialize();
      }

      const ctx = this.audioContext.getContext() as AudioContext;
      if (!ctx) {
        throw createAudioError('INITIALIZATION_FAILED', 'AudioContext not available');
      }

      await this.ensureGainNode(ctx);

      // Fetch the audio file
      const response = await fetch(uri);
      if (!response.ok) {
        throw createAudioError('SOURCE_NOT_FOUND', `Failed to fetch audio: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      this._status.duration = this.audioBuffer.duration * 1000;
      this.updateState('ready');
    } catch (error: any) {
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

  async loadPCMStream(config: AudioConfig): Promise<void> {
    this.cleanup();
    this.updateState('loading');

    try {
      if (!this.audioContext.isInitialized) {
        await this.audioContext.initialize();
      }

      const ctx = this.audioContext.getContext() as AudioContext;
      if (!ctx) {
        throw createAudioError('INITIALIZATION_FAILED', 'AudioContext not available');
      }

      await this.ensureGainNode(ctx);

      this.pcmConfig = { ...config };
      this._status.duration = 0;
      this.pcmBuffer = [];
      this.isStreaming = false;
      this.updateState('ready');
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  feedPCMData(data: ArrayBuffer | Int16Array): void {
    if (!this.pcmConfig) {
      console.warn('Cannot feed PCM data: stream not loaded');
      return;
    }

    const ctx = this.audioContext.getContext() as AudioContext;
    if (!ctx) return;

    // Convert to Float32
    let float32Samples: Float32Array;
    if (data instanceof Int16Array) {
      float32Samples = pcmToFloat32(data, 16);
    } else {
      float32Samples = pcmToFloat32(data, this.pcmConfig.bitDepth);
    }

    // Resample if needed
    if (this.pcmConfig.sampleRate !== ctx.sampleRate) {
      float32Samples = resampleLinear(
        float32Samples,
        this.pcmConfig.sampleRate,
        ctx.sampleRate
      );
    }

    // Add to buffer
    this.pcmBuffer.push(float32Samples);

    // Update buffered status
    const totalSamples = this.pcmBuffer.reduce((sum, arr) => sum + arr.length, 0);
    const bufferedMs = samplesToDuration(totalSamples, ctx.sampleRate);
    this._status.buffered = bufferedMs;
    this.notifyBufferChange(bufferedMs);

    // If playing, schedule the new samples
    if (this.isStreaming && this._status.state === 'playing') {
      this.scheduleNextBuffer();
    }
  }

  async flush(): Promise<void> {
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
    const ctx = this.audioContext.getContext() as AudioContext;
    if (!ctx) {
      throw createAudioError('INVALID_STATE', 'No audio source loaded');
    }

    if (this.pcmConfig) {
      // PCM streaming playback
      this.isStreaming = true;
      this.nextScheduleTime = ctx.currentTime;
      this.startTime = ctx.currentTime;
      this.startStreamScheduler();
      this.startPositionTracking();
      this.updateState('playing');
    } else if (this.audioBuffer) {
      // File playback
      this.stopSourceNode();

      this.sourceNode = ctx.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.gainNode!);

      this.sourceNode.onended = () => {
        if (this._status.state === 'playing') {
          this.updateState('stopped');
          this._status.position = 0;
          this.pausePosition = 0;
          this.stopPositionTracking();
          this.notifyEnded();
        }
      };

      const offset = this.pausePosition / 1000;
      this.sourceNode.start(0, offset);
      this.startTime = ctx.currentTime - offset;
      this.startPositionTracking();
      this.updateState('playing');
    }
  }

  pause(): void {
    if (this._status.state !== 'playing') return;

    const ctx = this.audioContext.getContext() as AudioContext;

    if (this.pcmConfig) {
      this.isStreaming = false;
      this.stopStreamScheduler();
    } else if (this.sourceNode && ctx) {
      this.pausePosition = (ctx.currentTime - this.startTime) * 1000;
      this.stopSourceNode();
    }

    this.stopPositionTracking();
    this.updateState('paused');
  }

  stop(): void {
    if (this._status.state === 'idle') return;

    if (this.pcmConfig) {
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
    if (this.pcmConfig) {
      throw createAudioError('INVALID_STATE', 'Cannot seek in PCM stream');
    }

    if (!this.audioBuffer) {
      throw createAudioError('INVALID_STATE', 'No audio loaded');
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

    const ctx = this.audioContext.getContext() as AudioContext;
    if (this.gainNode && ctx) {
      this.gainNode.gain.setValueAtTime(
        this._status.muted ? 0 : clampedVolume,
        ctx.currentTime
      );
    }

    this.notifyStateChange();
  }

  setMuted(muted: boolean): void {
    this._status.muted = muted;

    const ctx = this.audioContext.getContext() as AudioContext;
    if (this.gainNode && ctx) {
      this.gainNode.gain.setValueAtTime(
        muted ? 0 : this._status.volume,
        ctx.currentTime
      );
    }

    this.notifyStateChange();
  }

  onStateChange(callback: PlayerStateCallback): () => void {
    this.stateCallbacks.add(callback);
    return () => this.stateCallbacks.delete(callback);
  }

  onPosition(callback: PlayerPositionCallback, intervalMs = DEFAULT_POSITION_UPDATE_INTERVAL): () => void {
    this.positionCallbacks.set(callback, intervalMs);
    return () => this.positionCallbacks.delete(callback);
  }

  onBufferChange(callback: PlayerBufferCallback): () => void {
    this.bufferCallbacks.add(callback);
    return () => this.bufferCallbacks.delete(callback);
  }

  onEnded(callback: PlayerEndedCallback): () => void {
    this.endedCallbacks.add(callback);
    return () => this.endedCallbacks.delete(callback);
  }

  dispose(): void {
    this.cleanup();
    this.stateCallbacks.clear();
    this.positionCallbacks.clear();
    this.bufferCallbacks.clear();
    this.endedCallbacks.clear();
  }

  // Private methods

  private async ensureGainNode(ctx: AudioContext): Promise<void> {
    if (!this.gainNode) {
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(this._status.volume, ctx.currentTime);
      this.gainNode.connect(ctx.destination);
    }
  }

  private scheduleNextBuffer(): void {
    const ctx = this.audioContext.getContext() as AudioContext;
    if (!ctx || !this.gainNode || this.pcmBuffer.length === 0) return;

    const chunk = this.pcmBuffer.shift();
    if (!chunk) return;

    const audioBuffer = ctx.createBuffer(1, chunk.length, ctx.sampleRate);
    audioBuffer.getChannelData(0).set(chunk);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.gainNode);

    const scheduleTime = Math.max(this.nextScheduleTime, ctx.currentTime);
    source.start(scheduleTime);

    this.nextScheduleTime = scheduleTime + audioBuffer.duration;

    // Update buffered status
    const totalSamples = this.pcmBuffer.reduce((sum, arr) => sum + arr.length, 0);
    const bufferedMs = samplesToDuration(totalSamples, ctx.sampleRate);
    this._status.buffered = bufferedMs;
    this.notifyBufferChange(bufferedMs);
  }

  private startStreamScheduler(): void {
    this.stopStreamScheduler();

    this.streamScheduleInterval = setInterval(() => {
      if (this.isStreaming && this.pcmBuffer.length > 0) {
        this.scheduleNextBuffer();
      }
    }, 50);
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
        // Ignore errors
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
    this.stateCallbacks.forEach((callback) => {
      try {
        callback(status);
      } catch (e) {
        console.error('Error in state callback:', e);
      }
    });
  }

  private notifyBufferChange(buffered: number): void {
    this.bufferCallbacks.forEach((callback) => {
      try {
        callback(buffered);
      } catch (e) {
        console.error('Error in buffer callback:', e);
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
      if (interval < minInterval) minInterval = interval;
    });

    this.positionIntervalId = setInterval(() => {
      const ctx = this.audioContext.getContext() as AudioContext;
      if (this._status.state !== 'playing' || !ctx) return;

      const position = (ctx.currentTime - this.startTime) * 1000;
      this._status.position = position;

      // Check if file playback ended
      if (
        !this.pcmConfig &&
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

  private handleError(error: any): void {
    const audioError = createAudioError(
      error.code || 'UNKNOWN',
      error.message || String(error),
      error instanceof Error ? error : undefined
    );

    this._status.state = 'error';
    this._status.error = audioError;
    this.notifyStateChange();
  }
}

export function createPlayer(audioContext: IAudioContext): IPlayer {
  return new WebPlayer(audioContext);
}
