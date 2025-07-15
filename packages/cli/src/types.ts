export type ProjectType = 'native' | 'web' | 'shared' | 'workspace';

export interface GenerateProjectOptions {
  name: string;
  type: ProjectType;
  directory: string;
  skipInstall: boolean;
  appName?: string; // For native projects - display name for the app
}

export interface TemplateData {
  projectName: string;
  packageName: string;
  version: string;
  description: string;
  appName?: string; // For native projects
} 