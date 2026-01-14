/**
 * Theme Analyzer - Extracts theme keys by statically analyzing theme files.
 *
 * Uses TypeScript Compiler API to trace the declarative builder API:
 * - createTheme() / fromTheme(base)
 * - .addIntent('name', {...})
 * - .addRadius('name', value)
 * - .addShadow('name', {...})
 * - .setSizes({ button: { xs: {}, sm: {}, ... }, ... })
 * - .build()
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import type { ThemeValues } from './types';

interface AnalyzerContext {
  program: ts.Program;
  typeChecker: ts.TypeChecker;
  verbose: boolean;
}

/**
 * Extract theme values from a theme file.
 */
export function analyzeTheme(themePath: string, verbose = false): ThemeValues {
  const resolvedPath = path.resolve(themePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Theme file not found: ${resolvedPath}`);
  }

  const log = (...args: any[]) => {
    if (verbose) console.log('[theme-analyzer]', ...args);
  };

  log('Analyzing theme file:', resolvedPath);

  // Create a TypeScript program
  const program = ts.createProgram([resolvedPath], {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    allowSyntheticDefaultImports: true,
  });

  const sourceFile = program.getSourceFile(resolvedPath);
  if (!sourceFile) {
    throw new Error(`Failed to parse theme file: ${resolvedPath}`);
  }

  const ctx: AnalyzerContext = {
    program,
    typeChecker: program.getTypeChecker(),
    verbose,
  };

  const values: ThemeValues = {
    intents: [],
    sizes: {},
    radii: [],
    shadows: [],
    breakpoints: [],
    typography: [],
    surfaceColors: [],
    textColors: [],
    borderColors: [],
  };

  // Track imports for base theme resolution
  const imports = new Map<string, { source: string; imported: string }>();

  // First pass: collect imports
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node)) {
      const source = (node.moduleSpecifier as ts.StringLiteral).text;
      const clause = node.importClause;
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          const localName = element.name.text;
          const importedName = element.propertyName?.text ?? localName;
          imports.set(localName, { source, imported: importedName });
        }
      }
    }
  });

  /**
   * Process a builder method call chain.
   */
  function processBuilderChain(node: ts.Node): void {
    if (!ts.isCallExpression(node)) return;

    // Check if this is a .build() call
    if (ts.isPropertyAccessExpression(node.expression)) {
      const methodName = node.expression.name.text;

      if (methodName === 'build') {
        // Trace the full chain
        const calls = traceBuilderCalls(node);
        processCalls(calls);
        return;
      }
    }

    // Recurse into children
    ts.forEachChild(node, processBuilderChain);
  }

  interface BuilderCall {
    method: string;
    args: ts.NodeArray<ts.Expression>;
  }

  /**
   * Trace a builder chain backwards to collect all method calls.
   */
  function traceBuilderCalls(node: ts.CallExpression, calls: BuilderCall[] = []): BuilderCall[] {
    if (!ts.isPropertyAccessExpression(node.expression)) {
      // Check for createTheme() or fromTheme()
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const fnName = node.expression.text;
        if (fnName === 'fromTheme' && node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isIdentifier(arg)) {
            // Analyze base theme
            analyzeBaseTheme(arg.text, imports, values, ctx);
          }
        }
      }
      return calls;
    }

    const methodName = node.expression.name.text;
    calls.unshift({ method: methodName, args: node.arguments });

    // Recurse into the object being called
    const obj = node.expression.expression;
    if (ts.isCallExpression(obj)) {
      return traceBuilderCalls(obj, calls);
    }

    return calls;
  }

  /**
   * Process the collected builder method calls.
   */
  function processCalls(calls: BuilderCall[]): void {
    log('Processing', calls.length, 'builder method calls');

    for (const { method, args } of calls) {
      switch (method) {
        case 'addIntent': {
          const name = getStringValue(args[0]);
          if (name && !values.intents.includes(name)) {
            values.intents.push(name);
            log('  Found intent:', name);
          }
          break;
        }
        case 'addRadius': {
          const name = getStringValue(args[0]);
          if (name && !values.radii.includes(name)) {
            values.radii.push(name);
            log('  Found radius:', name);
          }
          break;
        }
        case 'addShadow': {
          const name = getStringValue(args[0]);
          if (name && !values.shadows.includes(name)) {
            values.shadows.push(name);
            log('  Found shadow:', name);
          }
          break;
        }
        case 'setSizes': {
          if (args[0] && ts.isObjectLiteralExpression(args[0])) {
            for (const prop of args[0].properties) {
              if (ts.isPropertyAssignment(prop)) {
                const componentName = getPropertyName(prop.name);
                if (componentName && ts.isObjectLiteralExpression(prop.initializer)) {
                  values.sizes[componentName] = getObjectKeys(prop.initializer);
                  log('  Found sizes for', componentName + ':', values.sizes[componentName]);
                }
              }
            }
          }
          break;
        }
        case 'setBreakpoints': {
          if (args[0] && ts.isObjectLiteralExpression(args[0])) {
            values.breakpoints = getObjectKeys(args[0]);
            log('  Found breakpoints:', values.breakpoints);
          }
          break;
        }
        case 'setColors': {
          if (args[0] && ts.isObjectLiteralExpression(args[0])) {
            for (const prop of args[0].properties) {
              if (ts.isPropertyAssignment(prop)) {
                const colorType = getPropertyName(prop.name);
                if (ts.isObjectLiteralExpression(prop.initializer)) {
                  const keys = getObjectKeys(prop.initializer);
                  switch (colorType) {
                    case 'surface':
                      values.surfaceColors = keys;
                      log('  Found surface colors:', keys);
                      break;
                    case 'text':
                      values.textColors = keys;
                      log('  Found text colors:', keys);
                      break;
                    case 'border':
                      values.borderColors = keys;
                      log('  Found border colors:', keys);
                      break;
                  }
                }
              }
            }
          }
          break;
        }
        case 'build':
          // End of chain
          break;
        default:
          log('  Skipping unknown method:', method);
      }
    }
  }

  // Second pass: find and process builder chains
  ts.forEachChild(sourceFile, (node) => {
    // Handle variable declarations
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (decl.initializer) {
          processBuilderChain(decl.initializer);
        }
      }
    }
    // Handle export statements
    if (ts.isExportAssignment(node)) {
      processBuilderChain(node.expression);
    }
  });

  // Extract typography keys from sizes if present
  if (values.sizes['typography']) {
    values.typography = values.sizes['typography'];
  }

  log('Extracted theme values:', values);

  return values;
}

/**
 * Analyze a base theme file referenced by an import.
 */
function analyzeBaseTheme(
  varName: string,
  imports: Map<string, { source: string; imported: string }>,
  values: ThemeValues,
  ctx: AnalyzerContext
): void {
  const log = (...args: any[]) => {
    if (ctx.verbose) console.log('[theme-analyzer]', ...args);
  };

  const importInfo = imports.get(varName);
  if (!importInfo) {
    log('Could not find import for base theme:', varName);
    return;
  }

  log('Base theme', varName, 'imported from', importInfo.source);

  // For @idealyst/theme imports, we know the structure
  if (importInfo.source === '@idealyst/theme' || importInfo.source.includes('@idealyst/theme')) {
    // Use default light theme values
    const defaultValues = getDefaultThemeValues();
    mergeThemeValues(values, defaultValues);
    log('Using default @idealyst/theme values');
    return;
  }

  // For relative imports, try to resolve and analyze
  // (This is simplified - full implementation would recursively analyze)
  log('Skipping base theme analysis for:', importInfo.source);
}

/**
 * Get default theme values from @idealyst/theme.
 */
function getDefaultThemeValues(): ThemeValues {
  return {
    intents: ['primary', 'success', 'error', 'warning', 'neutral', 'info'],
    sizes: {
      button: ['xs', 'sm', 'md', 'lg', 'xl'],
      chip: ['xs', 'sm', 'md', 'lg', 'xl'],
      badge: ['xs', 'sm', 'md', 'lg', 'xl'],
      icon: ['xs', 'sm', 'md', 'lg', 'xl'],
      input: ['xs', 'sm', 'md', 'lg', 'xl'],
      radioButton: ['xs', 'sm', 'md', 'lg', 'xl'],
      select: ['xs', 'sm', 'md', 'lg', 'xl'],
      slider: ['xs', 'sm', 'md', 'lg', 'xl'],
      switch: ['xs', 'sm', 'md', 'lg', 'xl'],
      textarea: ['xs', 'sm', 'md', 'lg', 'xl'],
      avatar: ['xs', 'sm', 'md', 'lg', 'xl'],
      progress: ['xs', 'sm', 'md', 'lg', 'xl'],
      accordion: ['xs', 'sm', 'md', 'lg', 'xl'],
      activityIndicator: ['xs', 'sm', 'md', 'lg', 'xl'],
      breadcrumb: ['xs', 'sm', 'md', 'lg', 'xl'],
      list: ['xs', 'sm', 'md', 'lg', 'xl'],
      menu: ['xs', 'sm', 'md', 'lg', 'xl'],
      text: ['xs', 'sm', 'md', 'lg', 'xl'],
      tabBar: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: ['xs', 'sm', 'md', 'lg', 'xl'],
      tooltip: ['xs', 'sm', 'md', 'lg', 'xl'],
      view: ['xs', 'sm', 'md', 'lg', 'xl'],
      // Typography sizes for Text component's $typography iterator
      typography: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption'],
    },
    radii: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    shadows: ['none', 'sm', 'md', 'lg', 'xl'],
    breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    typography: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption'],
    surfaceColors: ['screen', 'primary', 'secondary', 'tertiary', 'inverse', 'inverse-secondary', 'inverse-tertiary'],
    textColors: ['primary', 'secondary', 'tertiary', 'inverse', 'inverse-secondary', 'inverse-tertiary'],
    borderColors: ['primary', 'secondary', 'tertiary', 'disabled'],
  };
}

/**
 * Merge theme values, avoiding duplicates.
 */
function mergeThemeValues(target: ThemeValues, source: ThemeValues): void {
  target.intents.push(...source.intents.filter(k => !target.intents.includes(k)));
  target.radii.push(...source.radii.filter(k => !target.radii.includes(k)));
  target.shadows.push(...source.shadows.filter(k => !target.shadows.includes(k)));
  target.breakpoints.push(...source.breakpoints.filter(k => !target.breakpoints.includes(k)));
  target.typography.push(...source.typography.filter(k => !target.typography.includes(k)));
  target.surfaceColors.push(...source.surfaceColors.filter(k => !target.surfaceColors.includes(k)));
  target.textColors.push(...source.textColors.filter(k => !target.textColors.includes(k)));
  target.borderColors.push(...source.borderColors.filter(k => !target.borderColors.includes(k)));

  for (const [comp, sizes] of Object.entries(source.sizes)) {
    if (!target.sizes[comp]) {
      target.sizes[comp] = sizes;
    }
  }
}

// Helper functions

function getStringValue(node?: ts.Expression): string | null {
  if (!node) return null;
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isIdentifier(node)) return node.text;
  return null;
}

function getPropertyName(node: ts.PropertyName): string | null {
  if (ts.isIdentifier(node)) return node.text;
  if (ts.isStringLiteral(node)) return node.text;
  return null;
}

function getObjectKeys(node: ts.ObjectLiteralExpression): string[] {
  return node.properties
    .filter(ts.isPropertyAssignment)
    .map(prop => getPropertyName(prop.name))
    .filter((k): k is string => k !== null);
}

// ============================================================================
// Babel Plugin Compatibility Layer
// ============================================================================

/**
 * Theme keys format expected by the Babel plugin.
 * This is a subset of ThemeValues for backwards compatibility.
 */
export interface BabelThemeKeys {
  intents: string[];
  sizes: Record<string, string[]>;
  radii: string[];
  shadows: string[];
  typography: string[];
}

// Cache for loadThemeKeys to avoid re-parsing
let themeKeysCache: BabelThemeKeys | null = null;
let themeLoadAttempted = false;

/**
 * Load theme keys for the Babel plugin.
 * This is a compatibility wrapper around analyzeTheme() that:
 * - Provides caching (only parses once per build)
 * - Returns the subset of keys needed by the Babel plugin
 * - Handles path resolution based on babel opts
 *
 * @param opts - Babel plugin options (requires themePath)
 * @param rootDir - Root directory for path resolution
 * @param _babelTypes - Unused (kept for backwards compatibility)
 * @param verboseMode - Enable verbose logging
 */
export function loadThemeKeys(
  opts: { themePath?: string },
  rootDir: string,
  _babelTypes?: unknown,
  verboseMode = false
): BabelThemeKeys {
  if (themeLoadAttempted && themeKeysCache) {
    return themeKeysCache;
  }
  themeLoadAttempted = true;

  const themePath = opts.themePath;

  if (!themePath) {
    throw new Error(
      '[idealyst-plugin] themePath is required!\n' +
      'Add it to your babel config:\n' +
      '  ["@idealyst/theme/plugin", { themePath: "./src/theme/styles.ts" }]'
    );
  }

  // Resolve the path
  const resolvedPath = themePath.startsWith('.')
    ? path.resolve(rootDir, themePath)
    : themePath;

  if (verboseMode) {
    console.log('[idealyst-plugin] Analyzing theme file via @idealyst/tooling:', resolvedPath);
  }

  // Use the TypeScript-based analyzer
  const themeValues = analyzeTheme(resolvedPath, verboseMode);

  // Convert to Babel-compatible format (subset of ThemeValues)
  themeKeysCache = {
    intents: themeValues.intents,
    sizes: themeValues.sizes,
    radii: themeValues.radii,
    shadows: themeValues.shadows,
    typography: themeValues.typography,
  };

  if (verboseMode) {
    console.log('[idealyst-plugin] Extracted theme keys:');
    console.log('  intents:', themeKeysCache.intents);
    console.log('  radii:', themeKeysCache.radii);
    console.log('  shadows:', themeKeysCache.shadows);
    console.log('  sizes:');
    for (const [component, sizes] of Object.entries(themeKeysCache.sizes)) {
      console.log(`    ${component}:`, sizes);
    }
  }

  return themeKeysCache;
}

/**
 * Reset the theme cache. Useful for testing or hot reload.
 */
export function resetThemeCache(): void {
  themeKeysCache = null;
  themeLoadAttempted = false;
}
