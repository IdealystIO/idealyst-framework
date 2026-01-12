/**
 * Component Analyzer - Extracts component prop definitions using TypeScript Compiler API.
 *
 * Analyzes:
 * - types.ts files for prop interfaces
 * - JSDoc comments for descriptions
 * - Static .description properties on components
 * - Theme-derived types (Intent, Size) resolved to actual values
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import type {
  ComponentRegistry,
  ComponentDefinition,
  PropDefinition,
  ComponentAnalyzerOptions,
  ThemeValues,
  ComponentCategory,
  SampleProps,
} from './types';
import { analyzeTheme } from './theme-analyzer';

/**
 * Analyze components and generate a registry.
 */
export function analyzeComponents(options: ComponentAnalyzerOptions): ComponentRegistry {
  const { componentPaths, themePath, include, exclude, includeInternal = false } = options;

  const registry: ComponentRegistry = {};

  // First, analyze the theme to get valid values
  const themeValues = analyzeTheme(themePath, false);

  // Scan each component path
  for (const componentPath of componentPaths) {
    const resolvedPath = path.resolve(componentPath);

    if (!fs.existsSync(resolvedPath)) {
      console.warn(`[component-analyzer] Path not found: ${resolvedPath}`);
      continue;
    }

    // Find all component directories (those with index.ts or types.ts)
    const componentDirs = findComponentDirs(resolvedPath);

    for (const dir of componentDirs) {
      const componentName = path.basename(dir);

      // Apply include/exclude filters
      if (include && !include.includes(componentName)) continue;
      if (exclude && exclude.includes(componentName)) continue;
      if (!includeInternal && componentName.startsWith('_')) continue;

      const definition = analyzeComponentDir(dir, componentName, themeValues);
      if (definition) {
        registry[componentName] = definition;
      }
    }
  }

  return registry;
}

/**
 * Find all component directories in a path.
 */
function findComponentDirs(basePath: string): string[] {
  const dirs: string[] = [];

  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dirPath = path.join(basePath, entry.name);

    // Check if it's a component directory (has index.ts or types.ts)
    const hasIndex = fs.existsSync(path.join(dirPath, 'index.ts'));
    const hasTypes = fs.existsSync(path.join(dirPath, 'types.ts'));

    if (hasIndex || hasTypes) {
      dirs.push(dirPath);
    }
  }

  return dirs;
}

/**
 * Analyze a single component directory.
 */
function analyzeComponentDir(
  dir: string,
  componentName: string,
  themeValues: ThemeValues
): ComponentDefinition | null {
  // Find all TypeScript files in the component directory
  const tsFiles = fs.readdirSync(dir)
    .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
    .map(f => path.join(dir, f));

  if (tsFiles.length === 0) {
    return null;
  }

  // Create TypeScript program with all files
  const program = ts.createProgram(tsFiles, {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.React,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
  });

  const typeChecker = program.getTypeChecker();

  // Search all files for the props interface
  const propsInterfaceName = `${componentName}Props`;
  const altNames = [`${componentName}ComponentProps`, 'Props'];
  let propsInterface: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | null = null;
  let interfaceDescription: string | undefined;

  // Search each file for the props interface
  for (const filePath of tsFiles) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) continue;

    // First try the main props interface name
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === propsInterfaceName) {
        propsInterface = node;
        interfaceDescription = getJSDocDescription(node);
      }
      if (ts.isTypeAliasDeclaration(node) && node.name.text === propsInterfaceName) {
        propsInterface = node;
        interfaceDescription = getJSDocDescription(node);
      }
    });

    if (propsInterface) break;
  }

  // If not found, try alternate naming conventions
  if (!propsInterface) {
    for (const altName of altNames) {
      for (const filePath of tsFiles) {
        const sourceFile = program.getSourceFile(filePath);
        if (!sourceFile) continue;

        ts.forEachChild(sourceFile, (node) => {
          if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text === altName) {
            propsInterface = node;
            interfaceDescription = getJSDocDescription(node);
          }
        });

        if (propsInterface) break;
      }
      if (propsInterface) break;
    }
  }

  // If we couldn't find a props interface, skip this component
  if (!propsInterface) {
    return null;
  }

  // Extract props
  const props: Record<string, PropDefinition> = {};

  if (propsInterface) {
    const type = typeChecker.getTypeAtLocation(propsInterface);
    const properties = type.getProperties();

    for (const prop of properties) {
      const propDef = analyzeProperty(prop, typeChecker, themeValues);
      if (propDef && !isInternalProp(propDef.name)) {
        props[propDef.name] = propDef;
      }
    }
  }

  // Get description from the props interface JSDoc (single source of truth in types.ts)
  const description = interfaceDescription;

  // Determine category
  const category = inferCategory(componentName);

  // Look for docs.ts to extract sample props
  const sampleProps = extractSampleProps(dir);

  return {
    name: componentName,
    description,
    props,
    category,
    filePath: path.relative(process.cwd(), dir),
    sampleProps,
  };
}

