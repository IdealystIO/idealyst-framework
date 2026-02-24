import type { ComponentScenario } from "../types.js";

export const datepickerBookingScenario: ComponentScenario = {
  type: "component",
  id: "datepicker-booking",
  name: "DatePicker Booking Form",
  description:
    "Tests discovery and usage of @idealyst/datepicker components: DateInput, TimePicker, DateTimePicker with validation",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a meeting scheduler form. Requirements:

1. **Date Range** — Start date and end date fields. The end date must not be before the start date (show an error if it is). The start date must be today or later.
2. **Time Selection** — A time picker in 24-hour mode with 15-minute intervals for the meeting start time
3. **Combined Picker** — A combined date-and-time picker for a "follow-up reminder" field
4. **Form Layout** — Lay out the form with labels for each field using cards/sections
5. **Submit Button** — A button that shows all selected values in a summary below the form
6. **Validation** — Show error messages when dates are invalid

Discover what date/time picker packages are available using the MCP tools.`,
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
