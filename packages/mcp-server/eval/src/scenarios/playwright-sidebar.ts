import type { ProjectScenario } from "../types.js";

/**
 * A project scenario that uses the golden project copy
 * and enables Playwright-based runtime verification.
 *
 * The agent modifies files in the pre-installed project,
 * then the supervisor navigates the app with Playwright to verify it renders.
 */
export const playwrightSidebarScenario: ProjectScenario = {
  type: "project",
  id: "playwright-sidebar",
  name: "Playwright: Sidebar Dashboard",
  description:
    "Tests runtime verification: agent builds a sidebar dashboard in a real project, then Playwright verifies it renders and navigates correctly",
  scaffoldCommands: [
    // No scaffold commands — uses golden project copy when playwrightVerification is true
  ],
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Modify this existing app to have a sidebar dashboard layout.

Requirements:
1. **Update the router** to use a sidebar layout with at least 4 routes: Dashboard, Projects, Team, Settings
2. **Create screen components** for each route — each screen should display its name, a brief description, and a relevant icon
3. Use the framework's component library for all UI elements

IMPORTANT: Look at the existing file structure first using Read and Glob tools to understand the project layout before making changes.`,
  expectedToolUsage: [
    "get_intro",
    "get_navigation_types",
    "search_icons",
    "get_component_types",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /import.*from\s+['"]@idealyst\/navigation['"]/,
    /Dashboard|dashboard/,
    /Settings|settings/,
  ],
  expectedFiles: {
    "screens/Dashboard.tsx": "Dashboard screen with title and content",
    "screens/Settings.tsx": "Settings screen",
  },
  additionalAllowedTools: ["Bash", "Read", "Glob"],
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["playwright", "navigation", "layout", "sidebar"],

  // Enable Playwright verification
  playwrightVerification: true,
  playwrightInstructions: `After navigating to the app:
1. Verify the page loads without blank screen
2. Look for navigation elements (sidebar, menu items)
3. Check for the presence of "Dashboard", "Projects", "Team", "Settings" text
4. Try clicking a navigation item and verify the content area changes
5. Check browser console for critical errors (ignore React DevTools and minor warnings)`,
};
