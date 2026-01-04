import { Platform, PermissionsAndroid } from 'react-native';
import type { PermissionResult, PermissionStatus } from '../types';

/**
 * Check microphone permission status on React Native.
 */
export async function checkPermission(): Promise<PermissionResult> {
  if (Platform.OS === 'android') {
    return checkAndroidPermission();
  } else if (Platform.OS === 'ios') {
    return checkIOSPermission();
  }

  return { status: 'unavailable', canAskAgain: false };
}

/**
 * Request microphone permission on React Native.
 */
export async function requestPermission(): Promise<PermissionResult> {
  if (Platform.OS === 'android') {
    return requestAndroidPermission();
  } else if (Platform.OS === 'ios') {
    return requestIOSPermission();
  }

  return { status: 'unavailable', canAskAgain: false };
}

/**
 * Check Android microphone permission.
 */
async function checkAndroidPermission(): Promise<PermissionResult> {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );

    if (granted) {
      return { status: 'granted', canAskAgain: true };
    }

    // Permission not granted - we don't know if it's undetermined or blocked
    // without actually requesting
    return { status: 'undetermined', canAskAgain: true };
  } catch {
    return { status: 'unavailable', canAskAgain: false };
  }
}

/**
 * Request Android microphone permission.
 */
async function requestAndroidPermission(): Promise<PermissionResult> {
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'This app needs access to your microphone to record audio.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return mapAndroidResult(result);
  } catch {
    return { status: 'unavailable', canAskAgain: false };
  }
}

/**
 * Map Android permission result to our PermissionResult type.
 */
function mapAndroidResult(
  result: (typeof PermissionsAndroid.RESULTS)[keyof typeof PermissionsAndroid.RESULTS]
): PermissionResult {
  switch (result) {
    case PermissionsAndroid.RESULTS.GRANTED:
      return { status: 'granted', canAskAgain: true };
    case PermissionsAndroid.RESULTS.DENIED:
      return { status: 'denied', canAskAgain: true };
    case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
      return { status: 'blocked', canAskAgain: false };
    default:
      return { status: 'undetermined', canAskAgain: true };
  }
}

/**
 * Check iOS microphone permission.
 * On iOS, permission is checked automatically when the audio session starts.
 * We can't pre-check without actually requesting.
 */
async function checkIOSPermission(): Promise<PermissionResult> {
  // iOS doesn't have a way to check permission status without requesting
  // The permission is requested when starting the audio session
  return { status: 'undetermined', canAskAgain: true };
}

/**
 * Request iOS microphone permission.
 * On iOS, the permission dialog is shown automatically when starting
 * the audio stream. This function serves as a placeholder.
 */
async function requestIOSPermission(): Promise<PermissionResult> {
  // iOS permission is requested automatically when the audio stream starts
  // The native module handles this internally
  // We return undetermined here - the actual status will be known after start()
  return { status: 'undetermined', canAskAgain: true };
}
