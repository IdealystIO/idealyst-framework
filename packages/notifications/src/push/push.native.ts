// ============================================================================
// Native Push Notification Implementation
// Wraps @react-native-firebase/messaging for FCM (Android) and APNs (iOS).
//
// FCM is the only push transport on Android (GCM was deprecated in 2019).
// On iOS, Firebase Messaging bridges to APNs under the hood.
// ============================================================================

import { Platform } from 'react-native';
import type {
  PermissionResult,
  RequestPermissionOptions,
  PushToken,
  RemoteMessage,
  MessageHandler,
  TokenRefreshHandler,
} from '../types';
import { createNotificationError, normalizeFirebaseError } from '../errors';

// Graceful optional import — @react-native-firebase/messaging may not be installed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Messaging: any = null;
try {
  Messaging = require('@react-native-firebase/messaging').default;
} catch {
  // Will degrade gracefully when methods are called
}

function assertMessaging(): void {
  if (!Messaging) {
    throw createNotificationError(
      'not_available',
      '@react-native-firebase/messaging is not installed. Run: yarn add @react-native-firebase/app @react-native-firebase/messaging',
    );
  }
}

// ============================================================================
// Push Functions
// ============================================================================

/**
 * Request push notification permission.
 * On iOS, prompts the user. On Android 12 and below, this is a no-op (auto-granted).
 * Android 13+ (API 33) POST_NOTIFICATIONS permission should be handled via permissions layer.
 */
export async function requestPushPermission(
  _options?: RequestPermissionOptions,
): Promise<PermissionResult> {
  assertMessaging();

  try {
    const status = await Messaging().requestPermission();
    return mapAuthStatus(status);
  } catch (error) {
    throw normalizeFirebaseError(error);
  }
}

/**
 * Check if push notification permission is granted.
 */
export async function hasPermission(): Promise<boolean> {
  assertMessaging();

  try {
    const status = await Messaging().hasPermission();
    // 1 = AUTHORIZED, 2 = PROVISIONAL
    return status === 1 || status === 2;
  } catch {
    return false;
  }
}

/**
 * Get the FCM push token.
 */
export async function getPushToken(): Promise<PushToken> {
  assertMessaging();

  try {
    const token = await Messaging().getToken();
    return { token, type: 'fcm' };
  } catch (error) {
    throw normalizeFirebaseError(error);
  }
}

/**
 * Delete the FCM push token (unregister).
 */
export async function deletePushToken(): Promise<void> {
  assertMessaging();

  try {
    await Messaging().deleteToken();
  } catch (error) {
    throw normalizeFirebaseError(error);
  }
}

/**
 * Register a handler for foreground push messages.
 * Returns an unsubscribe function.
 */
export function onForegroundMessage(handler: MessageHandler): () => void {
  assertMessaging();

  return Messaging().onMessage((rawMessage: unknown) => {
    const message = normalizeFirebaseMessage(rawMessage, 'foreground');
    handler(message);
  });
}

/**
 * Register a handler for notification open events (when app is in background).
 * Also checks for initial notification (when app was launched from quit state).
 * Returns an unsubscribe function.
 */
export function onNotificationOpened(handler: MessageHandler): () => void {
  assertMessaging();

  // Check for initial notification (app opened from quit state)
  Messaging()
    .getInitialNotification()
    .then((rawMessage: unknown) => {
      if (rawMessage) {
        const message = normalizeFirebaseMessage(rawMessage, 'quit');
        handler(message);
      }
    })
    .catch(() => {
      // Silently fail — initial notification check is best-effort
    });

  // Listen for notification opens while app is in background
  return Messaging().onNotificationOpenedApp((rawMessage: unknown) => {
    const message = normalizeFirebaseMessage(rawMessage, 'background');
    handler(message);
  });
}

/**
 * Register a handler for token refresh events.
 * Returns an unsubscribe function.
 */
export function onTokenRefresh(handler: TokenRefreshHandler): () => void {
  assertMessaging();

  return Messaging().onTokenRefresh((newToken: string) => {
    handler({ token: newToken, type: 'fcm' });
  });
}

/**
 * Set background message handler.
 * MUST be called at the top level (outside React tree), typically in index.js.
 */
export function setBackgroundMessageHandler(handler: MessageHandler): void {
  assertMessaging();

  Messaging().setBackgroundMessageHandler(async (rawMessage: unknown) => {
    const message = normalizeFirebaseMessage(rawMessage, 'background');
    await handler(message);
  });
}

/**
 * Subscribe to an FCM topic.
 */
export async function subscribeToTopic(topic: string): Promise<void> {
  assertMessaging();

  try {
    await Messaging().subscribeToTopic(topic);
  } catch (error) {
    throw normalizeFirebaseError(error);
  }
}

/**
 * Unsubscribe from an FCM topic.
 */
export async function unsubscribeFromTopic(topic: string): Promise<void> {
  assertMessaging();

  try {
    await Messaging().unsubscribeFromTopic(topic);
  } catch (error) {
    throw normalizeFirebaseError(error);
  }
}

/**
 * Get the APNs token (iOS only).
 * Returns null on Android.
 */
export async function getAPNsToken(): Promise<string | null> {
  if (Platform.OS !== 'ios' || !Messaging) return null;

  try {
    return await Messaging().getAPNSToken();
  } catch {
    return null;
  }
}

// ============================================================================
// Internal Helpers
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAuthStatus(status: any): PermissionResult {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFirebaseMessage(raw: any, origin: RemoteMessage['origin']): RemoteMessage {
  return {
    messageId: raw.messageId ?? '',
    data: raw.data ?? {},
    notification: raw.notification
      ? {
          title: raw.notification.title,
          body: raw.notification.body,
          imageUrl:
            raw.notification.android?.imageUrl ??
            raw.notification.ios?.imageUrl ??
            raw.notification.imageUrl,
        }
      : undefined,
    topic: raw.topic,
    collapseKey: raw.collapseKey,
    sentTime: raw.sentTime,
    ttl: raw.ttl,
    origin,
  };
}
