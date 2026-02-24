import type { ComponentScenario } from "../types.js";

export const webLayoutTabsScenario: ComponentScenario = {
  type: "component",
  id: "web-layout-tabs",
  name: "Web Tab Layout",
  description:
    "Tests whether the agent can build a custom web tab bar using TabLayoutProps with tabBarIcon, tabBarLabel, tabBarBadge rendering and proper platform files",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check component documentation and types before using them in your code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a custom web tab bar layout for a social app. Requirements:

1. **Top Tab Bar** — Create a layout component that renders a horizontal tab bar at the top of the page, with content below
2. **Tab Icons & Labels** — Each tab should render its icon using \`tabBarIcon\` from route options (passing { focused, color, size }) and its label from \`tabBarLabel\`
3. **Badge Counts** — Tabs with a \`tabBarBadge\` value should show a Badge component with the count
4. **Active State** — The active tab should have a bottom border accent and different text/icon color
5. **Platform Files** — Create proper platform-specific files:
   - \`layouts/TabBarLayout.web.tsx\` — The real tab bar layout
   - \`layouts/TabBarLayout.native.tsx\` — A no-op mock (return null)
   - \`layouts/index.web.ts\` — Re-exports the web layout
   - \`layouts/index.native.ts\` — Re-exports the native mock
6. **Router Config** — Create an \`AppRouter.ts\` that uses the tab layout via \`layoutComponent\` on a tab navigator with 4 tabs: Feed, Search, Notifications (with badge count 3), and Profile. Each tab should have appropriate icons.

Use the MCP tools to look up navigation types (especially TabLayoutProps and TabBarScreenOptions), search for layout/tab recipes, and find appropriate icons.`,
  expectedToolUsage: [
    "get_navigation_types",
    "search_recipes",
    "get_recipe",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*Outlet.*from\s+['"]@idealyst\/navigation['"]/,
    /import.*TabLayoutProps.*from\s+['"]@idealyst\/navigation['"]/,
    /layoutComponent/,
    /tabBarIcon/,
    /tabBarLabel/,
    /tabBarBadge/,
    /<Outlet\s*\/>/,
    /\.web\./,
    /\.native\./,
    /return\s+null/,
  ],
  expectedFiles: {
    "layouts/TabBarLayout.web.tsx":
      "Tab bar layout rendering tabBarIcon, tabBarLabel, tabBarBadge with Outlet for content",
    "layouts/TabBarLayout.native.tsx":
      "No-op mock that returns null for native platform",
    "layouts/index.web.ts":
      "Re-exports TabBarLayout from the .web.tsx file",
    "layouts/index.native.ts":
      "Re-exports TabBarLayout from the .native.tsx file",
    "AppRouter.ts":
      "Tab navigator configuration using layoutComponent with 4 tabs including badges",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["navigation", "layout", "web-layout", "tabs", "outlet", "platform-files"],
};
