/**
 * Web Audio Context Manager
 *
 * Manages a shared AudioContext for both recording and playback on web.
 */

import type { IAudioContext } from '../types';

class WebAudioContextManager implements IAudioContext {
  private context: AudioContext | null = null;
  private _isInitialized = false;

  get sampleRate(): number {
    return this.context?.sampleRate ?? 44100;
  }

  get currentTime(): number {
    return this.context?.currentTime ?? 0;
  }

  get isInitialized(): boolean {
    return this._isInitialized && this.context !== null;
  }

  async initialize(): Promise<void> {
    if (this.context) {
      // Already initialized, just resume if suspended
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
      return;
    }

    // Create the AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('Web Audio API is not supported in this browser');
    }

    this.context = new AudioContextClass();
    this._isInitialized = true;

    // Resume if needed (some browsers require user interaction)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  getContext(): AudioContext | null {
    return this.context;
  }

  async suspend(): Promise<void> {
    if (this.context && this.context.state === 'running') {
      await this.context.suspend();
    }
  }

  async resume(): Promise<void> {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
      this._isInitialized = false;
    }
  }
}

// Singleton instance
let instance: WebAudioContextManager | null = null;

/**
 * Get the shared AudioContext manager instance.
 */
export function getAudioContext(): IAudioContext {
  if (!instance) {
    instance = new WebAudioContextManager();
  }
  return instance;
}

/**
 * Dispose the shared AudioContext.
 */
export async function disposeAudioContext(): Promise<void> {
  if (instance) {
    await instance.close();
    instance = null;
  }
}

export { WebAudioContextManager };
