import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Screen, Text, View, Button, Card, Slider } from '@idealyst/components';
import { useAudioPlayer } from '../hooks/index.web';
import { PLAYBACK_PROFILES } from '../constants';
import type { PlaybackConfig } from '../types';

/**
 * Progress bar component for audio playback
 */
const ProgressBar = ({ position, duration, onSeek }: { position: number; duration: number; onSeek?: (pos: number) => void }) => {
  const percentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View
      style={{
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: onSeek ? 'pointer' : 'default',
      }}
      // @ts-ignore - web onClick
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (!onSeek || duration <= 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        onSeek(percent * duration);
      }}
    >
      <View
        style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: '#6366f1',
          transition: 'width 100ms linear',
        }}
      />
    </View>
  );
};

/**
 * Buffer indicator for PCM streaming
 */
const BufferIndicator = ({ buffered }: { buffered: number }) => {
  const getColor = () => {
    if (buffered < 50) return '#ef4444'; // Red - low buffer
    if (buffered < 200) return '#f59e0b'; // Yellow - medium
    return '#22c55e'; // Green - good
  };

  return (
    <View style={{ marginTop: 8 }}>
      <Text size="sm" style={{ marginBottom: 4 }}>
        Buffer: {Math.round(buffered)}ms
      </Text>
      <View
        style={{
          height: 6,
          backgroundColor: '#e5e7eb',
          borderRadius: 3,
          overflow: 'hidden',
          maxWidth: 200,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${Math.min(100, (buffered / 500) * 100)}%`,
            backgroundColor: getColor(),
            transition: 'width 100ms, background-color 200ms',
          }}
        />
      </View>
    </View>
  );
};

/**
 * Format milliseconds as MM:SS
 */
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// ============================================
// FILE PLAYBACK DEMO
// ============================================

interface FilePlaybackDemoProps {
  audioUrl?: string;
}

export function FilePlaybackDemo({ audioUrl = '' }: FilePlaybackDemoProps) {
  const player = useAudioPlayer();
  const [url, setUrl] = useState(audioUrl);

  const loadAndPlay = useCallback(async () => {
    if (!url) return;
    try {
      await player.loadFile(url);
      await player.play();
    } catch (error) {
      console.error('Failed to load audio:', error);
    }
  }, [url, player]);

  const handleSeek = useCallback(async (positionMs: number) => {
    try {
      await player.seek(positionMs);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }, [player]);

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">File Playback</Text>
        <Text size="sm" color="secondary">
          Load and play audio files from URLs or local paths.
        </Text>

        {/* URL Input */}
        <View style={{ marginTop: 8 }}>
          <Text size="sm" weight="medium" style={{ marginBottom: 4 }}>Audio URL:</Text>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter audio URL (e.g., /audio/music.mp3)"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              fontSize: 14,
            }}
          />
        </View>

        {/* Progress */}
        <View style={{ marginTop: 12 }}>
          <View direction="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
            <Text size="sm">{formatTime(player.position)}</Text>
            <Text size="sm">{formatTime(player.duration)}</Text>
          </View>
          <ProgressBar
            position={player.position}
            duration={player.duration}
            onSeek={player.duration > 0 ? handleSeek : undefined}
          />
        </View>

        {/* Controls */}
        <View direction="row" spacing="sm" style={{ marginTop: 12, justifyContent: 'center' }}>
          <Button
            type="outlined"
            size="sm"
            onPress={loadAndPlay}
            disabled={!url || player.isLoading}
          >
            Load
          </Button>
          <Button
            size="sm"
            onPress={player.isPlaying ? player.pause : player.play}
            disabled={player.status.state === 'idle' || player.status.state === 'loading'}
          >
            {player.isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            type="outlined"
            size="sm"
            onPress={player.stop}
            disabled={player.status.state === 'idle'}
          >
            Stop
          </Button>
        </View>

        {/* Volume */}
        <View direction="row" style={{ alignItems: 'center', marginTop: 12 }}>
          <Button type="ghost" size="sm" onPress={player.toggleMute}>
            {player.status.muted ? '🔇' : '🔊'}
          </Button>
          <View style={{ flex: 1, maxWidth: 150, marginLeft: 8 }}>
            <Slider
              value={player.volume}
              onValueChange={player.setVolume}
              minimumValue={0}
              maximumValue={1}
              step={0.1}
            />
          </View>
          <Text size="sm" style={{ marginLeft: 8 }}>{Math.round(player.volume * 100)}%</Text>
        </View>

        {/* Status */}
        <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f9fafb', borderRadius: 6 }}>
          <Text size="sm" color="secondary">
            State: <Text weight="medium">{player.status.state}</Text>
            {player.error && (
              <Text color="danger"> | Error: {player.error.message}</Text>
            )}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================
// PCM STREAMING DEMO
// ============================================

interface PCMStreamingDemoProps {
  config?: PlaybackConfig;
}

export function PCMStreamingDemo({ config = PLAYBACK_PROFILES.speech }: PCMStreamingDemoProps) {
  const player = useAudioPlayer();
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof PLAYBACK_PROFILES>('speech');

  const currentConfig = PLAYBACK_PROFILES[selectedProfile];

  const startStreaming = useCallback(async () => {
    try {
      await player.loadPCMStream(currentConfig);
      await player.play();
      setIsStreaming(true);
    } catch (error) {
      console.error('Failed to start streaming:', error);
    }
  }, [currentConfig, player]);

  const stopStreaming = useCallback(() => {
    player.stop();
    setIsStreaming(false);
  }, [player]);

  // Generate and feed sample PCM data (sine wave)
  const feedSampleData = useCallback(() => {
    if (!isStreaming) return;

    const sampleRate = currentConfig.sampleRate;
    const frequency = 440; // A4 note
    const duration = 0.1; // 100ms of audio
    const sampleCount = Math.floor(sampleRate * duration);
    const samples = new Int16Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
      const t = i / sampleRate;
      const value = Math.sin(2 * Math.PI * frequency * t);
      samples[i] = Math.floor(value * 32767);
    }

    player.feedPCMData(samples);
  }, [isStreaming, currentConfig, player]);

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">PCM Streaming</Text>
        <Text size="sm" color="secondary">
          Stream raw PCM audio data for real-time playback. Ideal for TTS and AI voice responses.
        </Text>

        {/* Profile Selection */}
        <View style={{ marginTop: 8 }}>
          <Text size="sm" weight="medium" style={{ marginBottom: 4 }}>Playback Profile:</Text>
          <View direction="row" spacing="sm">
            {(Object.keys(PLAYBACK_PROFILES) as Array<keyof typeof PLAYBACK_PROFILES>).map((profile) => (
              <Button
                key={profile}
                size="sm"
                type={selectedProfile === profile ? 'filled' : 'outlined'}
                onPress={() => setSelectedProfile(profile)}
                disabled={isStreaming}
              >
                {profile}
              </Button>
            ))}
          </View>
        </View>

        {/* Config Info */}
        <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f0f9ff', borderRadius: 6 }}>
          <Text size="sm">
            Sample Rate: <Text weight="medium">{currentConfig.sampleRate}Hz</Text> |
            Channels: <Text weight="medium">{currentConfig.channels}</Text> |
            Bit Depth: <Text weight="medium">{currentConfig.bitDepth}</Text>
          </Text>
        </View>

        {/* Buffer Status */}
        <BufferIndicator buffered={player.status.buffered} />

        {/* Controls */}
        <View direction="row" spacing="sm" style={{ marginTop: 12, justifyContent: 'center' }}>
          <Button
            size="sm"
            intent={isStreaming ? 'danger' : 'primary'}
            onPress={isStreaming ? stopStreaming : startStreaming}
          >
            {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
          </Button>
          <Button
            type="outlined"
            size="sm"
            onPress={feedSampleData}
            disabled={!isStreaming}
          >
            Feed Sample Data
          </Button>
        </View>

        {/* Status */}
        <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f9fafb', borderRadius: 6 }}>
          <Text size="sm" color="secondary">
            State: <Text weight="medium">{player.status.state}</Text>
            {player.error && (
              <Text color="danger"> | Error: {player.error.message}</Text>
            )}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================
// VOICE PLAYBACK DEMO (TTS-style)
// ============================================

export function VoicePlaybackDemo() {
  const player = useAudioPlayer({ autoPlay: true });
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initializeStream = useCallback(async () => {
    try {
      await player.loadPCMStream(PLAYBACK_PROFILES.speech);
      await player.play();
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }, [player]);

  // Simulate receiving PCM data from a TTS API
  const simulateTTSResponse = useCallback(() => {
    if (!isReady) return;

    // Generate a chirp sound to simulate TTS output
    const sampleRate = 16000;
    const duration = 0.5;
    const samples = new Int16Array(sampleRate * duration);

    for (let i = 0; i < samples.length; i++) {
      const t = i / sampleRate;
      // Frequency sweep from 200Hz to 800Hz
      const freq = 200 + (600 * t / duration);
      const value = Math.sin(2 * Math.PI * freq * t) * (1 - t / duration);
      samples[i] = Math.floor(value * 32767);
    }

    player.feedPCMData(samples);
  }, [isReady, player]);

  // Simulate continuous TTS streaming
  const startContinuousStream = useCallback(() => {
    if (!isReady || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const sampleRate = 16000;
      const duration = 0.05; // 50ms chunks
      const samples = new Int16Array(sampleRate * duration);

      // Generate varying frequency tone
      const baseFreq = 300 + Math.random() * 200;
      for (let i = 0; i < samples.length; i++) {
        const t = i / sampleRate;
        const value = Math.sin(2 * Math.PI * baseFreq * t) * 0.5;
        samples[i] = Math.floor(value * 32767);
      }

      player.feedPCMData(samples);
    }, 50);
  }, [isReady, player]);

  const stopContinuousStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    stopContinuousStream();
    player.stop();
    setIsReady(false);
  }, [stopContinuousStream, player]);

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">Voice Playback (TTS-style)</Text>
        <Text size="sm" color="secondary">
          Demonstrates streaming PCM data as it arrives, similar to TTS or AI voice responses.
        </Text>

        {/* Buffer Status */}
        <BufferIndicator buffered={player.status.buffered} />

        {/* Controls */}
        <View direction="row" spacing="sm" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            onPress={initializeStream}
            disabled={isReady}
          >
            Initialize Stream
          </Button>
          <Button
            type="outlined"
            size="sm"
            onPress={simulateTTSResponse}
            disabled={!isReady}
          >
            Single TTS Response
          </Button>
          <Button
            type="outlined"
            size="sm"
            onPress={intervalRef.current ? stopContinuousStream : startContinuousStream}
            disabled={!isReady}
          >
            {intervalRef.current ? 'Stop Continuous' : 'Start Continuous'}
          </Button>
          <Button
            type="ghost"
            size="sm"
            onPress={reset}
          >
            Reset
          </Button>
        </View>

        {/* Status */}
        <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f9fafb', borderRadius: 6 }}>
          <Text size="sm" color="secondary">
            State: <Text weight="medium">{player.status.state}</Text> |
            Ready: <Text weight="medium">{isReady ? 'Yes' : 'No'}</Text>
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================
// CODE EXAMPLES
// ============================================

export function CodeExamples() {
  return (
    <Card>
      <View spacing="lg" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">Usage Examples</Text>

        <View spacing="sm">
          <Text size="md" weight="medium">File Playback</Text>
          <View style={{ backgroundColor: '#1e293b', padding: 12, borderRadius: 8 }}>
            <Text size="sm" style={{ fontFamily: 'monospace', color: '#e2e8f0', whiteSpace: 'pre' }}>
{`import { useAudioPlayer } from '@idealyst/audio-playback';

function Player() {
  const player = useAudioPlayer();

  const playFile = async () => {
    await player.loadFile('/audio/music.mp3');
    await player.play();
  };

  return (
    <Button onPress={player.isPlaying ? player.pause : player.play}>
      {player.isPlaying ? 'Pause' : 'Play'}
    </Button>
  );
}`}
            </Text>
          </View>
        </View>

        <View spacing="sm">
          <Text size="md" weight="medium">PCM Streaming</Text>
          <View style={{ backgroundColor: '#1e293b', padding: 12, borderRadius: 8 }}>
            <Text size="sm" style={{ fontFamily: 'monospace', color: '#e2e8f0', whiteSpace: 'pre' }}>
{`import { useAudioPlayer, PLAYBACK_PROFILES } from '@idealyst/audio-playback';

function VoicePlayer() {
  const player = useAudioPlayer();

  const startStream = async () => {
    await player.loadPCMStream(PLAYBACK_PROFILES.speech);
    await player.play();
  };

  // Feed PCM data as it arrives (e.g., from WebSocket)
  const onPCMData = (pcmData: ArrayBuffer) => {
    player.feedPCMData(pcmData);
  };

  return <Button onPress={startStream}>Start</Button>;
}`}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

// ============================================
// MAIN EXAMPLES SCREEN
// ============================================

export function AudioPlayerExamples() {
  return (
    <Screen scroll>
      <View spacing="lg" padding="md">
        <View spacing="sm">
          <Text size="xl" weight="bold">Audio Playback</Text>
          <Text color="secondary">
            Cross-platform audio playback with support for file playback and PCM streaming.
          </Text>
        </View>

        <FilePlaybackDemo />
        <PCMStreamingDemo />
        <VoicePlaybackDemo />
        <CodeExamples />
      </View>
    </Screen>
  );
}

export default AudioPlayerExamples;
