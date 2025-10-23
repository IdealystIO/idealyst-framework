const fs = require('fs');
const path = require('path');

/**
 * Phase 3: Remove createXStylesheet functions
 *
 * This script:
 * 1. Extracts the return object from createXStylesheet
 * 2. Inlines it directly into the main StyleSheet.create
 * 3. Removes the createXStylesheet function
 * 4. Removes individual export StyleSheet.create functions that use createXStylesheet
 */

function extractStylesheetBody(content) {
    // Match: export const createXStylesheet = (theme: Theme): Type => {
    //   return {
    //     prop1: value1,
    //     prop2: value2,
    //   };
    // }

    const pattern = /export\s+const\s+create\w+Stylesheet\s*=\s*\(theme:\s*Theme\)\s*:\s*\w+\s*=>\s*\{\s*return\s*\{([\s\S]*?)\};\s*\}/;
    const match = content.match(pattern);

    if (!match) return null;

    return match[1].trim();
}

function processFile(filePath) {
    console.log(`\nProcessing: ${path.relative(process.cwd(), filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Check if file has createXStylesheet
    if (!/export\s+const\s+create\w+Stylesheet/.test(content)) {
        console.log('  ℹ No createXStylesheet found');
        return;
    }

    // Extract the stylesheet body
    const stylesheetBody = extractStylesheetBody(content);
    if (!stylesheetBody) {
        console.log('  ⚠ Could not extract stylesheet body');
        return;
    }

    console.log('  Found createXStylesheet function');

    // Replace the main StyleSheet.create to inline the body directly
    // Pattern: export const xStyles = StyleSheet.create((theme: Theme) => {
    //   const stylesheet = createXStylesheet(theme);
    //   return {
    //     prop1: stylesheet.prop1,
    //     ...
    //   };
    // });

    const mainStylesPattern = /(export\s+const\s+\w+Styles\s+=\s+StyleSheet\.create\(\(theme:\s*Theme\)\s+=>\s+\{)\s*const\s+stylesheet\s+=\s+create\w+Stylesheet\(theme\);\s*return\s*\{[\s\S]*?\};/;

    content = content.replace(mainStylesPattern, (match, prefix) => {
        console.log('  Inlining stylesheet body into main StyleSheet.create');
        return `${prefix}\n    return {\n        ${stylesheetBody}\n    };`;
    });

    // Remove the createXStylesheet function
    const removeStylesheetPattern = /\/\*\*[\s\S]*?\*\/\s*export\s+const\s+create\w+Stylesheet\s*=\s*\(theme:\s*Theme\)\s*:\s*\w+\s*=>\s*\{[\s\S]*?\n\};\s*\n/;
    content = content.replace(removeStylesheetPattern, '');
    console.log('  Removed createXStylesheet function');

    // Remove individual export StyleSheet.create functions
    // Pattern: export const xSomethingStyles = StyleSheet.create((theme: Theme) => {
    //   const styles = createXStylesheet(theme);
    //   return { ... };
    // });

    const individualExportPattern = /export\s+const\s+\w+(?:Container|Icon|Content|Title|Message|Actions|CloseButton|Close|Header|Item|Label|Separator|Menu|Tab|Indicator|Table|Row|Cell|Textarea|Footer|Character)Styles\s+=\s+StyleSheet\.create\(\(theme:\s*Theme\)\s+=>\s+\{[\s\S]*?create\w+Stylesheet\(theme\);[\s\S]*?\}\);\s*\n/g;

    const removedCount = (content.match(individualExportPattern) || []).length;
    if (removedCount > 0) {
        content = content.replace(individualExportPattern, '');
        console.log(`  Removed ${removedCount} individual export StyleSheet.create functions`);
    }

    // Clean up the comment if it's orphaned
    content = content.replace(/\/\/ Export individual style sheets for backwards compatibility\s*\n+/g, '');

    // Clean up extra blank lines
    content = content.replace(/\n\n\n+/g, '\n\n');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('  ✓ Updated file');
    } else {
        console.log('  ℹ No changes made');
    }
}

function main() {
    const componentsDir = path.join(__dirname, 'packages/components/src');

    // Only process files that have createXStylesheet pattern
    const filesToProcess = [
        'Accordion/Accordion.styles.tsx',
        'Alert/Alert.styles.tsx',
        'Breadcrumb/Breadcrumb.styles.tsx',
        'Dialog/Dialog.styles.tsx',
        'List/List.styles.tsx',
        'Menu/Menu.styles.tsx',
        'Menu/MenuItem.styles.tsx',
        'TabBar/TabBar.styles.tsx',
        'Table/Table.styles.tsx',
        'TextArea/TextArea.styles.tsx',
    ];

    console.log(`Processing ${filesToProcess.length} files with createXStylesheet pattern.\n`);

    filesToProcess.forEach(relativePath => {
        const fullPath = path.join(componentsDir, relativePath);
        if (fs.existsSync(fullPath)) {
            try {
                processFile(fullPath);
            } catch (error) {
                console.error(`  ✗ Error processing ${relativePath}:`, error.message);
                console.error(error.stack);
            }
        } else {
            console.log(`  ⚠ File not found: ${relativePath}`);
        }
    });

    console.log('\n✓ Done with Phase 3!');
}

main();
