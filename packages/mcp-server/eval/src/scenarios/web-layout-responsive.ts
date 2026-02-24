import type { ComponentScenario } from "../types.js";

export const webLayoutResponsiveScenario: ComponentScenario = {
  type: "component",
  id: "web-layout-responsive",
  name: "Web Collapsible Sidebar Layout",
  description:
    "Tests whether the agent can build a collapsible sidebar layout with useState toggle, header bar with hamburger menu, avatar, 5 screens with icons, and full platform file structure",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a collapsible sidebar layout for an admin dashboard. This is a more advanced web layout. Requirements:

1. **Header Bar** — A fixed header (56px) with:
   - A hamburger menu icon button on the left that toggles sidebar collapse
   - The app title in the center
   - A user avatar on the right
2. **Collapsible Sidebar** — Below the header, a left sidebar that:
   - Is 260px when expanded, 64px when collapsed
   - Tracks collapse state with React state
   - Shows icon + label when expanded, icon only when collapsed
   - Has a chevron toggle button at the bottom
   - Smoothly transitions width
3. **Routes-Driven Menu** — Sidebar items built from the available routes, each with an icon and title
4. **Active Highlighting** — Current route highlighted with accent color and bold text
5. **Platform Files** — This should only render on web, not on mobile. Create platform-specific files so the layout is web-only.
6. **Router Config** — A router configuration using the layout with 5 routes: Dashboard, Users, Analytics, Messages, Settings — each with a title and icon

Look up the navigation documentation to understand how layouts, routing, and platform-specific files work.`,
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
    /useState/,
    /collapsed|isCollapsed|setCollapsed|setIsCollapsed/,
    /260|EXPANDED/i,
    /64|COLLAPSED/i,
    /<Outlet\s*\/>/,
    /menu/,
    /Avatar|avatar/,
    /chevron/i,
    /\.web\./,
    /\.native\./,
    /return\s+null/,
  ],
  expectedFiles: {
    "layouts/AdminLayout.web.tsx":
      "Collapsible sidebar layout with header, hamburger toggle, avatar, routes menu, and Outlet",
    "layouts/AdminLayout.native.tsx":
      "No-op mock that returns null for native platform",
    "layouts/index.web.ts":
      "Re-exports AdminLayout from the .web.tsx file",
    "layouts/index.native.ts":
      "Re-exports AdminLayout from the .native.tsx file",
    "AppRouter.ts":
      "Router configuration using layoutComponent with 5 screen routes with icons",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: [
    "navigation",
    "layout",
    "web-layout",
    "sidebar",
    "collapsible",
    "outlet",
    "platform-files",
  ],
};
