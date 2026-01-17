/**
 * Theme Source Analyzer - Extracts all theme values directly from TypeScript source.
 *
 * This analyzer parses the theme file and extracts all values from the builder API
 * without relying on hardcoded defaults. It traces:
 * - createTheme() / fromTheme(base)
 * - .addIntent('name', {...})
 * - .addRadius('name', value)
 * - .addShadow('name', {...})
 * - .setSizes({ component: { size: {...}, ... }, ... })
 * - .setColors({ surface: {...}, text: {...}, border: {...}, pallet: {...} })
 * - .setBreakpoints({ xs: 0, sm: 576, ... })
 * - .build()
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import type { ThemeValues } from './types';

export interface ThemeSourceAnalyzerOptions {
  /** Enable verbose logging */
  verbose?: boolean;
  /** Package aliases for resolving imports (e.g., { '@idealyst/theme': '/path/to/packages/theme' }) */
  aliases?: Record<string, string>;
}

interface AnalyzerContext {
  program: ts.Program;
  typeChecker: ts.TypeChecker;
  verbose: boolean;
  aliases: Record<string, string>;
  /** Track analyzed files to avoid cycles */
  analyzedFiles: Set<string>;
}

/**
 * Analyze a theme file and extract all theme values.
 * This is the main entry point for theme analysis.
 */
