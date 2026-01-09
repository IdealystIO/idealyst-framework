/**
 * Tests for wizard functionality
 */

// Mock chalk to avoid ESM issues
jest.mock('chalk', () => ({
  default: {
    blue: { bold: (s: string) => s },
    gray: (s: string) => s,
    yellow: (s: string) => s,
    green: (s: string) => s,
    red: (s: string) => s,
    bold: (s: string) => s,
  },
  blue: { bold: (s: string) => s },
  gray: (s: string) => s,
  yellow: (s: string) => s,
  green: (s: string) => s,
  red: (s: string) => s,
  bold: (s: string) => s,
}));

// Mock inquirer to avoid ESM issues
jest.mock('inquirer', () => ({
  default: {
    prompt: jest.fn(),
  },
  prompt: jest.fn(),
}));

// Mock ora for spinner
jest.mock('ora', () => ({
  default: () => ({
    start: () => ({ succeed: jest.fn(), fail: jest.fn(), stop: jest.fn() }),
    succeed: jest.fn(),
    fail: jest.fn(),
    stop: jest.fn(),
  }),
}));

import { validateNonInteractiveArgs, buildConfigFromArgs } from '../src/wizard';
import { CLIArgs } from '../src/types';

describe('Wizard', () => {
  describe('validateNonInteractiveArgs', () => {
    it('should pass with all required arguments', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should fail when projectName is missing', () => {
      const args: CLIArgs = {
        orgDomain: 'com.company',
        appDisplayName: 'My App',
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(false);
      expect(result.missing.some(m => m.includes('project-name'))).toBe(true);
    });

    it('should fail when orgDomain is missing', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        appDisplayName: 'My App',
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(false);
      expect(result.missing.some(m => m.includes('--org-domain'))).toBe(true);
    });

    it('should fail when appDisplayName is missing', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(false);
      expect(result.missing.some(m => m.includes('--app-name'))).toBe(true);
    });

    it('should fail when all required args are missing', () => {
      const args: CLIArgs = {};

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(false);
      expect(result.missing.some(m => m.includes('project-name'))).toBe(true);
      expect(result.missing.some(m => m.includes('--org-domain'))).toBe(true);
      expect(result.missing.some(m => m.includes('--app-name'))).toBe(true);
    });

    it('should fail when tRPC is enabled without API', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        withTrpc: true,
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(false);
      expect(result.missing.some(m => m.includes('--with-api'))).toBe(true);
    });

    it('should fail when GraphQL is enabled without API', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        withGraphql: true,
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(false);
      expect(result.missing.some(m => m.includes('--with-api'))).toBe(true);
    });

    it('should pass when tRPC is enabled with API', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        withApi: true,
        withTrpc: true,
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(true);
    });

    it('should pass when GraphQL is enabled with API', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        withApi: true,
        withGraphql: true,
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(true);
    });

    it('should pass when both tRPC and GraphQL are enabled with API', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        withApi: true,
        withTrpc: true,
        withGraphql: true,
      };

      const result = validateNonInteractiveArgs(args);
      expect(result.valid).toBe(true);
    });
  });

  describe('buildConfigFromArgs', () => {
    it('should build config with all required fields', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
      };

      const config = buildConfigFromArgs(args);

      expect(config.projectName).toBe('my-app');
      expect(config.orgDomain).toBe('com.company');
      expect(config.appDisplayName).toBe('My App');
      expect(config.iosBundleId).toBe('com.company.my-app');
      expect(config.androidPackageName).toBe('com.company.myapp');
    });

    it('should set extensions to false by default', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
      };

      const config = buildConfigFromArgs(args);

      expect(config.extensions.api).toBe(false);
      expect(config.extensions.prisma).toBe(false);
      expect(config.extensions.trpc).toBe(false);
      expect(config.extensions.graphql).toBe(false);
    });

    it('should enable extensions when specified', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        withApi: true,
        withPrisma: true,
        withTrpc: true,
        withGraphql: true,
      };

      const config = buildConfigFromArgs(args);

      expect(config.extensions.api).toBe(true);
      expect(config.extensions.prisma).toBe(true);
      expect(config.extensions.trpc).toBe(true);
      expect(config.extensions.graphql).toBe(true);
    });

    it('should set directory from args', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        directory: '/custom/path',
      };

      const config = buildConfigFromArgs(args);

      expect(config.directory).toBe('/custom/path');
    });

    it('should default directory to current directory', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
      };

      const config = buildConfigFromArgs(args);

      expect(config.directory).toBe('.');
    });

    it('should set skipInstall from args', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
        skipInstall: true,
      };

      const config = buildConfigFromArgs(args);

      expect(config.skipInstall).toBe(true);
    });

    it('should mark config as non-interactive', () => {
      const args: CLIArgs = {
        projectName: 'my-app',
        orgDomain: 'com.company',
        appDisplayName: 'My App',
      };

      const config = buildConfigFromArgs(args);

      expect(config.isInteractive).toBe(false);
    });

    it('should generate correct identifiers for complex names', () => {
      const args: CLIArgs = {
        projectName: 'my-super-cool-app',
        orgDomain: 'io.startup',
        appDisplayName: 'Super Cool App',
      };

      const config = buildConfigFromArgs(args);

      expect(config.iosBundleId).toBe('io.startup.my-super-cool-app');
      expect(config.androidPackageName).toBe('io.startup.mysupercoolapp');
    });
  });
});
