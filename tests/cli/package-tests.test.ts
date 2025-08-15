import fs from 'fs-extra';
import path from 'path';
import { tmpdir } from 'os';
import { execSync } from 'child_process';

// Test utilities
const TEST_TEMP_DIR = path.join(tmpdir(), 'idealyst-package-tests');

async function cleanupTestDir(): Promise<void> {
  if (await fs.pathExists(TEST_TEMP_DIR)) {
    await fs.remove(TEST_TEMP_DIR);
  }
}

function runCLICommand(command: string, cwd: string = TEST_TEMP_DIR): void {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'ignore', 
      env: { ...process.env, CI: 'true' }
    });
  } catch (error) {
    throw new Error(`CLI command failed: ${command}`);
  }
}

describe('Generated Package Tests', () => {
  beforeAll(async () => {
    await cleanupTestDir();
    await fs.ensureDir(TEST_TEMP_DIR);
  }, 15000);

  afterAll(async () => {
    await cleanupTestDir();
  });

  describe('Jest Configuration Validation', () => {
    test('should validate template Jest configurations are correct', async () => {
      // Test each template's Jest config directly from the template files
      const cliTemplatesDir = path.resolve(__dirname, '../../packages/cli/templates');
      
      const templateTypes = ['api', 'web', 'native', 'shared', 'workspace'];
      
      for (const templateType of templateTypes) {
        const templatePath = path.join(cliTemplatesDir, templateType);
        
        if (await fs.pathExists(templatePath)) {
          // Check Jest config exists and uses .js extension
          const jestConfigPath = path.join(templatePath, 'jest.config.js');
          expect(await fs.pathExists(jestConfigPath)).toBe(true);
          
          // Verify Jest config is valid JavaScript
          const jestConfigContent = await fs.readFile(jestConfigPath, 'utf8');
          expect(jestConfigContent).toContain('module.exports');
          
          // Verify common Jest settings based on template type
          switch (templateType) {
            case 'api':
            case 'shared':
              expect(jestConfigContent).toContain('ts-jest');
              expect(jestConfigContent).toContain('node');
              break;
            case 'web':
              expect(jestConfigContent).toContain('jsdom');
              break;
            case 'native':
              expect(jestConfigContent).toContain('react-native');
              break;
            case 'workspace':
              expect(jestConfigContent).toContain('projects');
              break;
          }
          
          // Check for Jest setup file if applicable
          if (templateType !== 'workspace') {
            const jestSetupPath = path.join(templatePath, 'jest.setup.js');
            if (await fs.pathExists(jestSetupPath)) {
              const setupContent = await fs.readFile(jestSetupPath, 'utf8');
              expect(setupContent.length).toBeGreaterThan(0);
            }
          }
          
          // Check package.json has proper test scripts
          const packageJsonPath = path.join(templatePath, 'package.json');
          if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJSON(packageJsonPath);
            expect(packageJson.scripts?.test).toBeDefined();
            if (templateType !== 'workspace') {
              expect(packageJson.scripts?.['test:watch']).toBeDefined();
              expect(packageJson.scripts?.['test:coverage']).toBeDefined();
              expect(packageJson.devDependencies?.jest).toBeDefined();
            }
          }
          
          // Check for test files
          if (templateType !== 'workspace') {
            const testDir = path.join(templatePath, '__tests__');
            if (await fs.pathExists(testDir)) {
              const testFiles = await fs.readdir(testDir);
              expect(testFiles.length).toBeGreaterThan(0);
              
              const hasTestFiles = testFiles.some(file => 
                file.endsWith('.test.ts') || 
                file.endsWith('.test.tsx') || 
                file.endsWith('.test.js')
              );
              expect(hasTestFiles).toBe(true);
            }
          }
        }
      }
    }, 30000);

    test('should validate Jest configurations use .js extension consistently', async () => {
      const cliTemplatesDir = path.resolve(__dirname, '../../packages/cli/templates');
      const templateTypes = ['api', 'web', 'native', 'shared', 'workspace'];
      
      for (const templateType of templateTypes) {
        const templatePath = path.join(cliTemplatesDir, templateType);
        
        if (await fs.pathExists(templatePath)) {
          // Ensure Jest config uses .js extension, not .ts or .json
          const jestConfigJs = path.join(templatePath, 'jest.config.js');
          const jestConfigTs = path.join(templatePath, 'jest.config.ts');
          const jestConfigJson = path.join(templatePath, 'jest.config.json');
          
          expect(await fs.pathExists(jestConfigJs)).toBe(true);
          expect(await fs.pathExists(jestConfigTs)).toBe(false);
          expect(await fs.pathExists(jestConfigJson)).toBe(false);
          
          // Check Jest setup files also use .js extension if they exist
          if (templateType !== 'workspace') {
            const jestSetupJs = path.join(templatePath, 'jest.setup.js');
            const jestSetupTs = path.join(templatePath, 'jest.setup.ts');
            
            // If setup file exists, it should be .js
            if (await fs.pathExists(jestSetupJs) || await fs.pathExists(jestSetupTs)) {
              expect(await fs.pathExists(jestSetupJs)).toBe(true);
              expect(await fs.pathExists(jestSetupTs)).toBe(false);
            }
          }
        }
      }
    }, 15000);

    test('should validate Jest configs reference correct file extensions', async () => {
      const cliTemplatesDir = path.resolve(__dirname, '../../packages/cli/templates');
      const templateTypes = ['api', 'web', 'native', 'shared'];
      
      for (const templateType of templateTypes) {
        const templatePath = path.join(cliTemplatesDir, templateType);
        const jestConfigPath = path.join(templatePath, 'jest.config.js');
        
        if (await fs.pathExists(jestConfigPath)) {
          const jestConfigContent = await fs.readFile(jestConfigPath, 'utf8');
          
          // Check that setupFilesAfterEnv references .js files, not .ts
          if (jestConfigContent.includes('setupFilesAfterEnv')) {
            expect(jestConfigContent).toContain('jest.setup.js');
            expect(jestConfigContent).not.toContain('jest.setup.ts');
          }
        }
      }
      
      // Check workspace Jest config references .js files
      const workspaceJestPath = path.join(cliTemplatesDir, 'workspace', 'jest.config.js');
      if (await fs.pathExists(workspaceJestPath)) {
        const workspaceJestContent = await fs.readFile(workspaceJestPath, 'utf8');
        if (workspaceJestContent.includes('projects')) {
          expect(workspaceJestContent).toContain('jest.config.js');
          expect(workspaceJestContent).not.toContain('jest.config.ts');
        }
      }
    }, 15000);

    test('should validate test file extensions and content', async () => {
      const cliTemplatesDir = path.resolve(__dirname, '../../packages/cli/templates');
      const templateTypes = ['api', 'web', 'native', 'shared'];
      
      for (const templateType of templateTypes) {
        const templatePath = path.join(cliTemplatesDir, templateType);
        const testDir = path.join(templatePath, '__tests__');
        
        if (await fs.pathExists(testDir)) {
          const testFiles = await fs.readdir(testDir);
          
          for (const testFile of testFiles) {
            if (testFile.endsWith('.test.ts') || testFile.endsWith('.test.tsx')) {
              const testFilePath = path.join(testDir, testFile);
              const testContent = await fs.readFile(testFilePath, 'utf8');
              
              // Verify test files contain actual test cases
              expect(testContent).toContain('describe');
              expect(testContent).toContain('test');
              expect(testContent).toContain('expect');
              
              // Verify they import/use the appropriate testing libraries
              if (templateType === 'web' || templateType === 'native') {
                // React components might use React Testing Library
                if (testFile.includes('component') || testFile.includes('App')) {
                  expect(testContent).toMatch(/@testing-library|jest|render/);
                }
              }
            }
          }
        }
      }
    }, 15000);
  });

  // Extended tests that can be run optionally with EXTENDED_TESTS=true
  if (process.env.EXTENDED_TESTS === 'true') {
    describe('Generated Project Tests (Extended)', () => {
      test('should create a workspace and validate its Jest setup works', async () => {
        // Create a test workspace using the CLI
        const workspaceName = 'test-workspace-extended';
        const workspacePath = path.join(TEST_TEMP_DIR, workspaceName);
        
        // Run CLI to create workspace
        runCLICommand(`yarn idealyst init ${workspaceName} --skip-install`, TEST_TEMP_DIR);
        
        // Verify workspace structure
        expect(await fs.pathExists(workspacePath)).toBe(true);
        expect(await fs.pathExists(path.join(workspacePath, 'jest.config.js'))).toBe(true);
        expect(await fs.pathExists(path.join(workspacePath, 'package.json'))).toBe(true);
        
        // Verify Jest config content
        const jestConfig = await fs.readFile(path.join(workspacePath, 'jest.config.js'), 'utf8');
        expect(jestConfig).toContain('module.exports');
        expect(jestConfig).toContain('projects');
      }, 60000);

      test('should create API project and validate Jest configuration', async () => {
        // Create workspace first
        const workspaceName = 'test-api-workspace';
        const workspacePath = path.join(TEST_TEMP_DIR, workspaceName);
        
        runCLICommand(`yarn idealyst init ${workspaceName} --skip-install`, TEST_TEMP_DIR);
        
        // Create API project
        runCLICommand('yarn idealyst create test-api --type api --skip-install', workspacePath);
        
        const apiPath = path.join(workspacePath, 'packages', 'test-api');
        
        // Verify API project structure
        expect(await fs.pathExists(apiPath)).toBe(true);
        expect(await fs.pathExists(path.join(apiPath, 'jest.config.js'))).toBe(true);
        expect(await fs.pathExists(path.join(apiPath, 'jest.setup.js'))).toBe(true);
        expect(await fs.pathExists(path.join(apiPath, '__tests__'))).toBe(true);
        
        // Verify package.json scripts
        const packageJson = await fs.readJSON(path.join(apiPath, 'package.json'));
        expect(packageJson.scripts.test).toBe('jest');
        expect(packageJson.scripts['test:watch']).toBe('jest --watch');
        expect(packageJson.scripts['test:coverage']).toBe('jest --coverage');
      }, 90000);

      test('should create Web project and validate React testing setup', async () => {
        // Create workspace first
        const workspaceName = 'test-web-workspace';
        const workspacePath = path.join(TEST_TEMP_DIR, workspaceName);
        
        runCLICommand(`yarn idealyst init ${workspaceName} --skip-install`, TEST_TEMP_DIR);
        
        // Create Web project
        runCLICommand('yarn idealyst create test-web --type web --skip-install', workspacePath);
        
        const webPath = path.join(workspacePath, 'packages', 'test-web');
        
        // Verify Web project structure
        expect(await fs.pathExists(webPath)).toBe(true);
        expect(await fs.pathExists(path.join(webPath, 'jest.config.js'))).toBe(true);
        expect(await fs.pathExists(path.join(webPath, 'jest.setup.js'))).toBe(true);
        expect(await fs.pathExists(path.join(webPath, '__tests__'))).toBe(true);
        
        // Verify Jest config has jsdom environment
        const jestConfig = await fs.readFile(path.join(webPath, 'jest.config.js'), 'utf8');
        expect(jestConfig).toContain('jsdom');
        expect(jestConfig).toContain('@testing-library/jest-dom');
      }, 90000);

      test('should create Native project and validate React Native testing setup', async () => {
        // Create workspace first
        const workspaceName = 'test-native-workspace';
        const workspacePath = path.join(TEST_TEMP_DIR, workspaceName);
        
        runCLICommand(`yarn idealyst init ${workspaceName} --skip-install`, TEST_TEMP_DIR);
        
        // Create Native project
        runCLICommand('yarn idealyst create test-native --type native --app-name "Test Native App" --skip-install', workspacePath);
        
        const nativePath = path.join(workspacePath, 'packages', 'test-native');
        
        // Verify Native project structure
        expect(await fs.pathExists(nativePath)).toBe(true);
        expect(await fs.pathExists(path.join(nativePath, 'jest.config.js'))).toBe(true);
        expect(await fs.pathExists(path.join(nativePath, 'jest.setup.js'))).toBe(true);
        expect(await fs.pathExists(path.join(nativePath, '__tests__'))).toBe(true);
        
        // Verify Jest config has react-native preset
        const jestConfig = await fs.readFile(path.join(nativePath, 'jest.config.js'), 'utf8');
        expect(jestConfig).toContain('react-native');
      }, 90000);

      test('should create Shared library and validate Node.js testing setup', async () => {
        // Create workspace first
        const workspaceName = 'test-shared-workspace';
        const workspacePath = path.join(TEST_TEMP_DIR, workspaceName);
        
        runCLICommand(`yarn idealyst init ${workspaceName} --skip-install`, TEST_TEMP_DIR);
        
        // Create Shared library
        runCLICommand('yarn idealyst create test-shared --type shared --skip-install', workspacePath);
        
        const sharedPath = path.join(workspacePath, 'packages', 'test-shared');
        
        // Verify Shared library structure
        expect(await fs.pathExists(sharedPath)).toBe(true);
        expect(await fs.pathExists(path.join(sharedPath, 'jest.config.js'))).toBe(true);
        expect(await fs.pathExists(path.join(sharedPath, '__tests__'))).toBe(true);
        
        // Verify Jest config has Node.js environment
        const jestConfig = await fs.readFile(path.join(sharedPath, 'jest.config.js'), 'utf8');
        expect(jestConfig).toContain('ts-jest');
        expect(jestConfig).toContain('node');
      }, 90000);
    });
  }
});
