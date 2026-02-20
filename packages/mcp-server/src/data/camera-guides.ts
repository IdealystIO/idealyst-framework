/**
 * Camera Package Guides
 *
 * Comprehensive documentation for @idealyst/camera.
 */

export const cameraGuides: Record<string, string> = {
  "idealyst://camera/overview": `# @idealyst/camera

Cross-platform camera package for photo capture and video recording.

## Installation

\`\`\`bash
yarn add @idealyst/camera
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ MediaDevices API |
| iOS      | ✅ AVFoundation |
| Android  | ✅ CameraX |

## Key Exports

\`\`\`typescript
import {
  CameraPreview,           // Component — NOT "Camera"
  useCamera,               // Hook — returns camera controls + cameraRef
  requestPermission,        // Standalone function — NOT "useCameraPermission" or "requestCameraPermission"
} from '@idealyst/camera';
\`\`\`

> **Common mistakes:**
> - The component is \`CameraPreview\`, NOT \`Camera\`
> - Permission is requested via \`requestPermission()\` standalone function, NOT a hook or \`requestCameraPermission\`
> - Pass \`camera.cameraRef.current\` to \`CameraPreview\`'s \`camera\` prop

## Quick Start

\`\`\`tsx
import { View, Button } from '@idealyst/components';
import { CameraPreview, useCamera } from '@idealyst/camera';

function CameraScreen() {
  const camera = useCamera({ autoRequestPermission: true });

  const handleTakePhoto = async () => {
    const photo = await camera.takePhoto();
    console.log('Photo:', photo.uri, photo.width, photo.height);
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraPreview camera={camera.cameraRef.current} style={{ flex: 1 }} />
      <Button onPress={handleTakePhoto} intent="primary">Take Photo</Button>
    </View>
  );
}
\`\`\`
`,

  "idealyst://camera/api": `# @idealyst/camera — API Reference

## Components

### CameraPreview

Renders the camera preview. Must receive a camera instance from \`useCamera().cameraRef.current\`.

\`\`\`typescript
interface CameraPreviewProps {
  camera: ICamera | null;            // Camera instance from useCamera().cameraRef.current
  style?: StyleProp<ViewStyle>;      // Preview container style
  aspectRatio?: number;              // e.g., 16/9, 4/3 (default: auto)
  resizeMode?: 'cover' | 'contain';  // Default: 'cover'
  mirror?: boolean;                  // Mirror preview (default: auto based on position)
  enableTapToFocus?: boolean;        // Default: true
  enablePinchToZoom?: boolean;       // Default: true
  onReady?: () => void;              // Called when preview is ready
  onFocus?: (point: FocusPoint) => void;  // Called on tap-to-focus
  testID?: string;
}
\`\`\`

---

## Hooks

### useCamera(options?)

Main camera hook. Returns camera state, controls, and a ref for CameraPreview.

\`\`\`typescript
interface UseCameraOptions {
  config?: Partial<CameraConfig>;     // Initial camera configuration
  autoRequestPermission?: boolean;    // Auto-request permission on mount (default: false)
  autoStart?: boolean;                // Auto-start camera on mount (default: false)
}
\`\`\`

**Returns \`UseCameraResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| status | CameraStatus | Full camera status |
| isActive | boolean | Whether preview is active |
| isRecording | boolean | Whether video recording is active |
| recordingDuration | number | Video recording duration in ms |
| activeDevice | CameraDevice \\| null | Currently active camera device |
| availableDevices | CameraDevice[] | All available camera devices |
| permission | PermissionResult \\| null | Permission status |
| error | CameraError \\| null | Current error |
| zoom | number | Current zoom level |
| torchActive | boolean | Whether torch/flash is on |
| start | (config?) => Promise<void> | Start camera preview |
| stop | () => Promise<void> | Stop camera |
| switchDevice | (deviceOrPosition) => Promise<void> | Switch camera (e.g., 'front' \\| 'back') |
| takePhoto | (options?) => Promise<PhotoResult> | Take a photo |
| startRecording | (options?) => Promise<void> | Start video recording |
| stopRecording | () => Promise<VideoResult> | Stop video recording |
| cancelRecording | () => Promise<void> | Cancel video recording |
| setZoom | (level: number) => void | Set zoom level |
| setTorch | (enabled: boolean) => void | Toggle torch/flash |
| focusOnPoint | (x, y) => Promise<void> | Focus on point (0-1 normalized) |
| requestPermission | () => Promise<PermissionResult> | Request camera permissions |
| cameraRef | RefObject<ICamera \\| null> | **Ref to pass to CameraPreview** |

---

## Standalone Functions

### requestPermission()

Request camera and microphone permissions. Returns a \`PermissionResult\`.

> **Important:** The export is \`requestPermission\`, NOT \`requestCameraPermission\`.

\`\`\`typescript
import { requestPermission } from '@idealyst/camera';

const result = await requestPermission();
// result: { camera: PermissionStatus, microphone: PermissionStatus, canAskAgain: boolean }
\`\`\`

### checkPermission()

Check current permission status without prompting the user.

\`\`\`typescript
import { checkPermission } from '@idealyst/camera';

const result = await checkPermission();
if (result.camera === 'granted') { /* ready */ }
\`\`\`

---

## Types

### CameraStatus (interface, NOT an enum)

\`CameraStatus\` is an **interface**, not an enum or string. Do NOT compare it directly to strings.

\`\`\`typescript
interface CameraStatus {
  state: CameraState;         // Current camera state
  permission: PermissionStatus; // Current permission status
  isActive: boolean;           // Whether preview is active
  isRecording: boolean;        // Whether recording is in progress
  activeDevice: CameraDevice | null;
  error: CameraError | null;
}

// CameraState is a string union:
type CameraState = 'idle' | 'initializing' | 'ready' | 'recording' | 'capturing';

// Check state like this:
if (camera.status.state === 'ready') { /* ... */ }
if (camera.status.permission === 'granted') { /* ... */ }

// WRONG — do NOT compare CameraStatus directly to strings:
// ❌ if (camera.status === 'not-determined')
// ❌ if (camera.status === 'denied')
\`\`\`

### PhotoResult

\`\`\`typescript
interface PhotoResult {
  uri: string;          // File path (native) or Blob URL (web)
  width: number;        // Image width in pixels
  height: number;       // Image height in pixels
  size: number;         // File size in bytes
  format: PhotoFormat;  // 'jpeg' | 'png' | 'heic'
  metadata?: PhotoMetadata;
  getArrayBuffer(): Promise<ArrayBufferLike>;
  getData(): Promise<Blob | string>;
}
\`\`\`

### VideoResult

\`\`\`typescript
interface VideoResult {
  uri: string;           // File path or Blob URL
  duration: number;      // Duration in ms
  width: number;         // Video width in pixels
  height: number;        // Video height in pixels
  size: number;          // File size in bytes
  format: VideoFormat;   // 'mp4' | 'mov'
  hasAudio: boolean;
  getArrayBuffer(): Promise<ArrayBufferLike>;
  getData(): Promise<Blob | string>;
}
\`\`\`

### PhotoOptions

\`\`\`typescript
interface PhotoOptions {
  format?: PhotoFormat;  // 'jpeg' | 'png' | 'heic' (default: 'jpeg')
  quality?: number;      // 0-100 (default: 90)
  flash?: boolean;       // Enable flash (default: false)
  skipSound?: boolean;   // Skip shutter sound (native, default: false)
}
\`\`\`

### VideoOptions

\`\`\`typescript
interface VideoOptions {
  format?: VideoFormat;  // 'mp4' | 'mov' (default: 'mp4')
  maxDuration?: number;  // Max duration in seconds (0 = unlimited)
  audio?: boolean;       // Enable audio (default: true)
  torch?: boolean;       // Enable torch during recording (default: false)
}
\`\`\`

### CameraConfig

\`\`\`typescript
type CameraPosition = 'front' | 'back' | 'external';
type VideoQuality = 'low' | 'medium' | 'high' | '4k';
type PhotoQuality = 'low' | 'medium' | 'high' | 'maximum';

interface CameraConfig {
  position: CameraPosition;     // Default: 'back'
  videoQuality: VideoQuality;   // Default: 'high'
  photoQuality: PhotoQuality;   // Default: 'high'
  resolution?: Resolution;      // Target resolution (best effort)
  enableAudio: boolean;         // Default: true
  torch: boolean;               // Default: false
  zoom: number;                 // Default: 1.0
  autoFocus: boolean;           // Default: true
  mirrorPreview?: boolean;      // Default: auto based on position
}
\`\`\`

### PermissionResult

\`\`\`typescript
type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'blocked' | 'unavailable';

interface PermissionResult {
  camera: PermissionStatus;
  microphone: PermissionStatus;
  canAskAgain: boolean;
}
\`\`\`

### CameraError

\`\`\`typescript
type CameraErrorCode =
  | 'PERMISSION_DENIED' | 'PERMISSION_BLOCKED'
  | 'DEVICE_NOT_FOUND' | 'DEVICE_IN_USE' | 'NOT_SUPPORTED'
  | 'INITIALIZATION_FAILED' | 'CAPTURE_FAILED' | 'RECORDING_FAILED'
  | 'INVALID_CONFIG' | 'STORAGE_FULL' | 'UNKNOWN';

interface CameraError {
  code: CameraErrorCode;
  message: string;
  originalError?: Error;
}
\`\`\`
`,

  "idealyst://camera/examples": `# @idealyst/camera — Examples

## Photo Capture Screen

\`\`\`tsx
import React, { useState } from 'react';
import { View, Button, Image, Text, IconButton } from '@idealyst/components';
import { CameraPreview, useCamera } from '@idealyst/camera';
import type { PhotoResult } from '@idealyst/camera';

function PhotoCaptureScreen() {
  const camera = useCamera({ autoRequestPermission: true, autoStart: true });
  const [photo, setPhoto] = useState<PhotoResult | null>(null);

  const handleCapture = async () => {
    const result = await camera.takePhoto({ format: 'jpeg', quality: 90 });
    setPhoto(result);
  };

  if (photo) {
    return (
      <View style={{ flex: 1 }}>
        <Image source={photo.uri} style={{ flex: 1 }} objectFit="contain" />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} gap="md" padding="md">
          <Button onPress={() => setPhoto(null)} intent="secondary">Retake</Button>
          <Button onPress={() => console.log('Save:', photo.uri)} intent="primary">Use Photo</Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraPreview camera={camera.cameraRef.current} style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} padding="md">
        <IconButton
          icon={camera.torchActive ? 'flash' : 'flash-off'}
          onPress={() => camera.setTorch(!camera.torchActive)}
        />
        <Button onPress={handleCapture} intent="primary" size="lg">
          Capture
        </Button>
        <IconButton
          icon="camera-flip"
          onPress={() => camera.switchDevice(
            camera.activeDevice?.position === 'front' ? 'back' : 'front'
          )}
        />
      </View>
    </View>
  );
}
\`\`\`

## Video Recording

\`\`\`tsx
import React, { useState } from 'react';
import { View, Button, Text } from '@idealyst/components';
import { CameraPreview, useCamera } from '@idealyst/camera';
import type { VideoResult } from '@idealyst/camera';

function VideoRecordingScreen() {
  const camera = useCamera({ autoRequestPermission: true, autoStart: true });
  const [video, setVideo] = useState<VideoResult | null>(null);

  const handleToggleRecording = async () => {
    if (camera.isRecording) {
      const result = await camera.stopRecording();
      setVideo(result);
    } else {
      await camera.startRecording({ format: 'mp4', audio: true });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraPreview camera={camera.cameraRef.current} style={{ flex: 1 }} />
      {camera.isRecording && (
        <Text style={{ position: 'absolute', top: 20, alignSelf: 'center', color: 'red' }}>
          REC {Math.round(camera.recordingDuration / 1000)}s
        </Text>
      )}
      <Button
        onPress={handleToggleRecording}
        intent={camera.isRecording ? 'danger' : 'primary'}
      >
        {camera.isRecording ? 'Stop Recording' : 'Record Video'}
      </Button>
      {video && <Text>Video saved: {video.uri} ({Math.round(video.duration / 1000)}s)</Text>}
    </View>
  );
}
\`\`\`

## Permission Handling

\`\`\`tsx
import React from 'react';
import { View, Button, Text } from '@idealyst/components';
import { useCamera, requestPermission } from '@idealyst/camera';

function CameraWithPermissions() {
  const camera = useCamera();

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result.camera === 'granted') {
      await camera.start();
    }
  };

  if (camera.permission?.camera !== 'granted') {
    return (
      <View padding="lg" gap="md" style={{ alignItems: 'center' }}>
        <Text>Camera permission is required</Text>
        <Button onPress={handleRequestPermission} intent="primary">
          Grant Permission
        </Button>
      </View>
    );
  }

  // ... render camera preview
}
\`\`\`
`,
};
