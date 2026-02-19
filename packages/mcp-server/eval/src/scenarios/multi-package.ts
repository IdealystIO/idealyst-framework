import type { ComponentScenario } from "../types.js";

export const multiPackageScenario: ComponentScenario = {
  type: "component",
  id: "multi-package",
  name: "Multi-Package Integration",
  description:
    "Tests whether the agent can integrate multiple Idealyst packages (storage, translate, components) in one screen",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about each package before writing any code.
Always check package documentation, component props, and API guides before using them.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a product detail screen that integrates three Idealyst packages:

1. **@idealyst/components** — For all UI elements (Card, Button, Text, Image display)
2. **@idealyst/storage** — To cache the product data locally
3. **@idealyst/translate** — For internationalization (English and Spanish)

The screen should display:
- Product image
- Product name (translated)
- Price with currency formatting
- Description (translated)
- An "Add to Cart" button with loading state
- A quantity selector

Look up the storage API guide, the translate guide, and the component documentation using the MCP tools before writing code.`,
  expectedToolUsage: [
    "get_storage_guide",
    "get_translate_guide",
    "get_component_docs",
    "list_packages",
    "get_package_docs",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /import.*from\s+['"]@idealyst\/storage['"]/,
    /import.*from\s+['"]@idealyst\/translate['"]/,
    /Button/,
    /useTranslat|translate|t\(/i,
  ],
  expectedFiles: {
    "ProductDetail.tsx": "Product detail screen with components, storage caching, and i18n",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["components", "storage", "translate", "multi-package"],
};
