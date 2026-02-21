/**
 * Native Background Recorder
 *
 * Wraps an IRecorder with React Native AppState awareness to manage
 * background recording lifecycle. The underlying react-native-audio-api
 * handles the actual background execution (foreground service on Android,
 * background audio mode on iOS).
 */

import { AppState, type AppStateStatus as RNAppStateStatus } from 'react-native';
import type {
  IBackgroundRecorder,
  IRecorder,
  IAudioContext,
  BackgroundRecorderStatus,
  BackgroundRecorderConfig,
  BackgroundLifecycleCallback,
  BackgroundLifecycleInfo,
  BackgroundStatusCallback,
  RecorderDataCallback,
  RecorderLevelCallback,
  RecorderStatus,
  AudioConfig,
  PermissionStatus,
  AppStateStatus,
} from '../types';
import { DEFAULT_BACKGROUND_RECORDER_STATUS, SESSION_PRESETS } from '../constants';
import { getAudioSessionManager } from '../session/index.native';
import { createRecorder } from '../recording/index.native';

export class NativeBackgroundRecorder implements IBackgroundRecorder {
  readonly recorder: IRecorder;

  private sessionManager = getAudioSessionManager();
  private config: BackgroundRecorderConfig;

  private _status: BackgroundRecorderStatus = { ...DEFAULT_BACKGROUND_RECORDER_STATUS };
  private appStateSubscription: { remove: () => void } | null = null;
  private interruptionUnsubscribe: (() => void) | null = null;
  private recorderStateUnsubscribe: (() => void) | null = null;
  private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
  private backgroundStartTime: number | null = null;

  private lifecycleCallbacks = new Set<BackgroundLifecycleCallback>();
  private statusCallbacks = new Set<BackgroundStatusCallback>();

  constructor(audioContext: IAudioContext, config: BackgroundRecorderConfig = {}) {
    this.config = config;

    // Create the underlying recorder
    this.recorder = createRecorder(audioContext);

    // Subscribe to inner recorder state changes to keep status in sync
    this.recorderStateUnsubscribe = this.recorder.onStateChange(
      (innerStatus: RecorderStatus) => {
        this.updateStatus({
          ...innerStatus,
          // Preserve background-specific fields
          appState: this._status.appState,
          isInBackground: this._status.isInBackground,
          wasInterrupted: this._status.wasInterrupted,
          backgroundSince: this._status.backgroundSince,
          backgroundDuration: this._status.backgroundDuration,
        });
      },
    );

    // Listen to AppState changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

    // Listen to audio session interruptions (phone calls, Siri, etc.)
    this.interruptionUnsubscribe = this.sessionManager.onInterruption((interruption) => {
      if (interruption.type === 'began') {
        this.updateStatus({ wasInterrupted: true });
        this.fireLifecycle({
          event: 'interrupted',
          timestamp: Date.now(),
        });
      } else if (interruption.type === 'ended') {
        this.fireLifecycle({
          event: 'interruptionEnded',
          timestamp: Date.now(),
          shouldResume: interruption.shouldResume,
        });
      }
    });
  }

  get status(): BackgroundRecorderStatus {
    return { ...this._status };
  }

  // -- Proxied recording control --

  async start(configOverride?: Partial<AudioConfig>): Promise<void> {
    // Configure audio session for background if needed
    if (this.config.autoConfigureSession !== false) {
      const sessionConfig = this.config.session ?? SESSION_PRESETS.backgroundRecord;
      await this.sessionManager.configure(sessionConfig);
    }

    // Reset background state for new recording session
    this.updateStatus({
      wasInterrupted: false,
      backgroundDuration: 0,
      backgroundSince: null,
    });

    await this.recorder.start(configOverride ?? this.config.audio);
  }

  async stop(): Promise<void> {
    this.clearMaxDurationTimer();
    const wasInBackground = this._status.isInBackground;

    await this.recorder.stop();

    if (wasInBackground) {
      this.fireLifecycle({
        event: 'stopped',
        timestamp: Date.now(),
        backgroundDuration: this._status.backgroundDuration,
      });
    }
  }

  async pause(): Promise<void> {
    await this.recorder.pause();
  }

  async resume(): Promise<void> {
    await this.recorder.resume();
  }

  // -- Proxied permission --

  async checkPermission(): Promise<PermissionStatus> {
    return this.recorder.checkPermission();
  }