/**
 * Extract sample props from docs.ts file if it exists.
 * The docs.ts file should export a `sampleProps` object.
 */
function extractSampleProps(dir: string): SampleProps | undefined {
  const docsPath = path.join(dir, 'docs.ts');

  if (!fs.existsSync(docsPath)) {
    return undefined;
  }

  try {
    const content = fs.readFileSync(docsPath, 'utf-8');

    // Create a simple TypeScript program to extract the sampleProps export
    const sourceFile = ts.createSourceFile(
      'docs.ts',
      content,
      ts.ScriptTarget.ES2020,
      true,
      ts.ScriptKind.TS
    );

    let samplePropsNode: ts.ObjectLiteralExpression | null = null;

    // Find the sampleProps export
    ts.forEachChild(sourceFile, (node) => {
      // Handle: export const sampleProps = { ... }
      if (ts.isVariableStatement(node)) {
        const isExported = node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
        if (isExported) {
          for (const decl of node.declarationList.declarations) {
            if (ts.isIdentifier(decl.name) && decl.name.text === 'sampleProps' && decl.initializer) {
              if (ts.isObjectLiteralExpression(decl.initializer)) {
                samplePropsNode = decl.initializer;
              }
            }
          }
        }
      }
    });

    if (!samplePropsNode) {
      return undefined;
    }

    // Extract the object literal as JSON-compatible structure
    // This is a simplified extraction - it handles basic literals
    const result: SampleProps = {};
    const propsNode = samplePropsNode as ts.ObjectLiteralExpression;

    for (const prop of propsNode.properties) {
      if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
        const propName = prop.name.text;

        if (propName === 'props' && ts.isObjectLiteralExpression(prop.initializer)) {
          result.props = extractObjectLiteral(prop.initializer, content);
        } else if (propName === 'children') {
          // For children, we store the raw source text
          result.children = prop.initializer.getText(sourceFile);
        } else if (propName === 'state' && ts.isObjectLiteralExpression(prop.initializer)) {
          // Extract state configuration for controlled components
          result.state = extractObjectLiteral(prop.initializer, content);
        }
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  } catch (e) {
    console.warn(`[component-analyzer] Error reading docs.ts in ${dir}:`, e);
    return undefined;
  }
}

/**
 * Extract an object literal to a plain object (for simple literal values).
 */
function extractObjectLiteral(node: ts.ObjectLiteralExpression, sourceContent: string): Record<string, any> {
  const result: Record<string, any> = {};

  for (const prop of node.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      const key = prop.name.text;
      const init = prop.initializer;

      if (ts.isStringLiteral(init)) {
        result[key] = init.text;
      } else if (ts.isNumericLiteral(init)) {
        result[key] = Number(init.text);
      } else if (init.kind === ts.SyntaxKind.TrueKeyword) {
        result[key] = true;
      } else if (init.kind === ts.SyntaxKind.FalseKeyword) {
        result[key] = false;
      } else if (ts.isArrayLiteralExpression(init)) {
        result[key] = extractArrayLiteral(init, sourceContent);
      } else if (ts.isObjectLiteralExpression(init)) {
        result[key] = extractObjectLiteral(init, sourceContent);
      } else {
        // For complex expressions (JSX, functions), store the raw source
        result[key] = init.getText();
      }
    }
  }

  return result;
}

