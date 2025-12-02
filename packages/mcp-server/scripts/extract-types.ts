#!/usr/bin/env tsx

/**
 * Extract Types Script
 *
 * Extracts TypeScript type information from @idealyst packages
 * and generates a JSON file for use by the MCP server.
 */

import { TypeExtractor } from './type-extractor.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🔍 Extracting types from Idealyst packages...\n');

  const extractor = new TypeExtractor();

  // Extract all component types
  console.log('📦 Extracting component types...');
  const components = extractor.extractAllComponents();
  console.log(`   Found ${Object.keys(components).length} components\n`);

  // Extract theme types
  console.log('🎨 Extracting theme types...');
  const themeTypes = extractor.extractThemeTypes();
  console.log(`   Found ${Object.keys(themeTypes).length} theme types\n`);

  // Extract navigation types
  console.log('🧭 Extracting navigation types...');
  const navigationTypes = extractor.extractNavigationTypes();
  console.log(`   Found ${Object.keys(navigationTypes).length} navigation types\n`);

  // Create output structure
  const output = {
    version: '1.0.93',
    extractedAt: new Date().toISOString(),
    components,
    theme: themeTypes,
    navigation: navigationTypes,
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
  console.log(`   Components: ${Object.keys(components).length}`);
  console.log(`   Theme Types: ${Object.keys(themeTypes).length}`);
  console.log(`   Navigation Types: ${Object.keys(navigationTypes).length}`);
  console.log(`   Total Props: ${Object.values(components).reduce((sum, c) => sum + c.props.length, 0)}`);
}

main().catch(error => {
  console.error('❌ Type extraction failed:', error);
  process.exit(1);
});
