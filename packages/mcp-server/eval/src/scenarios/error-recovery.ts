import type { ComponentScenario } from "../types.js";

export const errorRecoveryScenario: ComponentScenario = {
  type: "component",
  id: "error-recovery",
  name: "Error Recovery & Edge Cases",
  description:
    "Tests whether the agent handles not-found errors and recovers gracefully",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
If a tool returns an error or says something doesn't exist, adapt your approach and find alternatives.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `I need you to build a form using the Idealyst framework. Here are my requirements — but note that some of these might not exist exactly as described, so you'll need to look things up and adapt:

1. Use the "Wizard" component for a multi-step form (look it up — if it doesn't exist, find an alternative)
2. Use the "login-wizard" recipe as a starting point (search for it — if it doesn't exist, find a similar recipe)
3. Import from "@idealyst/forms" package (check if this package exists)
4. The form should have: name field, email field, and a submit button

Use the MCP tools to verify what actually exists before writing code. Do NOT hallucinate components or packages — only use what the tools confirm is available.`,
  expectedToolUsage: [
    "get_component_docs",
    "search_recipes",
    "search_packages",
    "list_components",
    "search_components",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Button/,
    /TextInput|Input/,
  ],
  expectedFiles: {
    "FormScreen.tsx": "Form with name, email, and submit button using actual available components",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["error-handling", "recovery", "edge-cases"],
};
