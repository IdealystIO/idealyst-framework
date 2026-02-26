import type { ComponentScenario } from "../types.js";

export const installGuideCameraScenario: ComponentScenario = {
  type: "component",
  id: "install-guide-camera",
  name: "Camera with Install Guide",
  description:
    "Tests whether the agent uses get_install_guide to understand native setup requirements and builds a camera screen",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a camera capture screen AND document the native setup requirements. Two files required:

**File 1: SETUP.md** (native configuration guide)
- Look up the camera package install guide to understand what native configuration is needed
- Document the required iOS Info.plist entries (camera usage description, etc.)
- Document the required Android manifest permissions
- Include any CocoaPods or Gradle configuration needed

**File 2: CameraScreen.tsx** (camera capture UI)
- Show a camera preview that fills most of the screen
- A capture button to take a photo
- A flash toggle button (on/off/auto)
- Display the last captured photo as a small thumbnail
- Handle camera permissions (request on mount, show a message if denied)

Look up both the install guide AND the camera package documentation using the MCP tools.`,
  expectedToolUsage: [
    "get_install_guide",
    "get_camera_guide",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/camera['"]/,
    /NSCameraUsageDescription|Info\.plist/i,
    /CAMERA|AndroidManifest|android/i,
    /CameraPreview/,
    /useCamera/,
    /takePhoto|capture/i,
  ],
  expectedFiles: {
    "SETUP.md": "Native setup guide with iOS and Android permission configuration",
    "CameraScreen.tsx":
      "Camera screen with preview, capture, flash toggle, and permission handling",
  },
  maxTurns: 50,
  difficulty: "intermediate",
  tags: ["camera", "install-guide", "native-setup", "packages"],
};
