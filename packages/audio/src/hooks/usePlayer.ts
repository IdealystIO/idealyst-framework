/**
 * usePlayer Hook
 *
 * Provides audio playback functionality for files and PCM streaming.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  UsePlayerOptions,
  UsePlayerResult,
  PlayerStatus,
  AudioError,
  AudioConfig,
} from '../types';
import {
  DEFAULT_PLAYER_STATUS,
  DEFAULT_POSITION_UPDATE_INTERVAL,
} from '../constants';
import { getAudioContext } from '../context';
import { createPlayer } from '../playback';

export function usePlayer(options: UsePlayerOptions = {}): UsePlayerResult {
  const {
    autoPlay = false,
    volume: initialVolume = 1.0,
    positionUpdateInterval = DEFAULT_POSITION_UPDATE_INTERVAL,
  } = options;

  const [status, setStatus] = useState<PlayerStatus>({
    ...DEFAULT_PLAYER_STATUS,
    volume: initialVolume,
  });

  const audioContextRef = useRef(getAudioContext());
  const playerRef = useRef<ReturnType<typeof createPlayer> | null>(null);
  const mountedRef = useRef(true);
  const autoPlayPendingRef = useRef(false);

  // Initialize player lazily
  const getPlayer = useCallback(() => {
    if (!playerRef.current) {
      playerRef.current = createPlayer(audioContextRef.current);
      // Set initial volume
      playerRef.current.setVolume(initialVolume);
    }
    return playerRef.current;
  }, [initialVolume]);

  // Load file
  const loadFile = useCallback(async (uri: string) => {
    const player = getPlayer();
    const audioContext = audioContextRef.current;

    // Ensure audio context is initialized
    if (!audioContext.isInitialized) {
      await audioContext.initialize();
    }

    await player.loadFile(uri);

    if (autoPlay) {
      autoPlayPendingRef.current = true;
    }
  }, [getPlayer, autoPlay]);

  // Unload
  const unload = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.unload();
    }
  }, []);

  // Load PCM stream
  const loadPCMStream = useCallback(async (config: AudioConfig) => {
    const player = getPlayer();
    const audioContext = audioContextRef.current;

    // Ensure audio context is initialized
    if (!audioContext.isInitialized) {
      await audioContext.initialize();
    }

    await player.loadPCMStream(config);

    if (autoPlay) {
      autoPlayPendingRef.current = true;
    }
  }, [getPlayer, autoPlay]);

  // Feed PCM data
  const feedPCMData = useCallback((data: ArrayBuffer | Int16Array) => {
    const player = playerRef.current;
    if (player) {
      player.feedPCMData(data);
    }
  }, []);

  // Flush
  const flush = useCallback(async () => {
    const player = playerRef.current;
    if (player) {
      await player.flush();
    }
  }, []);

  // Play
  const play = useCallback(async () => {
    const player = getPlayer();
    await player.play();
  }, [getPlayer]);

  // Pause
  const pause = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.pause();
    }
  }, []);

  // Stop
  const stop = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.stop();
    }
  }, []);

  // Seek
  const seek = useCallback(async (positionMs: number) => {
    const player = playerRef.current;
    if (player) {
      await player.seek(positionMs);
    }
  }, []);

  // Set volume
  const setVolume = useCallback((vol: number) => {
    const player = playerRef.current;
    if (player) {
      player.setVolume(vol);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.setMuted(!status.muted);
    }
  }, [status.muted]);

  // Setup on mount
  useEffect(() => {
    mountedRef.current = true;

    const player = getPlayer();

    // Subscribe to state changes
    const unsubState = player.onStateChange((newStatus) => {
      if (mountedRef.current) {
        setStatus(newStatus);

        // Handle autoplay
        if (autoPlayPendingRef.current && newStatus.state === 'ready') {
          autoPlayPendingRef.current = false;
          player.play().catch(console.error);
        }
      }
    });

    // Subscribe to position updates
    const unsubPosition = player.onPosition((position) => {
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, position }));
      }
    }, positionUpdateInterval);

    // Subscribe to buffer changes
    const unsubBuffer = player.onBufferChange((buffered) => {
      if (mountedRef.current) {
        setStatus((prev) => ({ ...prev, buffered }));
      }
    });

    // Subscribe to ended event
    const unsubEnded = player.onEnded(() => {
      if (mountedRef.current) {
        // Status will be updated via onStateChange
      }
    });

    return () => {
      mountedRef.current = false;
      unsubState();
      unsubPosition();
      unsubBuffer();
      unsubEnded();

      // Dispose player on unmount
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [getPlayer, positionUpdateInterval]);

  // Derived state
  const isPlaying = status.isPlaying;
  const isPaused = status.isPaused;
  const isLoading = status.state === 'loading';
  const position = status.position;
  const duration = status.duration;
  const volume = status.volume;
  const error = status.error || null;

  return {
    // State
    status,
    isPlaying,
    isPaused,
    isLoading,
    position,
    duration,
    volume,
    error,

    // File playback
    loadFile,
    unload,

    // PCM streaming
    loadPCMStream,
    feedPCMData,
    flush,

    // Playback control
    play,
    pause,
    stop,
    seek,

    // Volume
    setVolume,
    toggleMute,
  };
}
