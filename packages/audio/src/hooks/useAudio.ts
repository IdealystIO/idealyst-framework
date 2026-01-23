/**
 * useAudio Hook
 *
 * Provides access to the shared audio context and session management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  UseAudioOptions,
  UseAudioResult,
  AudioSessionState,
  AudioSessionConfig,
} from '../types';
import { DEFAULT_SESSION_STATE, SESSION_PRESETS } from '../constants';
import { getAudioContext } from '../context';
import { getAudioSessionManager } from '../session';

export function useAudio(options: UseAudioOptions = {}): UseAudioResult {
  const { session, initializeOnMount = true } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionState, setSessionState] = useState<AudioSessionState>(DEFAULT_SESSION_STATE);
  const [outputs, setOutputs] = useState<string[]>([]);

  const audioContextRef = useRef(getAudioContext());
  const sessionManagerRef = useRef(getAudioSessionManager());
  const mountedRef = useRef(true);

  // Initialize audio context and session
  const initialize = useCallback(async () => {
    try {
      const audioContext = audioContextRef.current;
      const sessionManager = sessionManagerRef.current;

      // Initialize audio context
      if (!audioContext.isInitialized) {
        await audioContext.initialize();
      }

      // Configure session if provided
      if (session) {
        await sessionManager.configure(session);
      } else {
        // Use default preset
        await sessionManager.configure(SESSION_PRESETS.default);
      }

      // Activate session
      await sessionManager.activate();

      if (mountedRef.current) {
        setIsInitialized(true);
        setSessionState(sessionManager.state);
        setOutputs(sessionManager.getCurrentOutputs());
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }, [session]);

  // Configure audio session
  const configureSession = useCallback(async (config: Partial<AudioSessionConfig>) => {
    const sessionManager = sessionManagerRef.current;
    await sessionManager.configure(config);
    if (mountedRef.current) {
      setSessionState(sessionManager.state);
    }
  }, []);

  // Suspend audio context
  const suspend = useCallback(async () => {
    const audioContext = audioContextRef.current;
    await audioContext.suspend();
  }, []);

  // Resume audio context
  const resume = useCallback(async () => {
    const audioContext = audioContextRef.current;
    await audioContext.resume();
  }, []);

  // Setup on mount
  useEffect(() => {
    mountedRef.current = true;

    if (initializeOnMount) {
      initialize().catch(console.error);
    }

    // Subscribe to session changes
    const sessionManager = sessionManagerRef.current;

    const unsubInterruption = sessionManager.onInterruption((interruption) => {
      if (mountedRef.current) {
        // Handle interruption (e.g., phone call)
        if (interruption.type === 'began') {
          // Audio was interrupted
          console.log('Audio session interrupted');
        } else if (interruption.type === 'ended' && interruption.shouldResume) {
          // Resume audio if appropriate
          console.log('Audio session interruption ended, should resume');
        }
      }
    });

    const unsubRouteChange = sessionManager.onRouteChange((change) => {
      if (mountedRef.current) {
        setOutputs(change.currentOutputs);
      }
    });

    return () => {
      mountedRef.current = false;
      unsubInterruption();
      unsubRouteChange();
    };
  }, [initializeOnMount, initialize]);

  return {
    isInitialized,
    sessionState,
    outputs,
    initialize,
    configureSession,
    suspend,
    resume,
  };
}
