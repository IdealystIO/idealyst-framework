/**
 * Get Types Tool
 *
 * Returns TypeScript type definitions for Idealyst components, theme, and navigation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TypesData {
  version: string;
  extractedAt: string;
  components: Record<string, any>;
  theme: Record<string, any>;
  navigation: Record<string, any>;
}

let cachedTypes: TypesData | null = null;

/**
 * Load extracted types from JSON file
 */
function loadTypes(): TypesData {
  if (cachedTypes) {
    return cachedTypes;
  }

  const typesPath = path.join(__dirname, '../generated/types.json');

  if (!fs.existsSync(typesPath)) {
    throw new Error(
      'Types file not found. Please run "yarn extract-types" to generate type definitions.'
    );
  }

  const content = fs.readFileSync(typesPath, 'utf-8');
  cachedTypes = JSON.parse(content);

  return cachedTypes!;
}

/**
 * Get component types by name
 */
export function getComponentTypes(componentName: string, format: 'typescript' | 'json' | 'both' = 'both') {
  const types = loadTypes();
  const component = types.components[componentName];

  if (!component) {
    throw new Error(
      `Component "${componentName}" not found. Available components: ${Object.keys(types.components).join(', ')}`
    );
  }

  const result: any = {
    component: componentName,
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
      .map(([name, info]: [string, any]) => info.definition)
      .join('\n\n');
    result.typescript = tsOutput;
  }

  if (format === 'json' || format === 'both') {
    result.schema = types.theme;
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
      .map(([name, definition]) => definition)
      .join('\n\n');
    result.typescript = tsOutput;
  }

  if (format === 'json' || format === 'both') {
    result.schema = types.navigation;
  }

  return result;
}

/**
 * Format TypeScript output for better readability
 */
function formatTypeScriptOutput(component: any): string {
  const sections: string[] = [];

  // Main props interface
  sections.push(`// ${component.propsInterface}`);
  sections.push(component.typeDefinition);

  // Related types
  if (Object.keys(component.relatedTypes).length > 0) {
    sections.push('\n// Related Types');
    for (const [name, definition] of Object.entries(component.relatedTypes)) {
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
 * Get examples for a component
 */
export function getComponentExamples(componentName: string): string | null {
  const examplesPath = path.join(
    __dirname,
    `../../examples/components/${componentName}.examples.tsx`
  );

  if (!fs.existsSync(examplesPath)) {
    return null;
  }

  return fs.readFileSync(examplesPath, 'utf-8');
}
