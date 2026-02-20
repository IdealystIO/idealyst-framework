/**
 * Get Types Tool
 *
 * Returns TypeScript type definitions for Idealyst components, theme, and navigation.
 * Enhanced with @idealyst/tooling registry data for authoritative prop values.
 *
 * Types are generated dynamically at runtime using @idealyst/tooling if the
 * pre-generated types.json file is not found.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { analyzeComponents, analyzeTheme } from '@idealyst/tooling';
import type { ComponentRegistry, ThemeValues } from '@idealyst/tooling';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TypesData {
  version: string;
  extractedAt: string;
  components: Record<string, any>;
  theme: Record<string, any>;
  navigation: Record<string, any>;
  // Registry data from @idealyst/tooling (single source of truth)
  registry?: {
    components: Record<string, any>;
    themeValues: any;
  };
}

let cachedTypes: TypesData | null = null;

/**
 * Find the monorepo root by looking for package.json with workspaces
 */
function findMonorepoRoot(): string | null {
  // Start from the mcp-server package location
  let currentDir = path.resolve(__dirname, '../..');

  // Walk up looking for the monorepo root (has workspaces in package.json)
  for (let i = 0; i < 10; i++) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (pkg.workspaces) {
          return currentDir;
        }
      } catch {
        // Continue searching
      }
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  return null;
}

/**
 * Find package paths - works with both symlinked monorepo and installed packages
 */
function findPackagePaths(): { componentsPath: string; themePath: string } | null {
  // First try: resolve via node_modules (works for symlinked monorepo)
  try {
    const componentsEntry = require.resolve('@idealyst/components');
    const themeEntry = require.resolve('@idealyst/theme');

    // Get the src directories
    const componentsPath = path.join(path.dirname(componentsEntry), '..', 'src');
    const themePath = path.join(path.dirname(themeEntry), '..', 'src', 'lightTheme.ts');

    if (fs.existsSync(componentsPath) && fs.existsSync(themePath)) {
      return { componentsPath, themePath };
    }
  } catch {
    // Not found via require.resolve
  }

  // Second try: look for monorepo structure
  const monorepoRoot = findMonorepoRoot();
  if (monorepoRoot) {
    const componentsPath = path.join(monorepoRoot, 'packages/components/src');
    const themePath = path.join(monorepoRoot, 'packages/theme/src/lightTheme.ts');

    if (fs.existsSync(componentsPath) && fs.existsSync(themePath)) {
      return { componentsPath, themePath };
    }
  }

  return null;
}

/**
 * Static navigation types - hardcoded since dynamic extraction requires ts-morph.
 * These map to the actual exports from @idealyst/navigation.
 */
function getStaticNavigationTypes(): Record<string, string> {
  return {
    NavigatorProvider: `// NavigatorProvider — Root navigation component
import type { NavigatorParam } from '@idealyst/navigation';

type NavigatorProviderProps = {
  route: NavigatorParam;
  floatingComponent?: React.ReactNode;
};

// Usage: <NavigatorProvider route={routeConfig} />`,

    NavigateParams: `// NavigateParams — Used with navigate() and replace()
type NavigateParams = {
  path: string;
  vars?: Record<string, string>;
  replace?: boolean;
  state?: Record<string, string | number | boolean>;
};`,

    useNavigator: `// useNavigator() — Navigation hook
// Returns: { navigate, replace, canGoBack, goBack }
type NavigatorContextValue = {
  navigate: (params: NavigateParams) => void;
  replace: (params: Omit<NavigateParams, 'replace'>) => void;
  canGoBack: () => boolean;
  goBack: () => void;
};

// Usage:
// const { navigate, goBack, canGoBack } = useNavigator();
// navigate({ path: '/detail', vars: { id: '123' } });
// navigate({ path: '/home', state: { tab: 'recent' } });`,

    useParams: `// useParams() — Get route parameters
// Returns Record<string, string | undefined>
// NOTE: Does NOT accept type parameters. Use type assertion if needed.
// const params = useParams();
// const id = params.id; // string | undefined`,

    useNavigationState: `// useNavigationState<T>() — Get navigation state data
// Returns T (defaults to Record<string, unknown>)
// Always provide a type parameter:
// const state = useNavigationState<{ autostart?: boolean }>();`,

    useCurrentPath: `// useCurrentPath() — Get current route path as string
// const path = useCurrentPath(); // '/users/123'`,

    RouteConfig: `// Route Configuration Types
type ScreenParam = {
  path: string;
  type: 'screen';
  component: React.ComponentType;
  options?: ScreenOptions;
};

type ScreenOptions = {
  title?: string;
  headerShown?: boolean;
  fullScreen?: boolean;
  headerTitle?: React.ComponentType | React.ReactElement | string;
  headerLeft?: React.ComponentType | React.ReactElement;
  headerRight?: React.ComponentType | React.ReactElement;
  headerBackVisible?: boolean;
};

type TabBarScreenOptions = ScreenOptions & {
  tabBarIcon?: (props: { focused: boolean; color: string; size: string | number }) => React.ReactElement;
  tabBarLabel?: string;
  tabBarBadge?: string | number;
  tabBarVisible?: boolean;
};

type TabNavigatorParam = {
  path: string;
  type: 'navigator';
  layout: 'tab';
  routes: RouteParam[];
  options?: TabBarScreenOptions;
};

type StackNavigatorParam = {
  path: string;
  type: 'navigator';
  layout: 'stack';
  routes: RouteParam[];
  options?: ScreenOptions;
};

type DrawerNavigatorParam = {
  path: string;
  type: 'navigator';
  layout: 'drawer';
  routes: RouteParam[];
  options?: TabBarScreenOptions;
  sidebarComponent?: React.ComponentType;
};

type NavigatorParam = TabNavigatorParam | StackNavigatorParam | DrawerNavigatorParam;
type RouteParam = NavigatorParam | ScreenParam;`,
  };
}

