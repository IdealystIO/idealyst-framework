import {
  parseImports,
  getPlatformForSource,
  filterPlatformImports,
  getUniqueSources,
  groupImportsBySource,
} from '../src/utils/importParser';

describe('importParser', () => {
  describe('getPlatformForSource', () => {
    describe('React Native sources', () => {
      it('should identify react-native as native platform', () => {
        expect(getPlatformForSource('react-native')).toBe('react-native');
      });

      it('should identify react-native-* packages as native platform', () => {
        expect(getPlatformForSource('react-native-gesture-handler')).toBe('react-native');
        expect(getPlatformForSource('react-native-reanimated')).toBe('react-native');
        expect(getPlatformForSource('react-native-safe-area-context')).toBe('react-native');
        expect(getPlatformForSource('react-native-screens')).toBe('react-native');
        expect(getPlatformForSource('react-native-svg')).toBe('react-native');
      });

      it('should identify known native sources', () => {
        expect(getPlatformForSource('expo-status-bar')).toBe('react-native');
      });
    });

    describe('React DOM sources', () => {
      it('should identify react-dom as dom platform', () => {
        expect(getPlatformForSource('react-dom')).toBe('react-dom');
      });

      it('should identify react-dom/* packages as dom platform', () => {
        expect(getPlatformForSource('react-dom/client')).toBe('react-dom');
        expect(getPlatformForSource('react-dom/server')).toBe('react-dom');
      });
    });

    describe('neutral sources', () => {
      it('should identify react as neutral', () => {
        expect(getPlatformForSource('react')).toBe('neutral');
      });

      it('should identify regular packages as neutral', () => {
        expect(getPlatformForSource('lodash')).toBe('neutral');
        expect(getPlatformForSource('axios')).toBe('neutral');
        expect(getPlatformForSource('@tanstack/react-query')).toBe('neutral');
      });

      it('should identify relative imports as neutral', () => {
        expect(getPlatformForSource('./Button')).toBe('neutral');
        expect(getPlatformForSource('../utils')).toBe('neutral');
      });
    });

    describe('custom sources', () => {
      it('should allow additional native sources', () => {
        expect(
          getPlatformForSource('my-native-lib', {
            additionalNativeSources: ['my-native-lib'],
          })
        ).toBe('react-native');
      });

      it('should allow additional dom sources', () => {
        expect(
          getPlatformForSource('my-web-lib', {
            additionalDomSources: ['my-web-lib'],
          })
        ).toBe('react-dom');
      });
    });
  });

  describe('parseImports', () => {
    describe('named imports', () => {
      it('should parse single named import', () => {
        const code = `import { View } from 'react-native';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(1);
        expect(imports[0]).toMatchObject({
          name: 'View',
          source: 'react-native',
          platform: 'react-native',
          isDefault: false,
          isNamespace: false,
          isTypeOnly: false,
        });
      });

      it('should parse multiple named imports', () => {
        const code = `import { View, Text, TouchableOpacity } from 'react-native';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(3);
        expect(imports.map((i) => i.name)).toEqual(['View', 'Text', 'TouchableOpacity']);
      });

      it('should parse aliased imports', () => {
        const code = `import { Image as RNImage } from 'react-native';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(1);
        expect(imports[0]).toMatchObject({
          name: 'RNImage',
          originalName: 'Image',
          source: 'react-native',
        });
      });
    });

    describe('default imports', () => {
      it('should parse default import', () => {
        const code = `import React from 'react';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(1);
        expect(imports[0]).toMatchObject({
          name: 'React',
          source: 'react',
          isDefault: true,
          isNamespace: false,
        });
      });

      it('should parse default with named imports', () => {
        const code = `import React, { useState, useEffect } from 'react';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(3);
        expect(imports[0]).toMatchObject({ name: 'React', isDefault: true });
        expect(imports[1]).toMatchObject({ name: 'useState', isDefault: false });
        expect(imports[2]).toMatchObject({ name: 'useEffect', isDefault: false });
      });
    });

    describe('namespace imports', () => {
      it('should parse namespace import', () => {
        const code = `import * as RN from 'react-native';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(1);
        expect(imports[0]).toMatchObject({
          name: 'RN',
          source: 'react-native',
          isDefault: false,
          isNamespace: true,
        });
      });
    });

    describe('type imports', () => {
      it('should parse type-only imports', () => {
        const code = `import type { ViewProps } from 'react-native';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(1);
        expect(imports[0]).toMatchObject({
          name: 'ViewProps',
          source: 'react-native',
          isTypeOnly: true,
        });
      });

      it('should parse inline type imports', () => {
        const code = `import { type ViewProps, View } from 'react-native';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(2);
        expect(imports[0]).toMatchObject({ name: 'ViewProps', isTypeOnly: true });
        expect(imports[1]).toMatchObject({ name: 'View', isTypeOnly: false });
      });
    });

    describe('side-effect imports', () => {
      it('should not include side-effect imports', () => {
        const code = `import 'react-native-gesture-handler';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(0);
      });
    });

    describe('require calls', () => {
      it('should parse require calls', () => {
        const code = `const RN = require('react-native');`;
        const imports = parseImports(code, 'test.ts');

        expect(imports).toHaveLength(1);
        expect(imports[0]).toMatchObject({
          name: 'require',
          source: 'react-native',
          platform: 'react-native',
          isNamespace: true,
        });
      });
    });

    describe('line and column positions', () => {
      it('should track line numbers correctly', () => {
        const code = `import React from 'react';
import { View } from 'react-native';
import { createPortal } from 'react-dom';`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports[0].line).toBe(1);
        expect(imports[1].line).toBe(2);
        expect(imports[2].line).toBe(3);
      });
    });

    describe('multiple import statements', () => {
      it('should parse multiple import statements from different sources', () => {
        const code = `
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createPortal } from 'react-dom';
import lodash from 'lodash';
`;
        const imports = parseImports(code, 'test.tsx');

        expect(imports).toHaveLength(6);

        const sources = getUniqueSources(imports);
        expect(sources).toContain('react');
        expect(sources).toContain('react-native');
        expect(sources).toContain('react-dom');
        expect(sources).toContain('lodash');
      });
    });

    describe('complex scenarios', () => {
      it('should handle real-world component imports', () => {
        const code = `
import React, { forwardRef, useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { ViewProps, TextProps } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@idealyst/theme';
`;
        const imports = parseImports(code, 'Button.native.tsx');

        // Count by source
        const grouped = groupImportsBySource(imports);
        expect(grouped.get('react')?.length).toBe(6);
        expect(grouped.get('react-native')?.length).toBe(7); // 5 regular + 2 type-only
        expect(grouped.get('react-native-vector-icons/MaterialCommunityIcons')?.length).toBe(1);
        expect(grouped.get('@idealyst/theme')?.length).toBe(1);
      });
    });
  });

  describe('filterPlatformImports', () => {
    it('should filter to only platform-specific imports', () => {
      const code = `
import React from 'react';
import { View } from 'react-native';
import { createPortal } from 'react-dom';
import lodash from 'lodash';
`;
      const imports = parseImports(code, 'test.tsx');
      const platformImports = filterPlatformImports(imports);

      expect(platformImports).toHaveLength(2);
      expect(platformImports.map((i) => i.source)).toEqual(['react-native', 'react-dom']);
    });

    it('should filter to specific platform', () => {
      const code = `
import { View } from 'react-native';
import { createPortal } from 'react-dom';
`;
      const imports = parseImports(code, 'test.tsx');

      const nativeImports = filterPlatformImports(imports, 'react-native');
      expect(nativeImports).toHaveLength(1);
      expect(nativeImports[0].source).toBe('react-native');

      const domImports = filterPlatformImports(imports, 'react-dom');
      expect(domImports).toHaveLength(1);
      expect(domImports[0].source).toBe('react-dom');
    });
  });

  describe('groupImportsBySource', () => {
    it('should group imports by their source module', () => {
      const code = `
import React, { useState } from 'react';
import { View, Text } from 'react-native';
`;
      const imports = parseImports(code, 'test.tsx');
      const grouped = groupImportsBySource(imports);

      expect(grouped.size).toBe(2);
      expect(grouped.get('react')?.length).toBe(2);
      expect(grouped.get('react-native')?.length).toBe(2);
    });
  });
});
