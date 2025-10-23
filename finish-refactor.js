const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'packages/components/src');

// Files that need createXStylesheet wrapper removed
const files = [
    'List/List.styles.tsx',
    'Menu/Menu.styles.tsx',
    'Menu/MenuItem.styles.tsx',
    'TabBar/TabBar.styles.tsx',
    'Table/Table.styles.tsx',
    'TextArea/TextArea.styles.tsx',
];

files.forEach(file => {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Pattern 1: Remove createXStylesheet function definition
    // Match: export const createXStylesheet = (theme: Theme) => { return { ... }; }
    content = content.replace(
        /export const create\w+Stylesheet = \(theme: Theme\)(?::\s*\w+Stylesheet)?\s*=>\s*\{\s*return\s*\{[\s\S]*?\};\s*\}/g,
        ''
    );

    // Pattern 2: Update StyleSheet.create to not use wrapper
    // Match: const stylesheet = createXStylesheet(theme);
    content = content.replace(
        /const (\w+) = create\w+Stylesheet\(theme\);\s*return\s*\{/g,
        'return {'
    );

    // Pattern 3: Replace stylesheet.property with direct function call
    // This is more complex, needs manual handling per file

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Processed ${file}`);
});

console.log('\n✅ All files processed! Manual cleanup may still be needed.');
