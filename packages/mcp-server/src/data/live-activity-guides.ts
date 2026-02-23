/**
 * Live Activity Package Guides
 *
 * Comprehensive documentation for @idealyst/live-activity.
 */

export const liveActivityGuides: Record<string, string> = {
  "idealyst://live-activity/overview": `# @idealyst/live-activity

Cross-platform Live Activities for React Native — iOS ActivityKit (Lock Screen + Dynamic Island) and Android 16 Live Updates (\`Notification.ProgressStyle\`).

## What Are Live Activities?

**iOS**: Live Activities display real-time information on the Lock Screen and Dynamic Island. They use \`ActivityKit\` and require a Widget Extension target in Xcode.

**Android 16+**: Live Updates use \`Notification.ProgressStyle\` to display rich, updating progress notifications. On older Android versions, the package falls back to standard progress notifications.

## Key Features

- **Unified JavaScript API** — \`useLiveActivity()\` hook and imperative functions work on both platforms
- **Pre-built SwiftUI templates** — Delivery, Timer, Media, and Progress templates out of the box
- **CLI generator** — Scaffold custom Live Activities with \`idealyst add live-activity\`
- **TurboModule bridge** — New Architecture native module for maximum performance
- **Type-safe template system** — Generic \`StartActivityOptions<T>\` with per-template type checking
- **Push token support** — iOS push tokens for server-driven updates
- **Event system** — Subscribe to activity lifecycle events (started, updated, ended, stale, token)
- **Graceful degradation** — Web returns \`not_supported\`, older Android falls back to standard notifications

## Platform Requirements

| Platform | Minimum Version | Notes |
|----------|----------------|-------|
| iOS      | 16.2+          | Requires Widget Extension target |
| Android  | API 24+        | ProgressStyle on API 36+, fallback on older |
| Web      | N/A            | Stubs return \`not_supported\` |

## Architecture

\`\`\`
┌─────────────────────────────────────────────┐
│  JavaScript (useLiveActivity hook)          │
│  - Type-safe start/update/end              │
│  - Event subscriptions                      │
│  - Template presets                         │
├─────────────────────────────────────────────┤
│  TurboModule Bridge (JSON serialization)    │
├──────────────────┬──────────────────────────┤
│  iOS (Swift)     │  Android (Kotlin)        │
│  - ActivityKit   │  - ProgressStyle         │
│  - SwiftUI Views │  - NotificationManager   │
│  - Push Tokens   │  - Fallback support      │
└──────────────────┴──────────────────────────┘
\`\`\`

## Template Types

| Template     | Use Case                        | Dynamic Island |
|-------------|----------------------------------|----------------|
| \`delivery\`  | Order/package tracking           | Progress + ETA |
| \`timer\`     | Countdown/stopwatch              | Native timer   |
| \`media\`     | Now playing / media playback     | Track info     |
| \`progress\`  | Generic progress (upload, etc.)  | Progress ring  |
| \`custom\`    | User-defined Swift views         | Custom layout  |
`,

  "idealyst://live-activity/api": `# @idealyst/live-activity — API Reference

## useLiveActivity() Hook

The primary way to manage Live Activities in React components.

\`\`\`typescript
import { useLiveActivity } from '@idealyst/live-activity';

function MyComponent() {
  const {
    // State
    isSupported,         // boolean — platform supports Live Activities
    isEnabled,           // boolean — user has granted permission
    currentActivity,     // LiveActivityInfo | null
    activities,          // LiveActivityInfo[]
    isLoading,           // boolean
    error,               // LiveActivityError | null

    // Actions
    start,               // (options: StartActivityOptions<T>) => Promise<LiveActivityInfo>
    update,              // (activityId, options: UpdateActivityOptions<T>) => Promise<void>
    end,                 // (activityId, options?: EndActivityOptions) => Promise<void>
    endAll,              // (options?: EndActivityOptions) => Promise<void>
    getActivity,         // (activityId) => Promise<LiveActivityInfo | null>
    listActivities,      // () => Promise<LiveActivityInfo[]>
    getPushToken,        // (activityId) => Promise<string | null>
    checkAvailability,   // () => Promise<{ supported: boolean; enabled: boolean }>
  } = useLiveActivity({
    autoCheckAvailability: true,  // Check on mount (default: true)
    onEvent: (event) => {},       // Event callback
  });
}
\`\`\`

## Imperative API

For use outside of React components or in event handlers:

\`\`\`typescript
import {
  checkAvailability,
  start,
  update,
  end,
  endAll,
  getActivity,
  listActivities,
  getPushToken,
  addEventListener,
} from '@idealyst/live-activity';
\`\`\`

## start(options)

Start a new Live Activity.

\`\`\`typescript
const info = await start<'delivery'>({
  templateType: 'delivery',
  attributes: {
    title: 'Order #1234',
    startLabel: 'Restaurant',
    endLabel: 'Your Door',
    driverName: 'Alex',
  },
  contentState: {
    status: 'Preparing your order',
    progress: 0.1,
    eta: new Date(Date.now() + 30 * 60000).toISOString(),
  },
  ios: {
    relevanceScore: 100,
    staleDate: new Date(Date.now() + 60 * 60000).toISOString(),
  },
  android: {
    channelId: 'live_updates',
  },
});
\`\`\`

### StartActivityOptions\<T\>

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \`templateType\` | \`TemplateType\` | Yes | Template: \`'delivery'\` \\| \`'timer'\` \\| \`'media'\` \\| \`'progress'\` \\| \`'custom'\` |
| \`attributes\` | \`TemplateAttributesMap[T]\` | Yes | Static attributes (set once) |
| \`contentState\` | \`TemplateContentStateMap[T]\` | Yes | Dynamic content (can update) |
| \`ios\` | \`object\` | No | iOS-specific: \`relevanceScore\`, \`staleDate\`, \`alert\` |
| \`android\` | \`object\` | No | Android-specific: \`channelId\`, \`notificationId\`, \`deepLink\` |

## update(activityId, options)

Update an active Live Activity's content state.

\`\`\`typescript
await update(info.id, {
  contentState: {
    status: 'On the way!',
    progress: 0.6,
    eta: new Date(Date.now() + 10 * 60000).toISOString(),
  },
  ios: {
    alert: {
      title: 'Update',
      body: 'Your order is on the way!',
      sound: 'default',
    },
  },
});
\`\`\`

## end(activityId, options?)

End a Live Activity.

\`\`\`typescript
await end(info.id, {
  dismissalPolicy: 'default',      // 'immediate' | 'default' | 'afterDate'
  finalContentState: {
    status: 'Delivered!',
    progress: 1.0,
  },
  dismissAfter: Date.now() + 5000,  // Used with 'afterDate' policy
});
\`\`\`

## endAll(options?)

End all active Live Activities.

\`\`\`typescript
await endAll({ dismissalPolicy: 'immediate' });
\`\`\`

## getPushToken(activityId)

Get the push token for an iOS Live Activity (returns \`null\` on Android).

\`\`\`typescript
const token = await getPushToken(info.id);
if (token) {
  await sendTokenToServer(token);
}
\`\`\`

## addEventListener(handler)

Subscribe to Live Activity events.

\`\`\`typescript
const unsubscribe = addEventListener((event) => {
  switch (event.type) {
    case 'started':
    case 'updated':
    case 'ended':
    case 'stale':
      console.log(event.activityId, event.type);
      break;
    case 'pushTokenUpdated':
      console.log('New token:', event.payload.token);
      break;
  }
});

// Clean up
unsubscribe();
\`\`\`

## Template Presets

Convenience functions that return typed \`StartActivityOptions\`:

\`\`\`typescript
import {
  deliveryActivity,
  timerActivity,
  mediaActivity,
  progressActivity,
} from '@idealyst/live-activity';

// Each returns StartActivityOptions<T> with sensible defaults
const options = deliveryActivity(
  { title: 'Order #1234', startLabel: 'Kitchen', endLabel: 'Door' },
  { status: 'Preparing', progress: 0, eta: new Date().toISOString() }
);

await start(options);
\`\`\`

## Types

### LiveActivityInfo

\`\`\`typescript
interface LiveActivityInfo {
  id: string;
  state: LiveActivityState;
  pushToken?: string;
  startedAt: number;
  templateType: TemplateType;
  attributes: Record<string, unknown>;
  contentState: Record<string, unknown>;
}
\`\`\`

### LiveActivityState

\`\`\`typescript
type LiveActivityState =
  | 'idle'
  | 'starting'
  | 'active'
  | 'updating'
  | 'ending'
  | 'ended'
  | 'stale';
\`\`\`

### LiveActivityEvent

\`\`\`typescript
interface LiveActivityEvent {
  type: 'started' | 'updated' | 'ended' | 'stale' | 'pushTokenUpdated';
  activityId: string;
  timestamp: number;
  payload: Record<string, unknown>;
}
\`\`\`

### LiveActivityError

\`\`\`typescript
interface LiveActivityError {
  code: LiveActivityErrorCode;
  message: string;
  originalError?: unknown;
}

type LiveActivityErrorCode =
  | 'not_supported'
  | 'not_enabled'
  | 'already_active'
  | 'not_found'
  | 'start_failed'
  | 'update_failed'
  | 'end_failed'
  | 'token_failed'
  | 'unknown';
\`\`\`
`,

  "idealyst://live-activity/examples": `# @idealyst/live-activity — Examples

## Basic: Start and Update a Delivery Activity

\`\`\`typescript
import { useLiveActivity, deliveryActivity } from '@idealyst/live-activity';

function DeliveryTracker({ orderId }: { orderId: string }) {
  const { start, update, end, currentActivity, isSupported } = useLiveActivity();

  const startTracking = async () => {
    if (!isSupported) return;

    await start(deliveryActivity(
      {
        title: \`Order #\${orderId}\`,
        startLabel: 'Restaurant',
        endLabel: 'Your Door',
        driverName: 'Alex',
      },
      {
        status: 'Preparing your order',
        progress: 0,
        eta: new Date(Date.now() + 30 * 60000).toISOString(),
      }
    ));
  };

  const updateProgress = async (progress: number, status: string) => {
    if (!currentActivity) return;

    await update(currentActivity.id, {
      contentState: { status, progress },
    });
  };

  const markDelivered = async () => {
    if (!currentActivity) return;

    await end(currentActivity.id, {
      dismissalPolicy: 'default',
      finalContentState: {
        status: 'Delivered!',
        progress: 1.0,
      },
    });
  };

  return null; // UI implementation
}
\`\`\`

## Timer Activity

\`\`\`typescript
import { useLiveActivity, timerActivity } from '@idealyst/live-activity';

function WorkoutTimer() {
  const { start, update, end, currentActivity } = useLiveActivity();

  const startTimer = async (durationMs: number) => {
    const endTime = new Date(Date.now() + durationMs);

    await start(timerActivity(
      { title: 'Workout Timer', timerLabel: 'Time Remaining' },
      {
        status: 'Running',
        endTime: endTime.toISOString(),
        isPaused: false,
      }
    ));
  };

  const pauseTimer = async () => {
    if (!currentActivity) return;
    await update(currentActivity.id, {
      contentState: { isPaused: true, status: 'Paused' },
    });
  };

  const resumeTimer = async () => {
    if (!currentActivity) return;
    await update(currentActivity.id, {
      contentState: { isPaused: false, status: 'Running' },
    });
  };

  return null;
}
\`\`\`

## Media / Now Playing Activity

\`\`\`typescript
import { useLiveActivity, mediaActivity } from '@idealyst/live-activity';

function NowPlaying({ track }: { track: Track }) {
  const { start, update, end, currentActivity } = useLiveActivity();

  const showNowPlaying = async () => {
    await start(mediaActivity(
      {
        title: 'Now Playing',
        artist: track.artist,
        albumArt: track.artworkUrl,
      },
      {
        trackName: track.name,
        isPlaying: true,
        progress: 0,
        elapsed: 0,
        duration: track.durationMs,
      }
    ));
  };

  const updatePlayback = async (elapsed: number, isPlaying: boolean) => {
    if (!currentActivity) return;
    await update(currentActivity.id, {
      contentState: {
        elapsed,
        progress: elapsed / track.durationMs,
        isPlaying,
      },
    });
  };

  return null;
}
\`\`\`

## Generic Progress Activity

\`\`\`typescript
import { useLiveActivity, progressActivity } from '@idealyst/live-activity';

function FileUploader() {
  const { start, update, end, currentActivity } = useLiveActivity();

  const startUpload = async (fileName: string) => {
    await start(progressActivity(
      { title: \`Uploading \${fileName}\` },
      { status: 'Starting...', progress: 0 }
    ));
  };

  const onProgress = async (percent: number) => {
    if (!currentActivity) return;
    await update(currentActivity.id, {
      contentState: {
        status: \`\${Math.round(percent * 100)}% complete\`,
        progress: percent,
      },
    });
  };

  const onComplete = async () => {
    if (!currentActivity) return;
    await end(currentActivity.id, {
      dismissalPolicy: 'default',
      finalContentState: {
        status: 'Upload complete!',
        progress: 1.0,
      },
    });
  };

  return null;
}
\`\`\`

## Push Token for Server-Driven Updates (iOS)

\`\`\`typescript
import { useLiveActivity, deliveryActivity } from '@idealyst/live-activity';

function ServerDrivenActivity() {
  const { start, getPushToken } = useLiveActivity({
    onEvent: async (event) => {
      if (event.type === 'pushTokenUpdated') {
        // Send updated token to your server
        await fetch('/api/live-activity-token', {
          method: 'POST',
          body: JSON.stringify({
            activityId: event.activityId,
            token: event.payload.token,
            platform: event.payload.platform,
          }),
        });
      }
    },
  });

  const startWithPush = async () => {
    const info = await start(deliveryActivity(
      { title: 'Order #5678' },
      { status: 'Processing', progress: 0 }
    ));

    // Get the initial push token
    const token = await getPushToken(info.id);
    if (token) {
      await fetch('/api/live-activity-token', {
        method: 'POST',
        body: JSON.stringify({
          activityId: info.id,
          token,
          platform: 'ios',
        }),
      });
    }
  };

  return null;
}
\`\`\`

## Custom Activity with CLI Generator

\`\`\`bash
# Scaffold a custom Live Activity
idealyst add live-activity --type live-activity --activity-name OrderTracker
\`\`\`

This generates:
- \`ios/*LiveActivity/OrderTrackerAttributes.swift\` — ActivityAttributes struct
- \`ios/*LiveActivity/OrderTrackerActivityView.swift\` — SwiftUI Widget view
- \`ios/*LiveActivity/OrderTrackerBundle.swift\` — WidgetBundle entry point
- \`src/activities/orderTracker.ts\` — TypeScript interface + typed helper

\`\`\`typescript
// Use the generated typed helper
import { startOrderTracker } from './activities/orderTracker';

const options = startOrderTracker(
  { title: 'Order #9999', accentColor: '#FF6B35' },
  { status: 'In Kitchen', progress: 0.2 }
);

const info = await start(options);
\`\`\`

## Listening to All Events

\`\`\`typescript
import { addEventListener } from '@idealyst/live-activity';

// At app startup — subscribe globally
const unsubscribe = addEventListener((event) => {
  switch (event.type) {
    case 'started':
      analytics.track('live_activity_started', {
        activityId: event.activityId,
      });
      break;
    case 'ended':
      analytics.track('live_activity_ended', {
        activityId: event.activityId,
      });
      break;
    case 'stale':
      // Activity hasn't been updated and iOS considers it stale
      console.warn('Activity stale:', event.activityId);
      break;
    case 'pushTokenUpdated':
      syncTokenToServer(event.activityId, event.payload.token);
      break;
  }
});
\`\`\`

## Checking Availability

\`\`\`typescript
import { useLiveActivity } from '@idealyst/live-activity';

function MyScreen() {
  const { isSupported, isEnabled, checkAvailability } = useLiveActivity();

  // isSupported: device/OS supports live activities
  // isEnabled: user has granted permission (iOS) or can post promoted notifications (Android)

  if (!isSupported) {
    return <Text>Live Activities not supported on this device</Text>;
  }

  if (!isEnabled) {
    return <Text>Please enable Live Activities in Settings</Text>;
  }

  return <Text>Ready to use Live Activities!</Text>;
}
\`\`\`
`,
};