/**
 * Generate types dynamically using @idealyst/tooling
 */
function generateTypes(): TypesData {
  const paths = findPackagePaths();

  if (!paths) {
    throw new Error(
      'Could not find @idealyst/components and @idealyst/theme packages. ' +
        'Ensure you are running in the Idealyst monorepo or have the packages installed.'
    );
  }

  const { componentsPath, themePath } = paths;

  // Analyze components using @idealyst/tooling
  let componentRegistry: ComponentRegistry = {};
  let themeValues: ThemeValues | null = null;

  try {
    componentRegistry = analyzeComponents({
      componentPaths: [componentsPath],
      themePath,
    });
  } catch (error) {
    console.warn('[mcp-server] Warning: Could not analyze components:', error);
  }

  try {
    themeValues = analyzeTheme(themePath, false);
  } catch (error) {
    console.warn('[mcp-server] Warning: Could not analyze theme:', error);
  }

  // Convert component registry to the expected format
  const components: Record<string, any> = {};
  for (const [name, def] of Object.entries(componentRegistry)) {
    components[name] = {
      propsInterface: `${name}Props`,
      props: Object.entries(def.props).map(([propName, prop]) => ({
        name: propName,
        type: prop.type,
        required: prop.required,
        description: prop.description,
        values: prop.values,
        default: prop.default,
      })),
      typeDefinition: '', // Not available without ts-morph
      relatedTypes: {},
      registry: def,
    };
  }

  // Build theme types from themeValues
  const theme: Record<string, any> = {};
  if (themeValues) {
    theme.Intent = {
      name: 'Intent',
      definition: `type Intent = ${themeValues.intents.map((i) => `'${i}'`).join(' | ')};`,
      values: themeValues.intents,
    };

    // Extract size keys from the first size group
    // themeValues.sizes is Record<string, string[]> — the values are string arrays, not objects
    const firstSizeGroup = Object.keys(themeValues.sizes)[0];
    const sizeKeys = firstSizeGroup
      ? (themeValues.sizes as Record<string, string[]>)[firstSizeGroup]
      : ['xs', 'sm', 'md', 'lg', 'xl'];
    theme.Size = {
      name: 'Size',
      definition: `type Size = ${sizeKeys.map((s) => `'${s}'`).join(' | ')};`,
      values: sizeKeys,
    };
  }

  return {
    version: 'dynamic',
    extractedAt: new Date().toISOString(),
    components,
    theme,
    navigation: getStaticNavigationTypes(),
    registry: {
      components: componentRegistry,
      themeValues,
    },
  };
}

/**
 * Load types from JSON file or generate dynamically
 */
