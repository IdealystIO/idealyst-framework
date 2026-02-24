import type { ComponentScenario } from "../types.js";

export const loginScreenScenario: ComponentScenario = {
  type: "component",
  id: "login-screen",
  name: "Login Screen Builder",
  description:
    "Tests whether the agent can discover and use component docs + recipes to build a login screen",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a login screen. The screen should have:
- Email input with validation
- Password input (obscured)
- A "Log In" submit button with loading state
- A "Forgot Password?" link
- Error message display`,
  expectedToolUsage: [
    "list_components",
    "get_component_docs",
    "search_recipes",
    "get_recipe",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Button/,
    /TextInput|Input/,
    /password|secure/i,
    /loading|isLoading|submitting/i,
  ],
  expectedFiles: {
    "LoginScreen.tsx": "Login screen component with email/password inputs and submit button",
  },
  maxTurns: 50,
  difficulty: "basic",
  tags: ["components", "recipes", "forms"],
};
