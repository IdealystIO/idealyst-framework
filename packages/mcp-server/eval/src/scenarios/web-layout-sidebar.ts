import type { ComponentScenario } from "../types.js";

export const webLayoutSidebarScenario: ComponentScenario = {
  type: "component",
  id: "web-layout-sidebar",
  name: "Web Sidebar Layout",
  description:
    "Tests whether the agent can build a web sidebar layout using layoutComponent with proper .web.tsx/.native.tsx platform files, Outlet from @idealyst/navigation, and active route highlighting",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a web sidebar layout for a dashboard app. Requirements:

1. **Sidebar Layout** — A layout component with a left sidebar (240px wide) containing navigation links and a content area on the right
2. **Routes-Driven Menu** — The sidebar menu items should be built from the available routes, showing each route's title and icon
3. **Active Highlighting** — The currently active route should be visually highlighted (bold text, accent background color)
4. **Platform Files** — This should only render on web, not on mobile. Create platform-specific files so the layout is web-only.
5. **Router Config** — A router configuration that uses the sidebar layout with at least 4 screen routes (Dashboard, Projects, Team, Settings), each with a title and icon

Look up the navigation documentation to understand how layouts and routing work.`,
  expectedToolUsage: [
    "get_navigation_types",
    "search_recipes",
    "get_recipe",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*Outlet.*from\s+['"]@idealyst\/navigation['"]/,
    /import.*StackLayoutProps.*from\s+['"]@idealyst\/navigation['"]/,
    /layoutComponent/,
    /currentPath/,
    /routes/,
    /<Outlet\s*\/>/,
    /\.web\./,
    /\.native\./,
    /return\s+null/,
  ],
  expectedFiles: {
    "layouts/SidebarLayout.web.tsx":
      "Sidebar layout with routes-driven menu, active highlighting, and Outlet for content",
    "layouts/SidebarLayout.native.tsx":
      "No-op mock that returns null for native platform",
    "layouts/index.web.ts":
      "Re-exports SidebarLayout from the .web.tsx file",
    "layouts/index.native.ts":
      "Re-exports SidebarLayout from the .native.tsx file",
    "AppRouter.ts":
      "Router configuration using layoutComponent with 4+ screen routes",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["navigation", "layout", "web-layout", "sidebar", "outlet", "platform-files"],
};
