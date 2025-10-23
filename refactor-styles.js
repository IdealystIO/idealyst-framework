const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Script to inline createXStyles functions that return plain objects (not functions)
 * into StyleSheet.create() calls.
 */

function parseFile(filePath) {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
    );
    return { sourceFile, sourceCode };
}

/**
 * Check if a function returns another function (has variant parameters)
 */
function returnsFunction(node) {
    let returnsFunc = false;

    function visit(n) {
        // Check if it's a return statement
        if (ts.isReturnStatement(n) && n.expression) {
            // Check if it returns an arrow function or function expression
            if (ts.isArrowFunction(n.expression) || ts.isFunctionExpression(n.expression)) {
                returnsFunc = true;
            }
        }
        ts.forEachChild(n, visit);
    }

    visit(node);
    return returnsFunc;
}

/**
 * Find all createXStyles functions in the file
 */
function findCreateStylesFunctions(sourceFile, sourceCode) {
    const functions = new Map();

    function visit(node) {
        // Look for: const createXStyles = (theme: Theme) => { ... }
        if (ts.isVariableStatement(node)) {
            const declaration = node.declarationList.declarations[0];
            if (declaration && ts.isVariableDeclaration(declaration)) {
                const name = declaration.name.getText(sourceFile);
                if (name.startsWith('create') && name.endsWith('Styles')) {
                    const initializer = declaration.initializer;
                    if (initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))) {
                        const returnsAFunction = returnsFunction(initializer);

                        // Get the function body
                        let bodyText = '';
                        if (initializer.body) {
                            if (ts.isBlock(initializer.body)) {
                                // Find the return statement
                                const returnStmt = initializer.body.statements.find(s => ts.isReturnStatement(s));
                                if (returnStmt && returnStmt.expression && !returnsAFunction) {
                                    bodyText = returnStmt.expression.getText(sourceFile);
                                }
                            } else {
                                // Arrow function with implicit return
                                bodyText = initializer.body.getText(sourceFile);
                            }
                        }

                        functions.set(name, {
                            name,
                            node,
                            returnsFunction: returnsAFunction,
                            bodyText,
                            start: node.getStart(sourceFile),
                            end: node.getEnd(),
                        });
                    }
                }
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return functions;
}

/**
 * Find StyleSheet.create call and get the properties that call createXStyles
 */
function findStyleSheetCreate(sourceFile) {
    let styleSheetNode = null;
    let properties = [];

    function visit(node) {
        // Look for: StyleSheet.create((theme: Theme) => ({ ... }))
        if (ts.isCallExpression(node)) {
            const expr = node.expression;
            if (ts.isPropertyAccessExpression(expr) &&
                expr.expression.getText(sourceFile) === 'StyleSheet' &&
                expr.name.getText(sourceFile) === 'create') {
                styleSheetNode = node;

                // Get the arrow function argument
                const arrowFunc = node.arguments[0];
                if (arrowFunc && ts.isArrowFunction(arrowFunc)) {
                    const body = arrowFunc.body;

                    // Get the object literal being returned
                    let objLiteral = null;
                    if (ts.isBlock(body)) {
                        const returnStmt = body.statements.find(s => ts.isReturnStatement(s));
                        if (returnStmt && returnStmt.expression && ts.isObjectLiteralExpression(returnStmt.expression)) {
                            objLiteral = returnStmt.expression;
                        }
                    } else if (ts.isObjectLiteralExpression(body)) {
                        objLiteral = body;
                    }

                    // Find properties that call createXStyles(theme)
                    if (objLiteral) {
                        objLiteral.properties.forEach(prop => {
                            if (ts.isPropertyAssignment(prop)) {
                                const initializer = prop.initializer;
                                if (ts.isCallExpression(initializer)) {
                                    const funcName = initializer.expression.getText(sourceFile);
                                    if (funcName.startsWith('create') && funcName.endsWith('Styles')) {
                                        properties.push({
                                            propertyName: prop.name.getText(sourceFile),
                                            functionName: funcName,
                                            node: prop,
                                            start: prop.getStart(sourceFile),
                                            end: prop.getEnd(),
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return { styleSheetNode, properties };
}

/**
 * Process a single file
 */
function processFile(filePath) {
    console.log(`\nProcessing: ${filePath}`);

    const { sourceFile, sourceCode } = parseFile(filePath);
    const createFunctions = findCreateStylesFunctions(sourceFile, sourceCode);
    const { properties } = findStyleSheetCreate(sourceFile);

    // Filter functions that should be inlined (don't return functions)
    const toInline = Array.from(createFunctions.values()).filter(f => !f.returnsFunction && f.bodyText);

    if (toInline.length === 0) {
        console.log('  No functions to inline.');
        return;
    }

    console.log(`  Found ${toInline.length} function(s) to inline:`);
    toInline.forEach(f => console.log(`    - ${f.name}`));

    // Create a map of replacements
    const replacements = [];

    // Step 1: Replace calls in StyleSheet.create
    properties.forEach(prop => {
        const func = createFunctions.get(prop.functionName);
        if (func && !func.returnsFunction && func.bodyText) {
            replacements.push({
                start: prop.start,
                end: prop.end,
                text: `${prop.propertyName}: ${func.bodyText}`,
            });
        }
    });

    // Step 2: Remove function definitions
    toInline.forEach(func => {
        replacements.push({
            start: func.start,
            end: func.end + 1, // Include the newline
            text: '',
        });
    });

    // Sort replacements by position (reverse order to maintain positions)
    replacements.sort((a, b) => b.start - a.start);

    // Apply replacements
    let newCode = sourceCode;
    for (const replacement of replacements) {
        newCode = newCode.substring(0, replacement.start) +
                  replacement.text +
                  newCode.substring(replacement.end);
    }

    // Clean up extra blank lines (more than 2 consecutive newlines)
    newCode = newCode.replace(/\n\n\n+/g, '\n\n');

    // Write back to file
    fs.writeFileSync(filePath, newCode, 'utf-8');
    console.log(`  ✓ Updated ${filePath}`);
}

/**
 * Main function
 */
function main() {
    const componentsDir = path.join(__dirname, 'packages/components/src');

    // Find all .styles.tsx files
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

    console.log('\n✓ Done!');
}

main();
