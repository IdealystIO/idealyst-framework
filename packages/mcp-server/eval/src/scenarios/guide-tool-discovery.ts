import type { ComponentScenario } from "../types.js";

export const guideToolDiscoveryScenario: ComponentScenario = {
  type: "component",
  id: "guide-tool-discovery",
  name: "Guide Tool Discovery",
  description:
    "Tests whether the agent discovers and uses dedicated get_*_guide tools instead of relying on generic get_package_docs",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a media upload screen that combines camera capture, file picking, and upload animations. Requirements:

1. **Camera Capture** — Let users take a photo using the camera with proper permission handling
2. **File Picking** — Let users pick images from their gallery as an alternative to capturing
3. **Upload Animation** — Animate each media item as it's added (fade in) and when upload completes (scale bounce)
4. **Media Preview Grid** — Show captured/picked media in a grid with image thumbnails
5. **Upload Button** — A button to upload all selected media with a loading state

Discover what packages are available for camera, file picking, and animations using the MCP tools.`,
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
    /useAnimatedStyle|usePresence|useAnimatedValue/,
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
