import type { PermissionResult, PermissionStatus } from '../types';

/**
 * Map browser PermissionState to our PermissionStatus.
 */
function mapPermissionState(state: PermissionState): PermissionStatus {
  switch (state) {
    case 'granted':
      return 'granted';
    case 'denied':
      return 'denied';
    case 'prompt':
    default:
      return 'undetermined';
  }
}

/**
 * Check camera and microphone permission status without prompting.
 */
export async function checkPermission(): Promise<PermissionResult> {
  // Check if permissions API is available
  if (!navigator.permissions) {
    // Fall back to undetermined - we can't check without prompting
    return {
      camera: 'undetermined',
      microphone: 'undetermined',
      canAskAgain: true,
    };
  }

  try {
    const [cameraResult, micResult] = await Promise.all([
      navigator.permissions.query({ name: 'camera' as PermissionName }),
      navigator.permissions.query({ name: 'microphone' as PermissionName }),
    ]);

    return {
      camera: mapPermissionState(cameraResult.state),
      microphone: mapPermissionState(micResult.state),
      canAskAgain: cameraResult.state !== 'denied' || micResult.state !== 'denied',
    };
  } catch {
    // Safari and some browsers don't support querying camera/microphone permissions
    // Return undetermined - we'll need to request to find out
    return {
      camera: 'undetermined',
      microphone: 'undetermined',
      canAskAgain: true,
    };
  }
}

/**
 * Request camera and microphone permissions.
 * This will trigger the browser's permission dialog.
 */
export async function requestPermission(): Promise<PermissionResult> {
  // Check if getUserMedia is available
  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      camera: 'unavailable',
      microphone: 'unavailable',
      canAskAgain: false,
    };
  }

  let cameraStatus: PermissionStatus = 'denied';
  let microphoneStatus: PermissionStatus = 'denied';

  // Request camera permission
  try {
    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoStream.getTracks().forEach((track) => track.stop());
    cameraStatus = 'granted';
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        cameraStatus = 'denied';
      } else if (error.name === 'NotFoundError') {
        cameraStatus = 'unavailable';
      } else {
        cameraStatus = 'denied';
      }
    }
  }

  // Request microphone permission
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStream.getTracks().forEach((track) => track.stop());
    microphoneStatus = 'granted';
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        microphoneStatus = 'denied';
      } else if (error.name === 'NotFoundError') {
        microphoneStatus = 'unavailable';
      } else {
        microphoneStatus = 'denied';
      }
    }
  }

  return {
    camera: cameraStatus,
    microphone: microphoneStatus,
    canAskAgain: true, // Web always allows re-requesting (user can change in browser settings)
  };
}

/**
 * Request only camera permission.
 */
export async function requestCameraPermission(): Promise<PermissionStatus> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return 'unavailable';
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    return 'granted';
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        return 'denied';
      }
      if (error.name === 'NotFoundError') {
        return 'unavailable';
      }
    }
    return 'denied';
  }
}

/**
 * Request only microphone permission.
 */
export async function requestMicrophonePermission(): Promise<PermissionStatus> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return 'unavailable';
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return 'granted';
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        return 'denied';
      }
      if (error.name === 'NotFoundError') {
        return 'unavailable';
      }
    }
    return 'denied';
  }
}
