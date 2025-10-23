const fs = require('fs');
const path = require('path');

/**
 * Final cleanup - remove ALL deepMerge and expanded usage
 * This handles both simple functions and functions that return functions
 */

function processFile(filePath) {
    console.log(`\nProcessing: ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Step 1: Remove deepMerge from imports (if still there)
    content = content.replace(
        /import\s+{\s*deepMerge\s*}\s+from\s+['"]\.\.\/utils\/deepMerge['"];?\s*\n/g,
        ''
    );

    // Step 2: Remove expanded parameter from ALL function signatures
    // Pattern: (theme: Theme, expanded: ...)
    content = content.replace(
        /\(theme:\s*Theme,\s*expanded:\s*Partial<[^>]+>\)/g,
        '(theme: Theme)'
    );

    // Step 3: Remove ALL deepMerge calls
    // Pattern: deepMerge({ ... }, expanded)
    // Replace with just the first argument
    let iterations = 0;
    let prevContent;
    do {
        prevContent = content;
        // Simple case: deepMerge({...}, expanded)
        content = content.replace(
            /deepMerge\s*\(\s*(\{[\s\S]*?\})\s*,\s*expanded\s*\)/g,
            '$1'
        );
        iterations++;
    } while (content !== prevContent && iterations < 10);

    // Step 4: Remove expanded from createXStylesheet signatures
    content = content.replace(
        /(export\s+const\s+create\w+Stylesheet\s*=\s*\(theme:\s*Theme),\s*expanded\?:\s*Partial<[^>]+>/g,
        '$1'
    );

    // Step 5: Remove expanded?.prop || {} from function calls
    content = content.replace(
        /(create\w+Styles)\s*\(\s*theme\s*,\s*expanded\?\.\w+\s*\|\|\s*\{\}\s*\)/g,
        '$1(theme)'
    );

    // Step 6: Remove expanded from simple function calls: createXStyles(theme, {})
    content = content.replace(
        /(create\w+Styles)\s*\(\s*theme\s*,\s*\{\}\s*\)/g,
        '$1(theme)'
    );

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('  ✓ Updated');
    } else {
        console.log('  ℹ No changes');
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
    console.log(`Processing ${styleFiles.length} files.\n`);

    styleFiles.forEach(file => {
        try {
            processFile(file);
        } catch (error) {
            console.error(`  ✗ Error: ${error.message}`);
        }
    });

    console.log('\n✓ All done!');
}

main();