function loadTypes(): TypesData {
  if (cachedTypes) {
    return cachedTypes;
  }

  // Try to load pre-generated types first (works for both bundled and source)
  const pkgRoot = findPackageRoot();
  const typesPath = path.join(pkgRoot, 'src/generated/types.json');

  if (fs.existsSync(typesPath)) {
    try {
      const content = fs.readFileSync(typesPath, 'utf-8');
      cachedTypes = JSON.parse(content);
      return cachedTypes!;
    } catch (error) {
      console.warn('[mcp-server] Warning: Could not parse types.json, generating dynamically');
    }
  }

  // Generate types dynamically
  cachedTypes = generateTypes();
  return cachedTypes;
}

/**
 * Find the canonical component name from types data (case-insensitive)
 */
/** Deprecated component names that should redirect to their replacements */
const deprecatedAliases: Record<string, string> = {
  Input: "TextInput",
};

function findComponentNameInTypes(types: TypesData, componentName: string): string | undefined {
  // Direct match first (fast path)
  if (types.components[componentName]) {
    // Redirect deprecated components to their replacements
    return deprecatedAliases[componentName] ?? componentName;
  }

  // Case-insensitive lookup
  const lowerName = componentName.toLowerCase();
  const match = Object.keys(types.components).find(
    (name) => name.toLowerCase() === lowerName
  );

  if (match) {
    // Redirect deprecated components to their replacements
    return deprecatedAliases[match] ?? match;
  }

  return undefined;
}

/**
 * Get component types by name (case-insensitive)
 */
export function getComponentTypes(componentName: string, format: 'typescript' | 'json' | 'both' = 'both') {
  const types = loadTypes();
  const canonicalName = findComponentNameInTypes(types, componentName);

  if (!canonicalName) {
    throw new Error(
      `Component "${componentName}" not found. Available components: ${Object.keys(types.components).join(', ')}`
    );
  }

  const component = types.components[canonicalName];

  const result: any = {
    component: canonicalName,
  };

  if (format === 'typescript' || format === 'both') {
    result.typescript = formatTypeScriptOutput(component);
  }

  if (format === 'json' || format === 'both') {
    result.schema = {
      propsInterface: component.propsInterface,
      props: component.props,
      relatedTypes: component.relatedTypes,
    };

    // Include registry data if available (authoritative prop values)
    if (component.registry) {
      result.registry = component.registry;
    }
  }

  return result;
}

/**
 * Get theme types
 */
export function getThemeTypes(format: 'typescript' | 'json' | 'both' = 'both') {
  const types = loadTypes();

  const result: any = {
    name: 'Theme Types',
  };

  if (format === 'typescript' || format === 'both') {
    const tsOutput = Object.entries(types.theme)
      .map(([_, info]: [string, any]) => info.definition)
      .join('\n\n');
    result.typescript = tsOutput;
  }

  if (format === 'json' || format === 'both') {
    result.schema = types.theme;

    // Include authoritative theme values from registry if available
    if (types.registry?.themeValues) {
      result.themeValues = types.registry.themeValues;
    }
  }

  return result;
}

/**
 * Get navigation types
 */
export function getNavigationTypes(format: 'typescript' | 'json' | 'both' = 'both') {
  const types = loadTypes();

  const result: any = {
    name: 'Navigation Types',
  };

  if (format === 'typescript' || format === 'both') {
    const tsOutput = Object.entries(types.navigation)
      .map(([_, definition]) => definition)
      .join('\n\n');
    result.typescript = tsOutput;
  }

  if (format === 'json' || format === 'both') {
    result.schema = types.navigation;
  }

  return result;
}

/**
 * Known type resolutions for props that the @idealyst/tooling analyzer reports as `any`.
 * The analyzer cannot resolve types imported from @idealyst/theme, so we map them here.
 * Key format: "ComponentName.propName" or just "propName" for global matches.
 */
const KNOWN_PROP_TYPES: Record<string, string> = {
  // Icon-specific
  'Icon.size': "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number",
  'Icon.intent': "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'",
  'Icon.color': "Color /* e.g. 'blue.500', 'red.300' — use intent for semantic coloring */",
  'Icon.textColor': "'primary' | 'secondary' | 'tertiary' | 'inverse'",
  // Global fallbacks for common prop names when type is 'any'
  'size': "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
  'intent': "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'",
};

/**
 * Resolve a prop's type, replacing 'any' with known concrete types where possible.
 */
