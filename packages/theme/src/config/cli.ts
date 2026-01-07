#!/usr/bin/env node
/**
 * Idealyst Style Generator CLI
 *
 * Reads idealyst.config.ts and generates flat Unistyles-compatible style files.
 *
 * Usage:
 *   npx ts-node packages/theme/src/config/cli.ts [config-path] [output-dir]
 *
 * Defaults:
 *   config-path: ./idealyst.config.ts
 *   output-dir:  ./generated
 */

import * as fs from 'fs';
import * as path from 'path';

// Dynamic import for ESM compatibility
async function main() {
    const args = process.argv.slice(2);
    const configPath = args[0] || './idealyst.config.ts';
    const outputDir = args[1] || './generated';

    console.log('🎨 Idealyst Style Generator');
    console.log(`   Config: ${configPath}`);
    console.log(`   Output: ${outputDir}`);
    console.log('');

    // Resolve paths
    const resolvedConfigPath = path.resolve(process.cwd(), configPath);
    const resolvedOutputDir = path.resolve(process.cwd(), outputDir);

    // Check config exists
    if (!fs.existsSync(resolvedConfigPath)) {
        console.error(`❌ Config file not found: ${resolvedConfigPath}`);
        console.error('');
        console.error('Create an idealyst.config.ts file with your theme configuration.');
        console.error('See the documentation for examples.');
        process.exit(1);
    }

    // Import config dynamically
    // Note: This requires ts-node or a pre-compiled config
    let config;
    try {
        // Try to import the config
        const configModule = await import(resolvedConfigPath);
        config = configModule.default || configModule;
    } catch (err) {
        console.error(`❌ Failed to load config: ${err}`);
        console.error('');
        console.error('Make sure your config file:');
        console.error('  1. Is a valid TypeScript/JavaScript file');
        console.error('  2. Uses export default or named exports');
        console.error('  3. Has all required theme properties');
        process.exit(1);
    }

    // Validate config
    if (!config.themes || !config.themes.light || !config.themes.dark) {
        console.error('❌ Invalid config: themes.light and themes.dark are required');
        process.exit(1);
    }

    // Import generator
    const { generateStyles } = await import('./generator');

    // Generate styles
    console.log('⚙️  Generating styles...');
    const files = generateStyles(config);

    // Ensure output directory exists
    if (!fs.existsSync(resolvedOutputDir)) {
        fs.mkdirSync(resolvedOutputDir, { recursive: true });
    }

    // Write files
    for (const [filename, content] of Object.entries(files)) {
        const filePath = path.join(resolvedOutputDir, filename);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`   ✓ ${filename}`);
    }

    console.log('');
    console.log(`✅ Generated ${Object.keys(files).length} files in ${outputDir}`);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Import the generated unistyles.generated.ts in your app entry');
    console.log('  2. Update components to import from generated style files');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
