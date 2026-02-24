import type { ComponentScenario } from "../types.js";

export const datagridAnalyticsScenario: ComponentScenario = {
  type: "component",
  id: "datagrid-analytics",
  name: "DataGrid Analytics Table",
  description:
    "Tests discovery and usage of @idealyst/datagrid for virtualized tabular data with sorting, selection, and custom cell renderers",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a user analytics table screen for an admin dashboard. Requirements:

1. **Data Table** — Display a virtualized table of user activity data
2. **Columns** — User (avatar + name), Email, Status (active/inactive with visual indicator), Last Active (date), Sessions (number, right-aligned)
3. **Custom Cell Rendering** — The User column should show an avatar next to the name. The Status column should show a visual badge.
4. **Sorting** — Enable sorting on Name, Last Active, and Sessions columns
5. **Row Selection** — Enable multi-row selection with a selected row count display
6. **Resizable Columns** — Columns should be resizable with minimum widths
7. **Sticky Header** — The header should stay visible when scrolling

Discover what data table/grid packages are available using the MCP tools.`,
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
