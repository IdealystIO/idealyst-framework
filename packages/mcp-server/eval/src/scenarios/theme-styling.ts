import type { ComponentScenario } from "../types.js";

export const themeStylingScenario: ComponentScenario = {
  type: "component",
  id: "theme-styling",
  name: "Theme & Styling Integration",
  description:
    "Tests whether the agent correctly uses the Idealyst theme system: intent colors, sizes, typography, and Unistyles",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check theme types, component types, and documentation before using them in code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a styled component showcase screen that demonstrates proper Idealyst theming:

1. **Intent Colors** — Show Button, Alert, and Badge components in each available intent (primary, success, warning, danger, info)
2. **Size Variants** — Show Button and TextInput in each available size (sm, md, lg)
3. **Typography Scale** — Show Text components using every available typography preset (h1 through h6, subtitle, body, caption, etc.)
4. **Card Styling** — Cards with different padding sizes and shadow variants
5. **Icon Sizes** — Icons at different size values

Look up the theme types to see what Size, Intent, and other theme values are available.`,
  expectedToolUsage: [
    "get_theme_types",
    "get_component_types",
    "get_component_docs",
    "search_components",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /intent/i,
    /typography/i,
    /Button/,
    /Text/,
  ],
  expectedFiles: {
    "ThemeShowcase.tsx":
      "Showcase screen demonstrating intents, sizes, typography, and styling",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["theme", "styling", "intent", "size", "typography"],
};
