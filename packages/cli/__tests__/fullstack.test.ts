import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import { generateFullStackWorkspace } from '../src/generators/fullstack';
import { cleanupTempDir, createTempDir } from './setup';

describe('Fullstack Generator', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('fullstack-generator');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create a complete full-stack workspace', async () => {
    await generateFullStackWorkspace({
      name: 'my-fullstack-app',
      type: 'fullstack',
      directory: tempDir,
      skipInstall: true
    });

    const workspacePath = path.join(tempDir, 'my-fullstack-app');

    // Verify workspace structure
    expect(await fs.pathExists(workspacePath)).toBe(true);
    expect(await fs.pathExists(path.join(workspacePath, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(workspacePath, 'README.md'))).toBe(true);

    // Verify all packages were created
    const packagesPath = path.join(workspacePath, 'packages');
    expect(await fs.pathExists(path.join(packagesPath, 'database'))).toBe(true);
    expect(await fs.pathExists(path.join(packagesPath, 'api'))).toBe(true);
    expect(await fs.pathExists(path.join(packagesPath, 'web'))).toBe(true);
    expect(await fs.pathExists(path.join(packagesPath, 'mobile'))).toBe(true);
    expect(await fs.pathExists(path.join(packagesPath, 'shared'))).toBe(true);

    // Verify workspace package.json has integrated scripts
    const workspacePackageJson = await fs.readJSON(path.join(workspacePath, 'package.json'));
    expect(workspacePackageJson.scripts['dev']).toBeDefined();
    expect(workspacePackageJson.scripts['web:dev']).toBeDefined();
    expect(workspacePackageJson.scripts['mobile:start']).toBeDefined();
    expect(workspacePackageJson.scripts['api:dev']).toBeDefined();
    expect(workspacePackageJson.scripts['db:generate']).toBeDefined();

    // Verify concurrently is added as dependency
    expect(workspacePackageJson.devDependencies['concurrently']).toBeDefined();

    // Verify database package has exports
    const dbPackageJson = await fs.readJSON(path.join(packagesPath, 'database', 'package.json'));
    expect(dbPackageJson.exports).toBeDefined();
    expect(dbPackageJson.exports['.']).toBeDefined();
    expect(dbPackageJson.exports['./client']).toBeDefined();

    // Verify all packages are workspace-scoped
    expect(dbPackageJson.name).toBe('@my-fullstack-app/database');
    
    const apiPackageJson = await fs.readJSON(path.join(packagesPath, 'api', 'package.json'));
    expect(apiPackageJson.name).toBe('@my-fullstack-app/api');

    // Verify web and mobile have tRPC setup
    const webAppPath = path.join(packagesPath, 'web', 'src', 'App.tsx');
    const webAppContent = await fs.readFile(webAppPath, 'utf8');
    expect(webAppContent).toContain('trpc.Provider');

    const mobileAppPath = path.join(packagesPath, 'mobile', 'src', 'App.tsx');
    const mobileAppContent = await fs.readFile(mobileAppPath, 'utf8');
    expect(mobileAppContent).toContain('trpc.Provider');

    // Verify README includes comprehensive documentation
    const readmeContent = await fs.readFile(path.join(workspacePath, 'README.md'), 'utf8');
    expect(readmeContent).toContain('# my-fullstack-app');
    expect(readmeContent).toContain('full-stack application');
    expect(readmeContent).toContain('yarn dev');
    expect(readmeContent).toContain('Architecture');
  });

  it('should handle Figma token integration', async () => {
    await generateFullStackWorkspace({
      name: 'figma-app',
      type: 'fullstack',
      directory: tempDir,
      skipInstall: true,
      figmaToken: 'test-figma-token-123'
    });

    const workspacePath = path.join(tempDir, 'figma-app');
    const devcontainerEnvPath = path.join(workspacePath, '.devcontainer', '.env');
    
    expect(await fs.pathExists(devcontainerEnvPath)).toBe(true);
    
    const envContent = await fs.readFile(devcontainerEnvPath, 'utf8');
    expect(envContent).toContain('FIGMA_ACCESS_TOKEN=test-figma-token-123');
  });
});
