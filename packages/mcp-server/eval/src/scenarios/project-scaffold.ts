import type { ProjectScenario } from "../types.js";

export const projectScaffoldScenario: ProjectScenario = {
  type: "project",
  id: "project-scaffold",
  name: "Full Project Scaffolding",
  description:
    "Tests agent building features in a real project scaffolded with idealyst-cli",
  scaffoldCommands: [
    {
      command:
        "idealyst init eval-app --no-interactive --org-domain com.evaltest --app-name 'Eval App' --skip-install --blank",
      timeoutMs: 60_000,
    },
  ],
  systemPrompt: `You are a developer who has just scaffolded a new project using a cross-platform framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your code using the Write tool to the workspace path provided.`,
  taskPrompt: `You've just created a new cross-platform app project. Now add a user profile screen with:
- Avatar display
- User name and email display fields
- An "Edit Profile" toggle that switches fields to editable inputs
- A "Save" button with loading state
- Proper layout and styling`,
  additionalAllowedTools: ["Bash", "Read", "Glob"],
  expectedToolUsage: [
    "get_component_docs",
    "get_component_types",
    "search_icons",
    "search_components",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Button/,
    /TextInput|Input/,
    /Avatar/i,
  ],
  expectedFiles: {
    "ProfileScreen.tsx": "User profile screen with avatar, fields, edit mode, and save",
  },
  maxTurns: 60,
  difficulty: "advanced",
  tags: ["project", "cli", "scaffold", "components"],
};
