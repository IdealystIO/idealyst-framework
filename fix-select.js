const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'packages/components/src/Select/Select.styles.tsx');

let content = fs.readFileSync(filePath, 'utf-8');

// Remove deepMerge calls with multiline support
// Pattern: deepMerge({ ... }, {})
let iterations = 0;
let prevContent;

do {
    prevContent = content;
    // Match deepMerge with nested braces
    content = content.replace(/deepMerge\s*\(\s*(\{(?:[^{}]|\{[^{}]*\})*\})\s*,\s*\{\}\s*\)/gs, '$1');
    iterations++;
} while (content !== prevContent && iterations < 20);

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`✓ Fixed Select.styles.tsx (${iterations} iterations)`);
