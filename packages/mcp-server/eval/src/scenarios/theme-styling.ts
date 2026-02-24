import type { ComponentScenario } from "../types.js";

export const themeStylingScenario: ComponentScenario = {
  type: "component",
  id: "theme-styling",
  name: "Theme & Styling Integration",
  description:
    "Tests whether the agent correctly uses the Idealyst theme system: intent colors, sizes, typography, and Unistyles",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a component showcase screen that demonstrates the framework's theming capabilities:

1. **Color Variants** — Show buttons, alerts, and badges in each available color/intent variant
2. **Size Variants** — Show buttons and text inputs in each available size
3. **Typography Scale** — Show text in every available typography preset
4. **Card Styling** — Cards with different padding sizes and shadow variants
5. **Icon Sizes** — Icons at different size values`,
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
