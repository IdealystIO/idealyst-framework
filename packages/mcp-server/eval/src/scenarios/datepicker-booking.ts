import type { ComponentScenario } from "../types.js";

export const datepickerBookingScenario: ComponentScenario = {
  type: "component",
  id: "datepicker-booking",
  name: "DatePicker Booking Form",
  description:
    "Tests discovery and usage of @idealyst/datepicker components: DateInput, TimePicker, DateTimePicker with validation",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check component documentation and types before using them in your code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a meeting scheduler form. Requirements:

1. **Date Range** — Two DateInput fields for start date and end date. The end date must not be before the start date (show an error if it is). The start date must be today or later.
2. **Time Selection** — A TimePicker in 24-hour mode with 15-minute intervals for the meeting start time
3. **Combined Picker** — A DateTimePicker for a "follow-up reminder" field
4. **Form Layout** — Use View, Text, and Card components from @idealyst/components for layout. Label each field.
5. **Submit Button** — A Button that shows all selected values in a summary Text below the form
6. **Validation** — Show error messages using the error prop on DateInput when dates are invalid

Look up the datepicker documentation for the DateInput, TimePicker, and DateTimePicker APIs.`,
  expectedToolUsage: [
    "get_datepicker_guide",
    "get_component_docs",
    "get_component_types",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/datepicker['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /DateInput|DateTimePicker|TimePicker/,
    /minDate|maxDate|error/,
    /Button/,
  ],
  expectedFiles: {
    "MeetingScheduler.tsx":
      "Meeting scheduler with date range, time picker, validation, and summary display",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["packages", "datepicker", "forms", "validation", "cross-platform"],
};
