import type { ComponentScenario } from "../types.js";

export const chartsDashboardScenario: ComponentScenario = {
  type: "component",
  id: "charts-dashboard",
  name: "Charts Data Dashboard",
  description:
    "Tests discovery and usage of @idealyst/charts for data visualization with LineChart and BarChart",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check package guides and component types before using them in code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a sales analytics dashboard screen. Requirements:

1. **Revenue Line Chart** — Use @idealyst/charts LineChart to show monthly revenue data over the past 12 months. Use proper DataPoint format with x/y values. Add axis labels.
2. **Category Bar Chart** — A BarChart comparing sales across 5 product categories. Use multiple data series to compare this year vs last year.
3. **Summary Cards** — Use Card and Text components at the top showing total revenue, growth percentage, and top category
4. **Time Period Selector** — Chip components to switch between "Last 7 Days", "Last 30 Days", "Last 12 Months"
5. **Responsive Layout** — Use View with proper padding and gap for spacing

Look up the charts guide using get_charts_guide to understand the DataPoint interface, ChartDataSeries format, and chart props. The data format is specific — do NOT guess it.`,
  expectedToolUsage: [
    "get_charts_guide",
    "get_component_docs",
    "get_component_types",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/charts['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /LineChart|BarChart/,
    /DataPoint|data/i,
    /Card/,
  ],
  expectedFiles: {
    "SalesDashboard.tsx":
      "Sales dashboard with line chart, bar chart, summary cards, and time period selector",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["packages", "charts", "data-visualization", "cross-platform"],
};
