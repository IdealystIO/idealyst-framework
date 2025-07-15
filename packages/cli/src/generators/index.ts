import { GenerateProjectOptions, ProjectType } from '../types';
import { generateNativeProject } from './native';
import { generateWebProject } from './web';
import { generateSharedLibrary } from './shared';
import { generateWorkspace } from './workspace';

export async function generateProject(options: GenerateProjectOptions): Promise<void> {
  const { type } = options;
  
  switch (type) {
    case 'native':
      await generateNativeProject(options);
      break;
    case 'web':
      await generateWebProject(options);
      break;
    case 'shared':
      await generateSharedLibrary(options);
      break;
    case 'workspace':
      await generateWorkspace(options);
      break;
    default:
      throw new Error(`Unknown project type: ${type}`);
  }
}

export * from './native';
export * from './web';
export * from './shared';
export * from './workspace'; 