// ============================================================================
// Permission Types
// ============================================================================

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'provisional'
  | 'blocked';

export interface PermissionResult {
  /** Current permission status. */
  status: PermissionStatus;
  /** Whether permission is sufficient to show notifications. */
  canNotify: boolean;
  /** iOS only: specific iOS authorization status details. */
  ios?: {
    alert: boolean;
    badge: boolean;
    sound: boolean;
    criticalAlert: boolean;
    provisional: boolean;
  };
}

export interface RequestPermissionOptions {
  /** iOS: request provisional (silent) authorization. */
  provisional?: boolean;
  /** iOS: request critical alert permission (requires entitlement). */
  criticalAlert?: boolean;
  /** iOS: request permission for specific notification types. */
  ios?: {
    alert?: boolean;
    badge?: boolean;
    sound?: boolean;
    criticalAlert?: boolean;
    provisional?: boolean;
    carPlay?: boolean;
    announcement?: boolean;
  };
}

// ============================================================================
// Push Notification Types
// ============================================================================

export type PushTokenType = 'fcm' | 'apns' | 'web';

export interface PushToken {
  /** The device token string. */
  token: string;
  /** Token type (fcm for Android, apns/fcm for iOS, web for browser). */
  type: PushTokenType;
}

export interface RemoteMessage {
  /** Unique message identifier. */
  messageId: string;
  /** Message payload data (key-value pairs). */
  data: Record<string, string>;
  /** Notification payload (title/body for display). */
  notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  /** FCM topic name if message was sent to a topic. */
  topic?: string;
  /** FCM collapse key. */
  collapseKey?: string;
  /** Message sent time (ms since epoch). */
  sentTime?: number;
  /** Time-to-live in seconds. */
  ttl?: number;
  /** Where the message was received. */
  origin: 'foreground' | 'background' | 'quit';
}

export type MessageHandler = (message: RemoteMessage) => void | Promise<void>;

export type TokenRefreshHandler = (token: PushToken) => void;

/** Web push configuration (web only). */
export interface WebPushConfig {
  /** VAPID public key (base64 string). */
  vapidKey: string;
  /** Path to the Service Worker file. Default: '/sw.js'. */
  serviceWorkerPath?: string;
}

// ============================================================================
// Local Notification Types
// ============================================================================

export type NotificationImportance =
  | 'none'
  | 'min'
  | 'low'
  | 'default'
  | 'high'
  | 'max';

export type NotificationVisibility =
  | 'private'
  | 'public'
  | 'secret';

export interface NotificationAction {
  /** Unique action identifier. */
  id: string;
  /** Button label shown to user. */
  title: string;
  /** Icon name (Android only, optional). */
  icon?: string;
  /** Whether this action opens the app. */
  foreground?: boolean;
  /** Whether this action is destructive (iOS: red, Android: dismiss). */
  destructive?: boolean;
  /** Whether this action accepts text input. */
  input?: boolean;
  /** Placeholder text for input actions. */
  inputPlaceholder?: string;
}

export interface NotificationCategory {
  /** Unique category identifier. */
  id: string;
  /** Actions to display with notifications of this category. */
  actions: NotificationAction[];
}

export interface AndroidChannel {
  /** Unique channel identifier. */
  id: string;
  /** Channel display name. */
  name: string;
  /** Channel description (shown in system settings). */
  description?: string;
  /** Importance level. */
  importance?: NotificationImportance;
  /** Enable vibration. */
  vibration?: boolean;
  /** Vibration pattern (ms). */
  vibrationPattern?: number[];
  /** Enable notification light. */
  lights?: boolean;
  /** Light color (hex). */
  lightColor?: string;
  /** Sound file name (without extension) in res/raw. */
  sound?: string;
  /** Badge (show dot on app icon). */
  badge?: boolean;
  /** Show on lock screen. */
  visibility?: NotificationVisibility;
}

export type RepeatFrequency =
  | 'none'
  | 'hourly'
  | 'daily'
  | 'weekly';