/**
 * Extract an array literal to a plain array.
 */
function extractArrayLiteral(node: ts.ArrayLiteralExpression, sourceContent: string): any[] {
  const result: any[] = [];

  for (const element of node.elements) {
    if (ts.isStringLiteral(element)) {
      result.push(element.text);
    } else if (ts.isNumericLiteral(element)) {
      result.push(Number(element.text));
    } else if (element.kind === ts.SyntaxKind.TrueKeyword) {
      result.push(true);
    } else if (element.kind === ts.SyntaxKind.FalseKeyword) {
      result.push(false);
    } else if (ts.isObjectLiteralExpression(element)) {
      result.push(extractObjectLiteral(element, sourceContent));
    } else if (ts.isArrayLiteralExpression(element)) {
      result.push(extractArrayLiteral(element, sourceContent));
    } else {
      // For complex expressions, store raw source
      result.push(element.getText());
    }
  }

  return result;
}

/**
 * Analyze a single property symbol.
 */
function analyzeProperty(
  symbol: ts.Symbol,
  typeChecker: ts.TypeChecker,
  themeValues: ThemeValues
): PropDefinition | null {
  const name = symbol.getName();
  const declarations = symbol.getDeclarations();

  if (!declarations || declarations.length === 0) return null;

  const declaration = declarations[0];
  const type = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
  const typeString = typeChecker.typeToString(type);

  // Get JSDoc description
  const description = ts.displayPartsToString(symbol.getDocumentationComment(typeChecker)) || undefined;

  // Check if required
  const required = !(symbol.flags & ts.SymbolFlags.Optional);

  // Extract values for union types / theme types
  const values = extractPropValues(type, typeString, typeChecker, themeValues);

  // Extract default value (from JSDoc @default tag)
  const defaultValue = extractDefaultValue(symbol);

  return {
    name,
    type: simplifyTypeName(typeString),
    values: values.length > 0 ? values : undefined,
    default: defaultValue,
    description,
    required,
  };
}

/**
 * Extract valid values for a prop type.
 */
function extractPropValues(
  type: ts.Type,
  typeString: string,
  _typeChecker: ts.TypeChecker,
  themeValues: ThemeValues
): string[] {
  // Handle theme-derived types
  if (typeString === 'Intent' || typeString.includes('Intent')) {
    return themeValues.intents;
  }
  if (typeString === 'Size' || typeString.includes('Size')) {
    // Return generic sizes - most components use the same keys
    return ['xs', 'sm', 'md', 'lg', 'xl'];
  }

  // Handle union types
  if (type.isUnion()) {
    const values: string[] = [];
    for (const unionType of type.types) {
      if (unionType.isStringLiteral()) {
        values.push(unionType.value);
      } else if ((unionType as any).intrinsicName === 'true') {
        values.push('true');
      } else if ((unionType as any).intrinsicName === 'false') {
        values.push('false');
      }
    }
    if (values.length > 0) return values;
  }

  // Handle boolean
  if (typeString === 'boolean') {
    return ['true', 'false'];
  }

  return [];
}

/**
 * Extract default value from JSDoc @default tag.
 */
