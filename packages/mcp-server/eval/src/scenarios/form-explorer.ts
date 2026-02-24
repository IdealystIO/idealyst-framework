import type { ComponentScenario } from "../types.js";

export const formExplorerScenario: ComponentScenario = {
  type: "component",
  id: "form-explorer",
  name: "Form Component Explorer",
  description:
    "Tests whether the agent can systematically explore form components and their types",
  systemPrompt: `You are a React developer evaluating the Idealyst framework for your team.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Explore what form-related components are available, then build a user registration form. The form should include:
- Full name input
- Email input
- Password input with confirmation
- A terms & conditions checkbox
- A submit button`,
  expectedToolUsage: [
    "list_components",
    "search_components",
    "get_component_docs",
    "get_component_types",
    "get_component_examples_ts",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /TextInput|Input/,
    /Button/,
    /Checkbox|Check/i,
    /password/i,
  ],
  expectedFiles: {
    "RegistrationForm.tsx": "User registration form with name, email, password, checkbox, and submit",
  },
  maxTurns: 50,
  difficulty: "basic",
  tags: ["components", "types", "forms", "exploration"],
};
