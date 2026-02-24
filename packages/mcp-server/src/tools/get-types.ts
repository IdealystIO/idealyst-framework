/**
 * Get Types Tool
 *
 * Returns TypeScript type definitions for Idealyst components, theme, and navigation.
 * Enhanced with @idealyst/tooling registry data for authoritative prop values.
 *
 * Types are pre-generated at build time by scripts/extract-types.ts and bundled
 * as a static import — no runtime file system access or dynamic generation needed.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import generatedTypes from "../generated/types.json" with { type: "json" };

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
 * Load types from the bundled generated data
 */
function loadTypes(): TypesData {
  if (cachedTypes) {
    return cachedTypes;
  }
  cachedTypes = generatedTypes as unknown as TypesData;
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