export function analyzeThemeSource(
  themePath: string,
  options: ThemeSourceAnalyzerOptions = {}
): ThemeValues {
  const resolvedPath = path.resolve(themePath);
  const verbose = options.verbose ?? false;
  const aliases = options.aliases ?? {};

  const log = (...args: unknown[]) => {
    if (verbose) console.log('[theme-source-analyzer]', ...args);
  };

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Theme file not found: ${resolvedPath}`);
  }

  log('Analyzing theme file:', resolvedPath);

  // Create a TypeScript program with proper module resolution
  const configPath = ts.findConfigFile(path.dirname(resolvedPath), ts.sys.fileExists, 'tsconfig.json');
  let compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
  };

  if (configPath) {
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    if (!configFile.error) {
      const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));
      compilerOptions = { ...compilerOptions, ...parsed.options };
    }
  }

  const program = ts.createProgram([resolvedPath], compilerOptions);
  const sourceFile = program.getSourceFile(resolvedPath);

  if (!sourceFile) {
    throw new Error(`Failed to parse theme file: ${resolvedPath}`);
  }

  const ctx: AnalyzerContext = {
    program,
    typeChecker: program.getTypeChecker(),
    verbose,
    aliases,
    analyzedFiles: new Set([resolvedPath]),
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
          log(`  Import: ${localName} from '${source}'`);
        }
      }
    }
  });

  /**
   * Resolve an import path using aliases.
   */
  function resolveImportPath(source: string, fromFile: string): string | null {
    // Check aliases first
    for (const [aliasPrefix, aliasPath] of Object.entries(ctx.aliases)) {
      if (source === aliasPrefix || source.startsWith(aliasPrefix + '/')) {
        const remainder = source.slice(aliasPrefix.length);
        let resolved = aliasPath + remainder;
        if (!path.isAbsolute(resolved)) {
          resolved = path.resolve(path.dirname(fromFile), resolved);
        }
        return resolved;
      }
    }

    // Try relative resolution
    if (source.startsWith('.')) {
      return path.resolve(path.dirname(fromFile), source);
    }

    // Try node_modules resolution
    try {
      return require.resolve(source, { paths: [path.dirname(fromFile)] });
    } catch {
      return null;
    }
  }

  /**
   * Find a theme file from a resolved directory/file path.
   */
  function findThemeFile(basePath: string, preferDark: boolean): string | null {
    const themeFileName = preferDark ? 'darkTheme' : 'lightTheme';

    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      path.join(basePath, 'src', `${themeFileName}.ts`),
      path.join(basePath, `${themeFileName}.ts`),
      path.join(basePath, 'src', 'index.ts'),
      path.join(basePath, 'index.ts'),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }

    return null;
  }

  /**
   * Analyze a base theme file recursively.
   */
  function analyzeBaseTheme(varName: string): void {
    const importInfo = imports.get(varName);
    if (!importInfo) {
      log(`Could not find import for base theme: ${varName}`);
      return;
    }

    log(`Analyzing base theme '${varName}' from '${importInfo.source}'`);

    const resolvedBase = resolveImportPath(importInfo.source, resolvedPath);
    if (!resolvedBase) {
      log(`Could not resolve import path: ${importInfo.source}`);
      return;
    }

    const preferDark = varName.toLowerCase().includes('dark');
    const themeFile = findThemeFile(resolvedBase, preferDark);

    if (!themeFile) {
      log(`Could not find theme file for: ${resolvedBase}`);
      return;
    }

    if (ctx.analyzedFiles.has(themeFile)) {
      log(`Already analyzed: ${themeFile}`);
      return;
    }

    ctx.analyzedFiles.add(themeFile);
    log(`Recursively analyzing: ${themeFile}`);

    // Parse and analyze the base theme file
    const baseValues = analyzeThemeSource(themeFile, { verbose, aliases });

    // Merge base values (base values come first, current file can override)
    mergeThemeValues(values, baseValues, false);
  }

  interface BuilderCall {
    method: string;
    args: ts.NodeArray<ts.Expression>;
  }

  /**
   * Trace a builder chain backwards to collect all method calls.
   */
  function traceBuilderCalls(node: ts.CallExpression, calls: BuilderCall[] = []): { calls: BuilderCall[]; baseThemeVar: string | null } {
    if (!ts.isPropertyAccessExpression(node.expression)) {
      // Check for createTheme() or fromTheme()
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const fnName = node.expression.text;
        if (fnName === 'fromTheme' && node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isIdentifier(arg)) {
            return { calls, baseThemeVar: arg.text };
          }
        }
      }
      return { calls, baseThemeVar: null };
    }

    const methodName = node.expression.name.text;
    calls.unshift({ method: methodName, args: node.arguments });

    // Recurse into the object being called
    const obj = node.expression.expression;
    if (ts.isCallExpression(obj)) {
      return traceBuilderCalls(obj, calls);
    }

    return { calls, baseThemeVar: null };
  }

  /**
   * Get a string value from an AST node.
   */
  function getStringValue(node?: ts.Expression): string | null {
    if (!node) return null;
    if (ts.isStringLiteral(node)) return node.text;
    if (ts.isIdentifier(node)) return node.text;
    if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    return null;
  }

  /**
   * Get all keys from an object literal.
   */
  function getObjectKeys(node: ts.ObjectLiteralExpression): string[] {
    return node.properties
      .filter((prop): prop is ts.PropertyAssignment => ts.isPropertyAssignment(prop))
      .map(prop => {
        if (ts.isIdentifier(prop.name)) return prop.name.text;
        if (ts.isStringLiteral(prop.name)) return prop.name.text;
        return null;
      })
      .filter((k): k is string => k !== null);
  }

  /**
   * Process the collected builder method calls and extract values.
   */
  function processCalls(calls: BuilderCall[]): void {
    log(`Processing ${calls.length} builder method calls`);

    for (const { method, args } of calls) {
      switch (method) {
        case 'addIntent': {
          const name = getStringValue(args[0]);
          if (name && !values.intents.includes(name)) {
            values.intents.push(name);
            log(`  Found intent: ${name}`);
          }
          break;
        }

        case 'addRadius': {
          const name = getStringValue(args[0]);
          if (name && !values.radii.includes(name)) {
            values.radii.push(name);
            log(`  Found radius: ${name}`);
          }
          break;
        }

        case 'addShadow': {
          const name = getStringValue(args[0]);
          if (name && !values.shadows.includes(name)) {
            values.shadows.push(name);
            log(`  Found shadow: ${name}`);
          }
          break;
        }

        case 'addBreakpoint': {
          const name = getStringValue(args[0]);
          if (name && !values.breakpoints.includes(name)) {
            values.breakpoints.push(name);
            log(`  Found breakpoint: ${name}`);
          }
          break;
        }

        case 'setBreakpoints': {
          if (args[0] && ts.isObjectLiteralExpression(args[0])) {
            const keys = getObjectKeys(args[0]);
            for (const key of keys) {
              if (!values.breakpoints.includes(key)) {
                values.breakpoints.push(key);
              }
            }
            log(`  Found breakpoints: ${values.breakpoints.join(', ')}`);
          }
          break;
        }

        case 'setSizes': {
          if (args[0] && ts.isObjectLiteralExpression(args[0])) {
            for (const prop of args[0].properties) {
              if (ts.isPropertyAssignment(prop)) {
                let componentName: string | null = null;
                if (ts.isIdentifier(prop.name)) {
                  componentName = prop.name.text;
                } else if (ts.isStringLiteral(prop.name)) {
                  componentName = prop.name.text;
                }

                if (componentName && ts.isObjectLiteralExpression(prop.initializer)) {
                  const sizeKeys = getObjectKeys(prop.initializer);
                  values.sizes[componentName] = sizeKeys;
                  log(`  Found sizes for ${componentName}: ${sizeKeys.join(', ')}`);

                  // Special case: typography sizes also populate the typography array
                  if (componentName === 'typography') {
                    for (const key of sizeKeys) {
                      if (!values.typography.includes(key)) {
                        values.typography.push(key);
                      }
                    }
                  }
                }
              }
            }
          } else if (args[0] && ts.isPropertyAccessExpression(args[0])) {
            // Handle references like: .setSizes(lightTheme.sizes)
            const propAccess = args[0];
            if (ts.isIdentifier(propAccess.expression) && propAccess.name.text === 'sizes') {
              const themeVarName = propAccess.expression.text;
              log(`  Found sizes reference: ${themeVarName}.sizes`);

              // Try to resolve this by analyzing the referenced theme
              const importInfo = imports.get(themeVarName);
              if (importInfo) {
                log(`  Resolving sizes from imported theme: ${importInfo.source}`);
                const resolvedBase = resolveImportPath(importInfo.source, resolvedPath);
                if (resolvedBase) {
                  const preferDark = themeVarName.toLowerCase().includes('dark');
                  const themeFile = findThemeFile(resolvedBase, preferDark);
                  if (themeFile && !ctx.analyzedFiles.has(themeFile)) {
                    ctx.analyzedFiles.add(themeFile);
                    const baseValues = analyzeThemeSource(themeFile, { verbose, aliases });
                    // Copy sizes from base theme
                    for (const [comp, sizes] of Object.entries(baseValues.sizes)) {
                      if (!values.sizes[comp]) {
                        values.sizes[comp] = sizes;
                        log(`  Inherited sizes for ${comp}: ${sizes.join(', ')}`);
                      }
                    }
                    // Also copy typography if we inherited it
                    for (const typo of baseValues.typography) {
                      if (!values.typography.includes(typo)) {
                        values.typography.push(typo);
                      }
                    }
                  }
                }
              }
            }
          }
          break;
        }

        case 'setColors': {
          if (args[0] && ts.isObjectLiteralExpression(args[0])) {
            for (const prop of args[0].properties) {
              if (ts.isPropertyAssignment(prop)) {
                let colorType: string | null = null;
                if (ts.isIdentifier(prop.name)) {
                  colorType = prop.name.text;
                } else if (ts.isStringLiteral(prop.name)) {
                  colorType = prop.name.text;
                }

                if (colorType && ts.isObjectLiteralExpression(prop.initializer)) {
                  const colorKeys = getObjectKeys(prop.initializer);
                  switch (colorType) {
                    case 'surface':
                      values.surfaceColors = colorKeys;
                      log(`  Found surface colors: ${colorKeys.join(', ')}`);
                      break;
                    case 'text':
                      values.textColors = colorKeys;
                      log(`  Found text colors: ${colorKeys.join(', ')}`);
                      break;
                    case 'border':
                      values.borderColors = colorKeys;
                      log(`  Found border colors: ${colorKeys.join(', ')}`);
                      break;
                  }
                }
                // Handle function calls like generateColorPallette() for pallet
                // We skip pallet since it's typically generated dynamically
              }
            }
          }
          break;
        }

        case 'build':
          // End of chain, nothing to extract
          break;

        default:
          log(`  Skipping unknown method: ${method}`);
      }
    }
  }

  /**
   * Process a node that might be a builder chain ending with .build().
   */
  function processBuilderChain(node: ts.Node): void {
    if (!ts.isCallExpression(node)) return;

    // Check if this is a .build() call
    if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'build') {
      log('Found .build() call, tracing chain...');
      const { calls, baseThemeVar } = traceBuilderCalls(node);

      // First analyze base theme if there is one
      if (baseThemeVar) {
        log(`Found fromTheme(${baseThemeVar})`);
        analyzeBaseTheme(baseThemeVar);
      }

      // Then process this file's calls (can override base)
      processCalls(calls);
      return;
    }

    // Recurse into children
    ts.forEachChild(node, processBuilderChain);
  }

  // Main analysis pass: find and process builder chains
  ts.forEachChild(sourceFile, (node) => {
    // Handle variable declarations: const lightTheme = createTheme()...build();
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (decl.initializer) {
          processBuilderChain(decl.initializer);
        }
      }
    }

    // Handle export statements: export const theme = ...
    if (ts.isExportAssignment(node)) {
      processBuilderChain(node.expression);
    }
  });

  log('Analysis complete:');
  log(`  Intents: ${values.intents.join(', ')}`);
  log(`  Radii: ${values.radii.join(', ')}`);
  log(`  Shadows: ${values.shadows.join(', ')}`);
  log(`  Breakpoints: ${values.breakpoints.join(', ')}`);
  log(`  Typography: ${values.typography.join(', ')}`);
  log(`  Size components: ${Object.keys(values.sizes).join(', ')}`);

  return values;
}

/**
 * Merge source theme values into target.
 * @param target - The target to merge into
 * @param source - The source to merge from
 * @param sourceOverrides - If true, source values replace target; if false, target values take precedence
 */
function mergeThemeValues(target: ThemeValues, source: ThemeValues, sourceOverrides: boolean): void {
  // Helper to merge arrays without duplicates
  const mergeArrays = (targetArr: string[], sourceArr: string[]): void => {
    for (const item of sourceArr) {
      if (!targetArr.includes(item)) {
        targetArr.push(item);
      }
    }
  };

  mergeArrays(target.intents, source.intents);
  mergeArrays(target.radii, source.radii);
  mergeArrays(target.shadows, source.shadows);
  mergeArrays(target.breakpoints, source.breakpoints);
  mergeArrays(target.typography, source.typography);
  mergeArrays(target.surfaceColors, source.surfaceColors);
  mergeArrays(target.textColors, source.textColors);
  mergeArrays(target.borderColors, source.borderColors);

  // Merge sizes - component by component
  for (const [component, sizes] of Object.entries(source.sizes)) {
    if (sourceOverrides || !target.sizes[component]) {
      target.sizes[component] = sizes;
    }
  }
}

/**
 * Convert ThemeValues to the format expected by the Babel plugin.
 */
export interface BabelThemeKeys {
  intents: string[];
  sizes: Record<string, string[]>;
  radii: string[];
  shadows: string[];
  typography: string[];
}

export function toBabelThemeKeys(values: ThemeValues): BabelThemeKeys {
  return {
    intents: values.intents,
    sizes: values.sizes,
    radii: values.radii,
    shadows: values.shadows,
    typography: values.typography,
  };
}
