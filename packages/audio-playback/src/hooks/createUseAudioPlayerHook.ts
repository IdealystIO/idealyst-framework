import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseAudioPlayerOptions,
  UseAudioPlayerResult,
  PlaybackConfig,
  PlayerStatus,
  PlayerError,
  IAudioPlayer,
} from '../types';
import { DEFAULT_PLAYER_STATUS, DEFAULT_POSITION_UPDATE_INTERVAL } from '../constants';

/**
 * Factory function type for creating platform-specific player instances.
 */
export type CreatePlayerFactory = () => IAudioPlayer;

/**
 * Create the useAudioPlayer hook with a platform-specific factory.
 */
export function createUseAudioPlayerHook(createPlayer: CreatePlayerFactory) {
  return function useAudioPlayer(
    options: UseAudioPlayerOptions = {}
  ): UseAudioPlayerResult {
    const {
      autoPlay = false,
      volume: initialVolume = 1.0,
      positionUpdateInterval = DEFAULT_POSITION_UPDATE_INTERVAL,
    } = options;

    const playerRef = useRef<IAudioPlayer | null>(null);
    const autoPlayRef = useRef(autoPlay);

    // Update autoPlay ref when it changes
    useEffect(() => {
      autoPlayRef.current = autoPlay;
    }, [autoPlay]);

    const [status, setStatus] = useState<PlayerStatus>({
      ...DEFAULT_PLAYER_STATUS,
      volume: initialVolume,
    });
    const [position, setPosition] = useState(0);
    const [error, setError] = useState<PlayerError | null>(null);

    // Initialize player instance
    useEffect(() => {
      const player = createPlayer();
      playerRef.current = player;

      // Set initial volume
      player.setVolume(initialVolume);

      // Subscribe to state changes
      const unsubscribeState = player.onStateChange((newStatus) => {
        setStatus(newStatus);
        if (newStatus.error) {
          setError(newStatus.error);
        }
      });

      // Subscribe to position updates
      const unsubscribePosition = player.onPosition((pos) => {
        setPosition(pos);
      }, positionUpdateInterval);

      // Subscribe to errors
      const unsubscribeError = player.onError((err) => {
        setError(err);
      });

      return () => {
        unsubscribeState();
        unsubscribePosition();
        unsubscribeError();
        player.dispose();
        playerRef.current = null;
      };
    }, [initialVolume, positionUpdateInterval]);

    const loadFile = useCallback(async (uri: string) => {
      setError(null);
      await playerRef.current?.loadFile(uri);

      // Auto-play if enabled
      if (autoPlayRef.current && playerRef.current?.status.state === 'ready') {
        await playerRef.current.play();
      }
    }, []);

    const loadPCMStream = useCallback(async (config: PlaybackConfig) => {
      setError(null);
      await playerRef.current?.loadPCMStream(config);

      // Auto-play if enabled
      if (autoPlayRef.current && playerRef.current?.status.state === 'ready') {
        await playerRef.current.play();
      }
    }, []);

    const unload = useCallback(() => {
      playerRef.current?.unload();
    }, []);

    const feedPCMData = useCallback((data: ArrayBuffer | Int16Array) => {
      playerRef.current?.feedPCMData(data);
    }, []);

    const flush = useCallback(async () => {
      await playerRef.current?.flush();
    }, []);

    const play = useCallback(async () => {
      setError(null);
      await playerRef.current?.play();
    }, []);

    const pause = useCallback(() => {
      playerRef.current?.pause();
    }, []);

    const stop = useCallback(() => {
      playerRef.current?.stop();
    }, []);

    const seek = useCallback(async (positionMs: number) => {
      await playerRef.current?.seek(positionMs);
    }, []);

    const setVolume = useCallback((vol: number) => {
      playerRef.current?.setVolume(vol);
    }, []);

    const toggleMute = useCallback(() => {
      if (playerRef.current) {
        playerRef.current.setMuted(!playerRef.current.status.muted);
      }
    }, []);

    return {
      // State
      status,
      isPlaying: status.isPlaying,
      isPaused: status.isPaused,
      isLoading: status.state === 'loading',
      position,
      duration: status.duration,
      volume: status.volume,
      error,

      // Source loading
      loadFile,
      loadPCMStream,
      unload,

      // PCM streaming
      feedPCMData,
      flush,

      // Controls
      play,
      pause,
      stop,
      seek,
      setVolume,
      toggleMute,
    };
  };
}
