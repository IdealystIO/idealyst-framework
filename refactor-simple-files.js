const fs = require('fs');
const path = require('path');

/**
 * Refactor "simple" files - those without createXStylesheet
 * but still have createXStyles functions that return plain objects
 */

const SIMPLE_FILES = [
    'ActivityIndicator/ActivityIndicator.styles.tsx',
    'Badge/Badge.styles.tsx',
    'Card/Card.styles.tsx',
    'Checkbox/Checkbox.styles.tsx',
    'Chip/Chip.styles.tsx',
    'Divider/Divider.styles.tsx',
    'Icon/Icon.styles.tsx',
    'Image/Image.styles.tsx',
    'Input/Input.styles.tsx',
    'Popover/Popover.styles.tsx',
    'Progress/Progress.styles.tsx',
    'RadioButton/RadioButton.styles.tsx',
    'SVGImage/SVGImage.styles.tsx',
    'Select/Select.styles.tsx',
    'Skeleton/Skeleton.styles.tsx',
    'Switch/Switch.styles.tsx',
    'Tooltip/Tooltip.styles.tsx',
    'Video/Video.styles.tsx',
    'View/View.styles.tsx',
];

function processFile(filePath) {
    console.log(`\nProcessing: ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Find all createXStyles functions that return plain objects
    // Pattern: function createXStyles(theme: Theme, expanded: ...) { return deepMerge({ ... }, expanded); }

    const functionsToInline = [];
    const functionPattern = /(?:function|const)\s+(create\w+Styles)\s*(?:=\s*)?\(theme:\s*Theme(?:,\s*expanded[^)]+)?\)(?::\s*\w+)?\s*(?:=>)?\s*\{\s*return\s+deepMerge\s*\((\{[\s\S]*?\}),\s*expanded\s*\);?\s*\}/g;

    let match;
    while ((match = functionPattern.exec(content)) !== null) {
        const funcName = match[1];
        const funcBody = match[2];

        functionsToInline.push({
            name: funcName,
            body: funcBody,
            fullMatch: match[0]
        });
        console.log(`  Found: ${funcName}`);
    }

    if (functionsToInline.length === 0) {
        console.log('  ℹ No functions to inline');
        return;
    }

    // Inline the functions where they're called
    functionsToInline.forEach(({ name, body }) => {
        // Pattern: propName: createXStyles(theme, {}),
        const callPattern = new RegExp(`(\\w+):\\s*${name}\\(theme,\\s*\\{\\}\\),?`, 'g');
        content = content.replace(callPattern, (match, propName) => {
            console.log(`  ✓ Inlining ${name} as ${propName}`);
            return `${propName}: ${body},`;
        });
    });

    // Remove the function definitions
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

    console.log(`Processing ${SIMPLE_FILES.length} simple files.\n`);

    SIMPLE_FILES.forEach(relativePath => {
        const fullPath = path.join(componentsDir, relativePath);
        if (fs.existsSync(fullPath)) {
            try {
                processFile(fullPath);
            } catch (error) {
                console.error(`  ✗ Error: ${error.message}`);
            }
        } else {
            console.log(`  ⚠ File not found: ${relativePath}`);
        }
    });

    console.log('\n✓ All done!');
}

main();