export interface NotificationTrigger {
  /** Type of trigger. */
  type: 'timestamp' | 'interval';
  /** For timestamp trigger: the date/time to fire (ms since epoch). */
  timestamp?: number;
  /** For interval trigger: interval in minutes. */
  interval?: number;
  /** Repeat frequency. 'none' = fire once. */
  repeatFrequency?: RepeatFrequency;
  /** Whether the notification should fire even if app is in low-power mode (Android). */
  alarmManager?: boolean;
}

export interface NotificationContent {
  /** Notification title. */
  title: string;
  /** Notification body text. */
  body?: string;
  /** Subtitle (iOS) or sub-text (Android). */
  subtitle?: string;
  /** Custom data payload (passed to press handlers). */
  data?: Record<string, string>;
  /** Category ID (for action buttons). */
  categoryId?: string;
  /** Badge count (iOS) or badge number (Android). */
  badge?: number;
  /** Sound file name (without extension). Use 'default' for system sound. */
  sound?: string;
  /** Image URL for big picture style. */
  imageUrl?: string;
  /** Thread identifier (iOS) for notification grouping. */
  threadId?: string;
}

export type AndroidNotificationStyle =
  | { type: 'bigPicture'; picture: string; title?: string; summary?: string }
  | { type: 'bigText'; text: string; title?: string; summary?: string }
  | { type: 'inbox'; lines: string[]; title?: string; summary?: string }
  | {
      type: 'messaging';
      person: { name: string; icon?: string };
      messages: Array<{ text: string; timestamp: number }>;
    };

export interface DisplayNotificationOptions extends NotificationContent {
  /** Unique notification identifier. Auto-generated if omitted. */
  id?: string;
  /** Android-specific options. */
  android?: {
    channelId?: string;
    smallIcon?: string;
    largeIcon?: string;
    color?: string;
    pressAction?: { id: string; launchActivity?: string };
    importance?: NotificationImportance;
    ongoing?: boolean;
    autoCancel?: boolean;
    groupId?: string;
    groupSummary?: boolean;
    progress?: { max: number; current: number; indeterminate?: boolean };
    actions?: NotificationAction[];
    style?: AndroidNotificationStyle;
  };
  /** iOS-specific options. */
  ios?: {
    categoryId?: string;
    interruptionLevel?: 'passive' | 'active' | 'timeSensitive' | 'critical';
    relevanceScore?: number;
    targetContentId?: string;
    attachments?: Array<{
      url: string;
      id?: string;
      thumbnailHidden?: boolean;
    }>;
  };
}

export interface ScheduleNotificationOptions extends DisplayNotificationOptions {
  /** Trigger configuration. */
  trigger: NotificationTrigger;
}

export interface DisplayedNotification {
  /** Notification identifier. */
  id: string;
  /** Notification title. */
  title?: string;
  /** Notification body. */
  body?: string;
  /** Custom data. */
  data?: Record<string, string>;
  /** Date displayed (ms since epoch). */
  date?: number;
}

export interface PendingNotification {
  /** Notification identifier. */
  id: string;
  /** Notification title. */
  title?: string;
  /** Notification body. */
  body?: string;
  /** Trigger details. */
  trigger: NotificationTrigger;
  /** Custom data. */
  data?: Record<string, string>;
}

export type NotificationEventType =
  | 'press'
  | 'action_press'
  | 'dismissed';

export interface NotificationEvent {
  /** Event type. */
  type: NotificationEventType;
  /** Notification identifier. */
  id: string;
  /** Notification content. */
  notification: DisplayedNotification;
  /** Action ID (only for 'action_press' events). */
  actionId?: string;
  /** Input text (only for input actions). */
  input?: string;
}

export type NotificationEventHandler = (event: NotificationEvent) => void | Promise<void>;

// ============================================================================
// Error Types
// ============================================================================

export type NotificationErrorCode =
  | 'not_available'
  | 'not_supported'
  | 'permission_denied'
  | 'token_failed'
  | 'display_failed'
  | 'schedule_failed'
  | 'cancel_failed'
  | 'channel_failed'
  | 'topic_failed'
  | 'unknown';

