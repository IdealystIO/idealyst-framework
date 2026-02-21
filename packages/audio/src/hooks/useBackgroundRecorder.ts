/**
 * useBackgroundRecorder Hook
 *
 * Provides recording functionality with PCM data streaming and
 * background lifecycle awareness. On native, detects app state
 * transitions and fires lifecycle callbacks. On web, works
 * identically to useRecorder (background events never fire).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  UseBackgroundRecorderOptions,
  UseBackgroundRecorderResult,
  BackgroundRecorderStatus,
  PermissionStatus,
  AudioConfig,
  RecorderDataCallback,
  BackgroundLifecycleCallback,
  IBackgroundRecorder,
} from '../types';
import {
  DEFAULT_BACKGROUND_RECORDER_STATUS,
  DEFAULT_LEVEL_UPDATE_INTERVAL,
} from '../constants';
import { getAudioContext } from '../context';
import { createBackgroundRecorder } from '../background';

export function useBackgroundRecorder(
  options: UseBackgroundRecorderOptions = {},
): UseBackgroundRecorderResult {
  const {
    config,
    session,
    autoRequestPermission = false,
    levelUpdateInterval = DEFAULT_LEVEL_UPDATE_INTERVAL,
    maxBackgroundDuration,
    autoConfigureSession = true,
    onLifecycleEvent,
  } = options;

  const [status, setStatus] = useState<BackgroundRecorderStatus>(
    DEFAULT_BACKGROUND_RECORDER_STATUS,
  );

  const audioContextRef = useRef(getAudioContext());
  const bgRecorderRef = useRef<IBackgroundRecorder | null>(null);
  const mountedRef = useRef(true);
  const lifecycleCallbackRef = useRef<BackgroundLifecycleCallback | undefined>(onLifecycleEvent);

  // Keep lifecycle callback ref up to date
  lifecycleCallbackRef.current = onLifecycleEvent;

  // Initialize background recorder lazily
  const getBgRecorder = useCallback(() => {
    if (!bgRecorderRef.current) {
      bgRecorderRef.current = createBackgroundRecorder(audioContextRef.current, {
        audio: config,
        session,
        maxBackgroundDuration,
        autoConfigureSession,
      });
    }
    return bgRecorderRef.current;
  }, [config, session, maxBackgroundDuration, autoConfigureSession]);

  // Check permission
  const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
    return getBgRecorder().checkPermission();
  }, [getBgRecorder]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    return getBgRecorder().requestPermission();
  }, [getBgRecorder]);

  // Start recording
  const start = useCallback(async (startConfig?: Partial<AudioConfig>) => {
    const bgRecorder = getBgRecorder();
    const audioContext = audioContextRef.current;

    // Ensure audio context is initialized
    if (!audioContext.isInitialized) {
      await audioContext.initialize();
    }

    await bgRecorder.start(startConfig ?? config);
  }, [getBgRecorder, config]);

  // Stop recording
  const stop = useCallback(async () => {
    await getBgRecorder().stop();
  }, [getBgRecorder]);

  // Pause recording
  const pause = useCallback(async () => {
    await getBgRecorder().pause();
  }, [getBgRecorder]);

  // Resume recording
  const resume = useCallback(async () => {
    await getBgRecorder().resume();
  }, [getBgRecorder]);

  // Subscribe to data
  const subscribeToData = useCallback((callback: RecorderDataCallback): (() => void) => {
    return getBgRecorder().onData(callback);
  }, [getBgRecorder]);

  // Reset peak level
  const resetPeakLevel = useCallback(() => {
    if (bgRecorderRef.current) {
      bgRecorderRef.current.resetPeakLevel();
    }
  }, []);

  // Setup on mount
  useEffect(() => {
    mountedRef.current = true;

    const bgRecorder = getBgRecorder();

    // Subscribe to background status changes
    const unsubStatus = bgRecorder.onStatusChange((newStatus) => {
      if (mountedRef.current) {
        setStatus(newStatus);
      }
    });

    // Subscribe to level updates
    const unsubLevel = bgRecorder.onLevel((level) => {
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, level }));
      }
    }, levelUpdateInterval);

    // Subscribe to lifecycle events and forward to callback
    const unsubLifecycle = bgRecorder.onLifecycle((info) => {
      if (mountedRef.current && lifecycleCallbackRef.current) {
        lifecycleCallbackRef.current(info);
      }
    });

    // Auto request permission if enabled
    if (autoRequestPermission) {
      requestPermission().catch(console.error);
    }

    return () => {
      mountedRef.current = false;
      unsubStatus();
      unsubLevel();
      unsubLifecycle();

      // Dispose background recorder on unmount
      if (bgRecorderRef.current) {
        bgRecorderRef.current.dispose();
        bgRecorderRef.current = null;
      }
    };
  }, [getBgRecorder, autoRequestPermission, requestPermission, levelUpdateInterval]);

  return {
    // Standard recorder state
    status,
    isRecording: status.isRecording,
    isPaused: status.isPaused,
    permission: status.permission,
    duration: status.duration,
    level: status.level,
    error: status.error ?? null,

    // Background-specific state
    isInBackground: status.isInBackground,
    wasInterrupted: status.wasInterrupted,
    backgroundDuration: status.backgroundDuration,
    appState: status.appState,

    // Actions
    start,
    stop,
    pause,
    resume,

    // Permissions
    checkPermission,
    requestPermission,

    // Data subscription
    subscribeToData,

    // Utilities
    resetPeakLevel,
  };
}
