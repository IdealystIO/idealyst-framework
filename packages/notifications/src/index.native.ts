export * from './types';
export {
  DEFAULT_PERMISSION_RESULT,
  DEFAULT_CHANNEL,
  DEFAULT_CHANNEL_ID,
  CHANNEL_PRESETS,
} from './constants';
export { createNotificationError } from './errors';

// Push
export {
  requestPushPermission,
  getPushToken,
  deletePushToken,
  hasPermission,
  onForegroundMessage,
  onNotificationOpened,
  onTokenRefresh,
  setBackgroundMessageHandler,
  subscribeToTopic,
  unsubscribeFromTopic,
  getAPNsToken,
} from './push/push.native';

// Local
export {
  displayNotification,
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  cancelDisplayedNotifications,
  cancelPendingNotifications,
  createChannel,
  deleteChannel,
  getChannels,
  setCategories,
  getDisplayedNotifications,
  getPendingNotifications,
  setBadgeCount,
  getBadgeCount,
  onNotificationEvent,
} from './local/local.native';

// Permissions
export {
  checkPermission,
  requestPermission,
  openNotificationSettings,
} from './permissions/permissions.native';

// Hooks — bound to native implementations
import { createUsePushNotificationsHook } from './push/usePushNotifications';
import { createUseLocalNotificationsHook } from './local/useLocalNotifications';
import { createUseNotificationPermissionsHook } from './permissions/useNotificationPermissions';

import {
  requestPushPermission,
  getPushToken,
  deletePushToken,
  onForegroundMessage,
  onNotificationOpened,
  onTokenRefresh,
  subscribeToTopic,
  unsubscribeFromTopic,
} from './push/push.native';

import {
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
  onNotificationEvent,
} from './local/local.native';

import {
  checkPermission,
  requestPermission,
  openNotificationSettings,
} from './permissions/permissions.native';

export const usePushNotifications = createUsePushNotificationsHook({
  requestPushPermission,
  getPushToken,
  deletePushToken,
  onForegroundMessage,
  onNotificationOpened,
  onTokenRefresh,
  subscribeToTopic,
  unsubscribeFromTopic,
});

export const useLocalNotifications = createUseLocalNotificationsHook({
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
  onNotificationEvent,
});

export const useNotificationPermissions = createUseNotificationPermissionsHook({
  checkPermission,
  requestPermission,
  openNotificationSettings,
});
