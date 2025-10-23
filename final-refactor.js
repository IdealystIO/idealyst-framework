const fs = require('fs');
const path = require('path');

/**
 * FINAL CAREFUL REFACTOR
 *
 * This script does everything in one pass:
 * 1. Remove deepMerge imports
 * 2. Remove expanded parameters
 * 3. Remove deepMerge calls
 * 4. ONLY inline createXStyles that have "return {" NOT "return ({"
 */

function processFile(filePath) {
    console.log(`\nProcessing: ${path.relative(process.cwd(), filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Step 1: Remove deepMerge import
    content = content.replace(
        /import\s+{\s*deepMerge\s*}\s+from\s+['"]\.\.\/utils\/deepMerge['"];?\s*\n/g,
        ''
    );
    console.log('  ✓ Removed deepMerge import');

    // Step 2: Remove expanded parameter from function signatures
    content = content.replace(
        /(const\s+create\w+Styles\s*=\s*\(theme:\s*Theme),\s*expanded:\s*Partial<[^>]+>/g,
        '$1'
    );

    // Step 3: Remove deepMerge wrappers
    content = content.replace(
        /deepMerge\s*\(\s*(\{[\s\S]*?\})\s*,\s*expanded\s*\)/g,
        '$1'
    );

    // Step 4: Remove expanded from createXStylesheet signatures
    content = content.replace(
        /(export\s+const\s+create\w+Stylesheet\s*=\s*\(theme:\s*Theme),\s*expanded\?:\s*Partial<[^>]+>/g,
        '$1'
    );

    // Step 5: Remove expanded?.prop || {} from calls
    content = content.replace(
        /(create\w+Styles)\s*\(\s*theme\s*,\s*expanded\?\.\w+\s*\|\|\s*\{\}\s*\)/g,
        '$1(theme)'
    );

    console.log('  ✓ Removed deepMerge calls and expanded parameters');

    // Step 6: Find and inline ONLY simple createXStyles functions
    // A simple function has pattern: const createXStyles = (theme: Theme) => { return { ... }; }
    // NOT: const createXStyles = (theme: Theme) => { return ({ ... }) => { ... }; }

    const simpleFunctionPattern = /\/\*\*[\s\S]*?\*\/\s*const\s+(create\w+Styles)\s*=\s*\(theme:\s*Theme\)(?::\s*\w+)?\s*=>\s*\{\s*return\s+(\{[\s\S]*?\});\s*\}/g;

    const functionsToInline = [];
    let match;

    while ((match = simpleFunctionPattern.exec(content)) !== null) {
        const funcName = match[1];
        const funcBody = match[2];
        const fullMatch = match[0];

        // Double-check: if the body contains ") =>" it's returning a function, skip it
        if (/\)\s*=>/.test(funcBody)) {
            console.log(`  ⊘ Skipping ${funcName} (returns a function)`);
            continue;
        }

        functionsToInline.push({
            name: funcName,
            body: funcBody,
            fullMatch: fullMatch
        });
        console.log(`  ✓ Found simple function to inline: ${funcName}`);
    }

    // Inline the simple functions
    functionsToInline.forEach(({ name, body }) => {
        // Replace calls in StyleSheet.create or createXStylesheet
        const callPattern = new RegExp(`(\\w+):\\s*${name}\\(theme\\),?`, 'g');
        content = content.replace(callPattern, (match, propName) => {
            console.log(`  ✓ Inlining ${name} as ${propName}`);
            return `${propName}: ${body},`;
        });
    });

    // Remove the inlined function definitions
    functionsToInline.forEach(({ fullMatch }) => {
        content = content.replace(fullMatch, '');
    });

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

    function findStyleFiles(dir) {
        const files = [];

        function walk(currentPath) {
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                if (entry.isDirectory()) {
                    walk(fullPath);
                } else if (entry.name.endsWith('.styles.tsx')) {
                    files.push(fullPath);
                }
            }
        }

        walk(dir);
        return files;
    }

    const styleFiles = findStyleFiles(componentsDir);
    console.log(`Found ${styleFiles.length} style files to process.\n`);

    styleFiles.forEach(file => {
        try {
            processFile(file);
        } catch (error) {
            console.error(`  ✗ Error processing ${file}:`, error.message);
        }
    });

    console.log('\n✓ All done!');
}

main();
