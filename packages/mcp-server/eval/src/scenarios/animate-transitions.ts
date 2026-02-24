import type { ComponentScenario } from "../types.js";

export const animateTransitionsScenario: ComponentScenario = {
  type: "component",
  id: "animate-transitions",
  name: "Animation & Transitions",
  description:
    "Tests discovery and usage of @idealyst/animate hooks (useAnimatedStyle, useAnimatedValue, usePresence, useGradientBorder) with correct easing values",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build an animated notification center screen. Requirements:

1. **Notification Cards** — Each notification card should animate in when it appears (fade + slide up) and animate out when dismissed
2. **Pulsing Badge** — A badge on the notification bell icon that continuously pulses to draw attention
3. **Expandable Details** — When a notification is tapped, its card expands to show details with a smooth animation
4. **Mark All Read Button** — A button that triggers a bounce animation (scale up then settle) when pressed
5. **Gradient Border** — The most recent notification should have an animated gradient border to highlight it

Discover what animation packages are available using the MCP tools.`,
  expectedToolUsage: [
    "get_animate_guide",
    "get_component_docs",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/animate['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /usePresence|useAnimatedStyle|useAnimatedValue|useGradientBorder/,
    /transform.*\{|opacity/,
    /Button/,
  ],
  expectedFiles: {
    "NotificationCenter.tsx":
      "Animated notification center with enter/exit, pulse, bounce, and gradient border animations",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["packages", "animate", "transitions", "cross-platform"],
};
