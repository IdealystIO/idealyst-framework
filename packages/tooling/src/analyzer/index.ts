/**
 * Component and Theme Analyzers
 *
 * Tools for extracting component metadata from TypeScript source code.
 * Used by both the Vite plugin (for docs generation) and MCP server (for IDE assistance).
 * Also used by the Babel plugin for $iterator expansion.
 */

export { analyzeComponents } from './component-analyzer';
export {
  analyzeTheme,
  loadThemeKeys,
  resetThemeCache,
  type BabelThemeKeys,
} from './theme-analyzer';

// New source-based analyzer (no hardcoded defaults)
export {
  analyzeThemeSource,
  toBabelThemeKeys,
  type ThemeSourceAnalyzerOptions,
  type BabelThemeKeys as BabelThemeKeysNew,
} from './theme-source-analyzer';

export * from './types';
