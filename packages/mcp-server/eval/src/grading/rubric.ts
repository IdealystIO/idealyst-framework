/**
 * Evaluation Rubric
 *
 * Defines scoring dimensions, weights, and constants for grading.
 */

import type { GradingDimension } from "../types.js";

export interface RubricDimension {
  key: GradingDimension;
  name: string;
  weight: number;
  description: string;
}

export const RUBRIC: RubricDimension[] = [
  {
    key: "toolDiscovery",
    name: "Tool Discovery",
    weight: 0.15,
    description:
      "Did the agent use appropriate MCP tools to learn about the framework?",
  },
  {
    key: "informationGathering",
    name: "Information Gathering",
    weight: 0.15,
    description:
      "Did the agent gather sufficient documentation before generating code?",
  },
  {
    key: "codeCorrectness",
    name: "Code Correctness",
    weight: 0.15,
    description:
      "Does the generated code use correct imports, props, and APIs?",
  },
  {
    key: "typecheckPasses",
    name: "TypeScript Compilation",
    weight: 0.2,
    description:
      "Does the generated code pass tsc --noEmit without errors?",
  },
  {
    key: "codeCompleteness",
    name: "Code Completeness",
    weight: 0.15,
    description: "Does the code fulfill all requirements stated in the task?",
  },
  {
    key: "efficiency",
    name: "Efficiency",
    weight: 0.1,
    description:
      "Did the agent avoid redundant tool calls and excessive turns?",
  },
  {
    key: "errorHandling",
    name: "Error Handling",
    weight: 0.1,
    description: "Did the agent handle tool errors and edge cases properly?",
  },
];

/** Valid @idealyst/* package imports */
export const VALID_IDEALYST_PACKAGES = [
  "@idealyst/components",
  "@idealyst/theme",
  "@idealyst/navigation",
  "@idealyst/storage",
  "@idealyst/translate",
  "@idealyst/config",
  "@idealyst/animate",
  "@idealyst/audio",
  "@idealyst/audio-playback",
  "@idealyst/blur",
  "@idealyst/camera",
  "@idealyst/datepicker",
  "@idealyst/files",
  "@idealyst/lottie",
  "@idealyst/microphone",
  "@idealyst/svg",
  "@idealyst/charts",
  "@idealyst/datagrid",
  "@idealyst/markdown",
  "@idealyst/oauth-client",
  "@idealyst/tooling",
];
