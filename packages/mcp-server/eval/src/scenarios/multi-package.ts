import type { ComponentScenario } from "../types.js";

export const multiPackageScenario: ComponentScenario = {
  type: "component",
  id: "multi-package",
  name: "Multi-Package Integration",
  description:
    "Tests whether the agent can integrate multiple Idealyst packages (storage, translate, components) in one screen",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a product detail screen with the following features:

- Product image, name, price with currency formatting, and description
- An "Add to Cart" button with loading state
- A quantity selector
- **Local caching** — Cache product data locally so it persists between sessions
- **Internationalization** — Support English and Spanish translations for product name and description

Discover what packages are available for storage and translation using the MCP tools.`,
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
