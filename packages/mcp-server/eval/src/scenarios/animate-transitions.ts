import type { ComponentScenario } from "../types.js";

export const animateTransitionsScenario: ComponentScenario = {
  type: "component",
  id: "animate-transitions",
  name: "Animation & Transitions",
  description:
    "Tests discovery and usage of @idealyst/animate hooks: useAnimatedStyle, usePresence, useSequence, useKeyframes, and transform syntax",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check package guides and component types before using them in code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build an animated notification center screen. Requirements:

1. **Notification Cards** — Each notification card should animate in when it appears using enter/exit animations (fade + slide up). When dismissed, it should animate out.
2. **Pulsing Badge** — A badge on the notification bell icon that continuously pulses using a keyframe animation to draw attention.
3. **Expandable Details** — When a notification is tapped, its card expands to show details with a smooth height/opacity animation sequence.
4. **Mark All Read Button** — A button that, when pressed, triggers a bounce animation sequence (scale up → scale down → settle).
5. **Gradient Border** — The most recent notification should have an animated gradient border to highlight it.

Use the @idealyst/animate package for ALL animations. Look up the animate guide to understand the available hooks (useAnimatedStyle, usePresence, useSequence, useKeyframes, useGradientBorder) and the simplified transform syntax ({ x, y, scale } not arrays). Do NOT use React Native's Animated API.`,
  expectedToolUsage: [
    "get_animate_guide",
    "get_component_docs",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/animate['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /usePresence|useAnimatedStyle|useSequence|useKeyframes|useGradientBorder/,
    /transform.*\{|opacity/,
    /Button/,
  ],
  expectedFiles: {
    "NotificationCenter.tsx":
      "Animated notification center with enter/exit, pulse, sequence, and gradient border animations",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["packages", "animate", "transitions", "cross-platform"],
};
