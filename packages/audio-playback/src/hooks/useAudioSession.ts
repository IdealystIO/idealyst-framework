/**
 * useAudioSession Hook
 *
 * React hook for managing audio session configuration on iOS/Android.
 * On web, this is a no-op but provides a consistent API.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  AudioSessionConfig,
  AudioSessionState,
  UseAudioSessionOptions,
  UseAudioSessionResult,
  IAudioSessionManager,
} from '../types';
import { DEFAULT_AUDIO_SESSION_STATE } from '../constants';

/**
 * Factory function to create the useAudioSession hook.
 * This allows platform-specific implementations to inject their AudioSessionManager.
 */
export function createUseAudioSessionHook(
  getManager: () => IAudioSessionManager
) {
  return function useAudioSession(
    options: UseAudioSessionOptions = {}
  ): UseAudioSessionResult {
    const {
      config,
      activateOnMount = false,
      deactivateOnUnmount = true,
    } = options;

    const managerRef = useRef<IAudioSessionManager | null>(null);
    const [state, setState] = useState<AudioSessionState>(DEFAULT_AUDIO_SESSION_STATE);
    const [outputs, setOutputs] = useState<string[]>([]);

    // Get or create manager
    const getManagerInstance = useCallback(() => {
      if (!managerRef.current) {
        managerRef.current = getManager();
      }
      return managerRef.current;
    }, []);

    // Sync state from manager
    const syncState = useCallback(() => {
      const manager = getManagerInstance();
      setState(manager.state);
      setOutputs(manager.getCurrentOutputs());
    }, [getManagerInstance]);

    // Configure the audio session
    const configure = useCallback(
      async (newConfig: Partial<AudioSessionConfig>): Promise<void> => {
        const manager = getManagerInstance();
        await manager.configure(newConfig);
        syncState();
      },
      [getManagerInstance, syncState]
    );

    // Activate the audio session
    const activate = useCallback(async (): Promise<void> => {
      const manager = getManagerInstance();
      await manager.activate();
      syncState();
    }, [getManagerInstance, syncState]);

    // Deactivate the audio session
    const deactivate = useCallback(
      async (notifyOthers?: boolean): Promise<void> => {
        const manager = getManagerInstance();
        await manager.deactivate(notifyOthers);
        syncState();
      },
      [getManagerInstance, syncState]
    );

    // Setup on mount
    useEffect(() => {
      const manager = getManagerInstance();

      // Subscribe to interruption events
      const unsubInterruption = manager.onInterruption((interruption) => {
        // Update state based on interruption
        if (interruption.type === 'began') {
          setState((prev) => ({ ...prev, isActive: false }));
        } else if (interruption.type === 'ended' && interruption.shouldResume) {
          setState((prev) => ({ ...prev, isActive: true }));
        }
      });

      // Subscribe to route change events
      const unsubRouteChange = manager.onRouteChange((change) => {
        setOutputs(change.currentOutputs);
      });

      // Apply initial config if provided
      const initializeSession = async () => {
        if (config) {
          await manager.configure(config);
        }
        if (activateOnMount) {
          await manager.activate();
        }
        syncState();
      };

      initializeSession();

      // Cleanup on unmount
      return () => {
        unsubInterruption();
        unsubRouteChange();
        if (deactivateOnUnmount) {
          manager.deactivate(true).catch(console.warn);
        }
      };
    }, []); // Only run on mount/unmount

    return {
      state,
      isActive: state.isActive,
      configure,
      activate,
      deactivate,
      outputs,
    };
  };
}
