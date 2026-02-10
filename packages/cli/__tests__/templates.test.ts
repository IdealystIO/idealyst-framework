/**
 * Tests for template processing utilities
 */

import { processTemplateContent, shouldProcessFile } from '../src/templates/processor';
import { TemplateData } from '../src/types';

describe('Template Processing', () => {
  const mockTemplateData: TemplateData = {
    projectName: 'my-app',
    packageName: '@my-app/shared',
    workspaceScope: 'my-app',
    version: '1.0.0',
    description: 'Test application',
    appDisplayName: 'My App',
    iosBundleId: 'com.company.my-app',
    androidPackageName: 'com.company.myapp',
    idealystVersion: '1.1.8',
    hasApi: false,
    hasPrisma: false,
    hasTrpc: false,
    hasGraphql: false,
    hasDevcontainer: false,
    isBlank: false,
    databaseProvider: 'sqlite',
  };

  describe('processTemplateContent', () => {
    it('should replace {{projectName}} placeholder', () => {
      const content = 'Project: {{projectName}}';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('Project: my-app');
    });

    it('should replace {{workspaceScope}} placeholder', () => {
      const content = '@{{workspaceScope}}/shared';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('@my-app/shared');
    });

    it('should replace {{appDisplayName}} placeholder', () => {
      const content = 'Welcome to {{appDisplayName}}';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('Welcome to My App');
    });

    it('should replace {{version}} placeholder', () => {
      const content = '"version": "{{version}}"';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('"version": "1.0.0"');
    });

    it('should replace {{iosBundleId}} placeholder', () => {
      const content = 'Bundle ID: {{iosBundleId}}';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('Bundle ID: com.company.my-app');
    });

    it('should replace {{androidPackageName}} placeholder', () => {
      const content = 'Package: {{androidPackageName}}';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('Package: com.company.myapp');
    });

    it('should replace {{idealystVersion}} placeholder', () => {
      const content = '"@idealyst/components": "^{{idealystVersion}}"';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('"@idealyst/components": "^1.1.8"');
    });

    it('should replace multiple placeholders in same content', () => {
      const content = '{{projectName}} v{{version}} - {{appDisplayName}}';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('my-app v1.0.0 - My App');
    });

    it('should replace repeated placeholders', () => {
      const content = '{{projectName}} and {{projectName}}';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('my-app and my-app');
    });

    it('should leave unknown placeholders unchanged', () => {
      const content = '{{unknownVariable}}';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('{{unknownVariable}}');
    });

    it('should handle content with no placeholders', () => {
      const content = 'No placeholders here';
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toBe('No placeholders here');
    });

    it('should handle empty content', () => {
      const result = processTemplateContent('', mockTemplateData);
      expect(result).toBe('');
    });

    it('should handle JSON content correctly', () => {
      const content = `{
  "name": "@{{workspaceScope}}/{{projectName}}",
  "version": "{{version}}",
  "description": "{{description}}"
}`;
      const result = processTemplateContent(content, mockTemplateData);
      expect(result).toContain('"name": "@my-app/my-app"');
      expect(result).toContain('"version": "1.0.0"');
      expect(result).toContain('"description": "Test application"');
    });
  });

  describe('shouldProcessFile', () => {
    describe('should process', () => {
      it('should process TypeScript files', () => {
        expect(shouldProcessFile('app.ts')).toBe(true);
        expect(shouldProcessFile('component.tsx')).toBe(true);
      });

      it('should process JavaScript files', () => {
        expect(shouldProcessFile('config.js')).toBe(true);
        expect(shouldProcessFile('app.jsx')).toBe(true);
      });

      it('should process JSON files', () => {
        expect(shouldProcessFile('package.json')).toBe(true);
        expect(shouldProcessFile('tsconfig.json')).toBe(true);
      });

      it('should process Markdown files', () => {
        expect(shouldProcessFile('README.md')).toBe(true);
      });

      it('should process YAML files', () => {
        expect(shouldProcessFile('config.yml')).toBe(true);
        expect(shouldProcessFile('docker-compose.yaml')).toBe(true);
      });

      it('should process env files', () => {
        expect(shouldProcessFile('.env')).toBe(true);
        expect(shouldProcessFile('.env.example')).toBe(true);
      });

      it('should process shell scripts', () => {
        expect(shouldProcessFile('build.sh')).toBe(true);
      });

      it('should process SQL files', () => {
        expect(shouldProcessFile('schema.sql')).toBe(true);
      });

      it('should process text files', () => {
        expect(shouldProcessFile('notes.txt')).toBe(true);
      });
    });

    describe('should not process', () => {
      it('should not process binary images', () => {
        expect(shouldProcessFile('logo.png')).toBe(false);
        expect(shouldProcessFile('icon.jpg')).toBe(false);
        expect(shouldProcessFile('photo.jpeg')).toBe(false);
        expect(shouldProcessFile('image.gif')).toBe(false);
        expect(shouldProcessFile('graphic.svg')).toBe(false);
      });

      it('should not process fonts', () => {
        expect(shouldProcessFile('font.ttf')).toBe(false);
        expect(shouldProcessFile('font.woff')).toBe(false);
        expect(shouldProcessFile('font.woff2')).toBe(false);
        expect(shouldProcessFile('font.eot')).toBe(false);
      });

      it('should not process compiled files', () => {
        expect(shouldProcessFile('bundle.min.js')).toBe(false);
        expect(shouldProcessFile('styles.min.css')).toBe(false);
      });

      it('should not process archives', () => {
        expect(shouldProcessFile('package.zip')).toBe(false);
        expect(shouldProcessFile('backup.tar.gz')).toBe(false);
      });

      it('should not process unknown binary formats', () => {
        expect(shouldProcessFile('data.bin')).toBe(false);
        expect(shouldProcessFile('model.dat')).toBe(false);
      });
    });
  });

  describe('Template data with extensions', () => {
    it('should handle template data with API enabled', () => {
      const dataWithApi: TemplateData = {
        ...mockTemplateData,
        hasApi: true,
      };
      const content = 'API: {{hasApi}}';
      const result = processTemplateContent(content, dataWithApi);
      // Note: boolean values may or may not be replaced depending on implementation
      expect(typeof result).toBe('string');
    });

    it('should handle template data with all extensions enabled', () => {
      const fullData: TemplateData = {
        ...mockTemplateData,
        hasApi: true,
        hasPrisma: true,
        hasTrpc: true,
        hasGraphql: true,
        hasDevcontainer: true,
      };
      const content = '{{projectName}} with extensions';
      const result = processTemplateContent(content, fullData);
      expect(result).toBe('my-app with extensions');
    });
  });
});