export interface NotificationError {
  code: NotificationErrorCode;
  message: string;
  /** Original error from underlying library. */
  originalError?: unknown;
}

// ============================================================================
// Hook Types: usePushNotifications
// ============================================================================

export interface UsePushNotificationsOptions {
  /** Auto-request permission and register on mount. */
  autoRegister?: boolean;
  /** Called when a foreground message arrives. */
  onMessage?: MessageHandler;
  /** Called when user opens a notification (from background/quit). */
  onNotificationOpened?: MessageHandler;
  /** Called when a new push token is issued. */
  onTokenRefresh?: TokenRefreshHandler;
}

export interface UsePushNotificationsResult {
  /** Current push token, or null if not registered. */
  token: PushToken | null;
  /** Whether the device is registered for push. */
  isRegistered: boolean;
  /** Whether registration is in progress. */
  isLoading: boolean;
  /** Current error, if any. */
  error: NotificationError | null;

  /** Request permission and register for push notifications. */
  register: () => Promise<PushToken>;
  /** Unregister from push (delete token). */
  unregister: () => Promise<void>;
  /** Get the current token without registering. */
  getToken: () => Promise<PushToken | null>;
  /** Subscribe to an FCM topic (native only). */
  subscribeToTopic: (topic: string) => Promise<void>;
  /** Unsubscribe from an FCM topic (native only). */
  unsubscribeFromTopic: (topic: string) => Promise<void>;
  /** Clear the current error. */
  clearError: () => void;
}

// ============================================================================
// Hook Types: useLocalNotifications
// ============================================================================

export interface UseLocalNotificationsOptions {
  /** Called when user presses a notification or action button. */
  onEvent?: NotificationEventHandler;
}

export interface UseLocalNotificationsResult {
  /** Display a notification immediately. Returns notification ID. */
  displayNotification: (options: DisplayNotificationOptions) => Promise<string>;
  /** Schedule a notification. Returns notification ID. */
  scheduleNotification: (options: ScheduleNotificationOptions) => Promise<string>;
  /** Cancel a specific notification by ID. */
  cancelNotification: (id: string) => Promise<void>;
  /** Cancel all notifications (displayed + pending). */
  cancelAllNotifications: () => Promise<void>;

  /** Create an Android notification channel. */
  createChannel: (channel: AndroidChannel) => Promise<void>;
  /** Delete an Android notification channel. */
  deleteChannel: (channelId: string) => Promise<void>;
  /** Get all Android notification channels. */
  getChannels: () => Promise<AndroidChannel[]>;

  /** Set notification categories (iOS action buttons). */
  setCategories: (categories: NotificationCategory[]) => Promise<void>;

  /** Get all currently displayed notifications. */
  getDisplayedNotifications: () => Promise<DisplayedNotification[]>;
  /** Get all pending (scheduled) notifications. */
  getPendingNotifications: () => Promise<PendingNotification[]>;

  /** Set the app badge count. */
  setBadgeCount: (count: number) => Promise<void>;
  /** Get the current app badge count. */
  getBadgeCount: () => Promise<number>;
}

// ============================================================================
// Hook Types: useNotificationPermissions
// ============================================================================

export interface UseNotificationPermissionsOptions {
  /** Auto-check permission on mount. */
  autoCheck?: boolean;
}

export interface UseNotificationPermissionsResult {
  /** Current permission status. */
  status: PermissionStatus;
  /** Detailed permission result. */
  permission: PermissionResult | null;
  /** Whether checking/requesting is in progress. */
  isLoading: boolean;

  /** Check current permission without prompting. */
  checkPermission: () => Promise<PermissionResult>;
  /** Request notification permission. */
  requestPermission: (options?: RequestPermissionOptions) => Promise<PermissionResult>;
  /** Open system settings for this app (to change permissions). */
  openSettings: () => Promise<void>;
}
