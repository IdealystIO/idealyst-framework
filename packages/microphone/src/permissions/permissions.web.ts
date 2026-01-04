import type { PermissionResult, PermissionStatus } from '../types';

/**
 * Check microphone permission status on web.
 */
export async function checkPermission(): Promise<PermissionResult> {
  // Check if permissions API is available
  if (!navigator.permissions) {
    // Fallback: we can't check, so assume undetermined
    return { status: 'undetermined', canAskAgain: true };
  }

  try {
    const result = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });

    const status = mapPermissionState(result.state);
    return {
      status,
      canAskAgain: status !== 'denied', // On web, denied can still be asked again (browser UI)
    };
  } catch {
    // Safari doesn't support querying microphone permission
    return { status: 'undetermined', canAskAgain: true };
  }
}

/**
 * Request microphone permission on web.
 * This triggers the browser's permission dialog.
 */
export async function requestPermission(): Promise<PermissionResult> {
  // Check if getUserMedia is available
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { status: 'unavailable', canAskAgain: false };
  }

  try {
    // Request microphone access - this triggers the permission prompt
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Stop all tracks immediately - we just needed to trigger the permission
    stream.getTracks().forEach((track) => track.stop());

    return { status: 'granted', canAskAgain: true };
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        return { status: 'denied', canAskAgain: true };
      }
      if (error.name === 'NotFoundError') {
        return { status: 'unavailable', canAskAgain: false };
      }
    }
    return { status: 'denied', canAskAgain: true };
  }
}

/**
 * Map browser permission state to our PermissionStatus type.
 */
function mapPermissionState(
  state: PermissionState
): PermissionStatus {
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
