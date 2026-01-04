import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseMicrophoneOptions,
  UseMicrophoneResult,
  AudioDataCallback,
  MicrophoneStatus,
  MicrophoneError,
  AudioLevel,
  PermissionResult,
  AudioConfig,
  IMicrophone,
} from '../types';
import { DEFAULT_AUDIO_CONFIG, DEFAULT_AUDIO_LEVEL } from '../constants';

/**
 * Factory function type for creating platform-specific microphone instances.
 */
export type CreateMicrophoneFactory = () => IMicrophone;

/**
 * Create the useMicrophone hook with a platform-specific factory.
 */
export function createUseMicrophoneHook(
  createMicrophone: CreateMicrophoneFactory
) {
  return function useMicrophone(
    options: UseMicrophoneOptions = {}
  ): UseMicrophoneResult {
    const {
      config = {},
      autoRequestPermission = false,
      levelUpdateInterval = 100,
    } = options;

    const microphoneRef = useRef<IMicrophone | null>(null);
    const configRef = useRef<Partial<AudioConfig>>(config);

    // Update config ref when it changes
    useEffect(() => {
      configRef.current = config;
    }, [config]);

    const [status, setStatus] = useState<MicrophoneStatus>({
      state: 'idle',
      permission: 'undetermined',
      isRecording: false,
      duration: 0,
      level: DEFAULT_AUDIO_LEVEL,
      config: { ...DEFAULT_AUDIO_CONFIG, ...config },
    });

    const [level, setLevel] = useState<AudioLevel>(DEFAULT_AUDIO_LEVEL);
    const [error, setError] = useState<MicrophoneError | null>(null);

    // Initialize microphone instance
    useEffect(() => {
      const mic = createMicrophone();
      microphoneRef.current = mic;

      const unsubscribeState = mic.onStateChange((newStatus) => {
        setStatus(newStatus);
        if (newStatus.error) {
          setError(newStatus.error);
        }
      });

      const unsubscribeLevel = mic.onAudioLevel((newLevel) => {
        setLevel(newLevel);
      }, levelUpdateInterval);

      const unsubscribeError = mic.onError((err) => {
        setError(err);
      });

      // Check or request permission on mount
      if (autoRequestPermission) {
        mic.requestPermission().catch(() => {});
      } else {
        mic.checkPermission().catch(() => {});
      }

      return () => {
        unsubscribeState();
        unsubscribeLevel();
        unsubscribeError();
        mic.dispose();
        microphoneRef.current = null;
      };
    }, [autoRequestPermission, levelUpdateInterval]);

    const start = useCallback(
      async (overrideConfig?: Partial<AudioConfig>) => {
        setError(null);
        const finalConfig = { ...configRef.current, ...overrideConfig };
        await microphoneRef.current?.start(finalConfig);
      },
      []
    );

    const stop = useCallback(async () => {
      await microphoneRef.current?.stop();
    }, []);

    const pause = useCallback(async () => {
      await microphoneRef.current?.pause();
    }, []);

    const resume = useCallback(async () => {
      await microphoneRef.current?.resume();
    }, []);

    const requestPermission = useCallback(async (): Promise<PermissionResult> => {
      const result = await microphoneRef.current?.requestPermission();
      return result ?? { status: 'unavailable', canAskAgain: false };
    }, []);

    const resetPeakLevel = useCallback(() => {
      microphoneRef.current?.resetPeakLevel();
    }, []);

    const subscribeToAudioData = useCallback(
      (callback: AudioDataCallback): (() => void) => {
        return microphoneRef.current?.onAudioData(callback) ?? (() => {});
      },
      []
    );

    return {
      status,
      isRecording: status.isRecording,
      isPaused: status.state === 'paused',
      level,
      error,
      permission: status.permission,
      start,
      stop,
      pause,
      resume,
      requestPermission,
      resetPeakLevel,
      subscribeToAudioData,
    };
  };
}
