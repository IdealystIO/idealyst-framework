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
    const sizeKeys = Object.keys(themeValues.sizes)[0]
      ? Object.keys(themeValues.sizes[Object.keys(themeValues.sizes)[0]])
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
    navigation: {}, // Navigation types require ts-morph, not available dynamically
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

  // Try to load pre-generated types first
  const typesPath = path.join(__dirname, '../generated/types.json');

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
 * Synthesize a TypeScript interface string from a component's properties array.
 * Used as a fallback when typeDefinition is not available (e.g. dynamic generation
 * without ts-morph).
 */
function synthesizeTypeDefinition(component: any): string {
  const interfaceName = component.propsInterface || 'Props';
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
    const propType = prop.type || 'unknown';
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
 * Find the correct example file name (case-insensitive)
 */
function findExampleFile(componentName: string): string | null {
  const examplesDir = path.join(__dirname, '../../examples/components');

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
