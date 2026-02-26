import type { ComponentScenario } from "../types.js";

export const lottieAnimationScenario: ComponentScenario = {
  type: "component",
  id: "lottie-animation",
  name: "Lottie Animation Onboarding",
  description:
    "Tests whether the agent can use the @idealyst/lottie package to build an onboarding screen with play/pause/restart controls",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build an animated onboarding screen using Lottie animations. Requirements:

1. **Lottie Animation** — Display a Lottie animation from a URL (use "https://assets.example.com/onboarding.json" as the source)
2. **Playback Controls** — Three buttons: Play, Pause, and Restart using an imperative ref
3. **Auto-Play** — The animation should auto-play and loop by default
4. **Completion Callback** — When the animation finishes one loop, update a "Loops completed" counter
5. **Sizing** — The animation should be 300x300 pixels
6. **Layout** — Center the animation with the controls below it, use appropriate spacing

Look up the Lottie package documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_lottie_guide",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/lottie['"]/,
    /useRef/,
    /LottieRef/,
    /autoPlay/,
    /loop/,
    /onComplete|onAnimationFinish/,
    /play\(\)|pause\(\)|stop\(\)|reset\(\)/,
  ],
  expectedFiles: {
    "OnboardingScreen.tsx":
      "Onboarding screen with Lottie animation and playback controls",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["lottie", "animation", "packages"],
};
