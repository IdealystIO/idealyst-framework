import { analyzePlatformImports } from '../src/analyzers/platformImports';
import { parseImports } from '../src/utils/importParser';
import { classifyFile } from '../src/utils/fileClassifier';

describe('Edge Cases', () => {
  describe('complex import patterns', () => {
    it('should handle re-exports', () => {
      const code = `
export { View, Text } from 'react-native';
`;
      // Re-exports are not detected as imports by the import parser
      // This is expected behavior - re-exports are a different AST node
      const imports = parseImports(code, 'index.ts');
      expect(imports).toHaveLength(0);
    });

    it('should handle dynamic imports', () => {
      const code = `
const RN = await import('react-native');
`;
      // Dynamic imports are not captured by the current implementation
      // This is expected - they require runtime analysis
      const imports = parseImports(code, 'Component.tsx');
      expect(imports).toHaveLength(0);
    });

    it('should handle destructured require', () => {
      const code = `
const { View, Text } = require('react-native');
`;
      // Destructured require captures the require call but not individual bindings
      const imports = parseImports(code, 'Component.ts');
      expect(imports).toHaveLength(1);
      expect(imports[0].name).toBe('require');
    });

    it('should handle namespace access patterns', () => {
      const code = `
import * as RN from 'react-native';
const View = RN.View;
`;
      // Namespace import is detected
      const imports = parseImports(code, 'Component.tsx');
      expect(imports).toHaveLength(1);
      expect(imports[0].isNamespace).toBe(true);
    });

    it('should handle imports with comments', () => {
      const code = `
// This imports React Native components
import { View, Text } from 'react-native'; // core components
/* Also import TouchableOpacity */
import { TouchableOpacity } from 'react-native';
`;
      const imports = parseImports(code, 'Component.tsx');
      expect(imports).toHaveLength(3);
    });
  });

  describe('all React Native primitives', () => {
    it('should flag all core RN components', () => {
      const code = `
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  SectionList,
} from 'react-native';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(6);
    });

    it('should flag all interactive RN components', () => {
      const code = `
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  Button,
} from 'react-native';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(5);
    });

    it('should flag all input RN components', () => {
      const code = `
import { TextInput, Switch } from 'react-native';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(2);
    });

    it('should flag modal and overlay components', () => {
      const code = `
import { Modal, Alert, StatusBar } from 'react-native';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(3);
    });

    it('should flag animation components', () => {
      const code = `
import { Animated, Easing, LayoutAnimation } from 'react-native';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(3);
    });

    it('should flag platform utilities', () => {
      const code = `
import { Platform, Dimensions, BackHandler, Keyboard } from 'react-native';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(4);
    });

    it('should flag safety components', () => {
      const code = `
import { SafeAreaView, KeyboardAvoidingView } from 'react-native';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(2);
    });
  });

  describe('all React DOM primitives', () => {
    it('should flag createPortal', () => {
      const code = `import { createPortal } from 'react-dom';`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].primitive).toBe('createPortal');
    });

    it('should flag flushSync', () => {
      const code = `import { flushSync } from 'react-dom';`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].primitive).toBe('flushSync');
    });

    it('should flag react-dom/client imports', () => {
      const code = `import { createRoot, hydrateRoot } from 'react-dom/client';`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(2);
    });

    it('should flag legacy render functions', () => {
      const code = `
import { render, hydrate, unmountComponentAtNode, findDOMNode } from 'react-dom';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.violations).toHaveLength(4);
    });
  });

  describe('third-party React Native libraries', () => {
    it('should flag react-native-gesture-handler imports', () => {
      const code = `
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should flag react-native-reanimated imports', () => {
      const code = `
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.passed).toBe(false);
    });

    it('should flag react-native-safe-area-context', () => {
      const code = `
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.passed).toBe(false);
    });

    it('should flag react-native-screens', () => {
      const code = `
import { enableScreens, Screen } from 'react-native-screens';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.passed).toBe(false);
    });

    it('should flag react-native-svg', () => {
      const code = `
import Svg, { Path, Circle, Rect } from 'react-native-svg';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.passed).toBe(false);
    });

    it('should flag expo libraries', () => {
      const code = `
import { StatusBar } from 'expo-status-bar';
`;
      const result = analyzePlatformImports('Component.tsx', code);
      expect(result.passed).toBe(false);
    });
  });

  describe('mixed valid and invalid imports', () => {
    it('should only flag invalid imports in a mixed file', () => {
      const code = `
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { View, Text } from 'react-native';  // These should be flagged
import { myHelper } from './utils';
import type { ViewProps } from 'react-native';  // Type import - OK
`;
      const result = analyzePlatformImports('Component.tsx', code);

      expect(result.violations).toHaveLength(2);
      expect(result.violations.map((v) => v.primitive)).toEqual(['View', 'Text']);
    });

    it('should handle component with multiple platform violations', () => {
      const code = `
import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { createPortal, flushSync } from 'react-dom';
`;
      const result = analyzePlatformImports('Component.tsx', code);

      expect(result.violations).toHaveLength(7);
      expect(result.violations.filter((v) => v.type === 'native-in-shared')).toHaveLength(5);
      expect(result.violations.filter((v) => v.type === 'dom-in-shared')).toHaveLength(2);
    });
  });

  describe('file path edge cases', () => {
    it('should handle Windows-style paths', () => {
      expect(classifyFile('src\\components\\Button.tsx')).toBe('shared');
      expect(classifyFile('src\\components\\Button.web.tsx')).toBe('web');
    });

    it('should handle files with numbers', () => {
      expect(classifyFile('Button2.tsx')).toBe('shared');
      expect(classifyFile('Button2.web.tsx')).toBe('web');
    });

    it('should handle files with hyphens and underscores', () => {
      expect(classifyFile('my-button.tsx')).toBe('shared');
      expect(classifyFile('my_button.web.tsx')).toBe('web');
    });

    it('should handle deeply nested component paths', () => {
      const code = `import { View } from 'react-native';`;

      const result1 = analyzePlatformImports(
        'packages/ui/src/components/forms/inputs/Button.tsx',
        code
      );
      expect(result1.fileType).toBe('shared');
      expect(result1.passed).toBe(false);

      const result2 = analyzePlatformImports(
        'packages/ui/src/components/forms/inputs/Button.native.tsx',
        code
      );
      expect(result2.fileType).toBe('native');
      expect(result2.passed).toBe(true);
    });
  });

  describe('source code edge cases', () => {
    it('should handle empty files', () => {
      const result = analyzePlatformImports('Button.tsx', '');
      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should handle files with only comments', () => {
      const code = `
// This is a comment
/* Multi-line
   comment */
`;
      const result = analyzePlatformImports('Button.tsx', code);
      expect(result.passed).toBe(true);
    });

    it('should handle files with syntax errors gracefully', () => {
      const code = `
import { View from 'react-native';  // Missing closing brace
`;
      // TypeScript parser should handle this gracefully
      expect(() => analyzePlatformImports('Button.tsx', code)).not.toThrow();
    });

    it('should handle JSX without imports', () => {
      const code = `
export function Button() {
  return <button>Click me</button>;
}
`;
      const result = analyzePlatformImports('Button.tsx', code);
      expect(result.passed).toBe(true);
    });

    it('should handle TypeScript with generics', () => {
      const code = `
import { View } from 'react-native';
import type { FC } from 'react';

export const Button: FC<{ label: string }> = ({ label }) => {
  return <View />;
};
`;
      const result = analyzePlatformImports('Button.tsx', code);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].primitive).toBe('View');
    });
  });

  describe('real-world component patterns', () => {
    it('should handle a typical web component', () => {
      const code = `
import React, { forwardRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useStyles } from './Modal.styles';
import type { ModalProps } from './types';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, isOpen, onClose }, ref) => {
    const styles = useStyles();

    if (!isOpen) return null;

    return createPortal(
      <div ref={ref} className={styles.overlay} onClick={onClose}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
`;
      const webResult = analyzePlatformImports('Modal.web.tsx', code);
      expect(webResult.passed).toBe(true);

      const sharedResult = analyzePlatformImports('Modal.tsx', code);
      expect(sharedResult.passed).toBe(false);
      expect(sharedResult.violations).toHaveLength(1);
    });

    it('should handle a typical native component', () => {
      const code = `
import React, { forwardRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal as RNModal,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ModalProps } from './types';

export const Modal = forwardRef<View, ModalProps>(
  ({ children, isOpen, onClose }, ref) => {
    const insets = useSafeAreaInsets();

    return (
      <RNModal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        >
          <Animated.View ref={ref} style={[styles.content, { paddingBottom: insets.bottom }]}>
            {children}
          </Animated.View>
        </TouchableOpacity>
      </RNModal>
    );
  }
);
`;
      const nativeResult = analyzePlatformImports('Modal.native.tsx', code);
      expect(nativeResult.passed).toBe(true);

      const sharedResult = analyzePlatformImports('Modal.tsx', code);
      expect(sharedResult.passed).toBe(false);
      // View, Text, TouchableOpacity, Modal (as RNModal), StyleSheet, Animated + useSafeAreaInsets
      expect(sharedResult.violations.length).toBeGreaterThan(5);
    });

    it('should handle shared utility files correctly', () => {
      const code = `
import { useState, useEffect, useCallback } from 'react';

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}
`;
      const result = analyzePlatformImports('useToggle.tsx', code);
      expect(result.passed).toBe(true);
    });
  });

  describe('configuration combinations', () => {
    it('should handle multiple configuration options together', () => {
      const code = `
import { View, Text, CustomNative } from 'react-native';
import { createPortal, customDom } from 'react-dom';
`;
      const result = analyzePlatformImports('Component.tsx', code, {
        severity: 'warning',
        additionalNativePrimitives: ['CustomNative'],
        additionalDomPrimitives: ['customDom'],
        ignoredPrimitives: ['View'],
      });

      expect(result.violations.every((v) => v.severity === 'warning')).toBe(true);
      expect(result.violations.map((v) => v.primitive)).not.toContain('View');
      expect(result.violations.map((v) => v.primitive)).toContain('Text');
      expect(result.violations.map((v) => v.primitive)).toContain('CustomNative');
      expect(result.violations.map((v) => v.primitive)).toContain('createPortal');
      expect(result.violations.map((v) => v.primitive)).toContain('customDom');
    });
  });
});
