export interface GenerateProjectOptions {
  name: string;
  directory: string;
  skipInstall: boolean;
  figmaToken?: string; // Figma personal access token for MCP integration
}

export interface TemplateData {
  projectName: string;
  packageName: string;
  version: string;
  description: string;
  appName?: string; // For native projects
  workspaceScope?: string; // For workspace-scoped packages
  idealystVersion: string; // Current version of Idealyst packages
} 