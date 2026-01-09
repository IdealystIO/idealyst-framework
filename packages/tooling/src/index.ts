/**
 * @idealyst/tooling
 *
 * Code analysis and validation utilities for Idealyst Framework.
 * Provides tools for babel plugins, CLI, and MCP to validate cross-platform code.
 *
 * Also provides component documentation generation:
 * - analyzeComponents(): Generate a component registry from TypeScript source
 * - analyzeTheme(): Extract theme values (intents, sizes, etc.)
 * - idealystDocsPlugin(): Vite plugin for virtual module support
 */

// Types
export * from './types';

// Component Documentation (also available via @idealyst/tooling/docs)
export {
  analyzeComponents,
  analyzeTheme,
  // Babel plugin compatibility
  loadThemeKeys,
  resetThemeCache,
  type BabelThemeKeys,
  // Types
  type ComponentRegistry,
  type ComponentDefinition,
  type PropDefinition,
  type ThemeValues,
  type ComponentAnalyzerOptions,
} from './analyzer';

// Vite Plugin (also available via @idealyst/tooling/vite)
export { idealystDocsPlugin, generateComponentRegistry } from './vite-plugin';
export type { IdealystDocsPluginOptions } from './analyzer/types';

// Analyzers
export {
  analyzePlatformImports,
  analyzeFiles,
  summarizeResults,
  formatViolation,
  formatViolations,
  type AnalysisSummary,
} from './analyzers';

// Rules
export {
  // React Native
  REACT_NATIVE_SOURCES,
  REACT_NATIVE_PRIMITIVES,
  REACT_NATIVE_PRIMITIVE_NAMES,
  REACT_NATIVE_RULE_SET,
  isReactNativePrimitive,
  getReactNativePrimitive,
  // React DOM
  REACT_DOM_SOURCES,
  REACT_DOM_PRIMITIVES,
  REACT_DOM_PRIMITIVE_NAMES,
  REACT_DOM_RULE_SET,
  HTML_INTRINSIC_ELEMENTS,
  HTML_ELEMENT_NAMES,
  isReactDomPrimitive,
  isHtmlElement,
  getReactDomPrimitive,
} from './rules';

// Utilities
export {
  classifyFile,
  isComponentFile,
  isSharedFile,
  isPlatformSpecificFile,
  getExpectedPlatform,
  getBaseName,
  parseImports,
  getPlatformForSource,
  filterPlatformImports,
  getUniqueSources,
  groupImportsBySource,
  type ImportParserOptions,
} from './utils';

// =============================================================================
// Runtime Placeholders - These get replaced by the Vite plugin at build time
// =============================================================================

import type { ComponentRegistry, ComponentDefinition } from './analyzer/types';

/**
 * Component registry placeholder.
 * This empty object is replaced at build time by the idealystDocsPlugin
 * with the actual component metadata extracted from your codebase.
 *
 * @example
 * ```ts
 * import { componentRegistry } from '@idealyst/tooling';
 *
 * // Access component definitions
 * const buttonDef = componentRegistry['Button'];
 * console.log(buttonDef.description);
 * console.log(buttonDef.props);
 * ```
 */
export const componentRegistry: ComponentRegistry = {};

/**
 * List of all component names in the registry.
 * Replaced at build time by the Vite plugin.
 */
export const componentNames: string[] = [];

/**
 * Get components filtered by category.
 * Replaced at build time by the Vite plugin.
 */
export function getComponentsByCategory(category: string): string[] {
  return Object.entries(componentRegistry)
    .filter(([_, def]) => def.category === category)
    .map(([name]) => name);
}

/**
 * Get prop configuration for a component (useful for playgrounds).
 * Replaced at build time by the Vite plugin.
 */
export function getPropConfig(componentName: string): Record<string, any> {
  const def = componentRegistry[componentName];
  if (!def) return {};

  return Object.entries(def.props).reduce((acc, [key, prop]) => {
    if (prop.values && prop.values.length > 0) {
      acc[key] = { type: 'select', options: prop.values, default: prop.default };
    } else if (prop.type === 'boolean') {
      acc[key] = { type: 'boolean', default: prop.default ?? false };
    } else if (prop.type === 'string') {
      acc[key] = { type: 'text', default: prop.default ?? '' };
    } else if (prop.type === 'number') {
      acc[key] = { type: 'number', default: prop.default ?? 0 };
    }
    return acc;
  }, {} as Record<string, any>);
}
