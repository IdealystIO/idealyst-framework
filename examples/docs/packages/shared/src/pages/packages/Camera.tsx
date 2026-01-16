import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function CameraPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Camera
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform camera access for photo and video capture. Provides a unified API
          for web and React Native with permissions handling, device switching, and real-time preview.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import {
  useCamera,
  CameraPreview,
  checkPermission,
  requestPermission,
} from '@idealyst/camera';`}
          language="typescript"
          title="Import"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Basic Usage
        </Text>

        <CodeBlock
          code={`import { useCamera, CameraPreview } from '@idealyst/camera';
import { View, Button, Text } from '@idealyst/components';

function CameraScreen() {
  const {
    status,
    isActive,
    cameraRef,
    permission,
    start,
    stop,
    takePhoto,
    requestPermission,
  } = useCamera();

  const handleTakePhoto = async () => {
    try {
      const photo = await takePhoto();
      console.log('Photo captured:', photo.uri);
    } catch (error) {
      console.error('Failed to take photo:', error);
    }
  };

  // Request permissions if not granted
  if (permission?.camera !== 'granted') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={requestPermission}>
          Grant Camera Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraPreview
        camera={cameraRef.current}
        style={{ flex: 1 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20 }}>
        {!isActive ? (
          <Button onPress={() => start()}>Start Camera</Button>
        ) : (
          <>
            <Button onPress={handleTakePhoto}>Take Photo</Button>
            <Button onPress={stop}>Stop</Button>
          </>
        )}
      </View>
    </View>
  );
}`}
          language="tsx"
          title="Camera with Photo Capture"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          useCamera Hook
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          The main hook for camera functionality:
        </Text>

        <CodeBlock
          code={`const {
  // State
  status,          // Full camera status
  isActive,        // Whether preview is active
  isRecording,     // Whether recording video
  recordingDuration, // Video duration in ms
  activeDevice,    // Current camera device
  availableDevices, // All camera devices
  permission,      // Permission status
  error,           // Current error
  zoom,            // Current zoom level
  torchActive,     // Whether torch is on

  // Actions
  start,           // Start camera preview
  stop,            // Stop camera
  switchDevice,    // Switch front/back camera
  takePhoto,       // Capture photo
  startRecording,  // Start video recording
  stopRecording,   // Stop and get video
  cancelRecording, // Cancel without saving
  setZoom,         // Set zoom level
  setTorch,        // Toggle torch/flash
  focusOnPoint,    // Tap-to-focus
  requestPermission, // Request permissions

  // Ref for CameraPreview
  cameraRef,
} = useCamera(options);`}
          language="tsx"
          title="Hook Return Values"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Hook Options
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="config" type="Partial<CameraConfig>" description="Initial camera configuration." />
          <PropRow name="autoRequestPermission" type="boolean" description="Auto-request permissions on mount. Default: false." />
          <PropRow name="autoStart" type="boolean" description="Auto-start camera after permissions granted. Default: false." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Video Recording
        </Text>

        <CodeBlock
          code={`function VideoRecorder() {
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    cameraRef,
  } = useCamera({ autoRequestPermission: true, autoStart: true });

  const handleStartRecording = async () => {
    await startRecording({
      format: 'mp4',
      audio: true,
      maxDuration: 60, // 60 second limit
    });
  };

  const handleStopRecording = async () => {
    const video = await stopRecording();
    console.log('Video saved:', video.uri);
    console.log('Duration:', video.duration, 'ms');
  };

  // Format recording duration
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraPreview camera={cameraRef.current} style={{ flex: 1 }} />

      {isRecording && (
        <View style={{ position: 'absolute', top: 20, alignSelf: 'center' }}>
          <Text style={{ color: 'red' }}>
            REC {formatTime(recordingDuration)}
          </Text>
        </View>
      )}

      <View style={{ padding: 20 }}>
        {!isRecording ? (
          <Button intent="danger" onPress={handleStartRecording}>
            Start Recording
          </Button>
        ) : (
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Button onPress={handleStopRecording}>Stop</Button>
            <Button type="outlined" onPress={cancelRecording}>Cancel</Button>
          </View>
        )}
      </View>
    </View>
  );
}`}
          language="tsx"
          title="Video Recording"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Camera Controls
        </Text>

        <CodeBlock
          code={`function CameraWithControls() {
  const {
    zoom,
    torchActive,
    activeDevice,
    availableDevices,
    setZoom,
    setTorch,
    switchDevice,
    focusOnPoint,
    cameraRef,
  } = useCamera({ autoRequestPermission: true, autoStart: true });

  return (
    <View style={{ flex: 1 }}>
      <CameraPreview
        camera={cameraRef.current}
        style={{ flex: 1 }}
        enableTapToFocus={true}
        enablePinchToZoom={true}
        onFocus={(point) => {
          console.log('Focused at:', point);
        }}
      />

      <View style={{ padding: 20 }}>
        {/* Zoom slider */}
        <View>
          <Text>Zoom: {zoom.toFixed(1)}x</Text>
          <Slider
            value={zoom}
            min={1}
            max={activeDevice?.maxZoom ?? 5}
            onChange={setZoom}
          />
        </View>

        {/* Torch toggle */}
        <Switch
          checked={torchActive}
          onChange={setTorch}
          label="Flash"
        />

        {/* Switch camera */}
        <Button onPress={() => switchDevice('front')}>
          Switch to Front Camera
        </Button>
        <Button onPress={() => switchDevice('back')}>
          Switch to Back Camera
        </Button>
      </View>
    </View>
  );
}`}
          language="tsx"
          title="Camera Controls"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          CameraPreview Props
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="camera" type="ICamera | null" description="Camera instance from useCamera().cameraRef.current." required />
          <PropRow name="style" type="ViewStyle" description="Preview container style." />
          <PropRow name="aspectRatio" type="number" description="Aspect ratio (e.g., 16/9). Default: auto." />
          <PropRow name="resizeMode" type="'cover' | 'contain'" description="How to resize content. Default: 'cover'." />
          <PropRow name="mirror" type="boolean" description="Mirror preview (for selfies). Default: auto." />
          <PropRow name="enableTapToFocus" type="boolean" description="Enable tap-to-focus. Default: true." />
          <PropRow name="enablePinchToZoom" type="boolean" description="Enable pinch-to-zoom. Default: true." />
          <PropRow name="onReady" type="() => void" description="Callback when preview is ready." />
          <PropRow name="onFocus" type="(point) => void" description="Callback when user taps to focus." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Camera Configuration
        </Text>

        <CodeBlock
          code={`const { start } = useCamera({
  config: {
    position: 'back',        // 'front' | 'back' | 'external'
    videoQuality: 'high',    // 'low' | 'medium' | 'high' | '4k'
    photoQuality: 'high',    // 'low' | 'medium' | 'high' | 'maximum'
    enableAudio: true,       // Enable audio for video
    torch: false,            // Enable torch/flash
    zoom: 1.0,              // Zoom level
    autoFocus: true,        // Enable auto-focus
  },
});

