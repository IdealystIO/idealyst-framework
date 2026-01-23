/**
 * Web Audio Session Manager (no-op)
 *
 * On web, audio sessions are managed automatically by the browser.
 * This provides a consistent API that does nothing on web.
 */

import type {
  IAudioSessionManager,
  AudioSessionConfig,
  AudioSessionState,
  AudioSessionInterruptionCallback,
  AudioSessionRouteChangeCallback,
} from './types';

const DEFAULT_STATE: AudioSessionState = {
  isActive: true, // Web is always "active"
  category: 'playAndRecord',
  mode: 'default',
  categoryOptions: [],
  otherAudioPlaying: false,
};

/**
 * Web implementation of AudioSessionManager.
 * All methods are no-ops since web handles audio sessions automatically.
 */
class WebAudioSessionManager implements IAudioSessionManager {
  private _state: AudioSessionState = { ...DEFAULT_STATE };

  get state(): AudioSessionState {
    return { ...this._state };
  }

  async configure(_config: Partial<AudioSessionConfig>): Promise<void> {
    // No-op on web
    // Just update internal state for consistency
    if (_config.category) {
      this._state.category = _config.category;
    }
    if (_config.mode) {
      this._state.mode = _config.mode;
    }
    if (_config.categoryOptions) {
      this._state.categoryOptions = _config.categoryOptions;
    }
  }

  async activate(): Promise<void> {
    // No-op on web
    this._state.isActive = true;
  }

  async deactivate(_notifyOthers?: boolean): Promise<void> {
    // No-op on web
    this._state.isActive = false;
  }

  onInterruption(_callback: AudioSessionInterruptionCallback): () => void {
    // No-op on web - browsers don't have interruption events like iOS
    // Could potentially use Page Visibility API, but that's different semantics
    return () => {};
  }

  onRouteChange(_callback: AudioSessionRouteChangeCallback): () => void {
    // No-op on web
    // Could potentially use navigator.mediaDevices.ondevicechange
    // but we'll keep it simple for now
    return () => {};
  }

  getCurrentOutputs(): string[] {
    // Return a generic output for web
    return ['Default'];
  }
}

// Singleton instance
let instance: WebAudioSessionManager | null = null;

/**
 * Get the AudioSessionManager singleton instance.
 * On web, this is a no-op implementation.
 */
export function getAudioSessionManager(): IAudioSessionManager {
  if (!instance) {
    instance = new WebAudioSessionManager();
  }
  return instance;
}

export { WebAudioSessionManager };
