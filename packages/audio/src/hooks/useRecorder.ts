/**
 * useRecorder Hook
 *
 * Provides recording functionality with PCM data streaming.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  UseRecorderOptions,
  UseRecorderResult,
  RecorderStatus,
  PermissionStatus,
  AudioLevel,
  AudioError,
  AudioConfig,
  RecorderDataCallback,
} from '../types';
import {
  DEFAULT_RECORDER_STATUS,
  DEFAULT_AUDIO_LEVEL,
  DEFAULT_LEVEL_UPDATE_INTERVAL,
} from '../constants';
import { getAudioContext } from '../context';
import { createRecorder } from '../recording';

export function useRecorder(options: UseRecorderOptions = {}): UseRecorderResult {
  const {
    config,
    autoRequestPermission = false,
    levelUpdateInterval = DEFAULT_LEVEL_UPDATE_INTERVAL,
  } = options;

  const [status, setStatus] = useState<RecorderStatus>(DEFAULT_RECORDER_STATUS);

  const audioContextRef = useRef(getAudioContext());
  const recorderRef = useRef<ReturnType<typeof createRecorder> | null>(null);
  const mountedRef = useRef(true);

  // Initialize recorder lazily
  const getRecorder = useCallback(() => {
    if (!recorderRef.current) {
      recorderRef.current = createRecorder(audioContextRef.current);
    }
    return recorderRef.current;
  }, []);

  // Check permission
  const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
    const recorder = getRecorder();
    return recorder.checkPermission();
  }, [getRecorder]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    const recorder = getRecorder();
    return recorder.requestPermission();
  }, [getRecorder]);

  // Start recording
  const start = useCallback(async (startConfig?: Partial<AudioConfig>) => {
    const recorder = getRecorder();
    const audioContext = audioContextRef.current;

    // Ensure audio context is initialized
    if (!audioContext.isInitialized) {
      await audioContext.initialize();
    }

    await recorder.start(startConfig || config);
  }, [getRecorder, config]);

  // Stop recording
  const stop = useCallback(async () => {
    const recorder = getRecorder();
    await recorder.stop();
  }, [getRecorder]);

  // Pause recording
  const pause = useCallback(async () => {
    const recorder = getRecorder();
    await recorder.pause();
  }, [getRecorder]);

  // Resume recording
  const resume = useCallback(async () => {
    const recorder = getRecorder();
    await recorder.resume();
  }, [getRecorder]);

  // Subscribe to data
  const subscribeToData = useCallback((callback: RecorderDataCallback): (() => void) => {
    const recorder = getRecorder();
    return recorder.onData(callback);
  }, [getRecorder]);

  // Reset peak level
  const resetPeakLevel = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder) {
      recorder.resetPeakLevel();
    }
  }, []);

  // Setup on mount
  useEffect(() => {
    mountedRef.current = true;

    const recorder = getRecorder();

    // Subscribe to state changes
    const unsubState = recorder.onStateChange((newStatus) => {
      if (mountedRef.current) {
        setStatus(newStatus);
      }
    });

    // Subscribe to level updates
    const unsubLevel = recorder.onLevel((level) => {
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, level }));
      }
    }, levelUpdateInterval);

    // Auto request permission if enabled
    if (autoRequestPermission) {
      requestPermission().catch(console.error);
    }

    return () => {
      mountedRef.current = false;
      unsubState();
      unsubLevel();

      // Dispose recorder on unmount
      if (recorderRef.current) {
        recorderRef.current.dispose();
        recorderRef.current = null;
      }
    };
  }, [getRecorder, autoRequestPermission, requestPermission, levelUpdateInterval]);

  // Derived state
  const isRecording = status.isRecording;
  const isPaused = status.isPaused;
  const permission = status.permission;
  const duration = status.duration;
  const level = status.level;
  const error = status.error || null;

  return {
    // State
    status,
    isRecording,
    isPaused,
    permission,
    duration,
    level,
    error,

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
