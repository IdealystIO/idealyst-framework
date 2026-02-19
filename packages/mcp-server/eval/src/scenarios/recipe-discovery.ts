import type { ComponentScenario } from "../types.js";

export const recipeDiscoveryScenario: ComponentScenario = {
  type: "component",
  id: "recipe-discovery",
  name: "Recipe Discovery & Adaptation",
  description:
    "Tests whether the agent can discover, retrieve, and adapt recipes for a real use case",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check recipes, component documentation, and types before writing code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a complete user profile screen. To do this efficiently:

1. **Search for recipes** — Look for any recipes related to settings, forms, navigation, or data display that you can adapt
2. **List all recipes** to see what's available
3. **Get the recipes** that seem most useful and adapt their code for a profile screen
4. **Combine patterns** from multiple recipes if needed

The profile screen should include:
- User info section (avatar, name, email) — adapt from settings recipe if available
- An "Edit Profile" form with TextInput fields for name, email, bio — adapt from a form recipe
- A theme switcher — adapt from a theme recipe if available
- A skeleton loading state while data loads — adapt from a skeleton recipe if available

The key test is: can you discover and intelligently combine existing recipes rather than building everything from scratch?`,
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
