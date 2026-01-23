/**
 * Native Audio Session Manager
 *
 * Manages iOS AVAudioSession (and Android audio focus) through react-native-audio-api.
 * Provides a unified API for configuring audio sessions across both platforms.
 */

import { AudioManager } from 'react-native-audio-api';
import type {
  IAudioSessionManager,
  AudioSessionConfig,
  AudioSessionState,
  AudioSessionCategory,
  AudioSessionMode,
  AudioSessionCategoryOption,
  AudioSessionInterruptionCallback,
  AudioSessionRouteChangeCallback,
  AudioSessionInterruption,
  AudioSessionRouteChange,
} from './types';

// Map our types to react-native-audio-api types
const CATEGORY_MAP: Record<AudioSessionCategory, string> = {
  ambient: 'ambient',
  soloAmbient: 'soloAmbient',
  playback: 'playback',
  record: 'record',
  playAndRecord: 'playAndRecord',
  multiRoute: 'multiRoute',
};

const MODE_MAP: Record<AudioSessionMode, string> = {
  default: 'default',
  voiceChat: 'voiceChat',
  gameChat: 'gameChat',
  videoRecording: 'videoRecording',
  measurement: 'measurement',
  moviePlayback: 'moviePlayback',
  videoChat: 'videoChat',
  spokenAudio: 'spokenAudio',
};

const OPTION_MAP: Record<AudioSessionCategoryOption, string> = {
  mixWithOthers: 'mixWithOthers',
  duckOthers: 'duckOthers',
  allowBluetooth: 'allowBluetooth',
  allowBluetoothA2DP: 'allowBluetoothA2DP',
  allowAirPlay: 'allowAirPlay',
  defaultToSpeaker: 'defaultToSpeaker',
  interruptSpokenAudioAndMixWithOthers: 'interruptSpokenAudioAndMixWithOthers',
};

const DEFAULT_STATE: AudioSessionState = {
  isActive: false,
  category: 'soloAmbient',
  mode: 'default',
  categoryOptions: [],
  otherAudioPlaying: false,
};

/**
 * Native implementation of AudioSessionManager.
 * Uses react-native-audio-api's AudioManager under the hood.
 */
class NativeAudioSessionManager implements IAudioSessionManager {
  private _state: AudioSessionState = { ...DEFAULT_STATE };
  private interruptionCallbacks: Set<AudioSessionInterruptionCallback> = new Set();
  private routeChangeCallbacks: Set<AudioSessionRouteChangeCallback> = new Set();
  private interruptionSubscription: { remove: () => void } | null = null;
  private routeChangeSubscription: { remove: () => void } | null = null;

  constructor() {
    // Enable audio interruption monitoring
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    try {
      // Enable interruption observation
      AudioManager.observeAudioInterruptions(true);

      // Listen for interruption events
      this.interruptionSubscription = AudioManager.addSystemEventListener(
        'interruption',
        (event: any) => {
          const interruption: AudioSessionInterruption = {
            type: event.type === 'began' ? 'began' : 'ended',
            shouldResume: event.type === 'ended' ? event.shouldResume : undefined,
          };
          this.interruptionCallbacks.forEach((cb) => cb(interruption));
        }
      );

      // Listen for route change events
      this.routeChangeSubscription = AudioManager.addSystemEventListener(
        'routeChange',
        (event: any) => {
          const change: AudioSessionRouteChange = {
            reason: this.mapRouteChangeReason(event.reason),
            previousOutputs: event.previousOutputs || [],
            currentOutputs: event.currentOutputs || [],
          };
          this.routeChangeCallbacks.forEach((cb) => cb(change));
        }
      );
    } catch (error) {
      console.warn('[AudioSessionManager] Failed to setup event listeners:', error);
    }
  }

