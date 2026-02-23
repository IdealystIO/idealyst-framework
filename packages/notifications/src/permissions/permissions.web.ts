import type { PermissionResult, RequestPermissionOptions } from '../types';
import { createNotificationError } from '../errors';

function mapWebPermission(permission: NotificationPermission): PermissionResult {
  switch (permission) {
    case 'granted':
      return { status: 'granted', canNotify: true };
    case 'denied':
      return { status: 'denied', canNotify: false };
    case 'default':
    default:
      return { status: 'undetermined', canNotify: false };
  }
}

/**
 * Check current notification permission without prompting.
 */
export async function checkPermission(): Promise<PermissionResult> {
  if (typeof Notification === 'undefined') {
    return { status: 'denied', canNotify: false };
  }
  return mapWebPermission(Notification.permission);
}

/**
 * Request notification permission from the user.
 */
export async function requestPermission(
  _options?: RequestPermissionOptions,
): Promise<PermissionResult> {
  if (typeof Notification === 'undefined') {
    throw createNotificationError(
      'not_supported',
      'Notifications are not supported in this browser',
    );
  }

  const permission = await Notification.requestPermission();
  return mapWebPermission(permission);
}

/**
 * Open system notification settings.
 * Browsers do not support programmatic settings access — this is a no-op.
 */
export async function openNotificationSettings(): Promise<void> {
  // Browsers have no API to open notification settings programmatically.
}
