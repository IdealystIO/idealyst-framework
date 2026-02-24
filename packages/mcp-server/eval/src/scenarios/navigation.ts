import type { ComponentScenario } from "../types.js";

export const navigationScenario: ComponentScenario = {
  type: "component",
  id: "navigation",
  name: "Navigation Setup",
  description:
    "Tests whether the agent can set up tab and stack navigation using the navigation package",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Set up navigation for a cross-platform app. The app should have:

1. **Bottom tab navigation** with three tabs: Home, Search, and Profile
2. **Stack navigator inside the Home tab** with:
   - A HomeScreen (list view)
   - A DetailScreen (accessible from HomeScreen)
3. Each tab should have an appropriate icon

Write the complete navigation configuration code.`,
  expectedToolUsage: [
    "get_navigation_types",
    "get_package_docs",
    "search_recipes",
    "get_recipe",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/navigation['"]/,
    /Home|home/,
    /Search|search/,
    /Profile|profile/,
    /tab|Tab/,
    /stack|Stack/,
  ],
  expectedFiles: {
    "Navigation.tsx": "Navigation configuration with bottom tabs and stack navigator",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["navigation", "packages", "recipes"],
};
