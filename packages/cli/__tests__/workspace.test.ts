import { generateWorkspace } from '../src/generators/workspace';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, verifyFileExists, verifyDirectoryStructure } from './setup';

describe('Workspace Generator', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('workspace-generator');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create a complete workspace structure', async () => {
    await generateWorkspace({
      name: 'test-workspace',
      type: 'workspace',
      directory: tempDir,
      skipInstall: true
    });

    const workspacePath = path.join(tempDir, 'test-workspace');

    // Verify main files exist
    await verifyFileExists(path.join(workspacePath, 'package.json'), [
      '"name": "test-workspace"',
      '"workspaces"'
    ]);

    await verifyFileExists(path.join(workspacePath, 'jest.config.js'));
    await verifyFileExists(path.join(workspacePath, 'README.md'));
    await verifyFileExists(path.join(workspacePath, 'tsconfig.json'));

    // Verify Docker files
    await verifyFileExists(path.join(workspacePath, 'Dockerfile'));
    await verifyFileExists(path.join(workspacePath, 'docker-compose.yml'));
    await verifyFileExists(path.join(workspacePath, 'docker-compose.prod.yml'));
    await verifyFileExists(path.join(workspacePath, '.dockerignore'));

    // Verify environment files
    await verifyFileExists(path.join(workspacePath, '.env.example'));
    await verifyFileExists(path.join(workspacePath, '.env.production'));

    // Verify documentation
    await verifyFileExists(path.join(workspacePath, 'DOCKER.md'));

    // Verify directory structure
    await verifyDirectoryStructure(workspacePath, [
      'docker',
      '.devcontainer'
    ]);
  });

  it('should handle template variable replacement', async () => {
    await generateWorkspace({
      name: 'my-custom-workspace',
      type: 'workspace',
      directory: tempDir,
      skipInstall: true
    });

    const workspacePath = path.join(tempDir, 'my-custom-workspace');
    const packageJsonPath = path.join(workspacePath, 'package.json');
    
    const packageJson = await fs.readJSON(packageJsonPath);
    expect(packageJson.name).toBe('my-custom-workspace');

    const readmePath = path.join(workspacePath, 'README.md');
    const readmeContent = await fs.readFile(readmePath, 'utf8');
    expect(readmeContent).toContain('my-custom-workspace');
  });
});
