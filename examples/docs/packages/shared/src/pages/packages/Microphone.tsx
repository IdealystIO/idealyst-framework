import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function MicrophonePage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Microphone
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform microphone access for audio streaming and recording. Provides
          real-time PCM data for speech processing, audio visualization, and file recording.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import {
  useMicrophone,
  useRecorder,
  checkPermission,
  requestPermission,
} from '@idealyst/microphone';`}
          language="typescript"
          title="Import"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Audio Streaming
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Use useMicrophone for real-time audio data (e.g., speech recognition, live processing):
        </Text>

        <CodeBlock
          code={`import { useMicrophone } from '@idealyst/microphone';

function AudioVisualizer() {
  const {
    isRecording,
    level,
    error,
    permission,
    start,
    stop,
    requestPermission,
    subscribeToAudioData,
  } = useMicrophone({
    config: {
      sampleRate: 16000, // Good for speech
      channels: 1,       // Mono
      bitDepth: 16,
    },
    autoRequestPermission: true,
    levelUpdateInterval: 50, // Update level every 50ms
  });

  // Subscribe to raw audio data
  useEffect(() => {
    if (!isRecording) return;

    const unsubscribe = subscribeToAudioData((pcmData) => {
      // Process raw PCM audio data
      console.log('Audio samples:', pcmData.samples.length);
      console.log('Timestamp:', pcmData.timestamp);

      // Send to speech recognition API, etc.
      // sendToSpeechAPI(pcmData.toBase64());
    });

    return unsubscribe;
  }, [isRecording, subscribeToAudioData]);

  return (
    <View>
      {/* Audio level meter */}
      <View style={{ height: 20, backgroundColor: '#e5e7eb' }}>
        <View
          style={{
            height: '100%',
            width: \`\${level.current * 100}%\`,
            backgroundColor: level.current > 0.8 ? '#ef4444' : '#22c55e',
          }}
        />
      </View>

      <Text>Level: {(level.current * 100).toFixed(0)}%</Text>
      <Text>Peak: {(level.peak * 100).toFixed(0)}%</Text>
      <Text>dB: {level.db.toFixed(1)}</Text>

      <Button onPress={isRecording ? stop : start}>
        {isRecording ? 'Stop' : 'Start'} Streaming
      </Button>
    </View>
  );
}`}
          language="tsx"
          title="Real-time Audio Streaming"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          useMicrophone Hook
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="status" type="MicrophoneStatus" description="Full microphone status." />
          <PropRow name="isRecording" type="boolean" description="Whether streaming is active." />
          <PropRow name="isPaused" type="boolean" description="Whether paused (native only)." />
          <PropRow name="level" type="AudioLevel" description="Current audio level metrics." />
          <PropRow name="error" type="MicrophoneError | null" description="Current error if any." />
          <PropRow name="permission" type="PermissionStatus" description="Permission status." />
          <PropRow name="start" type="(config?) => Promise" description="Start streaming." />
          <PropRow name="stop" type="() => Promise" description="Stop streaming." />
          <PropRow name="subscribeToAudioData" type="(callback) => () => void" description="Subscribe to PCM data." />
          <PropRow name="requestPermission" type="() => Promise" description="Request permissions." />
          <PropRow name="resetPeakLevel" type="() => void" description="Reset peak level meter." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          File Recording
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Use useRecorder to save audio to a WAV file:
        </Text>

        <CodeBlock
          code={`import { useRecorder } from '@idealyst/microphone';

function VoiceRecorder() {
  const {
    isRecording,
    duration,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useRecorder();

  const handleStart = async () => {
    await startRecording({
      format: 'wav',
      audioConfig: {
        sampleRate: 44100,
        channels: 1,
        bitDepth: 16,
      },
      maxDuration: 60, // 60 second limit
    });
  };

  const handleStop = async () => {
    const recording = await stopRecording();
    console.log('Recording saved:', recording.uri);
    console.log('Duration:', recording.duration, 'ms');
    console.log('Size:', recording.size, 'bytes');

    // Get as ArrayBuffer for upload
    const buffer = await recording.getArrayBuffer();

    // Or as Blob (web) / base64 (native)
    const data = await recording.getData();
  };

  // Format duration display
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <View>
      <Text typography="h3">{formatTime(duration)}</Text>

      {!isRecording ? (
        <Button intent="primary" onPress={handleStart}>
          Start Recording
        </Button>
      ) : (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Button intent="success" onPress={handleStop}>
            Save Recording
          </Button>
          <Button type="outlined" onPress={cancelRecording}>
            Cancel
          </Button>
        </View>
      )}
    </View>
  );
}`}
          language="tsx"
          title="WAV File Recording"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          useRecorder Hook
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="isRecording" type="boolean" description="Whether recording to file." />
          <PropRow name="duration" type="number" description="Recording duration in ms." />
          <PropRow name="error" type="MicrophoneError | null" description="Current error if any." />
          <PropRow name="startRecording" type="(options?) => Promise" description="Start recording to file." />
          <PropRow name="stopRecording" type="() => Promise<RecordingResult>" description="Stop and get result." />
          <PropRow name="cancelRecording" type="() => Promise" description="Cancel without saving." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Audio Configuration
        </Text>

        <CodeBlock
          code={`interface AudioConfig {
  // Sample rate in Hz
  sampleRate: 8000 | 16000 | 22050 | 44100 | 48000;

  // Number of channels (1 = mono, 2 = stereo)
  channels: 1 | 2;

  // Bits per sample
  bitDepth: 8 | 16 | 32;

  // Buffer size (samples per callback)
  // Lower = more responsive, higher CPU
  // Higher = less CPU, more latency
  bufferSize: number; // 256, 512, 1024, 2048, 4096
}

// Common configurations
const speechConfig = {
  sampleRate: 16000,
  channels: 1,
  bitDepth: 16,
  bufferSize: 4096,
};

const musicConfig = {
  sampleRate: 44100,
  channels: 2,
  bitDepth: 16,
  bufferSize: 2048,
};`}
          language="typescript"
          title="Audio Configuration"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          PCM Data
        </Text>

        <CodeBlock
          code={`subscribeToAudioData((pcmData) => {
  // Raw audio buffer
  const buffer: ArrayBuffer = pcmData.buffer;

  // Typed array for sample access
  const samples: Int16Array = pcmData.samples; // Based on bitDepth

  // Capture timestamp
  const timestamp: number = pcmData.timestamp;

  // Audio config used
  const config: AudioConfig = pcmData.config;

  // Convert to different formats
  const base64 = pcmData.toBase64();
  const blob = await pcmData.toBlob('audio/pcm');
  const dataUri = pcmData.toDataUri();

  // Process samples
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    // Normalize to -1.0 to 1.0
    const normalized = sample / 32768;
  }
});`}
          language="tsx"
          title="Working with PCM Data"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Audio Level
        </Text>

        <CodeBlock
          code={`interface AudioLevel {
  // Current level (0.0 - 1.0, normalized)
  current: number;

  // Peak level since last reset (0.0 - 1.0)
  peak: number;

  // RMS (root mean square) for accurate metering
  rms: number;

  // Decibel value (-Infinity to 0)
  db: number;
}

// Example: Audio level meter component
function LevelMeter({ level }: { level: AudioLevel }) {
  const getColor = () => {
    if (level.current > 0.9) return '#ef4444'; // Red - clipping
    if (level.current > 0.7) return '#f59e0b'; // Yellow - hot
    return '#22c55e'; // Green - normal
  };

  return (
    <View style={{ height: 200, width: 30, backgroundColor: '#e5e7eb' }}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: \`\${level.current * 100}%\`,
          backgroundColor: getColor(),
        }}
      />
      {/* Peak indicator */}
      <View
        style={{
          position: 'absolute',
          bottom: \`\${level.peak * 100}%\`,
          width: '100%',
          height: 2,
          backgroundColor: '#ef4444',
        }}
      />
    </View>
  );
}`}
          language="tsx"
          title="Audio Level Metering"
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
              Uses Web Audio API and AudioWorklet for low-latency audio processing.
              Pause/resume is not supported - must stop and start.
              WAV files are created client-side using ArrayBuffer.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              React Native
            </Text>
            <Text typography="body2" color="tertiary">
              Uses platform-native audio APIs for optimal performance.
              Supports pause/resume during streaming.
              WAV files can be saved directly to device storage.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Utility Functions
        </Text>

        <CodeBlock
          code={`import {
  createWavFile,
  createWavHeader,
  float32ToInt16,
  calculateAudioLevels,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from '@idealyst/microphone';

// Create a WAV file from raw PCM data
const wavBlob = createWavFile(pcmArrayBuffer, audioConfig);

// Convert Float32Array (Web Audio) to Int16Array
const int16Samples = float32ToInt16(float32Samples);

// Calculate audio levels from samples
const levels = calculateAudioLevels(samples);
console.log('RMS:', levels.rms, 'dB:', levels.db);

// Base64 encoding/decoding for API transport
const base64 = arrayBufferToBase64(audioBuffer);
const buffer = base64ToArrayBuffer(base64);`}
          language="typescript"
          title="Utility Functions"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Error Handling
        </Text>

        <CodeBlock
          code={`const { error } = useMicrophone();

// Error codes:
// 'PERMISSION_DENIED'    - User denied microphone access
// 'PERMISSION_BLOCKED'   - Permission blocked (native)
// 'DEVICE_NOT_FOUND'     - No microphone found
// 'DEVICE_IN_USE'        - Microphone used by another app
// 'NOT_SUPPORTED'        - Audio not supported
// 'INITIALIZATION_FAILED' - Failed to start
// 'RECORDING_FAILED'     - Recording error
// 'INVALID_CONFIG'       - Invalid audio config
// 'UNKNOWN'              - Unknown error

if (error) {
  switch (error.code) {
    case 'PERMISSION_DENIED':
      // Show permission explanation
      break;
    case 'DEVICE_NOT_FOUND':
      // No microphone available
      break;
    default:
      console.error(error.message);
  }
}`}
          language="tsx"
          title="Error Handling"
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
