/**
 * Native Audio Context Manager
 *
 * Manages a shared AudioContext using react-native-audio-api for both
 * recording and playback on React Native.
 */

import { AudioContext as RNAudioContext } from 'react-native-audio-api';
import type { IAudioContext } from '../types';

class NativeAudioContextManager implements IAudioContext {
  private context: RNAudioContext | null = null;
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
      return;
    }

    // Create the react-native-audio-api AudioContext
    this.context = new RNAudioContext();
    this._isInitialized = true;
  }

  getContext(): RNAudioContext | null {
    return this.context;
  }

  async suspend(): Promise<void> {
    // react-native-audio-api may not support suspend directly
    // This is a no-op for now
  }

  async resume(): Promise<void> {
    // react-native-audio-api may not support resume directly
    // This is a no-op for now
  }

  async close(): Promise<void> {
    if (this.context) {
      // Note: react-native-audio-api may not have a close method
      // We just null out the reference
      this.context = null;
      this._isInitialized = false;
    }
  }
}

// Singleton instance
let instance: NativeAudioContextManager | null = null;

/**
 * Get the shared AudioContext manager instance.
 */
export function getAudioContext(): IAudioContext {
  if (!instance) {
    instance = new NativeAudioContextManager();
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

export { NativeAudioContextManager };
