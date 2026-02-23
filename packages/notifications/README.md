# @idealyst/notifications

Cross-platform push and local notifications for React Native and web.

- **Push**: Firebase Cloud Messaging (native) / Web Push API (web)
- **Local**: Notifee (native) / Notification API (web)
- **Backend-agnostic**: gives you device tokens — your server sends via any push service

## Installation

```bash
yarn add @idealyst/notifications

# Native push (required for push on iOS/Android):
yarn add @react-native-firebase/app @react-native-firebase/messaging

# Native local (required for local notifications on iOS/Android):
yarn add @notifee/react-native
```

## Quick Start

```tsx
import {
  usePushNotifications,
  useLocalNotifications,
  useNotificationPermissions,
} from '@idealyst/notifications';

function App() {
  const { status, requestPermission } = useNotificationPermissions();
  const { token, register } = usePushNotifications({ autoRegister: true });
  const { displayNotification } = useLocalNotifications();

  return (
    <Button
      onPress={async () => {
        await requestPermission();
        const pushToken = await register();
        console.log('Push token:', pushToken);
        await displayNotification({
          title: 'Hello',
          body: 'Notifications are working!',
        });
      }}
    >
      Enable Notifications
    </Button>
  );
}
```

## API

### Hooks

- `usePushNotifications(options?)` — token management, message listeners
- `useLocalNotifications(options?)` — display, schedule, channels, badges
- `useNotificationPermissions(options?)` — check/request permissions

### Standalone Functions

Push: `requestPushPermission()`, `getPushToken()`, `deletePushToken()`, `onForegroundMessage()`, `onNotificationOpened()`, `onTokenRefresh()`, `setBackgroundMessageHandler()`, `subscribeToTopic()`, `unsubscribeFromTopic()`

Local: `displayNotification()`, `scheduleNotification()`, `cancelNotification()`, `cancelAllNotifications()`, `createChannel()`, `deleteChannel()`, `getChannels()`, `setCategories()`, `setBadgeCount()`, `getBadgeCount()`

Permissions: `checkPermission()`, `requestPermission()`, `openNotificationSettings()`

Web-only: `configurePush({ vapidKey, serviceWorkerPath? })` — required before push registration on web

## Native Setup

See `get_install_guide('notifications')` via the MCP server for full iOS/Android configuration (Firebase, APNs, Gradle, permissions).

## License

MIT
