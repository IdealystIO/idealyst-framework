/**
 * Notifications Package Guides
 *
 * Comprehensive documentation for @idealyst/notifications.
 * Cross-platform push and local notifications for React and React Native.
 */

export const notificationsGuides: Record<string, string> = {
  "idealyst://notifications/overview": `# @idealyst/notifications

Cross-platform push and local notifications for React and React Native.

## Installation

\`\`\`bash
# Web only
yarn add @idealyst/notifications

# Native (requires Firebase Messaging + Notifee)
yarn add @idealyst/notifications @react-native-firebase/app @react-native-firebase/messaging @notifee/react-native
cd ios && pod install
\`\`\`

## Platform Support

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| Push token registration | ✅ (Web Push API) | ✅ (APNs via FCM) | ✅ (FCM) |
| Foreground messages | ✅ | ✅ | ✅ |
| Background messages | Service Worker | ✅ | ✅ |
| Local notifications | ✅ (Notification API) | ✅ (Notifee) | ✅ (Notifee) |
| Scheduled notifications | ✅ (setTimeout) | ✅ (persistent) | ✅ (persistent) |
| Channels | — | — | ✅ |
| Categories/Actions | — | ✅ | ✅ |
| Badge count | ✅ (PWA Badge API) | ✅ | ✅ |
| Topics | — (server-side) | ✅ | ✅ |

## Key Exports

### Hooks
- \`usePushNotifications(options?)\` — Push token management, message listeners
- \`useLocalNotifications(options?)\` — Display, schedule, channels, badges
- \`useNotificationPermissions(options?)\` — Check/request permissions

### Standalone Functions
**Push:** \`requestPushPermission\`, \`getPushToken\`, \`deletePushToken\`, \`hasPermission\`, \`onForegroundMessage\`, \`onNotificationOpened\`, \`onTokenRefresh\`, \`setBackgroundMessageHandler\`, \`subscribeToTopic\`, \`unsubscribeFromTopic\`

**Local:** \`displayNotification\`, \`scheduleNotification\`, \`cancelNotification\`, \`cancelAllNotifications\`, \`createChannel\`, \`deleteChannel\`, \`getChannels\`, \`setCategories\`, \`getDisplayedNotifications\`, \`getPendingNotifications\`, \`setBadgeCount\`, \`getBadgeCount\`, \`onNotificationEvent\`

**Permissions:** \`checkPermission\`, \`requestPermission\`, \`openNotificationSettings\`

**Web-only:** \`configurePush({ vapidKey, serviceWorkerPath? })\`

## Quick Start

\`\`\`tsx
import {
  usePushNotifications,
  useLocalNotifications,
  useNotificationPermissions,
} from '@idealyst/notifications';

function NotificationSetup() {
  const { status, requestPermission } = useNotificationPermissions({ autoCheck: true });
  const { token, register } = usePushNotifications({
    autoRegister: true,
    onMessage: (message) => console.log('Foreground:', message),
  });
  const { displayNotification } = useLocalNotifications();

  // Send token to your server for push delivery
  useEffect(() => {
    if (token) sendTokenToServer(token);
  }, [token]);

  return <Button onPress={() => displayNotification({ title: 'Hello!' })} />;
}
\`\`\`

## Architecture

- **Backend-agnostic**: The package gives you device tokens. Your server sends pushes via any service (Courier, Knock, your own, etc.)
- **Native push transport**: Uses \`@react-native-firebase/messaging\` for FCM (Android) and APNs (iOS). FCM is the only Android push transport.
- **Native local notifications**: Uses \`@notifee/react-native\` for rich local notifications.
- **Web push**: Standard Web Push API with VAPID keys + Service Workers.
- **Web local**: Standard Notification API + setTimeout scheduling.

## Common Mistakes

1. **Forgetting \`configurePush()\` on web** — Must call \`configurePush({ vapidKey })\` before \`getPushToken()\` on web
2. **Not creating Android channels** — Android 8+ requires channels. Call \`createChannel()\` before displaying notifications
3. **Missing POST_NOTIFICATIONS on Android 13+** — Must request runtime permission via \`requestPermission()\`
4. **Web scheduling lost on page close** — \`setTimeout\`-based scheduling doesn't persist. Use a Service Worker for persistent web scheduling
5. **Background handler in React tree** — \`setBackgroundMessageHandler()\` must be called at top level (index.js), outside React components
`,

  "idealyst://notifications/api": `# Notifications API Reference

## Hooks

### usePushNotifications(options?)

Manages push notification registration, token state, and message listeners.

\`\`\`typescript
interface UsePushNotificationsOptions {
  autoRegister?: boolean;        // Auto-register on mount
  onMessage?: MessageHandler;    // Foreground message handler
  onNotificationOpened?: MessageHandler; // Notification press handler
  onTokenRefresh?: TokenRefreshHandler;  // Token refresh handler
}

interface UsePushNotificationsResult {
  token: PushToken | null;       // Current push token
  isRegistered: boolean;         // Registration state
  isLoading: boolean;            // Loading state
  error: NotificationError | null;

  register(): Promise<PushToken>;
  unregister(): Promise<void>;
  getToken(): Promise<PushToken | null>;
  subscribeToTopic(topic: string): Promise<void>;   // Native only
  unsubscribeFromTopic(topic: string): Promise<void>; // Native only
  clearError(): void;
}
\`\`\`

### useLocalNotifications(options?)

Display, schedule, and manage local notifications.

\`\`\`typescript
interface UseLocalNotificationsOptions {
  onEvent?: NotificationEventHandler; // Press/dismiss event handler
}

interface UseLocalNotificationsResult {
  displayNotification(options: DisplayNotificationOptions): Promise<string>;
  scheduleNotification(options: ScheduleNotificationOptions): Promise<string>;
  cancelNotification(id: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;

  // Android channels
  createChannel(channel: AndroidChannel): Promise<void>;
  deleteChannel(channelId: string): Promise<void>;
  getChannels(): Promise<AndroidChannel[]>;

  // iOS categories
  setCategories(categories: NotificationCategory[]): Promise<void>;

  // Queries
  getDisplayedNotifications(): Promise<DisplayedNotification[]>;
  getPendingNotifications(): Promise<PendingNotification[]>;

  // Badge
  setBadgeCount(count: number): Promise<void>;
  getBadgeCount(): Promise<number>;
}
\`\`\`

### useNotificationPermissions(options?)

Check and request notification permissions.

\`\`\`typescript
interface UseNotificationPermissionsOptions {
  autoCheck?: boolean;  // Auto-check on mount
}

interface UseNotificationPermissionsResult {
  status: PermissionStatus;             // 'granted' | 'denied' | 'undetermined' | 'provisional' | 'blocked'
  permission: PermissionResult | null;  // Detailed result
  isLoading: boolean;

  checkPermission(): Promise<PermissionResult>;
  requestPermission(options?: RequestPermissionOptions): Promise<PermissionResult>;
  openSettings(): Promise<void>;
}
\`\`\`

## Core Types

### PushToken

\`\`\`typescript
interface PushToken {
  token: string;
  type: 'fcm' | 'apns' | 'web';
}
\`\`\`

### RemoteMessage

\`\`\`typescript
interface RemoteMessage {
  messageId: string;
  data: Record<string, string>;
  notification?: { title?: string; body?: string; imageUrl?: string };
  topic?: string;
  collapseKey?: string;
  sentTime?: number;
  ttl?: number;
  origin: 'foreground' | 'background' | 'quit';
}
\`\`\`

### DisplayNotificationOptions

\`\`\`typescript
interface DisplayNotificationOptions {
  id?: string;           // Auto-generated if omitted
  title: string;
  body?: string;
  subtitle?: string;
  data?: Record<string, string>;
  categoryId?: string;
  badge?: number;
  sound?: string;        // 'default' for system sound
  imageUrl?: string;
  threadId?: string;     // iOS grouping

  android?: {
    channelId?: string;  // Required on Android 8+
    smallIcon?: string;
    largeIcon?: string;
    color?: string;
    pressAction?: { id: string };
    importance?: NotificationImportance;
    ongoing?: boolean;
    autoCancel?: boolean;
    groupId?: string;
    groupSummary?: boolean;
    progress?: { max: number; current: number; indeterminate?: boolean };
    actions?: NotificationAction[];
    style?: AndroidNotificationStyle;
  };

  ios?: {
    categoryId?: string;
    interruptionLevel?: 'passive' | 'active' | 'timeSensitive' | 'critical';
    relevanceScore?: number;
    attachments?: Array<{ url: string; id?: string }>;
  };
}
\`\`\`

### ScheduleNotificationOptions

\`\`\`typescript
interface ScheduleNotificationOptions extends DisplayNotificationOptions {
  trigger: NotificationTrigger;
}

interface NotificationTrigger {
  type: 'timestamp' | 'interval';
  timestamp?: number;    // ms since epoch (for timestamp type)
  interval?: number;     // minutes (for interval type)
  repeatFrequency?: 'none' | 'hourly' | 'daily' | 'weekly';
  alarmManager?: boolean; // Android: fire in low-power mode
}
\`\`\`

### AndroidChannel

\`\`\`typescript
interface AndroidChannel {
  id: string;
  name: string;
  description?: string;
  importance?: 'none' | 'min' | 'low' | 'default' | 'high' | 'max';
  vibration?: boolean;
  vibrationPattern?: number[];
  lights?: boolean;
  lightColor?: string;
  sound?: string;
  badge?: boolean;
  visibility?: 'private' | 'public' | 'secret';
}
\`\`\`

### NotificationEvent

\`\`\`typescript
interface NotificationEvent {
  type: 'press' | 'action_press' | 'dismissed';
  id: string;
  notification: DisplayedNotification;
  actionId?: string;  // Only for 'action_press'
  input?: string;     // Only for input actions
}
\`\`\`

### NotificationError

\`\`\`typescript
interface NotificationError {
  code: 'not_available' | 'not_supported' | 'permission_denied' | 'token_failed'
      | 'display_failed' | 'schedule_failed' | 'cancel_failed' | 'channel_failed'
      | 'topic_failed' | 'unknown';
  message: string;
  originalError?: unknown;
}
\`\`\`

## Standalone Functions

### Push

| Function | Signature | Notes |
|----------|-----------|-------|
| \`configurePush\` | \`(config: WebPushConfig) => void\` | **Web only.** Must call before \`getPushToken()\` |
| \`requestPushPermission\` | \`(options?) => Promise<PermissionResult>\` | |
| \`getPushToken\` | \`() => Promise<PushToken>\` | |
| \`deletePushToken\` | \`() => Promise<void>\` | |
| \`hasPermission\` | \`() => Promise<boolean>\` | |
| \`onForegroundMessage\` | \`(handler) => () => void\` | Returns unsubscribe fn |
| \`onNotificationOpened\` | \`(handler) => () => void\` | Returns unsubscribe fn |
| \`onTokenRefresh\` | \`(handler) => () => void\` | Returns unsubscribe fn |
| \`setBackgroundMessageHandler\` | \`(handler) => void\` | Native only. Call at top level |
| \`subscribeToTopic\` | \`(topic) => Promise<void>\` | Native only |
| \`unsubscribeFromTopic\` | \`(topic) => Promise<void>\` | Native only |
| \`getAPNsToken\` | \`() => Promise<string \\| null>\` | Native iOS only |

### Local

| Function | Signature |
|----------|-----------|
| \`displayNotification\` | \`(options: DisplayNotificationOptions) => Promise<string>\` |
| \`scheduleNotification\` | \`(options: ScheduleNotificationOptions) => Promise<string>\` |
| \`cancelNotification\` | \`(id: string) => Promise<void>\` |
| \`cancelAllNotifications\` | \`() => Promise<void>\` |
| \`cancelDisplayedNotifications\` | \`() => Promise<void>\` |
| \`cancelPendingNotifications\` | \`() => Promise<void>\` |
| \`createChannel\` | \`(channel: AndroidChannel) => Promise<void>\` |
| \`deleteChannel\` | \`(channelId: string) => Promise<void>\` |
| \`getChannels\` | \`() => Promise<AndroidChannel[]>\` |
| \`setCategories\` | \`(categories: NotificationCategory[]) => Promise<void>\` |
| \`getDisplayedNotifications\` | \`() => Promise<DisplayedNotification[]>\` |
| \`getPendingNotifications\` | \`() => Promise<PendingNotification[]>\` |
| \`setBadgeCount\` | \`(count: number) => Promise<void>\` |
| \`getBadgeCount\` | \`() => Promise<number>\` |
| \`onNotificationEvent\` | \`(handler) => () => void\` |

### Constants

| Constant | Description |
|----------|-------------|
| \`DEFAULT_CHANNEL_ID\` | \`'default'\` — Default Android channel ID |
| \`DEFAULT_CHANNEL\` | Pre-configured default channel |
| \`CHANNEL_PRESETS\` | Ready-to-use channel configs: \`alerts\`, \`silent\`, \`marketing\`, \`chat\` |
`,

  "idealyst://notifications/examples": `# Notifications Examples

## Push Notification Registration

\`\`\`tsx
import { usePushNotifications, configurePush } from '@idealyst/notifications';
import { Platform } from 'react-native';

// Web: configure VAPID key before using push
if (Platform.OS === 'web') {
  configurePush({ vapidKey: 'your-vapid-public-key' });
}

function PushSetup() {
  const {
    token,
    isRegistered,
    isLoading,
    error,
    register,
  } = usePushNotifications({
    autoRegister: true,
    onMessage: (message) => {
      console.log('Received foreground message:', message.notification?.title);
    },
    onNotificationOpened: (message) => {
      console.log('User tapped notification:', message.data);
      // Navigate based on message.data
    },
    onTokenRefresh: (newToken) => {
      // Update token on your server
      updateServerToken(newToken);
    },
  });

  useEffect(() => {
    if (token) {
      // Send token to your backend
      fetch('/api/register-device', {
        method: 'POST',
        body: JSON.stringify({ token: token.token, type: token.type }),
      });
    }
  }, [token]);

  if (isLoading) return <Text>Registering...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return <Text>Push token: {token?.token.substring(0, 20)}...</Text>;
}
\`\`\`

## Background Message Handler (Native)

\`\`\`typescript
// index.js — MUST be at top level, outside React tree
import { setBackgroundMessageHandler } from '@idealyst/notifications';

setBackgroundMessageHandler(async (message) => {
  console.log('Background message:', message.messageId);
  // Process data-only messages, update badges, etc.
});
\`\`\`

## Local Notification — Display

\`\`\`tsx
import { useLocalNotifications, createChannel, DEFAULT_CHANNEL } from '@idealyst/notifications';
import { Platform } from 'react-native';

function LocalNotificationDemo() {
  const { displayNotification, createChannel } = useLocalNotifications({
    onEvent: (event) => {
      if (event.type === 'press') {
        console.log('Notification pressed:', event.id);
      }
      if (event.type === 'action_press') {
        console.log('Action pressed:', event.actionId);
      }
    },
  });

  useEffect(() => {
    // Create default channel on Android
    if (Platform.OS === 'android') {
      createChannel(DEFAULT_CHANNEL);
    }
  }, []);

  const showNotification = async () => {
    const id = await displayNotification({
      title: 'New Message',
      body: 'You have a new message from John',
      data: { conversationId: '123' },
      sound: 'default',
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
    });
    console.log('Displayed notification:', id);
  };

  return <Button title="Show Notification" onPress={showNotification} />;
}
\`\`\`

## Scheduled Notification

\`\`\`tsx
import { useLocalNotifications } from '@idealyst/notifications';

function ReminderScheduler() {
  const { scheduleNotification, getPendingNotifications, cancelNotification } = useLocalNotifications();

  const scheduleReminder = async () => {
    const id = await scheduleNotification({
      title: 'Reminder',
      body: 'Time to take a break!',
      trigger: {
        type: 'timestamp',
        timestamp: Date.now() + 30 * 60 * 1000, // 30 minutes from now
      },
    });
    console.log('Scheduled:', id);
  };

  const scheduleDailyReminder = async () => {
    await scheduleNotification({
      title: 'Daily Check-in',
      body: 'How are you feeling today?',
      trigger: {
        type: 'timestamp',
        timestamp: getTomorrowAt9AM(),
        repeatFrequency: 'daily',
      },
    });
  };

  const viewPending = async () => {
    const pending = await getPendingNotifications();
    console.log('Pending notifications:', pending);
  };

  return (
    <View>
      <Button title="30-min Reminder" onPress={scheduleReminder} />
      <Button title="Daily Reminder" onPress={scheduleDailyReminder} />
      <Button title="View Pending" onPress={viewPending} />
    </View>
  );
}
\`\`\`

## Android Channels

\`\`\`tsx
import { createChannel, CHANNEL_PRESETS } from '@idealyst/notifications';
import { Platform } from 'react-native';

async function setupChannels() {
  if (Platform.OS !== 'android') return;

  // Use built-in presets
  await createChannel(CHANNEL_PRESETS.chat);
  await createChannel(CHANNEL_PRESETS.alerts);
  await createChannel(CHANNEL_PRESETS.silent);
  await createChannel(CHANNEL_PRESETS.marketing);

  // Or create a custom channel
  await createChannel({
    id: 'orders',
    name: 'Order Updates',
    description: 'Updates about your orders',
    importance: 'high',
    vibration: true,
    badge: true,
    sound: 'default',
  });
}
\`\`\`

## iOS Categories with Actions

\`\`\`tsx
import { setCategories, useLocalNotifications } from '@idealyst/notifications';
import { Platform } from 'react-native';

async function setupCategories() {
  if (Platform.OS !== 'ios') return;

  await setCategories([
    {
      id: 'message',
      actions: [
        { id: 'reply', title: 'Reply', input: true, inputPlaceholder: 'Type a reply...' },
        { id: 'mark_read', title: 'Mark as Read' },
      ],
    },
    {
      id: 'invitation',
      actions: [
        { id: 'accept', title: 'Accept', foreground: true },
        { id: 'decline', title: 'Decline', destructive: true },
      ],
    },
  ]);
}
\`\`\`

## Permission Flow

\`\`\`tsx
import { useNotificationPermissions } from '@idealyst/notifications';

function PermissionGate({ children }: { children: React.ReactNode }) {
  const { status, requestPermission, openSettings } = useNotificationPermissions({
    autoCheck: true,
  });

  if (status === 'undetermined') {
    return (
      <View>
        <Text>We need permission to send you notifications</Text>
        <Button title="Allow Notifications" onPress={() => requestPermission()} />
      </View>
    );
  }

  if (status === 'denied' || status === 'blocked') {
    return (
      <View>
        <Text>Notifications are disabled. Enable them in settings.</Text>
        <Button title="Open Settings" onPress={() => openSettings()} />
      </View>
    );
  }

  return <>{children}</>;
}
\`\`\`

## Flat Function Usage (Non-Hook)

\`\`\`typescript
import {
  requestPermission,
  getPushToken,
  displayNotification,
  createChannel,
  DEFAULT_CHANNEL,
} from '@idealyst/notifications';
import { Platform } from 'react-native';

async function setupNotifications() {
  // 1. Request permission
  const result = await requestPermission();
  if (!result.canNotify) return;

  // 2. Create channel (Android)
  if (Platform.OS === 'android') {
    await createChannel(DEFAULT_CHANNEL);
  }

  // 3. Get push token and send to server
  const token = await getPushToken();
  await sendTokenToServer(token);

  // 4. Display a welcome notification
  await displayNotification({
    title: 'Welcome!',
    body: 'Notifications are set up successfully.',
    android: { channelId: 'default' },
  });
}
\`\`\`

## Badge Management

\`\`\`tsx
import { useLocalNotifications } from '@idealyst/notifications';

function BadgeManager() {
  const { setBadgeCount, getBadgeCount } = useLocalNotifications();

  const updateBadge = async (count: number) => {
    await setBadgeCount(count);
  };

  const clearBadge = async () => {
    await setBadgeCount(0);
  };

  return (
    <View>
      <Button title="Set Badge to 5" onPress={() => updateBadge(5)} />
      <Button title="Clear Badge" onPress={clearBadge} />
    </View>
  );
}
\`\`\`
`,
};
