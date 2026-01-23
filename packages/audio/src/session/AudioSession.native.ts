/**
 * Native Audio Session Manager
 *
 * Manages iOS AVAudioSession through react-native-audio-api's AudioManager.
 */

import { AudioManager } from 'react-native-audio-api';
import type {
  IAudioSessionManager,
  AudioSessionConfig,
  AudioSessionState,
  AudioSessionCategory,
  AudioSessionMode,
  AudioSessionCategoryOption,
  AudioSessionInterruption,
  AudioSessionRouteChange,
} from '../types';
import { DEFAULT_SESSION_STATE } from '../constants';

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

class NativeAudioSessionManager implements IAudioSessionManager {
  private _state: AudioSessionState = { ...DEFAULT_SESSION_STATE };
  private interruptionCallbacks: Set<(interruption: AudioSessionInterruption) => void> = new Set();
  private routeChangeCallbacks: Set<(change: AudioSessionRouteChange) => void> = new Set();
  private interruptionSubscription: { remove: () => void } | null = null;
  private routeChangeSubscription: { remove: () => void } | null = null;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    try {
      AudioManager.observeAudioInterruptions(true);

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

      this.routeChangeSubscription = AudioManager.addSystemEventListener(
        'routeChange',
        (event: any) => {
          const change: AudioSessionRouteChange = {
            reason: event.reason || 'unknown',
            previousOutputs: event.previousOutputs || [],
            currentOutputs: event.currentOutputs || [],
          };
          this.routeChangeCallbacks.forEach((cb) => cb(change));
        }
      );
    } catch (error) {
      console.warn('[AudioSession] Failed to setup event listeners:', error);
    }
  }

  get state(): AudioSessionState {
    return { ...this._state };
  }

  async configure(config: Partial<AudioSessionConfig>): Promise<void> {
    const category = config.category || this._state.category;
    const mode = config.mode || this._state.mode;
    const options = config.categoryOptions || this._state.categoryOptions;

    const iosCategory = CATEGORY_MAP[category];
    const iosMode = MODE_MAP[mode];
    const iosOptions = options.map((opt) => OPTION_MAP[opt]).filter(Boolean);

    try {
      AudioManager.setAudioSessionOptions({
        iosCategory,
        iosMode,
        iosOptions,
      });

      this._state.category = category;
      this._state.mode = mode;
      this._state.categoryOptions = options;

      if (config.active !== false) {
        await this.activate();
      }
    } catch (error) {
      console.error('[AudioSession] Failed to configure:', error);
      throw error;
    }
  }

  async activate(): Promise<void> {
    try {
      AudioManager.setAudioSessionActivity(true);
      this._state.isActive = true;
    } catch (error) {
      console.error('[AudioSession] Failed to activate:', error);
      throw error;
    }
  }

  async deactivate(_notifyOthers: boolean = true): Promise<void> {
    try {
      AudioManager.setAudioSessionActivity(false);
      this._state.isActive = false;
    } catch (error) {
      console.error('[AudioSession] Failed to deactivate:', error);
      throw error;
    }
  }

  onInterruption(callback: (interruption: AudioSessionInterruption) => void): () => void {
    this.interruptionCallbacks.add(callback);
    return () => {
      this.interruptionCallbacks.delete(callback);
    };
  }

  onRouteChange(callback: (change: AudioSessionRouteChange) => void): () => void {
    this.routeChangeCallbacks.add(callback);
    return () => {
      this.routeChangeCallbacks.delete(callback);
    };
  }

  getCurrentOutputs(): string[] {
    try {
      const devicesInfo = AudioManager.getDevicesInfo();
      if (devicesInfo && devicesInfo.outputs) {
        return devicesInfo.outputs.map((output: any) => output.name || output.type || 'Unknown');
      }
      return ['Speaker'];
    } catch (error) {
      console.warn('[AudioSession] Failed to get outputs:', error);
      return ['Speaker'];
    }
  }

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

export function getAudioSessionManager(): IAudioSessionManager {
  if (!instance) {
    instance = new NativeAudioSessionManager();
  }
  return instance;
}

export function disposeAudioSessionManager(): void {
  if (instance) {
    instance.dispose();
    instance = null;
  }
}

export { NativeAudioSessionManager };
