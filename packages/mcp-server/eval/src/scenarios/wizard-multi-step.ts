import type { ComponentScenario } from "../types.js";

export const wizardMultiStepScenario: ComponentScenario = {
  type: "component",
  id: "wizard-multi-step",
  name: "Multi-Step Wizard",
  description:
    "Tests whether the agent can build a multi-step wizard with navigation-based state passing between steps",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a 3-step account setup wizard using route-based navigation. Create separate files for each step:

**File 1: wizard/WizardRouter.ts** (navigation configuration)
- Define routes for all 3 steps
- Set up a NavigatorProvider with stack navigation

**File 2: wizard/Step1Profile.tsx** (profile info)
- Text inputs for first name and last name
- An avatar placeholder (Icon or colored View)
- "Next" button that navigates to Step 2, passing the profile data via navigation state

**File 3: wizard/Step2Preferences.tsx** (preferences)
- Theme preference selector (light/dark) using buttons or a toggle
- Notification toggle (on/off)
- "Back" button to return to Step 1
- "Next" button that navigates to Step 3, passing both profile and preference data

**File 4: wizard/Step3Confirmation.tsx** (review & submit)
- Display all collected data from previous steps (received via useNavigationState)
- A summary Card showing profile info and preferences
- "Back" button and a "Submit" button
- Show a success message after submission

Use useNavigator for navigation and useNavigationState to receive data passed between steps.
Look up the navigation types documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_navigation_types",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/navigation['"]/,
    /useNavigator/,
    /useNavigationState/,
    /navigate\(/,
    /step|Step/i,
    /next|Next/i,
    /back|Back/i,
    /NavigatorProvider/,
  ],
  expectedFiles: {
    "wizard/WizardRouter.ts":
      "Navigation configuration for the 3-step wizard",
    "wizard/Step1Profile.tsx":
      "Step 1: Profile info form with name inputs",
    "wizard/Step2Preferences.tsx":
      "Step 2: Preferences with theme and notification toggles",
    "wizard/Step3Confirmation.tsx":
      "Step 3: Review and submit with data from previous steps",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["navigation", "wizard", "multi-step", "forms", "state"],
};
