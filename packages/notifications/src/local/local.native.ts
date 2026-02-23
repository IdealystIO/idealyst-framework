// ============================================================================
// Native Local Notification Implementation
// Wraps @notifee/react-native for rich local notifications on iOS and Android.
// ============================================================================

import { Platform } from 'react-native';
import type {
  DisplayNotificationOptions,
  ScheduleNotificationOptions,
  DisplayedNotification,
  PendingNotification,
  AndroidChannel,
  AndroidNotificationStyle,
  NotificationCategory,
  NotificationEvent,
  NotificationEventHandler,
  NotificationImportance,
} from '../types';
import { createNotificationError, normalizeNotifeeError } from '../errors';
import { DEFAULT_CHANNEL_ID } from '../constants';

// Graceful optional import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Notifee: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NotifeeEventType: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NotifeeTriggerType: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NotifeeRepeatFrequency: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NotifeeAndroidImportance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NotifeeAndroidVisibility: any = null;

try {
  const notifeeModule = require('@notifee/react-native');
  Notifee = notifeeModule.default;
  NotifeeEventType = notifeeModule.EventType;
  NotifeeTriggerType = notifeeModule.TriggerType;
  NotifeeRepeatFrequency = notifeeModule.RepeatFrequency;
  NotifeeAndroidImportance = notifeeModule.AndroidImportance;
  NotifeeAndroidVisibility = notifeeModule.AndroidVisibility;
} catch {
  // Will degrade gracefully
}

