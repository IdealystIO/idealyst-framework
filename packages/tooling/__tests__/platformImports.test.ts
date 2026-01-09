import {
  analyzePlatformImports,
  analyzeFiles,
  summarizeResults,
  formatViolation,
  formatViolations,
} from '../src/analyzers/platformImports';
import type { AnalysisResult, Violation } from '../src/types';

describe('platformImports analyzer', () => {
  describe('analyzePlatformImports', () => {
    describe('shared files (.tsx)', () => {
      it('should flag React Native imports in shared files', () => {
        const code = `
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function Button() {
  return <TouchableOpacity><View><Text>Hello</Text></View></TouchableOpacity>;
}
`;
        const result = analyzePlatformImports('Button.tsx', code);

        expect(result.passed).toBe(false);
        expect(result.fileType).toBe('shared');
        expect(result.violations).toHaveLength(3);
        expect(result.violations.map((v) => v.primitive)).toEqual([
          'View',
          'Text',
          'TouchableOpacity',
        ]);
        expect(result.violations.every((v) => v.type === 'native-in-shared')).toBe(true);
      });

      it('should flag React DOM imports in shared files', () => {
        const code = `
import React from 'react';
import { createPortal, flushSync } from 'react-dom';

export function Modal({ children }) {
  return createPortal(children, document.body);
}
`;
        const result = analyzePlatformImports('Modal.tsx', code);

        expect(result.passed).toBe(false);
        expect(result.violations).toHaveLength(2);
        expect(result.violations.map((v) => v.primitive)).toEqual(['createPortal', 'flushSync']);
        expect(result.violations.every((v) => v.type === 'dom-in-shared')).toBe(true);
      });

      it('should pass shared files with only neutral imports', () => {
        const code = `
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { myHelper } from './utils';

export function Component() {
  const [state, setState] = useState(null);
  return <div>Hello</div>;
}
`;
        const result = analyzePlatformImports('Component.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.violations).toHaveLength(0);
      });

      it('should flag both RN and DOM imports in same shared file', () => {
        const code = `
import { View } from 'react-native';
import { createPortal } from 'react-dom';
`;
        const result = analyzePlatformImports('Mixed.tsx', code);

        expect(result.passed).toBe(false);
        expect(result.violations).toHaveLength(2);
        expect(result.violations.some((v) => v.type === 'native-in-shared')).toBe(true);
        expect(result.violations.some((v) => v.type === 'dom-in-shared')).toBe(true);
      });
    });

    describe('web files (.web.tsx)', () => {
      it('should pass web files with DOM imports', () => {
        const code = `
import React from 'react';
import { createPortal } from 'react-dom';

export function Modal({ children }) {
  return createPortal(children, document.body);
}
`;
        const result = analyzePlatformImports('Modal.web.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('web');
        expect(result.violations).toHaveLength(0);
      });

      it('should flag React Native imports in web files', () => {
        const code = `
import React from 'react';
import { View, Text } from 'react-native';
`;
        const result = analyzePlatformImports('Component.web.tsx', code);

        expect(result.passed).toBe(false);
        expect(result.violations).toHaveLength(2);
        expect(result.violations.every((v) => v.type === 'native-in-web')).toBe(true);
      });
    });

    describe('native files (.native.tsx)', () => {
      it('should pass native files with RN imports', () => {
        const code = `
import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';

export function Button() {
  return <TouchableOpacity><View><Text>Hello</Text></View></TouchableOpacity>;
}
`;
        const result = analyzePlatformImports('Button.native.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('native');
        expect(result.violations).toHaveLength(0);
      });

      it('should flag React DOM imports in native files', () => {
        const code = `
import React from 'react';
import { createPortal } from 'react-dom';
`;
        const result = analyzePlatformImports('Component.native.tsx', code);

        expect(result.passed).toBe(false);
        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].type).toBe('dom-in-native');
      });

      it('should pass ios-specific files with RN imports', () => {
        const code = `
import { View, Text } from 'react-native';
`;
        const result = analyzePlatformImports('Button.ios.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('native');
      });

      it('should pass android-specific files with RN imports', () => {
        const code = `
import { View, Text } from 'react-native';
`;
        const result = analyzePlatformImports('Button.android.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('native');
      });
    });

    describe('non-component files', () => {
      it('should skip styles files', () => {
        const code = `
import { View } from 'react-native';
import { createPortal } from 'react-dom';
`;
        const result = analyzePlatformImports('Button.styles.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('styles');
        expect(result.violations).toHaveLength(0);
        expect(result.imports).toHaveLength(0); // Not parsed
      });

      it('should skip types files', () => {
        const code = `
import type { ViewProps } from 'react-native';
`;
        const result = analyzePlatformImports('types.ts', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('types');
      });

      it('should skip test files', () => {
        const code = `
import { View } from 'react-native';
`;
        const result = analyzePlatformImports('Button.test.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('other');
      });

      it('should skip index files', () => {
        const code = `
export { View } from 'react-native';
`;
        const result = analyzePlatformImports('index.ts', code);

        expect(result.passed).toBe(true);
        expect(result.fileType).toBe('other');
      });
    });

    describe('type-only imports', () => {
      it('should not flag type-only imports', () => {
        const code = `
import type { ViewProps, TextProps } from 'react-native';
import type { DOMAttributes } from 'react-dom';

export interface MyProps extends ViewProps {}
`;
        const result = analyzePlatformImports('Component.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.violations).toHaveLength(0);
      });

      it('should not flag inline type imports', () => {
        const code = `
import { type ViewProps, type TextProps } from 'react-native';
`;
        const result = analyzePlatformImports('Component.tsx', code);

        expect(result.passed).toBe(true);
        expect(result.violations).toHaveLength(0);
      });

      it('should flag mixed type and value imports', () => {
        const code = `
import { View, type ViewProps } from 'react-native';
`;
        const result = analyzePlatformImports('Component.tsx', code);

        expect(result.passed).toBe(false);
        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].primitive).toBe('View');
      });
    });

    describe('aliased imports', () => {
      it('should track original name for aliased imports', () => {
        const code = `
import { Image as RNImage } from 'react-native';
`;
        const result = analyzePlatformImports('Component.tsx', code);

        expect(result.passed).toBe(false);
        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].primitive).toBe('Image');
      });
    });

    describe('options', () => {
      describe('severity', () => {
        it('should use default error severity', () => {
          const code = `import { View } from 'react-native';`;
          const result = analyzePlatformImports('Button.tsx', code);

          expect(result.violations[0].severity).toBe('error');
        });

        it('should respect custom severity', () => {
          const code = `import { View } from 'react-native';`;

          const warningResult = analyzePlatformImports('Button.tsx', code, { severity: 'warning' });
          expect(warningResult.violations[0].severity).toBe('warning');

          const infoResult = analyzePlatformImports('Button.tsx', code, { severity: 'info' });
          expect(infoResult.violations[0].severity).toBe('info');
        });
      });

      describe('additionalNativePrimitives', () => {
        it('should flag additional native primitives', () => {
          const code = `
import { MyNativeComponent } from 'my-native-lib';
`;
          const result = analyzePlatformImports('Component.tsx', code, {
            additionalNativePrimitives: ['MyNativeComponent'],
            additionalNativeSources: ['my-native-lib'],
          });

          expect(result.passed).toBe(false);
          expect(result.violations).toHaveLength(1);
          expect(result.violations[0].primitive).toBe('MyNativeComponent');
        });
      });

      describe('additionalDomPrimitives', () => {
        it('should flag additional DOM primitives', () => {
          const code = `
import { myDomHelper } from 'my-dom-lib';
`;
          const result = analyzePlatformImports('Component.tsx', code, {
            additionalDomPrimitives: ['myDomHelper'],
            additionalDomSources: ['my-dom-lib'],
          });

          expect(result.passed).toBe(false);
          expect(result.violations).toHaveLength(1);
          expect(result.violations[0].primitive).toBe('myDomHelper');
        });
      });

      describe('ignoredPrimitives', () => {
        it('should ignore specified primitives', () => {
          const code = `
import { View, Text, TouchableOpacity } from 'react-native';
`;
          const result = analyzePlatformImports('Button.tsx', code, {
            ignoredPrimitives: ['View', 'Text'],
          });

          expect(result.passed).toBe(false);
          expect(result.violations).toHaveLength(1);
          expect(result.violations[0].primitive).toBe('TouchableOpacity');
        });

        it('should pass when all imports are ignored', () => {
          const code = `
import { View } from 'react-native';
`;
          const result = analyzePlatformImports('Button.tsx', code, {
            ignoredPrimitives: ['View'],
          });

          expect(result.passed).toBe(true);
          expect(result.violations).toHaveLength(0);
        });
      });

      describe('ignoredPatterns', () => {
        it('should skip files matching ignored patterns', () => {
          const code = `
import { View } from 'react-native';
`;
          const result = analyzePlatformImports('src/__mocks__/Button.tsx', code, {
            ignoredPatterns: ['**/__mocks__/**'],
          });

          expect(result.passed).toBe(true);
          expect(result.violations).toHaveLength(0);
        });

        it('should handle multiple patterns', () => {
          const code = `import { View } from 'react-native';`;

          expect(
            analyzePlatformImports('Button.fixture.tsx', code, {
              ignoredPatterns: ['*.fixture.tsx', '*.mock.tsx'],
            }).passed
          ).toBe(true);

          expect(
            analyzePlatformImports('Button.mock.tsx', code, {
              ignoredPatterns: ['*.fixture.tsx', '*.mock.tsx'],
            }).passed
          ).toBe(true);
        });
      });
    });

    describe('violation messages', () => {
      it('should include helpful messages for native-in-shared', () => {
        const code = `import { View } from 'react-native';`;
        const result = analyzePlatformImports('Button.tsx', code);

        expect(result.violations[0].message).toContain('View');
        expect(result.violations[0].message).toContain('react-native');
        expect(result.violations[0].message).toContain('.native.tsx');
      });

      it('should include helpful messages for dom-in-shared', () => {
        const code = `import { createPortal } from 'react-dom';`;
        const result = analyzePlatformImports('Modal.tsx', code);

        expect(result.violations[0].message).toContain('createPortal');
        expect(result.violations[0].message).toContain('react-dom');
        expect(result.violations[0].message).toContain('.web.tsx');
      });
    });

    describe('line and column tracking', () => {
      it('should track violation positions', () => {
        const code = `import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';`;

        const result = analyzePlatformImports('Button.tsx', code);

        expect(result.violations[0].line).toBe(2);
        expect(result.violations[1].line).toBe(3);
      });
    });
  });

  describe('analyzeFiles', () => {
    it('should analyze multiple files', () => {
      const files = [
        { path: 'Button.tsx', content: `import { View } from 'react-native';` },
        { path: 'Button.native.tsx', content: `import { View } from 'react-native';` },
        { path: 'Modal.tsx', content: `import { createPortal } from 'react-dom';` },
      ];

      const results = analyzeFiles(files);

      expect(results).toHaveLength(3);
      expect(results[0].passed).toBe(false); // shared with RN
      expect(results[1].passed).toBe(true); // native with RN
      expect(results[2].passed).toBe(false); // shared with DOM
    });

    it('should apply options to all files', () => {
      const files = [
        { path: 'Button.tsx', content: `import { View } from 'react-native';` },
        { path: 'Modal.tsx', content: `import { View } from 'react-native';` },
      ];

      const results = analyzeFiles(files, { severity: 'warning' });

      expect(results.every((r) => r.violations.every((v) => v.severity === 'warning'))).toBe(true);
    });
  });

  describe('summarizeResults', () => {
    it('should summarize analysis results', () => {
      const results: AnalysisResult[] = [
        {
          filePath: 'Button.tsx',
          fileType: 'shared',
          passed: false,
          imports: [],
          violations: [
            {
              type: 'native-in-shared',
              primitive: 'View',
              source: 'react-native',
              filePath: 'Button.tsx',
              line: 1,
              column: 1,
              message: 'test',
              severity: 'error',
            },
            {
              type: 'native-in-shared',
              primitive: 'Text',
              source: 'react-native',
              filePath: 'Button.tsx',
              line: 1,
              column: 1,
              message: 'test',
              severity: 'warning',
            },
          ],
        },
        {
          filePath: 'Modal.tsx',
          fileType: 'shared',
          passed: false,
          imports: [],
          violations: [
            {
              type: 'dom-in-shared',
              primitive: 'createPortal',
              source: 'react-dom',
              filePath: 'Modal.tsx',
              line: 1,
              column: 1,
              message: 'test',
              severity: 'error',
            },
          ],
        },
        {
          filePath: 'Button.native.tsx',
          fileType: 'native',
          passed: true,
          imports: [],
          violations: [],
        },
      ];

      const summary = summarizeResults(results);

      expect(summary.totalFiles).toBe(3);
      expect(summary.passedFiles).toBe(1);
      expect(summary.failedFiles).toBe(2);
      expect(summary.totalViolations).toBe(3);
      expect(summary.violationsByType['native-in-shared']).toBe(2);
      expect(summary.violationsByType['dom-in-shared']).toBe(1);
      expect(summary.violationsBySeverity.error).toBe(2);
      expect(summary.violationsBySeverity.warning).toBe(1);
    });
  });

  describe('formatViolation', () => {
    it('should format error violations', () => {
      const violation: Violation = {
        type: 'native-in-shared',
        primitive: 'View',
        source: 'react-native',
        filePath: 'Button.tsx',
        line: 10,
        column: 5,
        message: "React Native primitive 'View' should not be used in shared files.",
        severity: 'error',
      };

      const formatted = formatViolation(violation);

      expect(formatted).toContain('ERROR');
      expect(formatted).toContain('Button.tsx:10:5');
      expect(formatted).toContain(violation.message);
    });

    it('should format warning violations', () => {
      const violation: Violation = {
        type: 'dom-in-shared',
        primitive: 'createPortal',
        source: 'react-dom',
        filePath: 'Modal.tsx',
        line: 5,
        column: 1,
        message: 'test',
        severity: 'warning',
      };

      const formatted = formatViolation(violation);

      expect(formatted).toContain('WARN');
    });

    it('should format info violations', () => {
      const violation: Violation = {
        type: 'native-in-web',
        primitive: 'View',
        source: 'react-native',
        filePath: 'Component.web.tsx',
        line: 1,
        column: 1,
        message: 'test',
        severity: 'info',
      };

      const formatted = formatViolation(violation);

      expect(formatted).toContain('INFO');
    });
  });

  describe('formatViolations', () => {
    it('should format all violations from results', () => {
      const results: AnalysisResult[] = [
        {
          filePath: 'Button.tsx',
          fileType: 'shared',
          passed: false,
          imports: [],
          violations: [
            {
              type: 'native-in-shared',
              primitive: 'View',
              source: 'react-native',
              filePath: 'Button.tsx',
              line: 1,
              column: 1,
              message: 'View violation',
              severity: 'error',
            },
          ],
        },
        {
          filePath: 'Modal.tsx',
          fileType: 'shared',
          passed: false,
          imports: [],
          violations: [
            {
              type: 'dom-in-shared',
              primitive: 'createPortal',
              source: 'react-dom',
              filePath: 'Modal.tsx',
              line: 1,
              column: 1,
              message: 'Portal violation',
              severity: 'error',
            },
          ],
        },
      ];

      const lines = formatViolations(results);

      expect(lines).toHaveLength(2);
      expect(lines[0]).toContain('View violation');
      expect(lines[1]).toContain('Portal violation');
    });
  });
});
