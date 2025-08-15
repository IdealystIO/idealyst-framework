import { validateProjectName, createPackageName, getTemplateData, isWorkspaceRoot, getWorkspaceName } from '../src/generators/utils';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, verifyFileExists } from './setup';

describe('CLI Utils', () => {
  describe('validateProjectName', () => {
    it('should accept valid package names', () => {
      expect(validateProjectName('my-app')).toBe(true);
      expect(validateProjectName('my-web-app')).toBe(true);
      expect(validateProjectName('backend')).toBe(true);
      expect(validateProjectName('shared-utils')).toBe(true);
    });

    it('should reject invalid package names', () => {
      expect(validateProjectName('My App')).toBe(false); // spaces
      expect(validateProjectName('my_app')).toBe(false); // underscores
      expect(validateProjectName('MyApp')).toBe(false); // uppercase
      expect(validateProjectName('123app')).toBe(false); // starts with number
      expect(validateProjectName('')).toBe(false); // empty
    });
  });

  describe('createPackageName', () => {
    it('should convert names to valid package names', () => {
      expect(createPackageName('My App')).toBe('my-app');
      expect(createPackageName('my_app')).toBe('my-app');
      expect(createPackageName('MyApp')).toBe('myapp');
      expect(createPackageName('my@special#app')).toBe('my-special-app');
    });
  });

  describe('getTemplateData', () => {
    it('should generate correct template data', () => {
      const data = getTemplateData('my-app', 'Test description', 'My App');
      
      expect(data.projectName).toBe('my-app');
      expect(data.packageName).toBe('my-app');
      expect(data.description).toBe('Test description');
      expect(data.appName).toBe('My App');
      expect(data.version).toBe('1.0.0');
    });

    it('should handle workspace scopes', () => {
      const data = getTemplateData('my-app', 'Test description', undefined, 'my-workspace');
      
      expect(data.packageName).toBe('@my-workspace/my-app');
    });
  });

  describe('workspace detection', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await createTempDir('workspace-detection');
    });

    afterEach(async () => {
      await cleanupTempDir(tempDir);
    });

    it('should detect workspace root correctly', async () => {
      // Create workspace package.json
      const packageJson = {
        name: 'my-workspace',
        workspaces: ['packages/*']
      };
      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      expect(await isWorkspaceRoot(tempDir)).toBe(true);
    });

    it('should not detect non-workspace as workspace root', async () => {
      // Create regular package.json
      const packageJson = {
        name: 'my-app'
      };
      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      expect(await isWorkspaceRoot(tempDir)).toBe(false);
    });

    it('should get workspace name correctly', async () => {
      const packageJson = {
        name: 'my-workspace',
        workspaces: ['packages/*']
      };
      await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson);

      expect(await getWorkspaceName(tempDir)).toBe('my-workspace');
    });

    it('should return null for directory without package.json', async () => {
      expect(await isWorkspaceRoot(tempDir)).toBe(false);
      expect(await getWorkspaceName(tempDir)).toBe(null);
    });
  });
});
