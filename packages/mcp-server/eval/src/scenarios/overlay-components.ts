import type { ComponentScenario } from "../types.js";

export const overlayComponentsScenario: ComponentScenario = {
  type: "component",
  id: "overlay-components",
  name: "Overlay & Dialog Patterns",
  description:
    "Tests discovery and usage of overlay components: Dialog, Menu, Popover, Tooltip, and Alert",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check component documentation and types before using them in your code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a product management screen with various overlay interactions:

1. **Delete Confirmation** — A Dialog that appears when the user taps a delete button, with "Cancel" and "Delete" actions
2. **Action Menu** — A Menu component attached to a "more options" icon button with actions like Edit, Duplicate, Archive
3. **Info Tooltip** — Tooltips on info icons that explain what each field means
4. **Success Alert** — An Alert component that shows a success message after saving
5. **Error Alert** — An Alert that shows validation errors with a "danger" intent

Use only Idealyst components. Look up Dialog, Menu, Tooltip, Alert, and Button documentation. Check their types carefully.`,
  expectedToolUsage: [
    "get_component_docs",
    "get_component_types",
    "search_components",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Dialog/,
    /Menu/,
    /Alert/,
    /Button/,
  ],
  expectedFiles: {
    "ProductManager.tsx":
      "Product management screen with dialog, menu, tooltip, and alert overlays",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["components", "overlay", "dialog", "menu", "tooltip", "alert"],
};
