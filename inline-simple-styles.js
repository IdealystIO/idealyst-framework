const fs = require('fs');
const path = require('path');

/**
 * Phase 2: Inline simple createXStyles functions
 *
 * This script:
 * 1. Finds createXStyles functions that return plain objects (not functions)
 * 2. Inlines their return values directly into StyleSheet.create
 * 3. Removes those simple createXStyles functions
 * 4. Keeps createXStyles functions that return functions (with variants)
 */

function extractObjectBody(code, functionName) {
    // Match: const createXStyles = (theme: Theme): Type => { return { ... }; }
    // or: const createXStyles = (theme: Theme): Type => ({ ... })

    const pattern = new RegExp(
        `const\\s+${functionName}\\s*=\\s*\\(theme:\\s*Theme\\)\\s*(?::\\s*[^=]+)?\\s*=>\\s*\\{?\\s*(?:return\\s+)?([\\s\\S]*?)\\s*;?\\s*\\}?\\s*(?=\\n\\n|\\/\\*\\*|const\\s+create|export|$)`,
        'g'
    );

    const match = pattern.exec(code);
    if (!match) return null;

    let body = match[1].trim();

    // Clean up the body
    if (body.startsWith('(') && body.endsWith(')')) {
        body = body.slice(1, -1).trim();
    }
    if (body.endsWith(';')) {
        body = body.slice(0, -1).trim();
    }
    if (body.endsWith('}')) {
        const lastBrace = body.lastIndexOf('}');
        const checkAfter = body.slice(lastBrace + 1).trim();
        if (checkAfter === '') {
            // This is likely an extra closing brace
            body = body.slice(0, lastBrace + 1);
        }
    }

    return body;
}

function isSimpleFunction(code, functionName) {
    // A simple function returns a plain object, not a function
    // Pattern: const createXStyles = (theme: Theme) => { return { ... }; }
    // NOT: const createXStyles = (theme: Theme) => { return ({ ... }) => { ... }; }

    const pattern = new RegExp(
        `const\\s+${functionName}\\s*=\\s*\\(theme:\\s*Theme\\)[\\s\\S]*?=>([\\s\\S]*?)(?=\\n\\n|\\/\\*\\*|const\\s+create|export|$)`,
        'g'
    );

    const match = pattern.exec(code);
    if (!match) return false;

    const body = match[1];

    // Check if the body contains "=>" which indicates it returns a function
    // But we need to be careful about arrow functions in object properties
    const lines = body.split('\n');
    for (const line of lines) {
        // If we see "return ({ ... }) =>" or "return (params) =>" it's not simple
        if (/return\s+\([^)]*\)\s*=>/.test(line)) {
            return false;
        }
        // If we see just "return (" at the start followed by "}) =>" later, it's not simple
        if (/\)\s*=>\s*\{/.test(line) && !line.trim().startsWith('//')) {
            return false;
        }
    }

    return true;
}

function processFile(filePath) {
    console.log(`\nProcessing: ${path.relative(process.cwd(), filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Find all createXStyles functions
    const functionsToInline = [];
    const functionPattern = /const\s+(create\w+Styles)\s*=\s*\(theme:\s*Theme\)/g;

    let match;
    while ((match = functionPattern.exec(content)) !== null) {
        const funcName = match[1];
        const isSimple = isSimpleFunction(content, funcName);

        if (isSimple) {
            const body = extractObjectBody(content, funcName);
            if (body) {
                functionsToInline.push({ name: funcName, body });
                console.log(`  Found simple function: ${funcName}`);
            }
        }
    }

    if (functionsToInline.length === 0) {
        console.log('  ℹ No simple functions to inline');
        return;
    }

    // Replace calls in StyleSheet.create or createXStylesheet
    functionsToInline.forEach(({ name, body }) => {
        // Pattern: propName: createXStyles(theme),
        const callPattern = new RegExp(
            `(\\w+):\\s*${name}\\(theme\\),?`,
            'g'
        );

        content = content.replace(callPattern, (match, propName) => {
            console.log(`  Inlining ${name} -> ${propName}`);
            return `${propName}: ${body},`;
        });
    });

    // Remove the function definitions
    functionsToInline.forEach(({ name }) => {
        // Remove the function and its JSDoc comment
        const removePattern = new RegExp(
            `(\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?const\\s+${name}\\s*=\\s*\\(theme:\\s*Theme\\)[\\s\\S]*?(?=\\n\\n|\\/\\*\\*|const\\s+create|export|$)`,
            'g'
        );

        content = content.replace(removePattern, '');
        console.log(`  Removed function: ${name}`);
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
            }
        } else {
            console.log(`  ⚠ File not found: ${relativePath}`);
        }
    });

    console.log('\n✓ Done with Phase 2!');
}

main();
