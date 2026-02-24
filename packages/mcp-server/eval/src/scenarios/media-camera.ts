import type { ComponentScenario } from "../types.js";

export const mediaCameraScenario: ComponentScenario = {
  type: "component",
  id: "media-camera",
  name: "Camera & Image Capture",
  description:
    "Tests discovery and usage of the @idealyst/camera package alongside components for a photo capture screen",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a photo capture screen for a document scanning app. Requirements:

1. **Camera View** — Display a live camera preview
2. **Capture Button** — A large circular button to take a photo
3. **Photo Preview** — After capture, show the photo with options to retake or confirm
4. **Flash Toggle** — An icon button to toggle the camera flash on/off
5. **Gallery Button** — A button to open the photo gallery as an alternative to capturing

Discover what camera/photo packages are available using the MCP tools.`,
  expectedToolUsage: [
    "search_packages",
    "get_package_docs",
    "get_component_docs",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /@idealyst\/camera/,
    /Button/,
    /Image/,
    /camera|Camera/i,
  ],
  expectedFiles: {
    "PhotoCapture.tsx":
      "Photo capture screen with camera preview, capture button, and photo review",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["packages", "camera", "media", "cross-platform"],
};
