import {
  classifyFile,
  isComponentFile,
  isSharedFile,
  isPlatformSpecificFile,
  getExpectedPlatform,
  getBaseName,
} from '../src/utils/fileClassifier';

describe('fileClassifier', () => {
  describe('classifyFile', () => {
    describe('shared files', () => {
      it('should classify .tsx files as shared', () => {
        expect(classifyFile('Button.tsx')).toBe('shared');
        expect(classifyFile('src/components/Button.tsx')).toBe('shared');
        expect(classifyFile('/absolute/path/Component.tsx')).toBe('shared');
      });

      it('should classify .jsx files as shared', () => {
        expect(classifyFile('Button.jsx')).toBe('shared');
        expect(classifyFile('src/components/Button.jsx')).toBe('shared');
      });
    });

    describe('web files', () => {
      it('should classify .web.tsx files as web', () => {
        expect(classifyFile('Button.web.tsx')).toBe('web');
        expect(classifyFile('src/components/Button.web.tsx')).toBe('web');
      });

      it('should classify .web.jsx files as web', () => {
        expect(classifyFile('Button.web.jsx')).toBe('web');
      });
    });

    describe('native files', () => {
      it('should classify .native.tsx files as native', () => {
        expect(classifyFile('Button.native.tsx')).toBe('native');
        expect(classifyFile('src/components/Button.native.tsx')).toBe('native');
      });

      it('should classify .native.jsx files as native', () => {
        expect(classifyFile('Button.native.jsx')).toBe('native');
      });

      it('should classify .ios.tsx files as native', () => {
        expect(classifyFile('Button.ios.tsx')).toBe('native');
        expect(classifyFile('Button.ios.jsx')).toBe('native');
      });

      it('should classify .android.tsx files as native', () => {
        expect(classifyFile('Button.android.tsx')).toBe('native');
        expect(classifyFile('Button.android.jsx')).toBe('native');
      });
    });

    describe('styles files', () => {
      it('should classify .styles.tsx files as styles', () => {
        expect(classifyFile('Button.styles.tsx')).toBe('styles');
        expect(classifyFile('Button.styles.ts')).toBe('styles');
      });

      it('should classify .style.tsx files as styles', () => {
        expect(classifyFile('Button.style.tsx')).toBe('styles');
        expect(classifyFile('Button.style.ts')).toBe('styles');
      });

      it('should classify .styles.jsx files as styles', () => {
        expect(classifyFile('Button.styles.jsx')).toBe('styles');
      });
    });

    describe('types files', () => {
      it('should classify .types.ts files as types', () => {
        expect(classifyFile('Button.types.ts')).toBe('types');
        expect(classifyFile('Button.types.tsx')).toBe('types');
      });

      it('should classify types.ts files as types', () => {
        expect(classifyFile('types.ts')).toBe('types');
        expect(classifyFile('types.tsx')).toBe('types');
      });

      it('should classify .d.ts files as types', () => {
        expect(classifyFile('Button.d.ts')).toBe('types');
        expect(classifyFile('global.d.ts')).toBe('types');
      });
    });

    describe('other files (excluded)', () => {
      it('should classify test files as other', () => {
        expect(classifyFile('Button.test.tsx')).toBe('other');
        expect(classifyFile('Button.test.ts')).toBe('other');
        expect(classifyFile('Button.spec.tsx')).toBe('other');
        expect(classifyFile('Button.spec.ts')).toBe('other');
      });

      it('should classify story files as other', () => {
        expect(classifyFile('Button.stories.tsx')).toBe('other');
        expect(classifyFile('Button.stories.ts')).toBe('other');
      });

      it('should classify config files as other', () => {
        expect(classifyFile('jest.config.ts')).toBe('other');
        expect(classifyFile('vite.config.js')).toBe('other');
      });

      it('should classify index files as other', () => {
        expect(classifyFile('index.ts')).toBe('other');
        expect(classifyFile('index.tsx')).toBe('other');
        expect(classifyFile('index.js')).toBe('other');
      });

      it('should classify non-component files as other', () => {
        expect(classifyFile('utils.ts')).toBe('other');
        expect(classifyFile('helpers.js')).toBe('other');
        expect(classifyFile('README.md')).toBe('other');
      });
    });

    describe('edge cases', () => {
      it('should handle files with multiple dots', () => {
        expect(classifyFile('Button.component.tsx')).toBe('shared');
        expect(classifyFile('my.button.web.tsx')).toBe('web');
      });

      it('should handle deeply nested paths', () => {
        expect(classifyFile('src/components/forms/inputs/Button.tsx')).toBe('shared');
        expect(classifyFile('packages/ui/src/Button.native.tsx')).toBe('native');
      });

      it('should be case-sensitive for extensions', () => {
        expect(classifyFile('Button.TSX')).toBe('other'); // Uppercase not matched
        expect(classifyFile('Button.Web.tsx')).toBe('shared'); // Web not .web
      });
    });
  });

  describe('isComponentFile', () => {
    it('should return true for component files', () => {
      expect(isComponentFile('Button.tsx')).toBe(true);
      expect(isComponentFile('Button.web.tsx')).toBe(true);
      expect(isComponentFile('Button.native.tsx')).toBe(true);
    });

    it('should return false for non-component files', () => {
      expect(isComponentFile('Button.styles.tsx')).toBe(false);
      expect(isComponentFile('types.ts')).toBe(false);
      expect(isComponentFile('Button.test.tsx')).toBe(false);
      expect(isComponentFile('index.ts')).toBe(false);
    });
  });

  describe('isSharedFile', () => {
    it('should return true only for shared files', () => {
      expect(isSharedFile('Button.tsx')).toBe(true);
      expect(isSharedFile('Button.jsx')).toBe(true);
    });

    it('should return false for platform-specific files', () => {
      expect(isSharedFile('Button.web.tsx')).toBe(false);
      expect(isSharedFile('Button.native.tsx')).toBe(false);
    });

    it('should return false for other file types', () => {
      expect(isSharedFile('Button.styles.tsx')).toBe(false);
      expect(isSharedFile('types.ts')).toBe(false);
    });
  });

  describe('isPlatformSpecificFile', () => {
    it('should return true for web and native files', () => {
      expect(isPlatformSpecificFile('Button.web.tsx')).toBe(true);
      expect(isPlatformSpecificFile('Button.native.tsx')).toBe(true);
      expect(isPlatformSpecificFile('Button.ios.tsx')).toBe(true);
      expect(isPlatformSpecificFile('Button.android.tsx')).toBe(true);
    });

    it('should return false for shared and other files', () => {
      expect(isPlatformSpecificFile('Button.tsx')).toBe(false);
      expect(isPlatformSpecificFile('Button.styles.tsx')).toBe(false);
      expect(isPlatformSpecificFile('types.ts')).toBe(false);
    });
  });

  describe('getExpectedPlatform', () => {
    it('should return web for web files', () => {
      expect(getExpectedPlatform('Button.web.tsx')).toBe('web');
    });

    it('should return native for native files', () => {
      expect(getExpectedPlatform('Button.native.tsx')).toBe('native');
      expect(getExpectedPlatform('Button.ios.tsx')).toBe('native');
      expect(getExpectedPlatform('Button.android.tsx')).toBe('native');
    });

    it('should return null for shared and other files', () => {
      expect(getExpectedPlatform('Button.tsx')).toBe(null);
      expect(getExpectedPlatform('Button.styles.tsx')).toBe(null);
      expect(getExpectedPlatform('types.ts')).toBe(null);
    });
  });

  describe('getBaseName', () => {
    it('should extract base name from shared files', () => {
      expect(getBaseName('Button.tsx')).toBe('Button');
      expect(getBaseName('MyComponent.jsx')).toBe('MyComponent');
    });

    it('should extract base name from platform-specific files', () => {
      expect(getBaseName('Button.web.tsx')).toBe('Button');
      expect(getBaseName('Button.native.tsx')).toBe('Button');
      expect(getBaseName('Button.ios.tsx')).toBe('Button');
      expect(getBaseName('Button.android.tsx')).toBe('Button');
    });

    it('should extract base name from styles files', () => {
      expect(getBaseName('Button.styles.tsx')).toBe('Button');
      expect(getBaseName('Button.style.ts')).toBe('Button');
    });

    it('should extract base name from types files', () => {
      expect(getBaseName('Button.types.ts')).toBe('Button');
    });

    it('should handle paths', () => {
      expect(getBaseName('src/components/Button.tsx')).toBe('Button');
      expect(getBaseName('/absolute/path/Button.web.tsx')).toBe('Button');
    });
  });
});
