import type { ComponentScenario } from "../types.js";

export const dataDisplayScenario: ComponentScenario = {
  type: "component",
  id: "data-display",
  name: "Data Display Dashboard",
  description:
    "Tests whether the agent can discover and use data display components: Table, List, Badge, Chip, Accordion, Progress",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a dashboard screen that displays a list of orders. Requirements:

1. **Order List** — A list of orders, each with a badge showing the order status (pending, shipped, delivered, cancelled)
2. **Status Filters** — A row of filter chips to filter orders by status
3. **Order Details** — An expandable section for each order that shows order items and delivery info
4. **Progress Indicator** — A progress bar for orders that are in transit (e.g. 60% delivered)
5. **Summary Stats** — Cards at the top showing total orders, pending, and delivered counts`,
  expectedToolUsage: [
    "list_components",
    "get_component_docs",
    "get_component_types",
    "search_components",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Badge/,
    /Chip/,
    /Accordion/,
    /Progress/,
    /List/,
  ],
  expectedFiles: {
    "OrderDashboard.tsx":
      "Dashboard with order list, badges, chips, accordion, and progress components",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["components", "data-display", "list", "badge", "chip", "accordion"],
};
