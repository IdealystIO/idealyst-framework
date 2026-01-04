# @idealyst/microphone

Cross-platform microphone streaming library for React and React Native. Provides low-level access to raw PCM audio samples for real-time processing, speech recognition, audio visualization, and file recording.

## Installation

```bash
# npm
npm install @idealyst/microphone

# yarn
yarn add @idealyst/microphone
```

### React Native Setup

For React Native, you also need to install the native audio streaming library:

```bash
yarn add react-native-live-audio-stream
```

#### iOS

```bash
cd ios && pod install
```

Add microphone permission to `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to your microphone to record audio.</string>
```

#### Android

Add permission to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Quick Start

### Streaming Audio Data

```tsx
import { useMicrophone, AUDIO_PROFILES } from '@idealyst/microphone';

function VoiceInput() {
  const {
    isRecording,
    level,
    start,
    stop,
    subscribeToAudioData
  } = useMicrophone({
    config: AUDIO_PROFILES.speech,
    autoRequestPermission: true,
  });

  useEffect(() => {
    if (!isRecording) return;

    return subscribeToAudioData((pcmData) => {
      // Process raw PCM samples
      console.log('Got', pcmData.samples.length, 'samples');

      // Send to speech recognition API
      sendToWhisperAPI(pcmData.buffer);
    });
  }, [isRecording, subscribeToAudioData]);

  return (
    <View>
      <Button onPress={isRecording ? stop : start}>
        {isRecording ? 'Stop' : 'Start'}
      </Button>
      <Text>Level: {Math.round(level.current * 100)}%</Text>
    </View>
  );
}
```

### Recording to File

```tsx
import { useRecorder } from '@idealyst/microphone';

function AudioRecorder() {
  const { isRecording, duration, startRecording, stopRecording } = useRecorder();

  const handleStop = async () => {
    const result = await stopRecording();

    // Get ArrayBuffer for upload
    const data = await result.getArrayBuffer();
    await uploadAudio(data);
  };

  return (
    <View>
      <Text>Duration: {Math.floor(duration / 1000)}s</Text>
      <Button onPress={isRecording ? handleStop : () => startRecording()}>
        {isRecording ? 'Stop' : 'Record'}
      </Button>
    </View>
  );
}
```

## Audio Profiles

Pre-configured profiles for common use cases:

```typescript
import { AUDIO_PROFILES } from '@idealyst/microphone';

// Speech recognition (Whisper, Google STT, etc.)
AUDIO_PROFILES.speech     // 16kHz mono 16-bit

// Music and high-quality audio
AUDIO_PROFILES.highQuality // 44.1kHz stereo 16-bit

// Real-time feedback with minimal latency
AUDIO_PROFILES.lowLatency  // 16kHz mono, 256 buffer

// Minimal bandwidth for voice calls
AUDIO_PROFILES.minimal     // 8kHz mono 8-bit
```

## API Reference

### useMicrophone Hook

```typescript
const {
  // State
  status,          // Full MicrophoneStatus object
  isRecording,     // boolean
  isPaused,        // boolean (native only)
  level,           // AudioLevel { current, peak, rms, db }
  error,           // MicrophoneError | null
  permission,      // PermissionStatus

  // Actions
  start,           // (config?) => Promise<void>
  stop,            // () => Promise<void>
  pause,           // () => Promise<void> (native only)
  resume,          // () => Promise<void> (native only)
  requestPermission, // () => Promise<PermissionResult>
  resetPeakLevel,  // () => void

  // Data subscription
  subscribeToAudioData, // (callback) => unsubscribe
} = useMicrophone(options);
```

### useRecorder Hook

```typescript
const {
  isRecording,     // boolean
  duration,        // number (ms)
  error,           // MicrophoneError | null

  startRecording,  // (options?) => Promise<void>
  stopRecording,   // () => Promise<RecordingResult>
  cancelRecording, // () => Promise<void>
} = useRecorder(options);
```

### PCMData Type

```typescript
interface PCMData {
  buffer: ArrayBuffer;      // Raw PCM data
  samples: TypedArray;      // Int8Array | Int16Array | Float32Array
  timestamp: number;        // Capture time (ms since epoch)
  config: AudioConfig;      // Audio configuration
}
```

### AudioLevel Type

```typescript
interface AudioLevel {
  current: number;  // 0.0 - 1.0
  peak: number;     // 0.0 - 1.0 (since last reset)
  rms: number;      // Root mean square
  db: number;       // Decibels (-Infinity to 0)
}
```

### RecordingResult Type

```typescript
interface RecordingResult {
  uri: string;                    // Blob URL (web) or data URI (native)
  duration: number;               // Duration in ms
  size: number;                   // File size in bytes
  config: AudioConfig;            // Audio config used
  format: 'wav' | 'raw';          // Recording format

  getArrayBuffer(): Promise<ArrayBuffer>;  // For upload/processing
  getData(): Promise<Blob | string>;       // Blob (web) or base64 (native)
}
```

## Platform Notes

### Web
- Uses Web Audio API with AudioWorklet for low-latency processing
- Float32 samples internally, converted to requested bit depth
- Pause is not supported (stops the stream)

### React Native
- Uses `react-native-live-audio-stream` for audio capture
- 32-bit float not supported (falls back to 16-bit)
- Pause/resume supported on native

## License

MIT
