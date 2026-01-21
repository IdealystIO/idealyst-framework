# @idealyst/audio-playback

Cross-platform audio playback for React and React Native with PCM streaming support.

## Features

- **Cross-platform**: Works on web (Web Audio API) and React Native (react-native-audio-api)
- **PCM Streaming**: Stream raw PCM16 audio data at various sample rates (ideal for TTS, AI voice)
- **File Playback**: Load and play audio files (mp3, wav, etc.)
- **React Hooks**: Simple `useAudioPlayer` hook for easy integration
- **Volume Control**: Full volume and mute support
- **Playback Controls**: Play, pause, stop, seek
- **TypeScript**: Full type definitions included

## Installation

```bash
# Using yarn
yarn add @idealyst/audio-playback

# Using npm
npm install @idealyst/audio-playback
```

### React Native Additional Setup

For React Native, you need to install the native audio library:

```bash
yarn add react-native-audio-api
```

## Quick Start

### File Playback

```tsx
import { useAudioPlayer } from '@idealyst/audio-playback';

function MusicPlayer() {
  const player = useAudioPlayer();

  const playMusic = async () => {
    await player.loadFile('/audio/music.mp3');
    await player.play();
  };

  return (
    <View>
      <Text>{player.position}ms / {player.duration}ms</Text>
      <Button onPress={playMusic}>Load & Play</Button>
      <Button onPress={player.isPlaying ? player.pause : player.play}>
        {player.isPlaying ? 'Pause' : 'Play'}
      </Button>
      <Button onPress={player.stop}>Stop</Button>
    </View>
  );
}
```

### PCM Streaming (for TTS/AI Voice)

```tsx
import { useAudioPlayer, PLAYBACK_PROFILES } from '@idealyst/audio-playback';

function VoicePlayback() {
  const player = useAudioPlayer();

  // Initialize the stream
  const startStreaming = async () => {
    await player.loadPCMStream(PLAYBACK_PROFILES.speech); // 16kHz mono
    await player.play();
  };

  // Feed PCM data as it arrives (e.g., from WebSocket, TTS API)
  const handlePCMData = (pcmData: ArrayBuffer | Int16Array) => {
    player.feedPCMData(pcmData);
  };

  // When done streaming, flush remaining data
  const finishStreaming = async () => {
    await player.flush();
    player.stop();
  };

  return (
    <Button onPress={startStreaming}>Start Voice Playback</Button>
  );
}
```

### With Auto-Play

```tsx
import { useAudioPlayer } from '@idealyst/audio-playback';

function AutoPlayer({ audioUrl }) {
  const player = useAudioPlayer({ autoPlay: true });

  useEffect(() => {
    player.loadFile(audioUrl);
  }, [audioUrl]);

  return <Text>Playing: {player.isPlaying ? 'Yes' : 'No'}</Text>;
}
```

## API Reference

### useAudioPlayer Hook

```typescript
const player = useAudioPlayer(options?: UseAudioPlayerOptions);
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoPlay` | `boolean` | `false` | Auto-play when source is loaded |
| `volume` | `number` | `1.0` | Initial volume (0.0 - 1.0) |
| `positionUpdateInterval` | `number` | `100` | Position update interval in ms |

#### Return Value

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `status` | `PlayerStatus` | Full player status object |
| `isPlaying` | `boolean` | Whether audio is playing |
| `isPaused` | `boolean` | Whether audio is paused |
| `isLoading` | `boolean` | Whether source is loading |
| `position` | `number` | Current position in ms |
| `duration` | `number` | Total duration in ms (0 for streams) |
| `volume` | `number` | Current volume (0.0 - 1.0) |
| `error` | `PlayerError \| null` | Current error if any |
| `loadFile(uri)` | `Promise<void>` | Load audio file |
| `loadPCMStream(config)` | `Promise<void>` | Initialize PCM streaming |
| `unload()` | `void` | Unload current source |
| `feedPCMData(data)` | `void` | Feed PCM data for streaming |
| `flush()` | `Promise<void>` | Flush buffered PCM data |
| `play()` | `Promise<void>` | Start/resume playback |
| `pause()` | `void` | Pause playback |
| `stop()` | `void` | Stop playback |
| `seek(positionMs)` | `Promise<void>` | Seek to position |
| `setVolume(volume)` | `void` | Set volume |
| `toggleMute()` | `void` | Toggle mute state |

### Playback Profiles

Pre-configured audio settings for common use cases:

```typescript
import { PLAYBACK_PROFILES } from '@idealyst/audio-playback';

// Speech/Voice (TTS, AI assistants)
PLAYBACK_PROFILES.speech    // 16kHz, mono, 16-bit

// High Quality Music
PLAYBACK_PROFILES.highQuality // 44.1kHz, stereo, 16-bit

// Studio Quality
PLAYBACK_PROFILES.studio    // 48kHz, stereo, 16-bit

// Phone Quality
PLAYBACK_PROFILES.phone     // 8kHz, mono, 16-bit
```

### Custom Configuration

```typescript
import { PlaybackConfig } from '@idealyst/audio-playback';

const customConfig: PlaybackConfig = {
  sampleRate: 22050,
  channels: 1,
  bitDepth: 16,
};

await player.loadPCMStream(customConfig);
```

## Utility Functions

The package exports several utility functions for audio processing:

```typescript
import {
  int16ToFloat32,
  float32ToInt16,
  pcmToFloat32,
  resampleLinear,
  monoToStereo,
  stereoToMono,
  samplesToDuration,
  durationToSamples,
} from '@idealyst/audio-playback';
```

## Platform Differences

### Web
- Uses Web Audio API with AudioWorklet for low-latency PCM streaming
- File playback uses `fetch` + `decodeAudioData`
- Supports all modern browsers

### React Native
- Uses `react-native-audio-api` for Web Audio API compatibility
- PCM streaming uses scheduled AudioBufferSourceNodes
- Requires native module installation

## Examples

See the [examples](./src/examples) directory for complete working examples:

- `FilePlaybackDemo` - Loading and playing audio files
- `PCMStreamingDemo` - Streaming raw PCM audio
- `VoicePlaybackDemo` - TTS-style voice playback

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  PlaybackConfig,
  PlayerStatus,
  PlayerState,
  PlayerError,
  UseAudioPlayerOptions,
  UseAudioPlayerResult,
} from '@idealyst/audio-playback';
```

## License

MIT
