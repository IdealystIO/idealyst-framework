import type { ComponentScenario } from "../types.js";

export const datagridAnalyticsScenario: ComponentScenario = {
  type: "component",
  id: "datagrid-analytics",
  name: "DataGrid Analytics Table",
  description:
    "Tests discovery and usage of @idealyst/datagrid for virtualized tabular data with sorting, selection, and custom cell renderers",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check package guides and component types before using them in code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a user analytics table screen for an admin dashboard. Requirements:

1. **DataGrid** — Use the @idealyst/datagrid package (NOT the List component) to display a table of user activity data
2. **Columns** — Define typed columns for: User (avatar + name), Email, Status (active/inactive badge), Last Active (date), Sessions (number, right-aligned)
3. **Custom Cell Renderers** — The User column should render an Avatar + Text side by side. The Status column should render a Badge with appropriate intent (success for active, secondary for inactive).
4. **Sorting** — Enable sorting on Name, Last Active, and Sessions columns. Implement the sort logic.
5. **Row Selection** — Enable multi-row selection with a selected row count display
6. **Resizable Columns** — Make columns resizable with minimum widths
7. **Sticky Header** — The header should stay visible when scrolling

Look up the datagrid guide for the DataGrid and Column API. Use @idealyst/components for Avatar, Badge, Text, and View. Do NOT use the List component — DataGrid is specifically for tabular data.`,
  expectedToolUsage: [
    "get_datagrid_guide",
    "get_component_docs",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/datagrid['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /DataGrid/,
    /Column/,
    /sortable/i,
    /Avatar|Badge/,
  ],
  expectedFiles: {
    "UserAnalytics.tsx":
      "Analytics table with DataGrid, custom renderers, sorting, selection, and resizable columns",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["packages", "datagrid", "data-display", "cross-platform"],
};
