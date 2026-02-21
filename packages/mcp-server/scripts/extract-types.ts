#!/usr/bin/env tsx

/**
 * Extract Types Script
 *
 * Extracts TypeScript type information from @idealyst packages
 * and generates a JSON file for use by the MCP server.
 *
 * Uses @idealyst/tooling for component registry generation (single source of truth)
 * and the legacy TypeExtractor for detailed type definitions.
 */

import { TypeExtractor } from './type-extractor.js';
import { analyzeComponents, analyzeTheme } from '@idealyst/tooling';
import type { ComponentRegistry, ThemeValues } from '@idealyst/tooling';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🔍 Extracting types from Idealyst packages...\n');

  const extractor = new TypeExtractor();

  // ============================================================
  // Extract component registry using @idealyst/tooling
  // This is the single source of truth for props and values
  // ============================================================
  console.log('📦 Extracting component registry via @idealyst/tooling...');
  let componentRegistry: ComponentRegistry = {};
  let themeValues: ThemeValues | null = null;

  try {
    // Paths relative to scripts/ → mcp-server/ → packages/
    const componentsPath = path.resolve(__dirname, '../../components/src');
    const themePath = path.resolve(__dirname, '../../theme/src/lightTheme.ts');

    componentRegistry = analyzeComponents({
      componentPaths: [componentsPath],
      themePath,
    });
    console.log(`   Generated registry with ${Object.keys(componentRegistry).length} components\n`);

    // Also extract theme values
    console.log('🎨 Extracting theme values via @idealyst/tooling...');
    themeValues = analyzeTheme(themePath, false);
    console.log(`   Found ${themeValues.intents.length} intents, ${Object.keys(themeValues.sizes).length} size groups\n`);
  } catch (error) {
    console.error('   Warning: Could not use @idealyst/tooling, falling back to legacy extractor');
    console.error(`   Error: ${error instanceof Error ? error.message : error}\n`);
  }

  // ============================================================
  // Legacy extraction for detailed type definitions
  // ============================================================
  console.log('📝 Extracting detailed type definitions...');
  const components = extractor.extractAllComponents();
  console.log(`   Found ${Object.keys(components).length} components\n`);

  // Extract theme types
  console.log('🎨 Extracting theme type definitions...');
  const themeTypes = extractor.extractThemeTypes();
  console.log(`   Found ${Object.keys(themeTypes).length} theme types\n`);

  // Extract navigation types
  console.log('🧭 Extracting navigation types...');
  const navigationTypes = extractor.extractNavigationTypes();
  console.log(`   Found ${Object.keys(navigationTypes).length} navigation types\n`);

  // ============================================================
  // Merge: Tooling registry provides authoritative prop values,
  // legacy extractor provides detailed type definitions
  // ============================================================
  const mergedComponents: Record<string, any> = {};

  for (const [name, legacyData] of Object.entries(components)) {
    const registryData = componentRegistry[name];

    mergedComponents[name] = {
      ...legacyData,
      // Add registry data for prop values (authoritative source)
      registry: registryData || null,
    };
  }

  // Add any components from registry that weren't in legacy extractor
  for (const [name, registryData] of Object.entries(componentRegistry)) {
    if (!mergedComponents[name]) {
      mergedComponents[name] = {
        propsInterface: `${name}Props`,
        props: Object.entries(registryData.props).map(([propName, prop]) => ({
          name: propName,
          type: prop.type,
          required: prop.required,
          description: prop.description,
        })),
        typeDefinition: '',
        relatedTypes: {},
        registry: registryData,
      };
    }
  }

  // Create output structure
  const output = {
    version: '1.0.93',
    extractedAt: new Date().toISOString(),
    components: mergedComponents,
    theme: themeTypes,
    navigation: navigationTypes,
    // New: Include the authoritative registry data
    registry: {
      components: componentRegistry,
      themeValues,
    },
  };

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../src/generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON file
  const outputPath = path.join(outputDir, 'types.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`✅ Type extraction complete!`);
  console.log(`   Output: ${outputPath}\n`);

  // Print summary
  console.log('📊 Summary:');
  console.log(`   Components: ${Object.keys(mergedComponents).length}`);
  console.log(`   Registry Components: ${Object.keys(componentRegistry).length}`);
  console.log(`   Theme Types: ${Object.keys(themeTypes).length}`);
  console.log(`   Navigation Types: ${Object.keys(navigationTypes).length}`);
  console.log(`   Total Props: ${Object.values(mergedComponents).reduce((sum: number, c: any) => sum + (c.props?.length || 0), 0)}`);

  if (themeValues) {
    console.log(`   Theme Intents: ${themeValues.intents.join(', ')}`);
  }
}

main().catch(error => {
  console.error('❌ Type extraction failed:', error);
  process.exit(1);
});
