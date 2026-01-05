# @idealyst/camera

Cross-platform camera package for React and React Native. Provides a simple, unified API for camera access, photo capture, and video recording.

## Installation

```bash
npm install @idealyst/camera
# or
yarn add @idealyst/camera
```

### React Native Additional Setup

For React Native, you also need to install the peer dependencies:

```bash
npm install react-native-vision-camera
# or
yarn add react-native-vision-camera
```

Follow the [react-native-vision-camera setup guide](https://react-native-vision-camera.com/docs/guides/) for platform-specific configuration.

## Usage

### Basic Photo Capture

```tsx
import { useCamera, CameraPreview } from '@idealyst/camera';

function PhotoScreen() {
  const {
    start,
    takePhoto,
    isActive,
    permission,
    requestPermission,
    cameraRef,
  } = useCamera({ autoRequestPermission: true });

  const handleCapture = async () => {
    const photo = await takePhoto();
    console.log('Photo saved to:', photo.uri);
    console.log('Dimensions:', photo.width, 'x', photo.height);
  };

  if (permission?.camera !== 'granted') {
    return <button onClick={requestPermission}>Grant Camera Permission</button>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CameraPreview camera={cameraRef.current} style={{ flex: 1 }} />

      {!isActive && (
        <button onClick={() => start()}>Start Camera</button>
      )}

      {isActive && (
        <button onClick={handleCapture}>Take Photo</button>
      )}
    </div>
  );
}
```

### Video Recording

```tsx
import { useCamera, CameraPreview, formatDuration } from '@idealyst/camera';

function VideoScreen() {
  const {
    start,
    startRecording,
    stopRecording,
    isActive,
    isRecording,
    recordingDuration,
    cameraRef,
  } = useCamera({
    config: { enableAudio: true },
    autoRequestPermission: true,
    autoStart: true,
  });

  const handleToggleRecord = async () => {
    if (isRecording) {
      const video = await stopRecording();
      console.log('Video saved:', video.uri);
      console.log('Duration:', video.duration, 'ms');
    } else {
      await startRecording({ maxDuration: 60 }); // Max 60 seconds
    }
  };

  return (
    <div>
      <CameraPreview camera={cameraRef.current} aspectRatio={16/9} />

      {isRecording && (
        <div>{formatDuration(recordingDuration)}</div>
      )}

      <button onClick={handleToggleRecord}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
}
```

### Switch Camera

```tsx
import { useCamera, CameraPreview } from '@idealyst/camera';

function CameraWithFlip() {
  const {
    switchDevice,
    activeDevice,
    availableDevices,
    cameraRef,
  } = useCamera({ autoRequestPermission: true, autoStart: true });

  const handleFlip = () => {
    const newPosition = activeDevice?.position === 'back' ? 'front' : 'back';
    switchDevice(newPosition);
  };

  return (
    <div>
      <CameraPreview camera={cameraRef.current} style={{ flex: 1 }} />

      <button onClick={handleFlip}>
        Flip Camera ({activeDevice?.position})
      </button>

      <div>Available: {availableDevices.map(d => d.name).join(', ')}</div>
    </div>
  );
}
```

### Camera Controls

```tsx
import { useCamera, CameraPreview } from '@idealyst/camera';

function CameraWithControls() {
  const {
    setZoom,
    setTorch,
    zoom,
    torchActive,
    activeDevice,
    cameraRef,
  } = useCamera({ autoRequestPermission: true, autoStart: true });

  return (
    <div>
      <CameraPreview
        camera={cameraRef.current}
        enablePinchToZoom={true}
        enableTapToFocus={true}
        onFocus={(point) => console.log('Focused at:', point)}
      />

      {/* Zoom slider */}
      <input
        type="range"
        min={activeDevice?.minZoom ?? 1}
        max={activeDevice?.maxZoom ?? 10}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      />

      {/* Torch toggle */}
      {activeDevice?.hasTorch && (
        <button onClick={() => setTorch(!torchActive)}>
          Torch: {torchActive ? 'ON' : 'OFF'}
        </button>
      )}
    </div>
  );
}
```

## API Reference

### `useCamera(options?)`

React hook for camera functionality.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `config` | `Partial<CameraConfig>` | - | Initial camera configuration |
| `autoRequestPermission` | `boolean` | `false` | Auto-request permissions on mount |
| `autoStart` | `boolean` | `false` | Auto-start camera after permission granted |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `status` | `CameraStatus` | Current camera status |
| `isActive` | `boolean` | Whether camera preview is active |
| `isRecording` | `boolean` | Whether video recording is in progress |
| `recordingDuration` | `number` | Recording duration in milliseconds |
| `activeDevice` | `CameraDevice \| null` | Currently active camera |
| `availableDevices` | `CameraDevice[]` | All available cameras |
| `permission` | `PermissionResult \| null` | Permission status |
| `error` | `CameraError \| null` | Current error if any |
| `zoom` | `number` | Current zoom level |
| `torchActive` | `boolean` | Whether torch is on |
| `start` | `(config?) => Promise<void>` | Start camera |
| `stop` | `() => Promise<void>` | Stop camera |
| `switchDevice` | `(id \| position) => Promise<void>` | Switch camera |
| `takePhoto` | `(options?) => Promise<PhotoResult>` | Capture photo |
| `startRecording` | `(options?) => Promise<void>` | Start video recording |
| `stopRecording` | `() => Promise<VideoResult>` | Stop recording |
| `cancelRecording` | `() => Promise<void>` | Cancel recording |
| `setZoom` | `(level) => void` | Set zoom level |
| `setTorch` | `(enabled) => void` | Toggle torch |
| `focusOnPoint` | `(x, y) => Promise<void>` | Focus on point |
| `requestPermission` | `() => Promise<PermissionResult>` | Request permissions |
| `cameraRef` | `RefObject<ICamera>` | Camera instance ref |

### `<CameraPreview />`

Component for rendering camera preview.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `camera` | `ICamera \| null` | - | Camera instance from `useCamera` |
| `style` | `StyleProp<ViewStyle>` | - | Container style |
| `aspectRatio` | `number` | - | Fixed aspect ratio (e.g., 16/9) |
| `resizeMode` | `'cover' \| 'contain'` | `'cover'` | Content resize mode |
| `mirror` | `boolean` | auto | Mirror preview (auto for front camera) |
| `enableTapToFocus` | `boolean` | `true` | Enable tap-to-focus gesture |
| `enablePinchToZoom` | `boolean` | `true` | Enable pinch-to-zoom gesture |
| `onReady` | `() => void` | - | Called when preview is ready |
| `onFocus` | `(point) => void` | - | Called on tap-to-focus |

### Camera Profiles

Pre-configured camera settings for common use cases:

```tsx
import { CAMERA_PROFILES } from '@idealyst/camera';

// Use a profile
const { start } = useCamera();
await start(CAMERA_PROFILES.selfie);   // Front camera, mirrored
await start(CAMERA_PROFILES.video);    // Back camera, 4K
await start(CAMERA_PROFILES.scanning); // Optimized for QR/documents
```

## File Output

### Photo Result

```typescript
interface PhotoResult {
  uri: string;              // File path (native) or Blob URL (web)
  width: number;
  height: number;
  size: number;
  format: 'jpeg' | 'png' | 'heic';
  getArrayBuffer(): Promise<ArrayBuffer>;
  getData(): Promise<Blob | string>;
}
```

### Video Result

```typescript
interface VideoResult {
  uri: string;              // File path (native) or Blob URL (web)
  duration: number;         // Duration in milliseconds
  width: number;
  height: number;
  size: number;
  format: 'mp4' | 'mov';
  hasAudio: boolean;
  getArrayBuffer(): Promise<ArrayBuffer>;
  getData(): Promise<Blob | string>;
}
```

## Platform Differences

| Feature | Web | React Native |
|---------|-----|--------------|
| Photo capture | Canvas-based | react-native-vision-camera |
| Video recording | MediaRecorder API | react-native-vision-camera |
| Zoom | CSS transform / track constraints | Vision Camera zoom prop |
| Torch | Track constraints (limited support) | Full support |
| Focus | Auto-focus only | Tap-to-focus supported |
| File output | Blob URLs | File system paths |

## License

MIT
