import { useCallback, useEffect, useRef } from 'react';
import type {
  UseLocalNotificationsOptions,
  UseLocalNotificationsResult,
  DisplayNotificationOptions,
  ScheduleNotificationOptions,
  AndroidChannel,
  NotificationCategory,
  DisplayedNotification,
  PendingNotification,
  NotificationEventHandler,
} from '../types';

/**
 * Factory that creates a useLocalNotifications hook bound to platform-specific functions.
 * Each platform entry point calls this with the correct implementations.
 */
export function createUseLocalNotificationsHook(fns: {
  displayNotification: (options: DisplayNotificationOptions) => Promise<string>;
  scheduleNotification: (options: ScheduleNotificationOptions) => Promise<string>;
  cancelNotification: (id: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  createChannel: (channel: AndroidChannel) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
  getChannels: () => Promise<AndroidChannel[]>;
  setCategories: (categories: NotificationCategory[]) => Promise<void>;
  getDisplayedNotifications: () => Promise<DisplayedNotification[]>;
  getPendingNotifications: () => Promise<PendingNotification[]>;
  setBadgeCount: (count: number) => Promise<void>;
  getBadgeCount: () => Promise<number>;
  onNotificationEvent: (handler: NotificationEventHandler) => () => void;
}) {
  return function useLocalNotifications(
    options: UseLocalNotificationsOptions = {},
  ): UseLocalNotificationsResult {
    const { onEvent } = options;
    const mountedRef = useRef(true);

    useEffect(() => {
      mountedRef.current = true;
      let unsub: (() => void) | undefined;

      if (onEvent) {
        unsub = fns.onNotificationEvent(onEvent);
      }

      return () => {
        mountedRef.current = false;
        unsub?.();
      };
    }, [onEvent]);

    const displayNotification = useCallback(
      (opts: DisplayNotificationOptions) => fns.displayNotification(opts),
      [],
    );

    const scheduleNotification = useCallback(
      (opts: ScheduleNotificationOptions) => fns.scheduleNotification(opts),
      [],
    );

    const cancelNotification = useCallback(
      (id: string) => fns.cancelNotification(id),
      [],
    );

    const cancelAllNotifications = useCallback(
      () => fns.cancelAllNotifications(),
      [],
    );

    const createChannel = useCallback(
      (channel: AndroidChannel) => fns.createChannel(channel),
      [],
    );

    const deleteChannel = useCallback(
      (channelId: string) => fns.deleteChannel(channelId),
      [],
    );

    const getChannels = useCallback(() => fns.getChannels(), []);

    const setCategories = useCallback(
      (categories: NotificationCategory[]) => fns.setCategories(categories),
      [],
    );

    const getDisplayedNotifications = useCallback(
      () => fns.getDisplayedNotifications(),
      [],
    );

    const getPendingNotifications = useCallback(
      () => fns.getPendingNotifications(),
      [],
    );

    const setBadgeCount = useCallback(
      (count: number) => fns.setBadgeCount(count),
      [],
    );

    const getBadgeCount = useCallback(() => fns.getBadgeCount(), []);

    return {
      displayNotification,
      scheduleNotification,
      cancelNotification,
      cancelAllNotifications,
      createChannel,
      deleteChannel,
      getChannels,
      setCategories,
      getDisplayedNotifications,
      getPendingNotifications,
      setBadgeCount,
      getBadgeCount,
    };
  };
}
