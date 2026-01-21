import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Card, Screen, Button, Slider } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';
import { useAudioPlayer, PLAYBACK_PROFILES } from '@idealyst/audio-playback';
import type { PlaybackConfig } from '@idealyst/audio-playback';

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

function FilePlaybackDemo() {
  const player = useAudioPlayer();
  const [url, setUrl] = useState('');

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
        <Text size="lg" weight="semibold">File Playback Demo</Text>
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

function PCMStreamingDemo() {
  const player = useAudioPlayer();
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof PLAYBACK_PROFILES>('speech');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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

  // Continuous streaming simulation
  const startContinuousStream = useCallback(() => {
    if (!isStreaming || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const sampleRate = currentConfig.sampleRate;
      const duration = 0.05; // 50ms chunks
      const samples = new Int16Array(sampleRate * duration);

      const baseFreq = 300 + Math.random() * 200;
      for (let i = 0; i < samples.length; i++) {
        const t = i / sampleRate;
        const value = Math.sin(2 * Math.PI * baseFreq * t) * 0.5;
        samples[i] = Math.floor(value * 32767);
      }

      player.feedPCMData(samples);
    }, 50);
  }, [isStreaming, currentConfig, player]);

  const stopContinuousStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">PCM Streaming Demo</Text>
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
        <View direction="row" spacing="sm" style={{ marginTop: 12, flexWrap: 'wrap' }}>
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
          <Button
            type="outlined"
            size="sm"
            onPress={intervalRef.current ? stopContinuousStream : startContinuousStream}
            disabled={!isStreaming}
          >
            {intervalRef.current ? 'Stop Continuous' : 'Start Continuous'}
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
// MAIN PAGE
// ============================================

export function AudioPlaybackPage() {
  return (
    <Screen scroll>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Audio Playback
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform audio playback for React and React Native. Supports file playback
          and real-time PCM streaming for TTS and AI voice responses.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import {
  useAudioPlayer,
  PLAYBACK_PROFILES,
} from '@idealyst/audio-playback';`}
          language="typescript"
          title="Import"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          File Playback
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Load and play audio files from URLs or local paths:
        </Text>

        <CodeBlock
          code={`import { useAudioPlayer } from '@idealyst/audio-playback';

function MusicPlayer() {
  const player = useAudioPlayer();

  const playFile = async (uri: string) => {
    await player.loadFile(uri);
    await player.play();
  };

  return (
    <View>
      <Text>{formatTime(player.position)} / {formatTime(player.duration)}</Text>

      <ProgressBar
        position={player.position}
        duration={player.duration}
        onSeek={player.seek}
      />

      <Button onPress={player.isPlaying ? player.pause : player.play}>
        {player.isPlaying ? 'Pause' : 'Play'}
      </Button>

      <Slider
        value={player.volume}
        onValueChange={player.setVolume}
        minimumValue={0}
        maximumValue={1}
      />
    </View>
  );
}`}
          language="tsx"
          title="File Playback Example"
        />

        <FilePlaybackDemo />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          PCM Streaming
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Stream raw PCM audio data for real-time playback. Perfect for TTS APIs and AI voice responses:
        </Text>

        <CodeBlock
          code={`import { useAudioPlayer, PLAYBACK_PROFILES } from '@idealyst/audio-playback';

function VoicePlayer() {
  const player = useAudioPlayer();

  const startStreaming = async () => {
    // Initialize stream with speech-optimized settings
    await player.loadPCMStream(PLAYBACK_PROFILES.speech);
    await player.play();
  };

  // Feed PCM data as it arrives (e.g., from WebSocket or TTS API)
  const onPCMData = (pcmData: ArrayBuffer | Int16Array) => {
    player.feedPCMData(pcmData);
  };

  // When done streaming, flush any remaining buffered audio
  const onStreamEnd = async () => {
    await player.flush();
  };

  return (
    <View>
      <Text>Buffer: {player.status.buffered}ms</Text>
      <Button onPress={startStreaming}>Start Stream</Button>
    </View>
  );
}`}
          language="tsx"
          title="PCM Streaming Example"
        />

        <PCMStreamingDemo />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          useAudioPlayer Hook
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="status" type="PlayerStatus" description="Full player status object." />
          <PropRow name="isPlaying" type="boolean" description="Whether audio is playing." />
          <PropRow name="isPaused" type="boolean" description="Whether audio is paused." />
          <PropRow name="isLoading" type="boolean" description="Whether loading a source." />
          <PropRow name="position" type="number" description="Current position in ms." />
          <PropRow name="duration" type="number" description="Total duration in ms (0 for streams)." />
          <PropRow name="volume" type="number" description="Current volume (0.0 - 1.0)." />
          <PropRow name="error" type="PlayerError | null" description="Current error if any." />
          <PropRow name="loadFile" type="(uri: string) => Promise" description="Load an audio file." />
          <PropRow name="loadPCMStream" type="(config: PlaybackConfig) => Promise" description="Initialize PCM streaming." />
          <PropRow name="unload" type="() => void" description="Unload current source." />
          <PropRow name="feedPCMData" type="(data: ArrayBuffer | Int16Array) => void" description="Feed PCM data to stream." />
          <PropRow name="flush" type="() => Promise" description="Flush remaining buffered audio." />
          <PropRow name="play" type="() => Promise" description="Start or resume playback." />
          <PropRow name="pause" type="() => void" description="Pause playback." />
          <PropRow name="stop" type="() => void" description="Stop playback." />
          <PropRow name="seek" type="(positionMs: number) => Promise" description="Seek to position." />
          <PropRow name="setVolume" type="(volume: number) => void" description="Set volume (0.0 - 1.0)." />
          <PropRow name="toggleMute" type="() => void" description="Toggle mute state." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Playback Profiles
        </Text>

        <CodeBlock
          code={`import { PLAYBACK_PROFILES } from '@idealyst/audio-playback';

// Pre-configured profiles for common use cases
PLAYBACK_PROFILES.speech   // 16kHz, mono, 16-bit (TTS, voice)
PLAYBACK_PROFILES.phone    // 8kHz, mono, 16-bit (telephony)
PLAYBACK_PROFILES.highQuality  // 44.1kHz, stereo, 16-bit (music)
PLAYBACK_PROFILES.studio   // 48kHz, stereo, 16-bit (professional)

// Custom configuration
const customConfig: PlaybackConfig = {
  sampleRate: 22050,
  channels: 1,
  bitDepth: 16,
};`}
          language="typescript"
          title="Playback Profiles"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Player States
        </Text>

        <CodeBlock
          code={`type PlayerState =
  | 'idle'      // No source loaded
  | 'loading'   // Loading source
  | 'ready'     // Source loaded, ready to play
  | 'playing'   // Currently playing
  | 'paused'    // Playback paused
  | 'stopped'   // Playback stopped
  | 'error';    // Error occurred

// Check state
if (player.status.state === 'playing') {
  // Audio is playing
}

// Or use convenience booleans
if (player.isPlaying) { /* ... */ }
if (player.isPaused) { /* ... */ }
if (player.isLoading) { /* ... */ }`}
          language="typescript"
          title="Player States"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Error Handling
        </Text>

        <CodeBlock
          code={`const { error } = useAudioPlayer();

// Error codes:
// 'SOURCE_NOT_FOUND'      - Audio file not found
// 'FORMAT_NOT_SUPPORTED'  - Unsupported audio format
// 'DECODE_ERROR'          - Failed to decode audio
// 'PLAYBACK_ERROR'        - Error during playback
// 'BUFFER_UNDERRUN'       - Buffer ran empty (streaming)
// 'INITIALIZATION_FAILED' - Failed to initialize audio
// 'UNKNOWN'               - Unknown error

if (error) {
  switch (error.code) {
    case 'SOURCE_NOT_FOUND':
      // File doesn't exist
      break;
    case 'BUFFER_UNDERRUN':
      // Feed more PCM data
      break;
    default:
      console.error(error.message);
  }
}`}
          language="tsx"
          title="Error Handling"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Platform Differences
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Web
            </Text>
            <Text typography="body2" color="tertiary">
              Uses Web Audio API with AudioWorklet for low-latency PCM streaming.
              File playback uses decodeAudioData for full format support.
              Supports mp3, wav, ogg, and other web-compatible formats.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              React Native
            </Text>
            <Text typography="body2" color="tertiary">
              Uses react-native-audio-api (Web Audio API polyfill) for consistent
              cross-platform behavior. Supports native audio formats.
              Requires react-native-audio-api peer dependency.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          WebSocket TTS Integration
        </Text>

        <CodeBlock
          code={`import { useAudioPlayer, PLAYBACK_PROFILES } from '@idealyst/audio-playback';

function TTSPlayer() {
  const player = useAudioPlayer();
  const wsRef = useRef<WebSocket | null>(null);

  const connectTTS = async () => {
    // Initialize player for speech
    await player.loadPCMStream(PLAYBACK_PROFILES.speech);
    await player.play();

    // Connect to TTS WebSocket
    const ws = new WebSocket('wss://api.example.com/tts');
    wsRef.current = ws;

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Feed PCM data directly to player
        player.feedPCMData(event.data);
      }
    };

    ws.onclose = async () => {
      // Flush remaining audio when stream ends
      await player.flush();
    };
  };

  const sendText = (text: string) => {
    wsRef.current?.send(JSON.stringify({ text }));
  };

  return (
    <View>
      <Button onPress={connectTTS}>Connect</Button>
      <Button onPress={() => sendText('Hello world!')}>
        Speak
      </Button>
    </View>
  );
}`}
          language="tsx"
          title="WebSocket TTS Integration"
        />
      </View>
    </Screen>
  );
}

function PropRow({
  name,
  type,
  description,
}: {
  name: string;
  type: string;
  description: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
    >
      <View style={{ width: 180 }}>
        <Text weight="semibold" style={{ fontFamily: 'monospace' }}>
          {name}
        </Text>
      </View>
      <View style={{ width: 200 }}>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {type}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text typography="body2" color="tertiary">
          {description}
        </Text>
      </View>
    </View>
  );
}
