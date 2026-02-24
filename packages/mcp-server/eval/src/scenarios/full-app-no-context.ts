import type { ComponentScenario } from "../types.js";

export const fullAppNoContextScenario: ComponentScenario = {
  type: "component",
  id: "full-app-no-context",
  name: "Full App Discovery (No Context)",
  description:
    "Tests whether a zero-context agent can discover the framework, read the intro, find packages, and build a multi-package app",
  systemPrompt: `You are a React developer. You have access to MCP tools that provide documentation about a component framework. You know nothing about this framework — use the tools to discover everything you need.`,
  taskPrompt: `Build a fitness tracker app screen. The screen should have:

1. **Workout Log** — A list of today's completed exercises showing name, sets, reps, and a completion checkmark
2. **Active Timer** — A large countdown timer display for the current exercise rest period, with start/pause/reset buttons. The timer digits should animate when changing.
3. **Weekly Progress Chart** — A chart showing workout minutes per day for the past 7 days
4. **Animated Progress Ring** — An animated progress indicator showing "3 of 5 exercises completed" that fills up smoothly as exercises are done
5. **Quick Stats Cards** — Cards showing today's stats: total time, calories burned, exercises completed

Use the MCP tools to discover what framework you're working with and what components and packages are available.`,
  expectedToolUsage: [
    "get_intro",
    "list_packages",
    "get_charts_guide",
    "get_animate_guide",
    "get_component_docs",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/components['"]/,
    /import.*from\s+['"]@idealyst\/charts['"]/,
    /import.*from\s+['"]@idealyst\/animate['"]/,
    /LineChart|BarChart/,
    /useAnimatedStyle|useAnimatedValue|usePresence/,
    /Button/,
  ],
  expectedFiles: {
    "FitnessTracker.tsx":
      "Fitness tracker with workout log, timer, charts, and animated progress using multiple packages",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: [
    "no-context",
    "discovery",
    "multi-package",
    "animate",
    "charts",
    "cross-platform",
  ],
};
