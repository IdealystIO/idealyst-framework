import type { ComponentScenario } from "../types.js";

export const gridResponsiveScenario: ComponentScenario = {
  type: "component",
  id: "grid-responsive",
  name: "Responsive Grid Layout",
  description:
    "Tests whether the agent can use the Grid component with responsive column breakpoints for a product catalog",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a product catalog screen with a responsive grid layout. Requirements:

1. **Responsive Grid** — Use the Grid component with responsive columns: 1 column on mobile (xs), 2 columns on tablet (sm), 3 columns on desktop (lg)
2. **Grid Gap** — Set appropriate gap spacing between grid items
3. **Product Cards** — Each grid item should be a Card containing:
   - A colored View as an image placeholder (different background per product)
   - Product name (Text)
   - Price display (Text with bold formatting)
   - An "Add to Cart" Button with a cart icon
4. **Product Data** — Include at least 9 sample products with varied names and prices
5. **Screen Layout** — Include a screen title at the top and appropriate padding

Look up the Grid and Card component types using the MCP tools.`,
  expectedToolUsage: [
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Grid/,
    /columns/,
    /xs.*1|sm.*2|lg.*3/,
    /gap/,
    /Card/,
    /Button/,
  ],
  expectedFiles: {
    "ProductCatalogScreen.tsx":
      "Product catalog with responsive grid layout and product cards",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["components", "grid", "responsive", "layout"],
};
