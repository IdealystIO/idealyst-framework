export type ProjectType = 'native' | 'web' | 'shared' | 'workspace' | 'api';

export interface GenerateProjectOptions {
  name: string;
  type: ProjectType;
  directory: string;
  skipInstall: boolean;
  appName?: string; // For native projects - display name for the app
  withTrpc?: boolean; // For web/native projects - include tRPC boilerplate
}

export interface TemplateData {
  projectName: string;
  packageName: string;
  version: string;
  description: string;
  appName?: string; // For native projects
} 