function extractDefaultValue(symbol: ts.Symbol): string | number | boolean | undefined {
  const tags = symbol.getJsDocTags();
  for (const tag of tags) {
    if (tag.name === 'default' && tag.text) {
      const value = ts.displayPartsToString(tag.text);
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
  }
  return undefined;
}

/**
 * Get JSDoc description from a node.
 */
function getJSDocDescription(node: ts.Node): string | undefined {
  const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;
  if (!jsDocs || jsDocs.length === 0) return undefined;

  const firstDoc = jsDocs[0];
  if (firstDoc.comment) {
    if (typeof firstDoc.comment === 'string') {
      return firstDoc.comment;
    }
    // Handle NodeArray of JSDocComment
    return (firstDoc.comment as ts.NodeArray<ts.JSDocComment>)
      .map(c => (c as any).text || '')
      .join('');
  }
  return undefined;
}

/**
 * Simplify type names for display.
 */
function simplifyTypeName(typeString: string): string {
  // Remove import paths
  typeString = typeString.replace(/import\([^)]+\)\./g, '');

  // Simplify common complex types
  if (typeString.includes('ReactNode')) return 'ReactNode';
  if (typeString.includes('StyleProp')) return 'Style';

  return typeString;
}

/**
 * Check if a prop should be excluded (internal/inherited).
 */
function isInternalProp(name: string): boolean {
  const internalProps = [
    'ref',
    'key',
    'children',
    'style',
    'testID',
    'nativeID',
    'accessible',
    'accessibilityActions',
    'accessibilityComponentType',
    'accessibilityElementsHidden',
    'accessibilityHint',
    'accessibilityIgnoresInvertColors',
    'accessibilityLabel',
    'accessibilityLabelledBy',
    'accessibilityLanguage',
    'accessibilityLiveRegion',
    'accessibilityRole',
    'accessibilityState',
    'accessibilityTraits',
    'accessibilityValue',
    'accessibilityViewIsModal',
    'collapsable',
    'focusable',
    'hasTVPreferredFocus',
    'hitSlop',
    'importantForAccessibility',
    'needsOffscreenAlphaCompositing',
    'onAccessibilityAction',
    'onAccessibilityEscape',
    'onAccessibilityTap',
    'onLayout',
    'onMagicTap',
    'onMoveShouldSetResponder',
    'onMoveShouldSetResponderCapture',
    'onResponderEnd',
    'onResponderGrant',
    'onResponderMove',
    'onResponderReject',
    'onResponderRelease',
    'onResponderStart',
    'onResponderTerminate',
    'onResponderTerminationRequest',
    'onStartShouldSetResponder',
    'onStartShouldSetResponderCapture',
    'pointerEvents',
    'removeClippedSubviews',
    'renderToHardwareTextureAndroid',
    'shouldRasterizeIOS',
    'tvParallaxMagnification',
    'tvParallaxProperties',
    'tvParallaxShiftDistanceX',
    'tvParallaxShiftDistanceY',
    'tvParallaxTiltAngle',
  ];

  return internalProps.includes(name) || name.startsWith('accessibility');
}

/**
 * Infer component category from name.
 */
function inferCategory(componentName: string): ComponentCategory {
  const formComponents = ['Button', 'Input', 'Checkbox', 'Select', 'Switch', 'RadioButton', 'Slider', 'TextArea'];
  const displayComponents = ['Text', 'Card', 'Badge', 'Chip', 'Avatar', 'Icon', 'Skeleton', 'Alert', 'Tooltip'];
  const layoutComponents = ['View', 'Screen', 'Divider'];
  const navigationComponents = ['TabBar', 'Breadcrumb', 'Menu', 'List', 'Link'];
  const overlayComponents = ['Dialog', 'Popover', 'Modal'];
  const dataComponents = ['Table', 'Progress', 'Accordion'];

  if (formComponents.includes(componentName)) return 'form';
  if (displayComponents.includes(componentName)) return 'display';
  if (layoutComponents.includes(componentName)) return 'layout';
  if (navigationComponents.includes(componentName)) return 'navigation';
  if (overlayComponents.includes(componentName)) return 'overlay';
  if (dataComponents.includes(componentName)) return 'data';

  return 'display'; // Default
}
