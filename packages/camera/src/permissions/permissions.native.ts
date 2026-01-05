import type { PermissionResult, PermissionStatus } from '../types';

// Lazy import to avoid issues when react-native-vision-camera is not installed
let Camera: typeof import('react-native-vision-camera').Camera | null = null;

async function getCamera() {
  if (!Camera) {
    try {
      const visionCamera = await import('react-native-vision-camera');
      Camera = visionCamera.Camera;
    } catch {
      return null;
    }
  }
  return Camera;
}

/**
 * Map Vision Camera permission status to our PermissionStatus.
 */
function mapVisionCameraStatus(status: string): PermissionStatus {
  switch (status) {
    case 'granted':
      return 'granted';
    case 'denied':
      return 'blocked'; // Vision Camera uses 'denied' for permanently denied
    case 'not-determined':
      return 'undetermined';
    case 'restricted':
      return 'unavailable';
    default:
      return 'undetermined';
  }
}

/**
 * Check camera and microphone permission status.
 */
export async function checkPermission(): Promise<PermissionResult> {
  const CameraModule = await getCamera();

  if (!CameraModule) {
    return {
      camera: 'unavailable',
      microphone: 'unavailable',
      canAskAgain: false,
    };
  }

  try {
    const cameraStatus = await CameraModule.getCameraPermissionStatus();
    const micStatus = await CameraModule.getMicrophonePermissionStatus();

    const cameraMapped = mapVisionCameraStatus(cameraStatus);
    const micMapped = mapVisionCameraStatus(micStatus);

    return {
      camera: cameraMapped,
      microphone: micMapped,
      canAskAgain: cameraMapped !== 'blocked' && micMapped !== 'blocked',
    };
  } catch {
    return {
      camera: 'undetermined',
      microphone: 'undetermined',
      canAskAgain: true,
    };
  }
}

/**
 * Request camera and microphone permissions.
 */
export async function requestPermission(): Promise<PermissionResult> {
  const CameraModule = await getCamera();

  if (!CameraModule) {
    return {
      camera: 'unavailable',
      microphone: 'unavailable',
      canAskAgain: false,
    };
  }

  try {
    const cameraStatus = await CameraModule.requestCameraPermission();
    const micStatus = await CameraModule.requestMicrophonePermission();

    const cameraMapped = mapVisionCameraStatus(cameraStatus);
    const micMapped = mapVisionCameraStatus(micStatus);

    return {
      camera: cameraMapped,
      microphone: micMapped,
      canAskAgain: cameraMapped !== 'blocked' && micMapped !== 'blocked',
    };
  } catch {
    return {
      camera: 'denied',
      microphone: 'denied',
      canAskAgain: true,
    };
  }
}

/**
 * Request only camera permission.
 */
export async function requestCameraPermission(): Promise<PermissionStatus> {
  const CameraModule = await getCamera();

  if (!CameraModule) {
    return 'unavailable';
  }

  try {
    const status = await CameraModule.requestCameraPermission();
    return mapVisionCameraStatus(status);
  } catch {
    return 'denied';
  }
}

/**
 * Request only microphone permission.
 */
export async function requestMicrophonePermission(): Promise<PermissionStatus> {
  const CameraModule = await getCamera();

  if (!CameraModule) {
    return 'unavailable';
  }

  try {
    const status = await CameraModule.requestMicrophonePermission();
    return mapVisionCameraStatus(status);
  } catch {
    return 'denied';
  }
}
