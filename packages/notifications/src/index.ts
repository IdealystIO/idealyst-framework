// Default entry — re-exports web implementation.
// Platform-specific entry points (index.native.ts, index.web.ts) are resolved by bundlers.
export * from './types';
export {
  DEFAULT_PERMISSION_RESULT,
  DEFAULT_CHANNEL,
  DEFAULT_CHANNEL_ID,
  CHANNEL_PRESETS,
  DEFAULT_SERVICE_WORKER_PATH,
} from './constants';
export { createNotificationError } from './errors';

// Push
export {
  configurePush,
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
} from './push/push.web';

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
} from './local/local.web';

// Permissions
export {
  checkPermission,
  requestPermission,
  openNotificationSettings,
} from './permissions/permissions.web';

// Hooks — bound to web implementations
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
} from './push/push.web';

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
} from './local/local.web';

import {
  checkPermission,
  requestPermission,
  openNotificationSettings,
} from './permissions/permissions.web';

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
