import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  UseRecorderOptions,
  UseRecorderResult,
  RecordingOptions,
  RecordingResult,
  MicrophoneError,
  IRecorder,
} from '../types';

/**
 * Factory function type for creating platform-specific recorder instances.
 */
export type CreateRecorderFactory = () => IRecorder;

/**
 * Create the useRecorder hook with a platform-specific factory.
 */
export function createUseRecorderHook(createRecorder: CreateRecorderFactory) {
  return function useRecorder(
    options: UseRecorderOptions = {}
  ): UseRecorderResult {
    const recorderRef = useRef<IRecorder | null>(null);
    const optionsRef = useRef<RecordingOptions | undefined>(options.options);

    // Update options ref when it changes
    useEffect(() => {
      optionsRef.current = options.options;
    }, [options.options]);

    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<MicrophoneError | null>(null);

    // Initialize recorder instance
    useEffect(() => {
      recorderRef.current = createRecorder();

      return () => {
        recorderRef.current?.dispose();
        recorderRef.current = null;
      };
    }, []);

    // Duration tracking
    useEffect(() => {
      if (!isRecording) {
        return;
      }

      const interval = setInterval(() => {
        if (recorderRef.current) {
          setDuration(recorderRef.current.duration);
        }
      }, 100);

      return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = useCallback(
      async (overrideOptions?: RecordingOptions) => {
        try {
          setError(null);
          const finalOptions = overrideOptions ?? optionsRef.current;
          await recorderRef.current?.startRecording(finalOptions);
          setIsRecording(true);
          setDuration(0);
        } catch (e) {
          const err = e as MicrophoneError;
          setError(err);
          throw err;
        }
      },
      []
    );

    const stopRecording = useCallback(async (): Promise<RecordingResult> => {
      const result = await recorderRef.current?.stopRecording();
      setIsRecording(false);
      if (!result) {
        throw new Error('No recording result');
      }
      return result;
    }, []);

    const cancelRecording = useCallback(async () => {
      await recorderRef.current?.cancelRecording();
      setIsRecording(false);
      setDuration(0);
    }, []);

    return {
      isRecording,
      duration,
      error,
      startRecording,
      stopRecording,
      cancelRecording,
    };
  };
}
