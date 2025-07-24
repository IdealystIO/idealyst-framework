import fs from 'fs-extra';
import path from 'path';
import { tmpdir } from 'os';
import { copyTemplate, processTemplateFile } from '../../packages/cli/src/generators/utils';
import { TemplateData } from '../../packages/cli/src/types';

// Test utilities
const TEST_TEMP_DIR = path.join(tmpdir(), 'idealyst-template-tests');

async function cleanupTestDir(): Promise<void> {
  if (await fs.pathExists(TEST_TEMP_DIR)) {
    await fs.remove(TEST_TEMP_DIR);
  }
}

async function createTestTemplateDir(): Promise<string> {
  const templateDir = path.join(TEST_TEMP_DIR, 'test-template');
  await fs.ensureDir(templateDir);
  return templateDir;
}

describe('Template Processing', () => {
  beforeEach(async () => {
    await cleanupTestDir();
    await fs.ensureDir(TEST_TEMP_DIR);
  });

  afterAll(async () => {
    await cleanupTestDir();
  });

  describe('copyTemplate', () => {
    test('should copy template files correctly', async () => {
      const templateDir = await createTestTemplateDir();
      const destDir = path.join(TEST_TEMP_DIR, 'output');
      
      // Create test template files
      await fs.writeFile(path.join(templateDir, 'test.txt'), 'Hello World');
      await fs.writeFile(path.join(templateDir, 'package.json'), JSON.stringify({
        name: '{{projectName}}',
        version: '{{version}}'
      }, null, 2));
      
      const templateData: TemplateData = {
        projectName: 'test-project',
        packageName: 'test-project',
        version: '1.0.0',
        description: 'Test project'
      };

      await copyTemplate(templateDir, destDir, templateData);

      // Verify files were copied
      expect(await fs.pathExists(path.join(destDir, 'test.txt'))).toBe(true);
      expect(await fs.pathExists(path.join(destDir, 'package.json'))).toBe(true);

      // Verify content was copied correctly
      const testContent = await fs.readFile(path.join(destDir, 'test.txt'), 'utf8');
      expect(testContent).toBe('Hello World');
    });

    test('should create nested directory structure', async () => {
      const templateDir = await createTestTemplateDir();
      const destDir = path.join(TEST_TEMP_DIR, 'output');
      
      // Create nested structure
      const nestedDir = path.join(templateDir, 'src', 'components');
      await fs.ensureDir(nestedDir);
      await fs.writeFile(path.join(nestedDir, 'Component.tsx'), 'export const Component = () => null;');
      
      const templateData: TemplateData = {
        projectName: 'test-project',
        packageName: 'test-project',
        version: '1.0.0',
        description: 'Test project'
      };

      await copyTemplate(templateDir, destDir, templateData);

      // Verify nested structure was created
      expect(await fs.pathExists(path.join(destDir, 'src', 'components', 'Component.tsx'))).toBe(true);
      
      const componentContent = await fs.readFile(path.join(destDir, 'src', 'components', 'Component.tsx'), 'utf8');
      expect(componentContent).toBe('export const Component = () => null;');
    });

    test('should handle empty template directory', async () => {
      const templateDir = await createTestTemplateDir();
      const destDir = path.join(TEST_TEMP_DIR, 'output');
      
      const templateData: TemplateData = {
        projectName: 'test-project',
        packageName: 'test-project',
        version: '1.0.0',
        description: 'Test project'
      };

      await expect(copyTemplate(templateDir, destDir, templateData)).resolves.not.toThrow();
      expect(await fs.pathExists(destDir)).toBe(true);
    });
  });

  describe('processTemplateFile', () => {
    test('should replace template variables in file content', async () => {
      const filePath = path.join(TEST_TEMP_DIR, 'template.json');
      const templateContent = JSON.stringify({
        name: '{{projectName}}',
        version: '{{version}}',
        description: '{{description}}',
        main: 'dist/index.js'
      }, null, 2);
      
      await fs.writeFile(filePath, templateContent);
      
      const templateData: TemplateData = {
        projectName: 'my-awesome-project',
        packageName: 'my-awesome-project',
        version: '2.1.0',
        description: 'An awesome test project'
      };

      await processTemplateFile(filePath, templateData);

      const processedContent = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(processedContent);
      
      expect(parsed.name).toBe('my-awesome-project');
      expect(parsed.version).toBe('2.1.0');
      expect(parsed.description).toBe('An awesome test project');
      expect(parsed.main).toBe('dist/index.js'); // unchanged
    });

    test('should handle multiple occurrences of same variable', async () => {
      const filePath = path.join(TEST_TEMP_DIR, 'multiple.txt');
      const templateContent = `
        Project: {{projectName}}
        Welcome to {{projectName}}!
        {{projectName}} is version {{version}}
      `;
      
      await fs.writeFile(filePath, templateContent);
      
      const templateData: TemplateData = {
        projectName: 'test-app',
        packageName: 'test-app',
        version: '1.5.0',
        description: 'Test app'
      };

      await processTemplateFile(filePath, templateData);

      const processedContent = await fs.readFile(filePath, 'utf8');
      
      expect(processedContent).toContain('Project: test-app');
      expect(processedContent).toContain('Welcome to test-app!');
      expect(processedContent).toContain('test-app is version 1.5.0');
    });

    test('should handle files with no template variables', async () => {
      const filePath = path.join(TEST_TEMP_DIR, 'static.txt');
      const staticContent = 'This is a static file with no variables.';
      
      await fs.writeFile(filePath, staticContent);
      
      const templateData: TemplateData = {
        projectName: 'test-project',
        packageName: 'test-project',
        version: '1.0.0',
        description: 'Test project'
      };

      await processTemplateFile(filePath, templateData);

      const processedContent = await fs.readFile(filePath, 'utf8');
      expect(processedContent).toBe(staticContent);
    });

    test('should handle app name for native projects', async () => {
      const filePath = path.join(TEST_TEMP_DIR, 'app.json');
      const templateContent = JSON.stringify({
        name: '{{appName}}',
        displayName: '{{appName}}',
        slug: '{{projectName}}'
      }, null, 2);
      
      await fs.writeFile(filePath, templateContent);
      
      const templateData: TemplateData = {
        projectName: 'my-native-app',
        packageName: 'my-native-app',
        version: '1.0.0',
        description: 'Native app',
        appName: 'My Native App'
      };

      await processTemplateFile(filePath, templateData);

      const processedContent = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(processedContent);
      
      expect(parsed.name).toBe('My Native App');
      expect(parsed.displayName).toBe('My Native App');
      expect(parsed.slug).toBe('my-native-app');
    });

    test('should handle missing app name gracefully', async () => {
      const filePath = path.join(TEST_TEMP_DIR, 'app.json');
      const templateContent = JSON.stringify({
        name: '{{appName}}',
        displayName: '{{appName}}'
      }, null, 2);
      
      await fs.writeFile(filePath, templateContent);
      
      const templateData: TemplateData = {
        projectName: 'my-native-app',
        packageName: 'my-native-app',
        version: '1.0.0',
        description: 'Native app'
        // appName is undefined
      };

      await processTemplateFile(filePath, templateData);

      const processedContent = await fs.readFile(filePath, 'utf8');
      
      // Should handle undefined gracefully (likely replace with empty string or leave as is)
      expect(processedContent).not.toContain('{{appName}}');
    });
  });

  describe('Template filtering', () => {
    test('should exclude node_modules and build directories', async () => {
      const templateDir = await createTestTemplateDir();
      const destDir = path.join(TEST_TEMP_DIR, 'output');
      
      // Create files that should be excluded
      await fs.ensureDir(path.join(templateDir, 'node_modules'));
      await fs.writeFile(path.join(templateDir, 'node_modules', 'package.json'), '{}');
      
      await fs.ensureDir(path.join(templateDir, 'dist'));
      await fs.writeFile(path.join(templateDir, 'dist', 'index.js'), 'console.log("build");');
      
      // Create files that should be included
      await fs.writeFile(path.join(templateDir, 'src.ts'), 'console.log("source");');
      
      const templateData: TemplateData = {
        projectName: 'test-project',
        packageName: 'test-project',
        version: '1.0.0',
        description: 'Test project'
      };

      await copyTemplate(templateDir, destDir, templateData);

      // Verify excluded directories are not copied
      expect(await fs.pathExists(path.join(destDir, 'node_modules'))).toBe(false);
      expect(await fs.pathExists(path.join(destDir, 'dist'))).toBe(false);
      
      // Verify included files are copied
      expect(await fs.pathExists(path.join(destDir, 'src.ts'))).toBe(true);
    });

    test('should handle .gitignore and dotfiles correctly', async () => {
      const templateDir = await createTestTemplateDir();
      const destDir = path.join(TEST_TEMP_DIR, 'output');
      
      // Create dotfiles
      await fs.writeFile(path.join(templateDir, '.gitignore'), 'node_modules/\ndist/');
      await fs.writeFile(path.join(templateDir, '.env.example'), 'API_KEY=');
      
      const templateData: TemplateData = {
        projectName: 'test-project',
        packageName: 'test-project',
        version: '1.0.0',
        description: 'Test project'
      };

      await copyTemplate(templateDir, destDir, templateData);

      // Verify dotfiles are copied
      expect(await fs.pathExists(path.join(destDir, '.gitignore'))).toBe(true);
      expect(await fs.pathExists(path.join(destDir, '.env.example'))).toBe(true);
    });
  });
}); 