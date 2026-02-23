import type {
  DisplayNotificationOptions,
  ScheduleNotificationOptions,
  DisplayedNotification,
  PendingNotification,
  AndroidChannel,
  NotificationCategory,
  NotificationEvent,
  NotificationEventHandler,
} from '../types';
import { createNotificationError } from '../errors';

// ============================================================================
// Internal State
// ============================================================================

interface TrackedNotification {
  id: string;
  notification: Notification;
  options: DisplayNotificationOptions;
  displayedAt: number;
}

interface ScheduledNotification {
  id: string;
  options: ScheduleNotificationOptions;
  timerId: ReturnType<typeof setTimeout>;
  intervalId?: ReturnType<typeof setInterval>;
}

const _displayed = new Map<string, TrackedNotification>();
const _pending = new Map<string, ScheduledNotification>();
const _eventHandlers = new Set<NotificationEventHandler>();
let _badgeCount = 0;
let _idCounter = 0;

function generateId(): string {
  return `notif_${Date.now()}_${++_idCounter}`;
}

// ============================================================================
// Display Functions
// ============================================================================

/**
 * Display a notification immediately.
 * Returns the notification ID.
 */
export async function displayNotification(
  options: DisplayNotificationOptions,
): Promise<string> {
  if (typeof Notification === 'undefined') {
    throw createNotificationError(
      'not_supported',
      'Notifications are not supported in this browser',
    );
  }

  if (Notification.permission !== 'granted') {
    throw createNotificationError(
      'permission_denied',
      'Notification permission not granted',
    );
  }

  const id = options.id ?? generateId();

  const notification = new Notification(options.title, {
    body: options.body,
    icon: options.imageUrl,
    tag: id,
    data: { id, ...options.data },
    silent: options.sound === undefined,
    badge: options.imageUrl,
  });

  const tracked: TrackedNotification = {
    id,
    notification,
    options,
    displayedAt: Date.now(),
  };

  _displayed.set(id, tracked);

  notification.onclick = () => {
    emitEvent({
      type: 'press',
      id,
      notification: {
        id,
        title: options.title,
        body: options.body,
        data: options.data,
        date: tracked.displayedAt,
      },
    });
  };

  notification.onclose = () => {
    _displayed.delete(id);
    emitEvent({
      type: 'dismissed',
      id,
      notification: {
        id,
        title: options.title,
        body: options.body,
        data: options.data,
        date: tracked.displayedAt,
      },
    });
  };

  return id;
}

/**
 * Schedule a notification.
 * Returns the notification ID.
 *
 * Note: Web scheduling uses setTimeout/setInterval and is lost on page close.
 */
export async function scheduleNotification(
  options: ScheduleNotificationOptions,
): Promise<string> {
  const id = options.id ?? generateId();
  const { trigger } = options;

  if (trigger.type === 'timestamp' && trigger.timestamp) {
    const delay = Math.max(0, trigger.timestamp - Date.now());

    if (trigger.repeatFrequency && trigger.repeatFrequency !== 'none') {
      // Initial delay, then repeat
      const intervalMs = getRepeatIntervalMs(trigger.repeatFrequency);
      const timerId = setTimeout(() => {
        displayNotification({ ...options, id });
        const intervalId = setInterval(() => {
          displayNotification({ ...options, id: generateId() });
        }, intervalMs);
        const existing = _pending.get(id);
        if (existing) {
          existing.intervalId = intervalId;
        }
      }, delay);

      _pending.set(id, { id, options, timerId });
    } else {
      const timerId = setTimeout(() => {
        _pending.delete(id);
        displayNotification({ ...options, id });
      }, delay);
      _pending.set(id, { id, options, timerId });
    }
  } else if (trigger.type === 'interval' && trigger.interval) {
    const intervalMs = trigger.interval * 60 * 1000;

    if (trigger.repeatFrequency && trigger.repeatFrequency !== 'none') {
      const timerId = setTimeout(() => {
        displayNotification({ ...options, id });
      }, intervalMs);

      const intervalId = setInterval(() => {
        displayNotification({ ...options, id: generateId() });
      }, intervalMs);

      _pending.set(id, { id, options, timerId, intervalId });
    } else {
      const timerId = setTimeout(() => {
        _pending.delete(id);
        displayNotification({ ...options, id });
      }, intervalMs);
      _pending.set(id, { id, options, timerId });
    }
  }

  return id;
}

