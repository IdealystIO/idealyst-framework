/**
 * Web Background Recorder (graceful degradation)
 *
 * On web, there is no "background" concept for apps.
 * This wraps the web recorder and provides the same interface,
 * but background lifecycle events never fire.
 */

import type {
  IBackgroundRecorder,
  IAudioContext,
  BackgroundRecorderStatus,
  BackgroundRecorderConfig,
  BackgroundLifecycleCallback,
  BackgroundStatusCallback,
  RecorderDataCallback,
  RecorderLevelCallback,
  RecorderStatus,
  AudioConfig,
  PermissionStatus,
} from '../types';
import { DEFAULT_BACKGROUND_RECORDER_STATUS } from '../constants';
import { createRecorder } from '../recording';

export class WebBackgroundRecorder implements IBackgroundRecorder {
  readonly recorder;

  private _status: BackgroundRecorderStatus = { ...DEFAULT_BACKGROUND_RECORDER_STATUS };
  private statusCallbacks = new Set<BackgroundStatusCallback>();
  private recorderStateUnsubscribe: (() => void) | null = null;

  constructor(audioContext: IAudioContext, _config?: BackgroundRecorderConfig) {
    this.recorder = createRecorder(audioContext);

    this.recorderStateUnsubscribe = this.recorder.onStateChange(
      (innerStatus: RecorderStatus) => {
        this.updateStatus({
          ...innerStatus,
          appState: 'active',
          isInBackground: false,
          wasInterrupted: false,
          backgroundSince: null,
          backgroundDuration: 0,
        });
      },
    );
  }

  get status(): BackgroundRecorderStatus {
    return { ...this._status };
  }

  async start(config?: Partial<AudioConfig>): Promise<void> {
    await this.recorder.start(config);
  }

  async stop(): Promise<void> {
    await this.recorder.stop();
  }

  async pause(): Promise<void> {
    await this.recorder.pause();
  }

  async resume(): Promise<void> {
    await this.recorder.resume();
  }

  async checkPermission(): Promise<PermissionStatus> {
    return this.recorder.checkPermission();
  }

  async requestPermission(): Promise<PermissionStatus> {
    return this.recorder.requestPermission();
  }

  onData(callback: RecorderDataCallback): () => void {
    return this.recorder.onData(callback);
  }

  onLevel(callback: RecorderLevelCallback, intervalMs?: number): () => void {
    return this.recorder.onLevel(callback, intervalMs);
  }

  onLifecycle(_callback: BackgroundLifecycleCallback): () => void {
    // No-op on web — background events never fire
    return () => {};
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
    if (this.recorderStateUnsubscribe) {
      this.recorderStateUnsubscribe();
      this.recorderStateUnsubscribe = null;
    }
    this.statusCallbacks.clear();
    this.recorder.dispose();
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
  return new WebBackgroundRecorder(audioContext, config);
}
