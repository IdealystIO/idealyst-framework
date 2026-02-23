import type { NotificationError, NotificationErrorCode } from './types';

export function createNotificationError(
  code: NotificationErrorCode,
  message: string,
  originalError?: unknown,
): NotificationError {
  return { code, message, originalError };
}

/**
 * Normalize errors from @react-native-firebase/messaging into NotificationError.
 */
export function normalizeFirebaseError(error: unknown): NotificationError {
  if (error && typeof error === 'object' && 'code' in error) {
    const fbError = error as { code?: string; message?: string };

    switch (fbError.code) {
      case 'messaging/permission-blocked':
      case 'messaging/permission-denied':
        return createNotificationError(
          'permission_denied',
          'Notification permission was denied by the user',
          error,
        );
      case 'messaging/token-subscribe-failed':
      case 'messaging/token-unsubscribe-failed':
        return createNotificationError(
          'token_failed',
          fbError.message || 'Failed to manage push token',
          error,
        );
      case 'messaging/topic-subscribe-failed':
      case 'messaging/topic-unsubscribe-failed':
        return createNotificationError(
          'topic_failed',
          fbError.message || 'Failed to manage topic subscription',
          error,
        );
      case 'messaging/unknown':
      default:
        return createNotificationError(
          'unknown',
          fbError.message || 'An unknown messaging error occurred',
          error,
        );
    }
  }

  if (error instanceof Error) {
    return createNotificationError('unknown', error.message, error);
  }

  return createNotificationError('unknown', String(error), error);
}

/**
 * Normalize errors from @notifee/react-native into NotificationError.
 */
export function normalizeNotifeeError(error: unknown): NotificationError {
  if (error && typeof error === 'object' && 'code' in error) {
    const nError = error as { code?: string; message?: string };

    if (nError.code?.includes('permission')) {
      return createNotificationError(
        'permission_denied',
        nError.message || 'Notification permission denied',
        error,
      );
    }

    if (nError.code?.includes('channel')) {
      return createNotificationError(
        'channel_failed',
        nError.message || 'Failed to manage notification channel',
        error,
      );
    }

    return createNotificationError(
      'unknown',
      nError.message || 'A notification error occurred',
      error,
    );
  }

  if (error instanceof Error) {
    return createNotificationError('unknown', error.message, error);
  }

  return createNotificationError('unknown', String(error), error);
}
