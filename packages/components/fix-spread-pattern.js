#!/usr/bin/env node
/**
 * Fix the spread pattern in style files.
 *
 * Transforms:
 *   const extended = applyExtensions('X', theme, { a, b });
 *   return { ...extended, c, d };
 *
 * To:
 *   return applyExtensions('X', theme, { a, b, c, d });
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findStyleFiles(dir) {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findStyleFiles(fullPath));
        } else if (entry.name.endsWith('.styles.tsx')) {
            files.push(fullPath);
        }
    }
    return files;
}

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Check if file has the spread pattern
    if (!content.includes('...extended')) {
        return false;
    }

    // Find the applyExtensions call and its object
    const applyMatch = content.match(/const extended = applyExtensions\(([^,]+),\s*([^,]+),\s*\{([\s\S]*?)\}\);/);
    if (!applyMatch) {
        console.log(`  Could not parse applyExtensions in ${path.basename(filePath)}`);
        return false;
    }

    const [fullApplyMatch, componentName, themeName, existingProps] = applyMatch;

    // Find the return statement
    const returnMatch = content.match(/return \{\s*\.\.\.extended,?([\s\S]*?)\};/);
    if (!returnMatch) {
        // Try simple spread-only pattern
        const simpleReturn = content.match(/return \{\s*\.\.\.extended\s*\};/);
        if (simpleReturn) {
            // Simple case: just return applyExtensions directly
            const newContent = content
                .replace(fullApplyMatch, '')
                .replace(simpleReturn[0], `return applyExtensions(${componentName}, ${themeName}, {${existingProps}});`)
                .replace(/\n\s*\n\s*\n/g, '\n\n'); // Clean up extra newlines

            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf-8');
                console.log(`Fixed (simple): ${path.relative(srcDir, filePath)}`);
                return true;
            }
        }
        return false;
    }

    const [fullReturnMatch, extraProps] = returnMatch;

    // Clean up extra props (remove leading/trailing whitespace and commas)
    const cleanExtraProps = extraProps.trim().replace(/^,|,$/g, '').trim();

    // Build new applyExtensions call with merged props
    let mergedProps = existingProps.trim();
    if (cleanExtraProps) {
        // Add comma if needed
        if (!mergedProps.endsWith(',')) {
            mergedProps += ',';
        }
        mergedProps += '\n        // Additional styles (merged from return)\n        ' + cleanExtraProps;
    }

    const newApplyCall = `return applyExtensions(${componentName}, ${themeName}, {${mergedProps}});`;

    // Replace the variable declaration + return with single return
    let newContent = content.replace(fullApplyMatch, '');
    newContent = newContent.replace(fullReturnMatch, newApplyCall);

    // Clean up extra newlines
    newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (newContent !== original) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Fixed: ${path.relative(srcDir, filePath)}`);
        return true;
    }
    return false;
}

const files = findStyleFiles(srcDir);
let fixed = 0;

for (const file of files) {
    try {
        if (fixFile(file)) {
            fixed++;
        }
    } catch (err) {
        console.log(`Error processing ${file}: ${err.message}`);
    }
}

console.log(`\nFixed ${fixed} files`);