  private mapRouteChangeReason(reason: string): AudioSessionRouteChange['reason'] {
    const reasonMap: Record<string, AudioSessionRouteChange['reason']> = {
      newDeviceAvailable: 'newDeviceAvailable',
      oldDeviceUnavailable: 'oldDeviceUnavailable',
      categoryChange: 'categoryChange',
      override: 'override',
      wakeFromSleep: 'wakeFromSleep',
      noSuitableRouteForCategory: 'noSuitableRouteForCategory',
      routeConfigurationChange: 'routeConfigurationChange',
    };
    return reasonMap[reason] || 'unknown';
  }

  get state(): AudioSessionState {
    return { ...this._state };
  }

  async configure(config: Partial<AudioSessionConfig>): Promise<void> {
    const category = config.category || this._state.category;
    const mode = config.mode || this._state.mode;
    const options = config.categoryOptions || this._state.categoryOptions;

    // Map our types to react-native-audio-api format
    const iosCategory = CATEGORY_MAP[category];
    const iosMode = MODE_MAP[mode];
    const iosOptions = options.map((opt) => OPTION_MAP[opt]).filter(Boolean);

    try {
      // Configure the audio session
      AudioManager.setAudioSessionOptions({
        iosCategory,
        iosMode,
        iosOptions,
      });

      // Update internal state
      this._state.category = category;
      this._state.mode = mode;
      this._state.categoryOptions = options;

      // Activate if requested
      if (config.active !== false) {
        await this.activate();
      }
    } catch (error) {
      console.error('[AudioSessionManager] Failed to configure audio session:', error);
      throw error;
    }
  }

  async activate(): Promise<void> {
    try {
      AudioManager.setAudioSessionActivity(true);
      this._state.isActive = true;
    } catch (error) {
      console.error('[AudioSessionManager] Failed to activate audio session:', error);
      throw error;
    }
  }

  async deactivate(notifyOthers: boolean = true): Promise<void> {
    try {
      // Note: react-native-audio-api doesn't have notifyOthers option directly,
      // but deactivating the session should naturally allow other audio to resume
      AudioManager.setAudioSessionActivity(false);
      this._state.isActive = false;
    } catch (error) {
      console.error('[AudioSessionManager] Failed to deactivate audio session:', error);
      throw error;
    }
  }

  onInterruption(callback: AudioSessionInterruptionCallback): () => void {
    this.interruptionCallbacks.add(callback);
    return () => {
      this.interruptionCallbacks.delete(callback);
    };
  }

  onRouteChange(callback: AudioSessionRouteChangeCallback): () => void {
    this.routeChangeCallbacks.add(callback);
    return () => {
      this.routeChangeCallbacks.delete(callback);
    };
  }

  getCurrentOutputs(): string[] {
    try {
      const devicesInfo = AudioManager.getDevicesInfo();
      // Extract output device names
      if (devicesInfo && devicesInfo.outputs) {
        return devicesInfo.outputs.map((output: any) => output.name || output.type || 'Unknown');
      }
      return ['Speaker'];
    } catch (error) {
      console.warn('[AudioSessionManager] Failed to get current outputs:', error);
      return ['Speaker'];
    }
  }

  /**
   * Clean up subscriptions when the manager is no longer needed.
   * Call this when your app is shutting down.
   */
  dispose(): void {
    if (this.interruptionSubscription) {
      this.interruptionSubscription.remove();
      this.interruptionSubscription = null;
    }
    if (this.routeChangeSubscription) {
      this.routeChangeSubscription.remove();
      this.routeChangeSubscription = null;
    }
    this.interruptionCallbacks.clear();
    this.routeChangeCallbacks.clear();
  }
}

// Singleton instance
let instance: NativeAudioSessionManager | null = null;

/**
 * Get the AudioSessionManager singleton instance.
 * On native, this wraps react-native-audio-api's AudioManager.
 */
export function getAudioSessionManager(): IAudioSessionManager {
  if (!instance) {
    instance = new NativeAudioSessionManager();
  }
  return instance;
}

/**
 * Dispose the AudioSessionManager singleton.
 * Call this when your app is shutting down to clean up resources.
 */
export function disposeAudioSessionManager(): void {
  if (instance) {
    instance.dispose();
    instance = null;
  }
}

export { NativeAudioSessionManager };
