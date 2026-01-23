/**
 * Web Audio Session Manager (no-op)
 *
 * On web, audio sessions are managed automatically by the browser.
 */

import type {
  IAudioSessionManager,
  AudioSessionConfig,
  AudioSessionState,
  AudioSessionInterruption,
  AudioSessionRouteChange,
} from '../types';
import { DEFAULT_SESSION_STATE } from '../constants';

class WebAudioSessionManager implements IAudioSessionManager {
  private _state: AudioSessionState = { ...DEFAULT_SESSION_STATE, isActive: true };

  get state(): AudioSessionState {
    return { ...this._state };
  }

  async configure(config: Partial<AudioSessionConfig>): Promise<void> {
    // No-op on web, just update internal state for consistency
    if (config.category) {
      this._state.category = config.category;
    }
    if (config.mode) {
      this._state.mode = config.mode;
    }
    if (config.categoryOptions) {
      this._state.categoryOptions = config.categoryOptions;
    }
  }

  async activate(): Promise<void> {
    this._state.isActive = true;
  }

  async deactivate(_notifyOthers?: boolean): Promise<void> {
    this._state.isActive = false;
  }

  onInterruption(_callback: (interruption: AudioSessionInterruption) => void): () => void {
    // No-op on web
    return () => {};
  }

  onRouteChange(_callback: (change: AudioSessionRouteChange) => void): () => void {
    // No-op on web
    return () => {};
  }

  getCurrentOutputs(): string[] {
    return ['Default'];
  }
}

// Singleton instance
let instance: WebAudioSessionManager | null = null;

export function getAudioSessionManager(): IAudioSessionManager {
  if (!instance) {
    instance = new WebAudioSessionManager();
  }
  return instance;
}

export { WebAudioSessionManager };