  async requestPermission(): Promise<PermissionStatus> {
    return this.recorder.requestPermission();
  }

  // -- Proxied data streaming --

  onData(callback: RecorderDataCallback): () => void {
    return this.recorder.onData(callback);
  }

  onLevel(callback: RecorderLevelCallback, intervalMs?: number): () => void {
    return this.recorder.onLevel(callback, intervalMs);
  }

  // -- Background-specific --

  onLifecycle(callback: BackgroundLifecycleCallback): () => void {
    this.lifecycleCallbacks.add(callback);
    return () => {
      this.lifecycleCallbacks.delete(callback);
    };
  }

  onStatusChange(callback: BackgroundStatusCallback): () => void {
    this.statusCallbacks.add(callback);
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  resetPeakLevel(): void {
    this.recorder.resetPeakLevel();
  }

  dispose(): void {
    this.clearMaxDurationTimer();

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    if (this.interruptionUnsubscribe) {
      this.interruptionUnsubscribe();
      this.interruptionUnsubscribe = null;
    }

    if (this.recorderStateUnsubscribe) {
      this.recorderStateUnsubscribe();
      this.recorderStateUnsubscribe = null;
    }

    this.lifecycleCallbacks.clear();
    this.statusCallbacks.clear();
    this.recorder.dispose();
  }

  // -- Private --

  private handleAppStateChange = (nextAppState: RNAppStateStatus): void => {
    const mappedState = this.mapAppState(nextAppState);
    const previousState = this._status.appState;
    const isRecording = this._status.isRecording;

    this.updateStatus({ appState: mappedState });

    // Transition: foreground -> background
    if (
      previousState === 'active' &&
      (mappedState === 'background' || mappedState === 'inactive')
    ) {
      this.backgroundStartTime = Date.now();
      this.updateStatus({
        isInBackground: true,
        backgroundSince: this.backgroundStartTime,
      });

      if (isRecording) {
        this.fireLifecycle({
          event: 'backgrounded',
          timestamp: Date.now(),
        });

        this.startMaxDurationTimer();
      }
    }

    // Transition: background -> foreground
    if (
      (previousState === 'background' || previousState === 'inactive') &&
      mappedState === 'active'
    ) {
      const bgDuration = this.backgroundStartTime
        ? Date.now() - this.backgroundStartTime
        : 0;

      this.clearMaxDurationTimer();

      this.updateStatus({
        isInBackground: false,
        backgroundSince: null,
        backgroundDuration: this._status.backgroundDuration + bgDuration,
      });

      this.backgroundStartTime = null;

      if (isRecording) {
        this.fireLifecycle({
          event: 'foregrounded',
          timestamp: Date.now(),
          backgroundDuration: bgDuration,
        });
      }
    }
  };

  private mapAppState(rnState: RNAppStateStatus): AppStateStatus {
    switch (rnState) {
      case 'active':
        return 'active';
      case 'background':
        return 'background';
      case 'inactive':
        return 'inactive';
      case 'unknown':
        return 'unknown';
      case 'extension':
        return 'extension';
      default:
        return 'unknown';
    }
  }

  private startMaxDurationTimer(): void {
    this.clearMaxDurationTimer();

    const maxDuration = this.config.maxBackgroundDuration;
    if (!maxDuration || maxDuration <= 0) return;

    this.maxDurationTimer = setTimeout(() => {
      this.fireLifecycle({
        event: 'maxDurationReached',
        timestamp: Date.now(),
        backgroundDuration: maxDuration,
      });
      this.stop().catch(console.error);
    }, maxDuration);
  }

  private clearMaxDurationTimer(): void {
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
  }

  private fireLifecycle(info: BackgroundLifecycleInfo): void {
    this.lifecycleCallbacks.forEach((cb) => {
      try {
        cb(info);
      } catch (e) {
        console.error('[BackgroundRecorder] Error in lifecycle callback:', e);
      }
    });
  }

  private updateStatus(partial: Partial<BackgroundRecorderStatus>): void {
    this._status = { ...this._status, ...partial };
    this.statusCallbacks.forEach((cb) => {
      try {
        cb(this._status);
      } catch (e) {
        console.error('[BackgroundRecorder] Error in status callback:', e);
      }
    });
  }
}

export function createBackgroundRecorder(
  audioContext: IAudioContext,
  config?: BackgroundRecorderConfig,
): IBackgroundRecorder {
  return new NativeBackgroundRecorder(audioContext, config);
}
