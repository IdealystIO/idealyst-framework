import { Platform, Linking, PermissionsAndroid } from 'react-native';
import type { PermissionResult, RequestPermissionOptions } from '../types';
import { createNotificationError } from '../errors';

// Graceful optional imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Notifee: any = null;
try {
  Notifee = require('@notifee/react-native').default;
} catch {
  // Will degrade gracefully
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Messaging: any = null;
try {
  Messaging = require('@react-native-firebase/messaging').default;
} catch {
  // Will degrade gracefully
}

/**
 * Check current notification permission without prompting.
 */
export async function checkPermission(): Promise<PermissionResult> {
  if (Notifee) {
    const settings = await Notifee.getNotificationSettings();
    return mapNotifeeSettings(settings);
  }

  if (Messaging) {
    const status = await Messaging().hasPermission();
    return mapFirebaseAuthStatus(status);
  }

  return { status: 'undetermined', canNotify: false };
}

/**
 * Request notification permission from the user.
 */
export async function requestPermission(
  options?: RequestPermissionOptions,
): Promise<PermissionResult> {
  // On Android 13+ (API 33), request the POST_NOTIFICATIONS runtime permission
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      'android.permission.POST_NOTIFICATIONS' as any,
    );
    if (result === PermissionsAndroid.RESULTS.DENIED) {
      return { status: 'denied', canNotify: false };
    }
    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return { status: 'blocked', canNotify: false };
    }
  }

  // Use Notifee for permission request (covers both local + push on iOS)
  if (Notifee) {
    const settings = await Notifee.requestPermission(
      options?.ios
        ? {
            alert: options.ios.alert,
            badge: options.ios.badge,
            sound: options.ios.sound,
            criticalAlert: options.ios.criticalAlert,
            provisional: options.ios.provisional ?? options.provisional,
            carPlay: options.ios.carPlay,
            announcement: options.ios.announcement,
          }
        : options?.provisional
          ? { provisional: true }
          : undefined,
    );
    return mapNotifeeSettings(settings);
  }

  // Fallback to Firebase Messaging permission request
  if (Messaging) {
    const status = await Messaging().requestPermission();
    return mapFirebaseAuthStatus(status);
  }

  throw createNotificationError(
    'not_available',
    'Neither @notifee/react-native nor @react-native-firebase/messaging is installed',
  );
}

/**
 * Open system notification settings for this app.
 */
export async function openNotificationSettings(): Promise<void> {
  if (Platform.OS === 'android' && Notifee) {
    await Notifee.openNotificationSettings();
    return;
  }

  // iOS: open app settings
  await Linking.openSettings();
}

// ============================================================================
// Internal Helpers
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNotifeeSettings(settings: any): PermissionResult {
  // Notifee AuthorizationStatus: 0=NOT_DETERMINED, 1=DENIED, 2=AUTHORIZED, 3=PROVISIONAL
  const authStatus = settings?.authorizationStatus ?? 0;
  const iosSettings = Platform.OS === 'ios'
    ? {
        alert: Boolean(settings?.ios?.alert),
        badge: Boolean(settings?.ios?.badge),
        sound: Boolean(settings?.ios?.sound),
        criticalAlert: Boolean(settings?.ios?.criticalAlert),
        provisional: authStatus === 3,
      }
    : undefined;

  switch (authStatus) {
    case 2: // AUTHORIZED
      return { status: 'granted', canNotify: true, ios: iosSettings };
    case 3: // PROVISIONAL
      return { status: 'provisional', canNotify: true, ios: iosSettings };
    case 1: // DENIED
      return { status: 'denied', canNotify: false, ios: iosSettings };
    case 0: // NOT_DETERMINED
    default:
      return { status: 'undetermined', canNotify: false, ios: iosSettings };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFirebaseAuthStatus(status: any): PermissionResult {
  // Firebase AuthorizationStatus: -1=NOT_DETERMINED, 0=DENIED, 1=AUTHORIZED, 2=PROVISIONAL
  switch (status) {
    case 1: // AUTHORIZED
      return { status: 'granted', canNotify: true };
    case 2: // PROVISIONAL
      return { status: 'provisional', canNotify: true };
    case 0: // DENIED
      return { status: 'denied', canNotify: false };
    case -1: // NOT_DETERMINED
    default:
      return { status: 'undetermined', canNotify: false };
  }
}
