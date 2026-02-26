import type { ComponentScenario } from "../types.js";

export const notificationsLocalScenario: ComponentScenario = {
  type: "component",
  id: "notifications-local",
  name: "Local Notifications Demo",
  description:
    "Tests whether the agent can use @idealyst/notifications to request permissions, send local notifications, and handle events",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a notification demo screen with the following features:

1. **Permission Gate** — Request notification permissions on mount and display the current permission status (granted/denied/undetermined)
2. **Compose Form** — A form with text inputs for notification title and body, plus a numeric input for schedule delay in seconds
3. **Send Button** — A "Send Notification" button that calls the local notification API with the composed title, body, and optional delay
4. **Event Log** — A scrollable list that shows received notification events with timestamps
5. **UI Polish** — Use appropriate icons for the send button, status indicators for permission state

Look up the notifications package documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_notifications_guide",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/notifications['"]/,
    /useNotificationPermissions|useLocalNotifications/,
    /displayNotification|scheduleNotification/,
    /requestPermission/,
    /title/,
    /body/,
  ],
  expectedFiles: {
    "NotificationDemoScreen.tsx":
      "Notification demo with permission gate, compose form, and event log",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["notifications", "packages", "permissions"],
};