function assertNotifee(): void {
  if (!Notifee) {
    throw createNotificationError(
      'not_available',
      '@notifee/react-native is not installed. Run: yarn add @notifee/react-native',
    );
  }
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
  assertNotifee();

  try {
    const id = await Notifee.displayNotification(mapToNotifee(options));
    return id;
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

/**
 * Schedule a notification with a trigger.
 * Returns the notification ID.
 */
export async function scheduleNotification(
  options: ScheduleNotificationOptions,
): Promise<string> {
  assertNotifee();

  try {
    const trigger = mapTrigger(options.trigger);
    const id = await Notifee.createTriggerNotification(
      mapToNotifee(options),
      trigger,
    );
    return id;
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

// ============================================================================
// Cancel Functions
// ============================================================================

export async function cancelNotification(id: string): Promise<void> {
  assertNotifee();
  try {
    await Notifee.cancelNotification(id);
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  assertNotifee();
  try {
    await Notifee.cancelAllNotifications();
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

export async function cancelDisplayedNotifications(): Promise<void> {
  assertNotifee();
  try {
    await Notifee.cancelDisplayedNotifications();
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

export async function cancelPendingNotifications(): Promise<void> {
  assertNotifee();
  try {
    await Notifee.cancelTriggerNotifications();
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

// ============================================================================
// Channels (Android)
// ============================================================================

export async function createChannel(channel: AndroidChannel): Promise<void> {
  assertNotifee();
  if (Platform.OS !== 'android') return;

  try {
    await Notifee.createChannel({
      id: channel.id,
      name: channel.name,
      description: channel.description,
      importance: mapImportance(channel.importance),
      vibration: channel.vibration,
      vibrationPattern: channel.vibrationPattern,
      lights: channel.lights,
      lightColor: channel.lightColor,
      sound: channel.sound ?? 'default',
      badge: channel.badge,
      visibility: mapVisibility(channel.visibility),
    });
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

export async function deleteChannel(channelId: string): Promise<void> {
  assertNotifee();
  if (Platform.OS !== 'android') return;

  try {
    await Notifee.deleteChannel(channelId);
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

export async function getChannels(): Promise<AndroidChannel[]> {
  assertNotifee();
  if (Platform.OS !== 'android') return [];

  try {
    const channels = await Notifee.getChannels();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return channels.map((ch: any) => ({
      id: ch.id,
      name: ch.name,
      description: ch.description,
      importance: reverseMapImportance(ch.importance),
      vibration: ch.vibration,
      vibrationPattern: ch.vibrationPattern,
      lights: ch.lights,
      lightColor: ch.lightColor,
      sound: ch.sound,
      badge: ch.badge,
      visibility: reverseMapVisibility(ch.visibility),
    }));
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

// ============================================================================
// Categories (iOS)
// ============================================================================

export async function setCategories(
  categories: NotificationCategory[],
): Promise<void> {
  assertNotifee();
  if (Platform.OS !== 'ios') return;

  try {
    await Notifee.setNotificationCategories(
      categories.map((cat) => ({
        id: cat.id,
        actions: cat.actions.map((action) => ({
          id: action.id,
          title: action.title,
          foreground: action.foreground,
          destructive: action.destructive,
          input: action.input
            ? { placeholderText: action.inputPlaceholder }
            : undefined,
        })),
      })),
    );
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

// ============================================================================
// Queries
// ============================================================================

export async function getDisplayedNotifications(): Promise<DisplayedNotification[]> {
  assertNotifee();

  try {
    const notifications = await Notifee.getDisplayedNotifications();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return notifications.map((n: any) => ({
      id: n.id,
      title: n.notification?.title,
      body: n.notification?.body,
      data: n.notification?.data,
      date: n.date,
    }));
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

export async function getPendingNotifications(): Promise<PendingNotification[]> {
  assertNotifee();

  try {
    const triggers = await Notifee.getTriggerNotifications();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return triggers.map((t: any) => ({
      id: t.notification?.id ?? '',
      title: t.notification?.title,
      body: t.notification?.body,
      trigger: {
        type: t.trigger?.type === 0 ? 'timestamp' : 'interval',
        timestamp: t.trigger?.timestamp,
        interval: t.trigger?.interval,
        repeatFrequency: reverseMapRepeatFrequency(t.trigger?.repeatFrequency),
      },
      data: t.notification?.data,
    }));
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

// ============================================================================
// Badge
// ============================================================================

export async function setBadgeCount(count: number): Promise<void> {
  assertNotifee();
  try {
    await Notifee.setBadgeCount(count);
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

export async function getBadgeCount(): Promise<number> {
  assertNotifee();
  try {
    return await Notifee.getBadgeCount();
  } catch (error) {
    throw normalizeNotifeeError(error);
  }
}

// ============================================================================
// Events
// ============================================================================

/**
 * Register a handler for foreground notification events.
 * Returns an unsubscribe function.
 */
export function onNotificationEvent(handler: NotificationEventHandler): () => void {
  assertNotifee();

  return Notifee.onForegroundEvent(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ type, detail }: { type: number; detail: any }) => {
      const event = mapNotifeeEvent(type, detail);
      if (event) handler(event);
    },
  );
}

// ============================================================================
// Internal Helpers
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToNotifee(options: DisplayNotificationOptions): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifeeNotification: any = {
    id: options.id,
    title: options.title,
    body: options.body,
    subtitle: options.subtitle,
    data: options.data,
  };

  // Android options
  if (Platform.OS === 'android') {
    notifeeNotification.android = {
      channelId: options.android?.channelId ?? DEFAULT_CHANNEL_ID,
      smallIcon: options.android?.smallIcon ?? 'ic_notification',
      largeIcon: options.android?.largeIcon,
      color: options.android?.color,
      importance: options.android?.importance
        ? mapImportance(options.android.importance)
        : undefined,
      ongoing: options.android?.ongoing,
      autoCancel: options.android?.autoCancel ?? true,
      groupId: options.android?.groupId,
      groupSummary: options.android?.groupSummary,
      sound: options.sound ?? 'default',
      pressAction: options.android?.pressAction ?? { id: 'default' },
    };

    if (options.android?.progress) {
      notifeeNotification.android.progress = options.android.progress;
    }

    if (options.android?.style) {
      notifeeNotification.android.style = mapAndroidStyle(options.android.style);
    }

    if (options.android?.actions) {
      notifeeNotification.android.actions = options.android.actions.map(
        (action) => ({
          title: action.title,
          pressAction: { id: action.id },
          icon: action.icon,
          input: action.input
            ? { placeholder: action.inputPlaceholder }
            : undefined,
        }),
      );
    }

    if (options.imageUrl) {
      notifeeNotification.android.largeIcon =
        notifeeNotification.android.largeIcon ?? options.imageUrl;
    }
  }

  // iOS options
  if (Platform.OS === 'ios') {
    notifeeNotification.ios = {
      categoryId: options.ios?.categoryId ?? options.categoryId,
      interruptionLevel: options.ios?.interruptionLevel,
      relevanceScore: options.ios?.relevanceScore,
      targetContentId: options.ios?.targetContentId,
      sound: options.sound ?? 'default',
      badgeCount: options.badge,
      threadId: options.threadId,
    };

    if (options.ios?.attachments) {
      notifeeNotification.ios.attachments = options.ios.attachments.map(
        (att) => ({
          url: att.url,
          id: att.id,
          thumbnailHidden: att.thumbnailHidden,
        }),
      );
    }
  }

  return notifeeNotification;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTrigger(trigger: ScheduleNotificationOptions['trigger']): any {
  if (trigger.type === 'timestamp') {
    return {
      type: NotifeeTriggerType?.TIMESTAMP ?? 0,
      timestamp: trigger.timestamp,
      repeatFrequency: mapRepeatFrequency(trigger.repeatFrequency),
      alarmManager: trigger.alarmManager
        ? { allowWhileIdle: true }
        : undefined,
    };
  }

  return {
    type: NotifeeTriggerType?.INTERVAL ?? 1,
    interval: trigger.interval,
    timeUnit: 2, // MINUTES
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAndroidStyle(style: AndroidNotificationStyle): any {
  if (!style) return undefined;

  switch (style.type) {
    case 'bigPicture':
      return { type: 0, picture: style.picture, title: style.title, summary: style.summary };
    case 'bigText':
      return { type: 1, text: style.text, title: style.title, summary: style.summary };
    case 'inbox':
      return { type: 2, lines: style.lines, title: style.title, summary: style.summary };
    case 'messaging':
      return {
        type: 3,
        person: style.person,
        messages: style.messages,
      };
    default:
      return undefined;
  }
}

function mapImportance(importance?: NotificationImportance): number {
  if (!NotifeeAndroidImportance) {
    // Fallback numeric values matching Notifee's AndroidImportance enum
    switch (importance) {
      case 'none': return 0;
      case 'min': return 1;
      case 'low': return 2;
      case 'default': return 3;
      case 'high': return 4;
      case 'max': return 5;
      default: return 3;
    }
  }

  switch (importance) {
    case 'none': return NotifeeAndroidImportance.NONE;
    case 'min': return NotifeeAndroidImportance.MIN;
    case 'low': return NotifeeAndroidImportance.LOW;
    case 'default': return NotifeeAndroidImportance.DEFAULT;
    case 'high': return NotifeeAndroidImportance.HIGH;
    case 'max': return NotifeeAndroidImportance.MAX;
    default: return NotifeeAndroidImportance.DEFAULT;
  }
}

function reverseMapImportance(importance: number): NotificationImportance {
  switch (importance) {
    case 0: return 'none';
    case 1: return 'min';
    case 2: return 'low';
    case 3: return 'default';
    case 4: return 'high';
    case 5: return 'max';
    default: return 'default';
  }
}

function mapVisibility(visibility?: string): number | undefined {
  if (!visibility) return undefined;

  if (NotifeeAndroidVisibility) {
    switch (visibility) {
      case 'private': return NotifeeAndroidVisibility.PRIVATE;
      case 'public': return NotifeeAndroidVisibility.PUBLIC;
      case 'secret': return NotifeeAndroidVisibility.SECRET;
      default: return NotifeeAndroidVisibility.PRIVATE;
    }
  }

  switch (visibility) {
    case 'private': return 0;
    case 'public': return 1;
    case 'secret': return -1;
    default: return 0;
  }
}

function reverseMapVisibility(visibility: number): 'private' | 'public' | 'secret' {
  switch (visibility) {
    case 1: return 'public';
    case -1: return 'secret';
    case 0:
    default: return 'private';
  }
}

function mapRepeatFrequency(frequency?: string): number | undefined {
  if (!frequency || frequency === 'none') return undefined;

  if (NotifeeRepeatFrequency) {
    switch (frequency) {
      case 'hourly': return NotifeeRepeatFrequency.HOURLY;
      case 'daily': return NotifeeRepeatFrequency.DAILY;
      case 'weekly': return NotifeeRepeatFrequency.WEEKLY;
      default: return undefined;
    }
  }

  switch (frequency) {
    case 'hourly': return 1;
    case 'daily': return 2;
    case 'weekly': return 3;
    default: return undefined;
  }
}

function reverseMapRepeatFrequency(frequency?: number): 'none' | 'hourly' | 'daily' | 'weekly' {
  switch (frequency) {
    case 1: return 'hourly';
    case 2: return 'daily';
    case 3: return 'weekly';
    default: return 'none';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNotifeeEvent(type: number, detail: any): NotificationEvent | null {
  const notification = detail?.notification;
  if (!notification) return null;

  const displayed: DisplayedNotification = {
    id: notification.id ?? '',
    title: notification.title,
    body: notification.body,
    data: notification.data,
  };

  // NotifeeEventType: 1=DISMISSED, 2=PRESS, 3=ACTION_PRESS
  switch (type) {
    case 2: // PRESS
      return { type: 'press', id: displayed.id, notification: displayed };
    case 3: // ACTION_PRESS
      return {
        type: 'action_press',
        id: displayed.id,
        notification: displayed,
        actionId: detail.pressAction?.id,
        input: detail.input,
      };
    case 1: // DISMISSED
      return { type: 'dismissed', id: displayed.id, notification: displayed };
    default:
      return null;
  }
}
