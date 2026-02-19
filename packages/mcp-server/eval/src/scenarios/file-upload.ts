import type { ComponentScenario } from "../types.js";

export const fileUploadScenario: ComponentScenario = {
  type: "component",
  id: "file-upload",
  name: "File Upload with Progress",
  description:
    "Tests discovery and usage of the @idealyst/files package for file picking and upload with progress tracking",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide documentation about Idealyst components, packages, recipes, and types.
Use these tools to learn about the framework before writing any code.
Always check package documentation and component types before using them in code.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a file upload screen for a document management app. Requirements:

1. **File Picker** — Use the @idealyst/files package to let users select files (documents, images)
2. **File List** — Display selected files with name, size, and type using List and Text components
3. **Upload Progress** — Show a Progress bar for each file being uploaded
4. **Upload Status** — Use Badge components to show status: pending, uploading, completed, failed
5. **Remove Button** — An icon button to remove a file from the upload queue before or after upload
6. **Upload All Button** — A Button to start uploading all selected files

Search for the files package first, read its documentation, then build the screen using Idealyst components.`,
  expectedToolUsage: [
    "search_packages",
    "get_package_docs",
    "get_component_docs",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /@idealyst\/files/,
    /Button/,
    /Progress/,
    /Badge/,
  ],
  expectedFiles: {
    "FileUpload.tsx":
      "File upload screen with file picker, progress bars, and upload management",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["packages", "files", "upload", "progress", "cross-platform"],
};
