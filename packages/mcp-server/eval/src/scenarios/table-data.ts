import type { ComponentScenario } from "../types.js";

export const tableDataScenario: ComponentScenario = {
  type: "component",
  id: "table-data",
  name: "Table Data Display",
  description:
    "Tests whether the agent can use the Table component with typed columns, custom renderers, and row interactions",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build an employee directory screen using the Table component. Requirements:

1. **Typed Data** — Define an Employee interface with: id, name, email, department, role, and avatarUrl
2. **Table Columns** — Configure columns for:
   - Name column with a custom renderer showing an Avatar next to the employee name
   - Email column
   - Department column with a Badge component showing department name with an intent color
   - Role column
3. **Sticky Header** — The table header should stick when scrolling
4. **Striped Rows** — Use striped row styling for better readability
5. **Row Press** — When a row is pressed, log the selected employee (use console.log or an alert)
6. **Sample Data** — Include at least 8 sample employees across different departments

Look up the Table component types and documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /Table/,
    /columns/,
    /render/,
    /onRowPress/,
    /Avatar/,
    /Badge/,
    /stickyHeader|striped/,
  ],
  expectedFiles: {
    "EmployeeDirectoryScreen.tsx":
      "Employee directory with Table, custom renderers, and row interactions",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["components", "table", "data"],
};
