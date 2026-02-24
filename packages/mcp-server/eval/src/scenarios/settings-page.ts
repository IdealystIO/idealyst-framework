import type { ComponentScenario } from "../types.js";

export const settingsPageScenario: ComponentScenario = {
  type: "component",
  id: "settings-page",
  name: "Settings Page Builder",
  description:
    "Tests whether the agent can use components, theme types, and icons to build a settings page",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Create a settings page with the following sections:

1. **Appearance** — A theme switcher between light and dark mode
2. **Notifications** — Toggle switches for push notifications and email notifications
3. **Account** — Display user avatar, name, and email with an "Edit Profile" button
4. **About** — App version and a "Log Out" button

Each section should have an appropriate icon.`,
  expectedToolUsage: [
    "search_recipes",
    "get_recipe",
    "get_component_docs",
    "get_theme_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Switch|Toggle/i,
    /Avatar/i,
    /Button/,
    /dark|theme/i,
  ],
  expectedFiles: {
    "SettingsPage.tsx": "Settings page with appearance, notifications, account, and about sections",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["components", "theme", "icons", "recipes"],
};
