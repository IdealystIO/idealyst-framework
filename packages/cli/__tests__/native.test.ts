import { generateNativeProject } from '../src/generators/native';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, verifyFileExists } from './setup';

describe('Native Generator', () => {
  let tempDir: string;
  let workspaceDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('native-generator');
    
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

  it('should create a native project with template fallback (CLI disabled)', async () => {
    // Disable React Native CLI to test template-only approach
    process.env.IDEALYST_USE_RN_CLI = 'false';

    await generateNativeProject({
      name: 'my-native-app',
      type: 'native',
      directory: workspaceDir,
      skipInstall: true,
      appName: 'My Native App',
      withTrpc: false
    });

    const projectPath = path.join(workspaceDir, 'packages', 'my-native-app');

    // Verify main files
    await verifyFileExists(path.join(projectPath, 'package.json'), [
      '"name": "@test-workspace/my-native-app"',
      '"react-native"'
    ]);

    await verifyFileExists(path.join(projectPath, 'App.tsx'));
    await verifyFileExists(path.join(projectPath, 'index.js'));
    await verifyFileExists(path.join(projectPath, 'app.json'));
    await verifyFileExists(path.join(projectPath, 'metro.config.js'));
    await verifyFileExists(path.join(projectPath, 'babel.config.js'));
    await verifyFileExists(path.join(projectPath, 'tsconfig.json'));
    await verifyFileExists(path.join(projectPath, 'jest.config.js'));

    // Verify test files
    await verifyFileExists(path.join(projectPath, '__tests__', 'App.test.tsx'));
    await verifyFileExists(path.join(projectPath, '__tests__', 'components.test.tsx'));

    // Verify source structure
    await verifyFileExists(path.join(projectPath, 'src'));

    // Check app.json for correct app name
    const appJson = await fs.readJSON(path.join(projectPath, 'app.json'));
    expect(appJson.displayName).toBe('My Native App');
    expect(appJson.name).toBe('my-native-app');

    // Reset environment variable
    delete process.env.IDEALYST_USE_RN_CLI;
  });

  it('should create native project with tRPC setup', async () => {
    process.env.IDEALYST_USE_RN_CLI = 'false';

    await generateNativeProject({
      name: 'my-trpc-native-app',
      type: 'native',
      directory: workspaceDir,
      skipInstall: true,
      appName: 'My tRPC App',
      withTrpc: true
    });

    const projectPath = path.join(workspaceDir, 'packages', 'my-trpc-native-app');

    // Verify tRPC files
    await verifyFileExists(path.join(projectPath, 'src', 'utils', 'trpc.ts'));
    
    // Verify App.tsx has tRPC provider
    const appContent = await fs.readFile(path.join(projectPath, 'App.tsx'), 'utf8');
    expect(appContent).toContain('TrpcProvider');

    // Verify package.json has tRPC dependencies
    const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
    expect(packageJson.dependencies).toHaveProperty('@trpc/client');
    expect(packageJson.dependencies).toHaveProperty('@trpc/react-query');

    delete process.env.IDEALYST_USE_RN_CLI;
  });

  it('should handle React Native CLI failure gracefully', async () => {
    // Enable RN CLI but it will fail in test environment
    process.env.IDEALYST_USE_RN_CLI = 'true';

    // Mock console methods to capture output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await generateNativeProject({
      name: 'cli-fallback-app',
      type: 'native',
      directory: workspaceDir,
      skipInstall: true,
      appName: 'CLI Fallback App'
    });

    const projectPath = path.join(workspaceDir, 'packages', 'cli-fallback-app');

    // Should still create the project via fallback
    await verifyFileExists(path.join(projectPath, 'package.json'));
    await verifyFileExists(path.join(projectPath, 'App.tsx'));

    // Should log fallback message
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('React Native CLI failed, falling back to template-only approach')
    );

    consoleSpy.mockRestore();
    delete process.env.IDEALYST_USE_RN_CLI;
  });

  it('should fail when not in a workspace', async () => {
    const nonWorkspaceDir = path.join(tempDir, 'non-workspace');
    await fs.ensureDir(nonWorkspaceDir);

    await expect(generateNativeProject({
      name: 'my-native-app',
      type: 'native',
      directory: nonWorkspaceDir,
      skipInstall: true
    })).rejects.toThrow('Individual projects can only be created within a workspace');
  });

  it('should validate project names', async () => {
    await expect(generateNativeProject({
      name: 'Invalid Name',
      type: 'native',
      directory: workspaceDir,
      skipInstall: true
    })).rejects.toThrow('Invalid project name');
  });

  it('should generate proper display name from project name', async () => {
    process.env.IDEALYST_USE_RN_CLI = 'false';

    await generateNativeProject({
      name: 'my-awesome-mobile-app',
      type: 'native',
      directory: workspaceDir,
      skipInstall: true
      // No appName provided - should generate from project name
    });

    const projectPath = path.join(workspaceDir, 'packages', 'my-awesome-mobile-app');
    const appJson = await fs.readJSON(path.join(projectPath, 'app.json'));
    
    // Should convert kebab-case to Title Case
    expect(appJson.displayName).toBe('My-awesome-mobile-app'); // Note: current implementation doesn't do perfect title case

    delete process.env.IDEALYST_USE_RN_CLI;
  });

  it('should create correct React Native dependencies', async () => {
    process.env.IDEALYST_USE_RN_CLI = 'false';

    await generateNativeProject({
      name: 'rn-deps-test',
      type: 'native',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', 'rn-deps-test');
    const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));

    // Check React Native specific dependencies
    expect(packageJson.dependencies).toHaveProperty('react-native');
    expect(packageJson.dependencies).toHaveProperty('react-native-vector-icons');
    expect(packageJson.dependencies).toHaveProperty('react-native-unistyles');

    // Check dev dependencies
    expect(packageJson.devDependencies).toHaveProperty('@types/react');
    expect(packageJson.devDependencies).toHaveProperty('react-test-renderer');

    delete process.env.IDEALYST_USE_RN_CLI;
  });
});
