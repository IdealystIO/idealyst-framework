import { GenerateProjectOptions, ProjectType } from '../types';
import { generateNativeProject } from './native';
import { generateWebProject } from './web';
import { generateSharedLibrary } from './shared';
import { generateWorkspace } from './workspace';
import { generateApiProject } from './api';
import { generateDatabaseProject } from './database';
import { generateFullStackWorkspace } from './fullstack';

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
    case 'api':
      await generateApiProject(options);
      break;
    case 'database':
      await generateDatabaseProject(options);
      break;
    case 'fullstack':
      await generateFullStackWorkspace(options);
      break;
    default:
      throw new Error(`Unknown project type: ${type}`);
  }
}

export * from './native';
export * from './web';
export * from './shared';
export * from './workspace';
export * from './api';
export * from './database';
export * from './fullstack'; 