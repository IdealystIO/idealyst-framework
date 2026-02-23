import type {
  PermissionResult,
  RequestPermissionOptions,
  PushToken,
  RemoteMessage,
  MessageHandler,
  TokenRefreshHandler,
  WebPushConfig,
} from '../types';
import { DEFAULT_SERVICE_WORKER_PATH } from '../constants';
import { createNotificationError } from '../errors';

// ============================================================================
// Configuration
// ============================================================================

let _config: WebPushConfig | null = null;
let _swRegistration: ServiceWorkerRegistration | null = null;
let _subscription: PushSubscription | null = null;
let _foregroundHandler: MessageHandler | null = null;
let _openedHandler: MessageHandler | null = null;
let _tokenRefreshHandler: TokenRefreshHandler | null = null;

/**
 * Configure web push with VAPID key and service worker path.
 * Must be called before requesting a push token.
 */
export function configurePush(config: WebPushConfig): void {
  _config = config;
}

// ============================================================================
// Push Functions
// ============================================================================

/**
 * Request push notification permission.
 */
export async function requestPushPermission(
  _options?: RequestPermissionOptions,
): Promise<PermissionResult> {
  if (typeof Notification === 'undefined') {
    throw createNotificationError(
      'not_supported',
      'Notifications are not supported in this browser',
    );
  }

  const permission = await Notification.requestPermission();
  return {
    status: permission === 'granted' ? 'granted' : permission === 'denied' ? 'denied' : 'undetermined',
    canNotify: permission === 'granted',
  };
}

/**
 * Check if push notification permission is granted.
 */
export async function hasPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false;
  return Notification.permission === 'granted';
}

/**
 * Get push token (PushSubscription) from the browser.
 * Requires configurePush() to have been called with a VAPID key.
 */
export async function getPushToken(): Promise<PushToken> {
  if (!_config?.vapidKey) {
    throw createNotificationError(
      'token_failed',
      'VAPID key not configured. Call configurePush({ vapidKey }) first.',
    );
  }

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw createNotificationError(
      'not_supported',
      'Push notifications are not supported in this browser',
    );
  }

  try {
    const registration = await navigator.serviceWorker.register(
      _config.serviceWorkerPath ?? DEFAULT_SERVICE_WORKER_PATH,
    );
    await navigator.serviceWorker.ready;
    _swRegistration = registration;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(_config.vapidKey),
    });

    _subscription = subscription;

    return {
      token: JSON.stringify(subscription.toJSON()),
      type: 'web',
    };
  } catch (error) {
    throw createNotificationError(
      'token_failed',
      error instanceof Error ? error.message : 'Failed to get push subscription',
      error,
    );
  }
}

/**
 * Delete push token (unsubscribe from push).
 */
export async function deletePushToken(): Promise<void> {
  if (_subscription) {
    try {
      await _subscription.unsubscribe();
    } catch {
      // Ignore unsubscribe errors
    }
    _subscription = null;
  }
}

/**
 * Register a handler for foreground push messages.
 * Returns an unsubscribe function.
 */
export function onForegroundMessage(handler: MessageHandler): () => void {
  _foregroundHandler = handler;

  const listener = (event: MessageEvent) => {
    if (event.data?.type === 'push-message' && _foregroundHandler) {
      const message = normalizeWebMessage(event.data, 'foreground');
      _foregroundHandler(message);
    }
  };

  navigator.serviceWorker?.addEventListener('message', listener);

  return () => {
    _foregroundHandler = null;
    navigator.serviceWorker?.removeEventListener('message', listener);
  };
}

/**
 * Register a handler for notification open events.
 * Returns an unsubscribe function.
 */
export function onNotificationOpened(handler: MessageHandler): () => void {
  _openedHandler = handler;

  const listener = (event: MessageEvent) => {
    if (event.data?.type === 'notification-click' && _openedHandler) {
      const message = normalizeWebMessage(event.data, 'background');
      _openedHandler(message);
    }
  };

  navigator.serviceWorker?.addEventListener('message', listener);

  return () => {
    _openedHandler = null;
    navigator.serviceWorker?.removeEventListener('message', listener);
  };
}

/**
 * Register a handler for token refresh events.
 * Returns an unsubscribe function.
 */
export function onTokenRefresh(handler: TokenRefreshHandler): () => void {
  _tokenRefreshHandler = handler;

  // Web push subscriptions can change when service worker updates.
  // Listen for pushsubscriptionchange via the service worker.
  const listener = async () => {
    if (_tokenRefreshHandler && _config) {
      try {
        const token = await getPushToken();
        _tokenRefreshHandler(token);
      } catch {
        // Silently fail on token refresh
      }
    }
  };

  navigator.serviceWorker?.addEventListener('controllerchange', listener);

  return () => {
    _tokenRefreshHandler = null;
    navigator.serviceWorker?.removeEventListener('controllerchange', listener);
  };
}

/**
 * Set background message handler.
 * On web, background push messages are handled by the Service Worker.
 * This is a no-op — implement background handling in your service worker script.
 */
export function setBackgroundMessageHandler(_handler: MessageHandler): void {
  // No-op: background messages are handled by the Service Worker.
}

/**
 * Subscribe to a topic.
 * Not supported on web — topic management should be done server-side.
 */
export async function subscribeToTopic(_topic: string): Promise<void> {
  // No-op: topic subscriptions are managed server-side for web push.
}

/**
 * Unsubscribe from a topic.
 * Not supported on web — topic management should be done server-side.
 */
export async function unsubscribeFromTopic(_topic: string): Promise<void> {
  // No-op: topic subscriptions are managed server-side for web push.
}

// ============================================================================
// Internal Helpers
// ============================================================================

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeWebMessage(data: any, origin: RemoteMessage['origin']): RemoteMessage {
  return {
    messageId: data.messageId ?? data.id ?? String(Date.now()),
    data: data.data ?? {},
    notification: data.notification
      ? {
          title: data.notification.title,
          body: data.notification.body,
          imageUrl: data.notification.image ?? data.notification.imageUrl,
        }
      : undefined,
    origin,
  };
}
