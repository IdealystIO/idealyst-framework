import type { ComponentScenario } from "../types.js";

export const recipeDiscoveryScenario: ComponentScenario = {
  type: "component",
  id: "recipe-discovery",
  name: "Recipe Discovery & Adaptation",
  description:
    "Tests whether the agent can discover, retrieve, and adapt recipes for a real use case",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a complete user profile screen. Look for any existing code recipes or patterns you can adapt rather than building everything from scratch.

The profile screen should include:
- User info section (avatar, name, email)
- An "Edit Profile" form with input fields for name, email, and bio
- A theme switcher for light/dark mode
- A skeleton loading state while data loads

The key goal is to discover and intelligently combine existing patterns rather than building everything from scratch.`,
  expectedToolUsage: [
    "list_recipes",
    "search_recipes",
    "get_recipe",
    "get_component_docs",
    "get_component_types",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /TextInput/,
    /Avatar/,
    /Button/,
    /Skeleton/i,
  ],
  expectedFiles: {
    "ProfileScreen.tsx":
      "Profile screen combining patterns from multiple recipes",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["recipes", "discovery", "adaptation", "components"],
};