// Or configure when starting
await start({
  position: 'front',
  videoQuality: 'medium',
});`}
          language="tsx"
          title="Configuration Options"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Permission Handling
        </Text>

        <CodeBlock
          code={`import { checkPermission, requestPermission } from '@idealyst/camera';

// Check current permission status
const result = await checkPermission();
console.log('Camera:', result.camera);      // 'granted' | 'denied' | 'undetermined'
console.log('Microphone:', result.microphone);
console.log('Can ask again:', result.canAskAgain);

// Request permissions
const newResult = await requestPermission();
if (newResult.camera === 'granted') {
  // Camera access granted
}

// Permission statuses:
// 'granted'     - Permission granted
// 'denied'      - Permission denied (can ask again)
// 'undetermined' - Not yet asked
// 'blocked'     - Denied with "don't ask again" (native)
// 'unavailable' - No camera hardware`}
          language="tsx"
          title="Permissions"
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
              Uses getUserMedia API and MediaRecorder. Videos are recorded as webm/mp4
              depending on browser support. Photos are captured from video frames.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              React Native
            </Text>
            <Text typography="body2" color="tertiary">
              Uses react-native-vision-camera under the hood. Full access to native
              camera features including HEIC photos, hardware acceleration, and
              advanced video codecs.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Working with Captured Media
        </Text>

        <CodeBlock
          code={`// Photo result
const photo = await takePhoto({ format: 'jpeg', quality: 90 });
console.log('URI:', photo.uri);
console.log('Size:', photo.width, 'x', photo.height);
console.log('File size:', photo.size, 'bytes');

// Get as ArrayBuffer (for upload)
const buffer = await photo.getArrayBuffer();

// Get as Blob (web) or base64 (native)
const data = await photo.getData();

// Video result
const video = await stopRecording();
console.log('URI:', video.uri);
console.log('Duration:', video.duration, 'ms');
console.log('Has audio:', video.hasAudio);

// Get video data
const videoBuffer = await video.getArrayBuffer();`}
          language="tsx"
          title="Media Results"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Error Handling
        </Text>

        <CodeBlock
          code={`const { error } = useCamera();

// Error codes:
// 'PERMISSION_DENIED'    - User denied camera access
// 'PERMISSION_BLOCKED'   - Permission blocked (native)
// 'DEVICE_NOT_FOUND'     - Camera not found
// 'DEVICE_IN_USE'        - Camera used by another app
// 'NOT_SUPPORTED'        - Camera not supported
// 'INITIALIZATION_FAILED' - Failed to start camera
// 'CAPTURE_FAILED'       - Photo capture failed
// 'RECORDING_FAILED'     - Video recording failed
// 'STORAGE_FULL'         - Device storage full
// 'UNKNOWN'              - Unknown error

if (error) {
  switch (error.code) {
    case 'PERMISSION_DENIED':
      // Show permission explanation
      break;
    case 'DEVICE_IN_USE':
      // Camera is being used by another app
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
  required,
}: {
  name: string;
  type: string;
  description: string;
  required?: boolean;
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
      <View style={{ width: 160 }}>
        <Text weight="semibold" style={{ fontFamily: 'monospace' }}>
          {name}
          {required && <Text color="danger">*</Text>}
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
