/**
 * Audio Package Guides
 *
 * Comprehensive documentation for @idealyst/audio.
 * PCM audio streaming & playback — NOT file-based recording.
 */

export const audioGuides: Record<string, string> = {
  "idealyst://audio/overview": `# @idealyst/audio

Cross-platform **PCM audio streaming** package for React and React Native.

> **Important:** This package provides real-time PCM streaming — it does NOT record to files.
> \`recorder.stop()\` returns \`void\`. Audio data arrives via \`subscribeToData()\` callbacks as binary PCM chunks.

## Installation

\`\`\`bash
yarn add @idealyst/audio
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ WebAudio API |
| iOS      | ✅ AVAudioEngine |
| Android  | ✅ AudioRecord |

## Key Concepts

1. **PCM Streaming** — Audio data is delivered as \`PCMData\` chunks via callbacks, not as files
2. **Audio Session** — On iOS/Android, configure the audio session category before recording/playback
3. **Audio Profiles** — Pre-configured \`AudioConfig\` presets: \`speech\`, \`highQuality\`, \`studio\`, \`phone\`
4. **Session Presets** — Pre-configured \`AudioSessionConfig\` presets: \`playback\`, \`record\`, \`voiceChat\`, \`ambient\`, \`default\`

## Exports

\`\`\`typescript
import {
  useRecorder,
  usePlayer,
  useAudio,
  AUDIO_PROFILES,
  SESSION_PRESETS,
} from '@idealyst/audio';
import type { PCMData, AudioConfig, AudioLevel } from '@idealyst/audio';
\`\`\`
`,

  "idealyst://audio/api": `# @idealyst/audio — API Reference

## Hooks

### useRecorder(options?)

PCM streaming recorder hook.

\`\`\`typescript
interface UseRecorderOptions {
  config?: Partial<AudioConfig>;       // Audio config (sample rate, channels, bit depth)
  autoRequestPermission?: boolean;     // Auto-request mic permission on mount
  levelUpdateInterval?: number;        // Level update interval in ms (default: 100)
}
\`\`\`

**Returns \`UseRecorderResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| status | RecorderStatus | Full status object |
| isRecording | boolean | Whether recording is active |
| isPaused | boolean | Whether recording is paused |
| permission | PermissionStatus | \`'undetermined' \\| 'granted' \\| 'denied' \\| 'blocked'\` |
| duration | number | Recording duration in ms |
| level | AudioLevel | Current audio level (\`{ current, peak, rms, db }\`) |
| error | AudioError \\| null | Current error |
| start | (config?) => Promise<void> | Start recording |
| stop | () => Promise<void> | **Stop recording — returns void, NOT audio data** |
| pause | () => Promise<void> | Pause recording |
| resume | () => Promise<void> | Resume recording |
| checkPermission | () => Promise<PermissionStatus> | Check mic permission |
| requestPermission | () => Promise<PermissionStatus> | Request mic permission |
| subscribeToData | (cb: RecorderDataCallback) => () => void | **Subscribe to PCM data chunks** |
| resetPeakLevel | () => void | Reset peak level meter |

> **Critical:** \`stop()\` returns \`Promise<void>\` — it does NOT return recorded audio.
> You MUST use \`subscribeToData()\` to collect PCM data chunks during recording.

---

### usePlayer(options?)

Audio playback hook supporting both file playback and PCM streaming.

\`\`\`typescript
interface UsePlayerOptions {
  autoPlay?: boolean;              // Auto-play when source loaded
  volume?: number;                 // Initial volume (0.0 - 1.0)
  positionUpdateInterval?: number; // Position update interval in ms (default: 100)
}
\`\`\`

**Returns \`UsePlayerResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| status | PlayerStatus | Full status object |
| isPlaying | boolean | Whether playback is active |
| isPaused | boolean | Whether playback is paused |
| isLoading | boolean | Whether source is loading |
| position | number | Current position in ms |
| duration | number | Total duration in ms |
| volume | number | Current volume (0.0 - 1.0) |
| error | AudioError \\| null | Current error |
| loadFile | (uri: string) => Promise<void> | Load audio file for playback |
| unload | () => void | Unload current source |
| loadPCMStream | (config: AudioConfig) => Promise<void> | **Start PCM streaming playback** |
| feedPCMData | (data: ArrayBufferLike \\| Int16Array) => void | **Feed PCM data — NOT strings** |
| flush | () => Promise<void> | Flush remaining buffered data |
| clearBuffer | () => void | Clear playback buffer |
| play | () => Promise<void> | Start/resume playback |
| pause | () => void | Pause playback |
| stop | () => void | Stop playback |
| seek | (positionMs: number) => Promise<void> | Seek to position |
| setVolume | (volume: number) => void | Set volume |
| toggleMute | () => void | Toggle mute |

> **Critical:** \`feedPCMData()\` accepts \`ArrayBufferLike | Int16Array\` — **NOT strings or base64**.

---

### useAudio(options?)

Audio session management hook (primarily for iOS/Android).

\`\`\`typescript
interface UseAudioOptions {
  session?: Partial<AudioSessionConfig>;  // Session config
  initializeOnMount?: boolean;            // Initialize on mount (default: true)
}
\`\`\`

**Returns \`UseAudioResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| isInitialized | boolean | Whether audio context is ready |
| sessionState | AudioSessionState | Current session state |
| outputs | string[] | Current audio outputs |
| initialize | () => Promise<void> | Initialize audio context |
| configureSession | (config) => Promise<void> | Configure audio session |
| suspend | () => Promise<void> | Suspend audio context |
| resume | () => Promise<void> | Resume audio context |

---

## Types

### AudioConfig

\`\`\`typescript
type SampleRate = 8000 | 16000 | 22050 | 24000 | 44100 | 48000;
type BitDepth = 8 | 16 | 32;
type ChannelCount = 1 | 2;

interface AudioConfig {
  sampleRate: SampleRate;   // Default: 16000
  channels: ChannelCount;   // Default: 1 (mono)
  bitDepth: BitDepth;       // Default: 16
}
\`\`\`

### PCMData

\`\`\`typescript
interface PCMData {
  buffer: ArrayBufferLike;                         // Raw audio buffer
  samples: Int8Array | Int16Array | Float32Array;  // Typed sample array
  timestamp: number;                               // Capture timestamp
  config: AudioConfig;                             // Audio config used
  toBase64(): string;                              // For external APIs (e.g., speech-to-text HTTP). Do NOT pass to feedPCMData().
}
\`\`\`

### AudioLevel

\`\`\`typescript
interface AudioLevel {
  current: number;  // 0.0 - 1.0
  peak: number;     // 0.0 - 1.0
  rms: number;      // Root mean square
  db: number;       // Decibel value (-Infinity to 0)
}
\`\`\`

### AudioSessionConfig (iOS/Android)

\`\`\`typescript
type AudioSessionCategory = 'ambient' | 'soloAmbient' | 'playback' | 'record' | 'playAndRecord' | 'multiRoute';
type AudioSessionMode = 'default' | 'voiceChat' | 'gameChat' | 'videoRecording' | 'measurement' | 'moviePlayback' | 'videoChat' | 'spokenAudio';

interface AudioSessionConfig {
  category: AudioSessionCategory;
  categoryOptions?: AudioSessionCategoryOption[];
  mode?: AudioSessionMode;
  active?: boolean;
}
\`\`\`

### Error Types

\`\`\`typescript
type AudioErrorCode =
  | 'PERMISSION_DENIED' | 'PERMISSION_BLOCKED'
  | 'DEVICE_NOT_FOUND' | 'DEVICE_IN_USE' | 'NOT_SUPPORTED'
  | 'SOURCE_NOT_FOUND' | 'FORMAT_NOT_SUPPORTED' | 'DECODE_ERROR' | 'PLAYBACK_ERROR' | 'BUFFER_UNDERRUN'
  | 'RECORDING_ERROR'
  | 'INITIALIZATION_FAILED' | 'INVALID_STATE' | 'INVALID_CONFIG' | 'UNKNOWN';

interface AudioError {
  code: AudioErrorCode;
  message: string;
  originalError?: Error;
}
\`\`\`

---

## Presets

### AUDIO_PROFILES

\`\`\`typescript
const AUDIO_PROFILES: AudioProfiles = {
  speech:      { sampleRate: 16000, channels: 1, bitDepth: 16 },
  highQuality: { sampleRate: 44100, channels: 2, bitDepth: 16 },
  studio:      { sampleRate: 48000, channels: 2, bitDepth: 32 },
  phone:       { sampleRate: 8000,  channels: 1, bitDepth: 16 },
};
\`\`\`

### SESSION_PRESETS

\`\`\`typescript
const SESSION_PRESETS: SessionPresets = {
  playback:  { category: 'playback', mode: 'default' },
  record:    { category: 'record', mode: 'default' },
  voiceChat: { category: 'playAndRecord', mode: 'voiceChat', categoryOptions: ['allowBluetooth', 'defaultToSpeaker'] },
  ambient:   { category: 'ambient', mode: 'default' },
  default:   { category: 'soloAmbient', mode: 'default' },
};
\`\`\`
`,

  "idealyst://audio/examples": `# @idealyst/audio — Examples

## Basic Recording with Data Collection

\`\`\`tsx
import React, { useRef, useEffect } from 'react';
import { View, Button, Text } from '@idealyst/components';
import { useRecorder, AUDIO_PROFILES } from '@idealyst/audio';
import type { PCMData } from '@idealyst/audio';

function VoiceRecorder() {
  const recorder = useRecorder({ config: AUDIO_PROFILES.speech });
  const chunksRef = useRef<ArrayBuffer[]>([]);

  // Subscribe to PCM data
  useEffect(() => {
    const unsubscribe = recorder.subscribeToData((data: PCMData) => {
      chunksRef.current.push(data.buffer as ArrayBuffer);
    });
    return unsubscribe;
  }, [recorder.subscribeToData]);

  const handleToggle = async () => {
    if (recorder.isRecording) {
      await recorder.stop(); // Returns void — data already collected via subscribeToData
      console.log(\`Collected \${chunksRef.current.length} chunks\`);
    } else {
      chunksRef.current = [];
      await recorder.start();
    }
  };

  return (
    <View padding="md" gap="md">
      <Button
        onPress={handleToggle}
        intent={recorder.isRecording ? 'error' : 'primary'}
      >
        {recorder.isRecording ? 'Stop' : 'Record'}
      </Button>
      <Text>Duration: {Math.round(recorder.duration / 1000)}s</Text>
      <Text>Level: {Math.round(recorder.level.current * 100)}%</Text>
    </View>
  );
}
\`\`\`

## PCM Streaming Playback

\`\`\`tsx
import React, { useRef, useEffect } from 'react';
import { View, Button, Text } from '@idealyst/components';
import { useRecorder, usePlayer, AUDIO_PROFILES } from '@idealyst/audio';
import type { PCMData } from '@idealyst/audio';

function RecordAndPlayback() {
  const recorder = useRecorder({ config: AUDIO_PROFILES.speech });
  const player = usePlayer();
  const chunksRef = useRef<ArrayBuffer[]>([]);

  useEffect(() => {
    const unsubscribe = recorder.subscribeToData((data: PCMData) => {
      chunksRef.current.push(data.buffer as ArrayBuffer);
    });
    return unsubscribe;
  }, [recorder.subscribeToData]);

  const handleRecord = async () => {
    if (recorder.isRecording) {
      await recorder.stop();
    } else {
      chunksRef.current = [];
      await recorder.start();
    }
  };

  const handlePlayback = async () => {
    // Initialize PCM streaming playback with the same config
    await player.loadPCMStream(AUDIO_PROFILES.speech);
    await player.play();

    // Feed all collected chunks
    for (const chunk of chunksRef.current) {
      player.feedPCMData(chunk); // Accepts ArrayBufferLike — NOT strings
    }

    await player.flush(); // Flush remaining buffer
  };

  return (
    <View padding="md" gap="md">
      <Button onPress={handleRecord} intent={recorder.isRecording ? 'error' : 'primary'}>
        {recorder.isRecording ? 'Stop Recording' : 'Record'}
      </Button>
      <Button
        onPress={handlePlayback}
        intent="secondary"
        disabled={chunksRef.current.length === 0 || player.isPlaying}
      >
        Play Back
      </Button>
    </View>
  );
}
\`\`\`

## File Playback

\`\`\`tsx
import React from 'react';
import { View, Button, Text, Progress } from '@idealyst/components';
import { usePlayer } from '@idealyst/audio';

function AudioFilePlayer({ uri }: { uri: string }) {
  const player = usePlayer();

  const handleLoad = async () => {
    await player.loadFile(uri);
    await player.play();
  };

  const progress = player.duration > 0 ? player.position / player.duration : 0;

  return (
    <View padding="md" gap="md">
      <Button onPress={handleLoad} disabled={player.isPlaying}>
        Play File
      </Button>
      <Progress value={progress * 100} />
      <Text>
        {Math.round(player.position / 1000)}s / {Math.round(player.duration / 1000)}s
      </Text>
      <View style={{ flexDirection: 'row' }} gap="sm">
        <Button onPress={() => player.pause()} disabled={!player.isPlaying} size="sm">
          Pause
        </Button>
        <Button onPress={() => player.stop()} size="sm">
          Stop
        </Button>
      </View>
    </View>
  );
}
\`\`\`

## Audio Session Setup (iOS/Android)

\`\`\`tsx
import React, { useEffect } from 'react';
import { useAudio, useRecorder, SESSION_PRESETS, AUDIO_PROFILES } from '@idealyst/audio';

function VoiceChatScreen() {
  const audio = useAudio({ session: SESSION_PRESETS.voiceChat });
  const recorder = useRecorder({ config: AUDIO_PROFILES.speech });

  useEffect(() => {
    // Audio session is automatically configured on mount
    // For manual configuration:
    audio.configureSession({
      category: 'playAndRecord',
      mode: 'voiceChat',
      categoryOptions: ['allowBluetooth', 'defaultToSpeaker'],
    });
  }, []);

  // ... recording/playback logic
}
\`\`\`

## Audio Level Visualization

\`\`\`tsx
import React from 'react';
import { View, Text } from '@idealyst/components';
import { useRecorder, AUDIO_PROFILES } from '@idealyst/audio';

function AudioLevelMeter() {
  const recorder = useRecorder({
    config: AUDIO_PROFILES.speech,
    autoRequestPermission: true,
  });

  return (
    <View padding="md" gap="sm">
      <Text>Level: {Math.round(recorder.level.current * 100)}%</Text>
      <Text>Peak: {Math.round(recorder.level.peak * 100)}%</Text>
      <Text>dB: {recorder.level.db.toFixed(1)}</Text>
      <View
        style={{
          height: 20,
          backgroundColor: '#e0e0e0',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: \`\${recorder.level.current * 100}%\`,
            height: '100%',
            backgroundColor: recorder.level.current > 0.8 ? 'red' : 'green',
          }}
        />
      </View>
    </View>
  );
}
\`\`\`
`,
};
