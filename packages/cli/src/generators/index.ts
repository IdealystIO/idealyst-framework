import { GenerateProjectOptions } from '../types';
import { generateFullStackProject } from './init';

export async function generateProject(options: GenerateProjectOptions): Promise<void> {
  await generateFullStackProject(options);
}

export * from './init'; 