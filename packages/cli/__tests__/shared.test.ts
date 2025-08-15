import { generateSharedLibrary } from '../src/generators/shared';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, verifyFileExists } from './setup';

describe('Shared Library Generator', () => {
  let tempDir: string;
  let workspaceDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('shared-generator');
    
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

  it('should create a shared library within a workspace', async () => {
    await generateSharedLibrary({
      name: 'shared-utils',
      type: 'shared',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', 'shared-utils');

    // Verify main files
    await verifyFileExists(path.join(projectPath, 'package.json'), [
      '"name": "@test-workspace/shared-utils"',
      '"main": "dist/index.js"',
      '"types": "dist/index.d.ts"'
    ]);

    await verifyFileExists(path.join(projectPath, 'tsconfig.json'));
    await verifyFileExists(path.join(projectPath, 'jest.config.js'));
    await verifyFileExists(path.join(projectPath, 'rollup.config.js'));

    // Verify source files
    await verifyFileExists(path.join(projectPath, 'src', 'index.ts'));

    // Verify test files
    await verifyFileExists(path.join(projectPath, '__tests__', 'shared.test.ts'));

    // Verify package.json has correct configuration
    const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.peerDependencies).toHaveProperty('react');
    expect(packageJson.peerDependencies).toHaveProperty('react-native');
  });

  it('should fail when not in a workspace', async () => {
    const nonWorkspaceDir = path.join(tempDir, 'non-workspace');
    await fs.ensureDir(nonWorkspaceDir);

    await expect(generateSharedLibrary({
      name: 'shared-utils',
      type: 'shared',
      directory: nonWorkspaceDir,
      skipInstall: true
    })).rejects.toThrow('Individual projects can only be created within a workspace');
  });

  it('should validate project names', async () => {
    await expect(generateSharedLibrary({
      name: 'Invalid Name',
      type: 'shared',
      directory: workspaceDir,
      skipInstall: true
    })).rejects.toThrow('Invalid project name');
  });

  it('should create cross-platform compatible structure', async () => {
    await generateSharedLibrary({
      name: 'cross-platform-lib',
      type: 'shared',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', 'cross-platform-lib');

    // Check that TypeScript config supports both React and React Native
    const tsConfig = await fs.readJSON(path.join(projectPath, 'tsconfig.json'));
    expect(tsConfig.compilerOptions.target).toBeDefined();
    expect(tsConfig.compilerOptions.module).toBeDefined();

    // Check rollup config exists for building
    await verifyFileExists(path.join(projectPath, 'rollup.config.js'));

    // Verify Jest config for testing
    const jestConfig = await fs.readFile(path.join(projectPath, 'jest.config.js'), 'utf8');
    expect(jestConfig).toContain('ts-jest');
  });
});
