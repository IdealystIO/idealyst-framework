import { generateWebProject } from '../src/generators/web';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, verifyFileExists } from './setup';

describe('Web Generator', () => {
  let tempDir: string;
  let workspaceDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('web-generator');
    
    // Create a workspace first
    workspaceDir = path.join(tempDir, 'test-workspace');
    await fs.ensureDir(workspaceDir);
    
    const workspacePackageJson = {
      name: 'test-workspace',
      workspaces: ['packages/*'],
      private: true
    };
    await fs.writeJSON(path.join(workspaceDir, 'package.json'), workspacePackageJson);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create a web project within a workspace', async () => {
    await generateWebProject({
      name: 'my-web-app',
      type: 'web',
      directory: workspaceDir,
      skipInstall: true,
      withTrpc: false
    });

    const projectPath = path.join(workspaceDir, 'packages', 'my-web-app');

    // Verify main files
    await verifyFileExists(path.join(projectPath, 'package.json'), [
      '"name": "@test-workspace/my-web-app"',
      '"type": "module"',
      '"scripts"'
    ]);

    await verifyFileExists(path.join(projectPath, 'index.html'));
    await verifyFileExists(path.join(projectPath, 'vite.config.ts'));
    await verifyFileExists(path.join(projectPath, 'tsconfig.json'));
    await verifyFileExists(path.join(projectPath, 'jest.config.js'));

    // Verify source files
    await verifyFileExists(path.join(projectPath, 'src', 'main.tsx'));
    await verifyFileExists(path.join(projectPath, 'src', 'App.tsx'));

    // Verify test files
    await verifyFileExists(path.join(projectPath, '__tests__', 'App.test.tsx'));
    await verifyFileExists(path.join(projectPath, '__tests__', 'components.test.tsx'));

    // Verify workspace was updated
    const workspacePackageJson = await fs.readJSON(path.join(workspaceDir, 'package.json'));
    expect(workspacePackageJson.workspaces).toContain('packages/*');
  });

  it('should create web project with tRPC setup', async () => {
    await generateWebProject({
      name: 'my-trpc-web-app',
      type: 'web',
      directory: workspaceDir,
      skipInstall: true,
      withTrpc: true
    });

    const projectPath = path.join(workspaceDir, 'packages', 'my-trpc-web-app');

    // Verify tRPC files
    await verifyFileExists(path.join(projectPath, 'src', 'utils', 'trpc.ts'));
    
    // Verify App.tsx has tRPC provider
    const appContent = await fs.readFile(path.join(projectPath, 'src', 'App.tsx'), 'utf8');
    expect(appContent).toContain('trpc.Provider');

    // Verify package.json has tRPC dependencies
    const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
    expect(packageJson.dependencies).toHaveProperty('@trpc/client');
    expect(packageJson.dependencies).toHaveProperty('@trpc/react-query');
  });

  it('should fail when not in a workspace', async () => {
    const nonWorkspaceDir = path.join(tempDir, 'non-workspace');
    await fs.ensureDir(nonWorkspaceDir);

    await expect(generateWebProject({
      name: 'my-web-app',
      type: 'web',
      directory: nonWorkspaceDir,
      skipInstall: true
    })).rejects.toThrow('Individual projects can only be created within a workspace');
  });

  it('should validate project names', async () => {
    await expect(generateWebProject({
      name: 'Invalid Name',
      type: 'web',
      directory: workspaceDir,
      skipInstall: true
    })).rejects.toThrow('Invalid project name');
  });
});
