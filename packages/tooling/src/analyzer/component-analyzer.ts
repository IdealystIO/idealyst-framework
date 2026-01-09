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
  let foundInFile: ts.SourceFile | null = null;

  // Search each file for the props interface
  for (const filePath of tsFiles) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) continue;

    // First try the main props interface name
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === propsInterfaceName) {
        propsInterface = node;
        interfaceDescription = getJSDocDescription(node);
        foundInFile = sourceFile;
      }
      if (ts.isTypeAliasDeclaration(node) && node.name.text === propsInterfaceName) {
        propsInterface = node;
        interfaceDescription = getJSDocDescription(node);
        foundInFile = sourceFile;
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
            foundInFile = sourceFile;
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

  return {
    name: componentName,
    description,
    props,
    category,
    filePath: path.relative(process.cwd(), dir),
  };
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
  typeChecker: ts.TypeChecker,
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
