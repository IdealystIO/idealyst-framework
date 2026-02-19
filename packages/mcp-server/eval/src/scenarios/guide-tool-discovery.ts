import type { ComponentScenario } from "../types.js";

export const guideToolDiscoveryScenario: ComponentScenario = {
  type: "component",
  id: "guide-tool-discovery",
  name: "Guide Tool Discovery",
  description:
    "Tests whether the agent discovers and uses dedicated get_*_guide tools instead of relying on generic get_package_docs",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.

IMPORTANT: For detailed API documentation on specific packages, use the dedicated guide tools (like get_camera_guide, get_files_guide, get_animate_guide) with topic "api". These have complete, accurate API references. The generic get_package_docs tool only has summaries.

Use these tools to learn about each package's exact API before writing any code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a media upload screen that combines camera capture, file picking, and upload animations. Requirements:

1. **Camera Capture** — Use @idealyst/camera to let users take a photo. Use the CameraPreview component and useCamera hook. Check permissions first with requestPermission.
2. **File Picking** — Use @idealyst/files to let users pick images from their gallery. Use useFilePicker with the pick() method (NOT pickFiles).
3. **Upload Animation** — Use @idealyst/animate to animate each media item as it uploads: fade in when added, progress animation while uploading, and a bounce sequence on completion.
4. **Media Preview Grid** — Show captured/picked media in a grid using View components with Image thumbnails
5. **Upload Button** — A Button to upload all selected media with a loading state

For EACH package, call the dedicated guide tool with topic "api" BEFORE writing code:
- get_camera_guide with topic "api" for camera types
- get_files_guide with topic "api" for file picker types
- get_animate_guide with topic "api" for animation hooks

Do NOT guess the APIs. The guide tools have the exact TypeScript interfaces.`,
  expectedToolUsage: [
    "get_camera_guide",
    "get_files_guide",
    "get_animate_guide",
    "get_component_docs",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/camera['"]/,
    /import.*from\s+['"]@idealyst\/files['"]/,
    /import.*from\s+['"]@idealyst\/animate['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /useCamera|CameraPreview/,
    /useFilePicker|pick/,
    /useAnimatedStyle|usePresence|useSequence/,
  ],
  expectedFiles: {
    "MediaUpload.tsx":
      "Media upload screen combining camera, file picker, and animations with correct API usage",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: [
    "guide-tools",
    "discovery",
    "camera",
    "files",
    "animate",
    "multi-package",
    "cross-platform",
  ],
};
