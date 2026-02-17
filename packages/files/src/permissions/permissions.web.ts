import type { PermissionStatus, PermissionResult } from '../types';

/**
 * Check photo library permission (always granted on web).
 */
export async function checkPhotoLibraryPermission(): Promise<PermissionStatus> {
  // Web doesn't require permissions for file input
  return 'granted';
}

/**
 * Request photo library permission (no-op on web).
 */
export async function requestPhotoLibraryPermission(): Promise<PermissionStatus> {
  // Web doesn't require permissions for file input
  return 'granted';
}

/**
 * Check camera permission for web.
 */
export async function checkCameraPermission(): Promise<PermissionStatus> {
  if (!navigator.permissions) {
    // Permissions API not supported, assume granted
    return 'granted';
  }

  try {
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });

    switch (result.state) {
      case 'granted':
        return 'granted';
      case 'denied':
        return 'denied';
      case 'prompt':
      default:
        return 'undetermined';
    }
  } catch {
    // Camera permission query not supported in this browser
    return 'undetermined';
  }
}

/**
 * Request camera permission for web.
 */
export async function requestCameraPermission(): Promise<PermissionStatus> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop the stream immediately, we just needed to request permission
    stream.getTracks().forEach(track => track.stop());
    return 'granted';
  } catch (error) {
    if (error instanceof DOMException) {
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
 * Check all file-related permissions.
 */
export async function checkPermissions(): Promise<PermissionResult> {
  const [photoLibrary, camera] = await Promise.all([
    checkPhotoLibraryPermission(),
    checkCameraPermission(),
  ]);

  return {
    photoLibrary,
    camera,
    canAskAgain: camera === 'undetermined',
  };
}

/**
 * Request all file-related permissions.
 */
export async function requestPermissions(): Promise<PermissionResult> {
  const photoLibrary = await requestPhotoLibraryPermission();
  const camera = await requestCameraPermission();

  return {
    photoLibrary,
    camera,
    canAskAgain: false, // After requesting, user must change in settings
  };
}
