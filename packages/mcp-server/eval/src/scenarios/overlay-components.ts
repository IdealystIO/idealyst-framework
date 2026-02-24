import type { ComponentScenario } from "../types.js";

export const overlayComponentsScenario: ComponentScenario = {
  type: "component",
  id: "overlay-components",
  name: "Overlay & Dialog Patterns",
  description:
    "Tests discovery and usage of overlay components: Dialog, Menu, Popover, Tooltip, and Alert",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a product management screen with various overlay interactions:

1. **Delete Confirmation** — A confirmation dialog that appears when the user taps a delete button, with "Cancel" and "Delete" actions
2. **Action Menu** — A dropdown menu attached to a "more options" icon button with actions like Edit, Duplicate, Archive
3. **Info Tooltips** — Tooltips on info icons that explain what each field means
4. **Success Alert** — A success message after saving
5. **Error Alert** — Validation error messages with a danger/error style`,
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