function resolveAnyType(componentName: string, propName: string, rawType: string): string {
  if (rawType !== 'any') return rawType;
  return KNOWN_PROP_TYPES[`${componentName}.${propName}`]
    ?? KNOWN_PROP_TYPES[propName]
    ?? rawType;
}

/**
 * Synthesize a TypeScript interface string from a component's properties array.
 * Used as a fallback when typeDefinition is not available (e.g. dynamic generation
 * without ts-morph).
 */
function synthesizeTypeDefinition(component: any): string {
  const interfaceName = component.propsInterface || 'Props';
  const componentName = interfaceName.replace(/Props$/, '');
  const props: any[] = component.props || [];

  if (props.length === 0) {
    return `interface ${interfaceName} {}`;
  }

  const lines: string[] = [];
  lines.push(`interface ${interfaceName} {`);

  for (const prop of props) {
    // Add JSDoc comment with description and default value
    const docParts: string[] = [];
    if (prop.description) {
      docParts.push(prop.description);
    }
    if (prop.defaultValue !== undefined && prop.defaultValue !== null) {
      docParts.push(`@default ${prop.defaultValue}`);
    } else if (prop.default !== undefined && prop.default !== null) {
      docParts.push(`@default ${prop.default}`);
    }

    if (docParts.length > 0) {
      if (docParts.length === 1) {
        lines.push(`  /** ${docParts[0]} */`);
      } else {
        lines.push('  /**');
        for (const part of docParts) {
          lines.push(`   * ${part}`);
        }
        lines.push('   */');
      }
    }

    const optional = prop.required ? '' : '?';
    const propType = resolveAnyType(componentName, prop.name, prop.type || 'unknown');
    lines.push(`  ${prop.name}${optional}: ${propType};`);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Format TypeScript output for better readability
 */
function formatTypeScriptOutput(component: any): string {
  const sections: string[] = [];

  // Main props interface
  sections.push(`// ${component.propsInterface}`);

  if (component.typeDefinition) {
    sections.push(component.typeDefinition);
  } else {
    // typeDefinition is empty — synthesize from properties data
    sections.push(synthesizeTypeDefinition(component));
  }

  // Related types
  if (Object.keys(component.relatedTypes).length > 0) {
    sections.push('\n// Related Types');
    for (const [_, definition] of Object.entries(component.relatedTypes)) {
      sections.push(definition as string);
    }
  }

  return sections.join('\n\n');
}

/**
 * Get list of all available components
 */
export function getAvailableComponents() {
  const types = loadTypes();
  return Object.keys(types.components);
}

/**
 * Find the mcp-server package root directory.
 * After bundling, __dirname points to dist/ (one level deep), but the source
 * code assumes dist/tools/ (two levels deep). This helper finds the package
 * root reliably regardless of bundling by walking up from __dirname.
 */
function findPackageRoot(): string {
  let dir = __dirname;
  for (let i = 0; i < 5; i++) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.name === '@idealyst/mcp-server') {
          return dir;
        }
      } catch {
        // continue
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: assume __dirname is dist/ or src/tools/
  return path.resolve(__dirname, '../..');
}

/**
 * Find the correct example file name (case-insensitive)
 */
function findExampleFile(componentName: string): string | null {
  const examplesDir = path.join(findPackageRoot(), 'examples/components');

  // Direct match first (fast path)
  const directPath = path.join(examplesDir, `${componentName}.examples.tsx`);
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  // Case-insensitive lookup
  if (!fs.existsSync(examplesDir)) {
    return null;
  }

  const lowerName = componentName.toLowerCase();
  const files = fs.readdirSync(examplesDir);
  const match = files.find(
    (file) => file.toLowerCase() === `${lowerName}.examples.tsx`
  );

  return match ? path.join(examplesDir, match) : null;
}

/**
 * Get examples for a component (case-insensitive)
 */
export function getComponentExamples(componentName: string): string | null {
  const examplesPath = findExampleFile(componentName);

  if (!examplesPath) {
    return null;
  }

  return fs.readFileSync(examplesPath, 'utf-8');
}

/**
 * Get the full component registry from @idealyst/tooling
 * This is the single source of truth for component props and values
 */
export function getComponentRegistry() {
  const types = loadTypes();
  return types.registry?.components || {};
}

/**
 * Get theme values from the registry
 * This is the single source of truth for available intents, sizes, etc.
 */
export function getRegistryThemeValues() {
  const types = loadTypes();
  return types.registry?.themeValues || null;
}