// ============================================================================
// Cancel Functions
// ============================================================================

/**
 * Cancel a specific notification by ID.
 */
export async function cancelNotification(id: string): Promise<void> {
  // Cancel displayed
  const displayed = _displayed.get(id);
  if (displayed) {
    displayed.notification.close();
    _displayed.delete(id);
  }

  // Cancel pending
  const pending = _pending.get(id);
  if (pending) {
    clearTimeout(pending.timerId);
    if (pending.intervalId) clearInterval(pending.intervalId);
    _pending.delete(id);
  }
}

/**
 * Cancel all notifications (displayed + pending).
 */
export async function cancelAllNotifications(): Promise<void> {
  await cancelDisplayedNotifications();
  await cancelPendingNotifications();
}

/**
 * Cancel all currently displayed notifications.
 */
export async function cancelDisplayedNotifications(): Promise<void> {
  for (const [id, tracked] of _displayed) {
    tracked.notification.close();
  }
  _displayed.clear();
}

/**
 * Cancel all pending (scheduled) notifications.
 */
export async function cancelPendingNotifications(): Promise<void> {
  for (const [id, pending] of _pending) {
    clearTimeout(pending.timerId);
    if (pending.intervalId) clearInterval(pending.intervalId);
  }
  _pending.clear();
}

// ============================================================================
// Channels (Android — no-op on web)
// ============================================================================

export async function createChannel(_channel: AndroidChannel): Promise<void> {
  // No-op: Android notification channels have no web equivalent.
}

export async function deleteChannel(_channelId: string): Promise<void> {
  // No-op
}

export async function getChannels(): Promise<AndroidChannel[]> {
  return [];
}

// ============================================================================
// Categories (iOS — no-op on web)
// ============================================================================

export async function setCategories(
  _categories: NotificationCategory[],
): Promise<void> {
  // No-op: iOS notification categories have no web equivalent.
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Get all currently displayed notifications.
 */
export async function getDisplayedNotifications(): Promise<DisplayedNotification[]> {
  return Array.from(_displayed.values()).map((tracked) => ({
    id: tracked.id,
    title: tracked.options.title,
    body: tracked.options.body,
    data: tracked.options.data,
    date: tracked.displayedAt,
  }));
}

/**
 * Get all pending (scheduled) notifications.
 */
export async function getPendingNotifications(): Promise<PendingNotification[]> {
  return Array.from(_pending.values()).map((pending) => ({
    id: pending.id,
    title: pending.options.title,
    body: pending.options.body,
    trigger: pending.options.trigger,
    data: pending.options.data,
  }));
}

// ============================================================================
// Badge
// ============================================================================

/**
 * Set the app badge count (PWA Badge API).
 */
export async function setBadgeCount(count: number): Promise<void> {
  _badgeCount = count;

  if ('setAppBadge' in navigator) {
    try {
      if (count > 0) {
        await (navigator as Navigator & { setAppBadge: (n: number) => Promise<void> }).setAppBadge(count);
      } else {
        await (navigator as Navigator & { clearAppBadge: () => Promise<void> }).clearAppBadge();
      }
    } catch {
      // Badge API may not be supported or permission may be denied
    }
  }
}

/**
 * Get the current app badge count.
 * Returns the last set count (no read API exists on web).
 */
export async function getBadgeCount(): Promise<number> {
  return _badgeCount;
}

// ============================================================================
// Events
// ============================================================================

/**
 * Register a handler for notification events (press, dismiss).
 * Returns an unsubscribe function.
 */
export function onNotificationEvent(handler: NotificationEventHandler): () => void {
  _eventHandlers.add(handler);
  return () => {
    _eventHandlers.delete(handler);
  };
}

// ============================================================================
// Internal Helpers
// ============================================================================

function emitEvent(event: NotificationEvent): void {
  for (const handler of _eventHandlers) {
    try {
      handler(event);
    } catch {
      // Don't let handler errors break other handlers
    }
  }
}

function getRepeatIntervalMs(frequency: string): number {
  switch (frequency) {
    case 'hourly':
      return 60 * 60 * 1000;
    case 'daily':
      return 24 * 60 * 60 * 1000;
    case 'weekly':
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}
