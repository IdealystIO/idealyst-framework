/**
 * Theme Analyzer - Extracts theme keys by statically analyzing theme files.
 *
 * Traces the declarative builder API:
 * - createTheme() / fromTheme(base)
 * - .addIntent('name', {...})
 * - .addRadius('name', value)
 * - .addShadow('name', {...})
 * - .setSizes({ button: { xs: {}, sm: {}, ... }, ... })
 * - .build()
 */

const nodePath = require('path');
const fs = require('fs');

let themeKeys = null;
let themeLoadAttempted = false;

// Global aliases configuration (set via plugin options)
let packageAliases = {};

/**
 * Resolve an import source using configured aliases (static version for use outside AST traversal).
 * Returns the resolved path or null if no alias matches.
 */
function resolveWithAliasesStatic(source, fromDir) {
    for (const [aliasPrefix, aliasPath] of Object.entries(packageAliases)) {
        if (source === aliasPrefix || source.startsWith(aliasPrefix + '/')) {
            // Replace the alias prefix with the actual path
            const remainder = source.slice(aliasPrefix.length);
            let resolved = aliasPath + remainder;

            // If aliasPath is relative, resolve from fromDir
            if (!nodePath.isAbsolute(resolved)) {
                resolved = nodePath.resolve(fromDir, resolved);
            }

            return resolved;
        }
    }
    return null;
}

/**
 * Extract theme keys by statically analyzing the theme file's AST.
 */
function extractThemeKeysFromAST(themeFilePath, babelTypes, verboseMode) {
    const { parseSync } = require('@babel/core');
    const traverse = require('@babel/traverse').default;
    const t = babelTypes;

    const log = (...args) => {
        if (verboseMode) console.log('[idealyst-plugin]', ...args);
    };

    const keys = {
        intents: [],
        sizes: {},
        radii: [],
        shadows: [],
    };

    log('Reading theme file:', themeFilePath);

    // Read and parse the theme file
    const code = fs.readFileSync(themeFilePath, 'utf-8');
    const ast = parseSync(code, {
        filename: themeFilePath,
        presets: [
            ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
        ],
        parserOpts: {
            plugins: ['typescript', 'jsx']
        }
    });

    if (!ast) {
        throw new Error(`[idealyst-plugin] Failed to parse theme file: ${themeFilePath}`);
    }

    // Track imports to resolve base themes
    const imports = new Map(); // varName -> { source, imported }

    // First pass: collect imports
    traverse(ast, {
        ImportDeclaration(path) {
            const source = path.node.source.value;
            for (const spec of path.node.specifiers) {
                if (t.isImportSpecifier(spec)) {
                    const localName = spec.local.name;
                    const importedName = t.isIdentifier(spec.imported) ? spec.imported.name : spec.imported.value;
                    imports.set(localName, { source, imported: importedName });
                }
            }
        }
    });

    /**
     * Recursively trace a builder chain to extract all method calls.
     * Returns { calls: Array, baseThemeVar: string | null }
     */
    function traceBuilderChain(node, calls = []) {
        if (!node) return { calls, baseThemeVar: null };

        if (t.isCallExpression(node)) {
            if (t.isIdentifier(node.callee, { name: 'createTheme' })) {
                return { calls, baseThemeVar: null };
            }
            if (t.isIdentifier(node.callee, { name: 'fromTheme' })) {
                const arg = node.arguments[0];
                if (t.isIdentifier(arg)) {
                    return { calls, baseThemeVar: arg.name };
                }
                return { calls, baseThemeVar: null };
            }

            if (t.isMemberExpression(node.callee)) {
                const methodName = node.callee.property.name;
                calls.unshift({ method: methodName, args: node.arguments });
                return traceBuilderChain(node.callee.object, calls);
            }
        }

        return { calls, baseThemeVar: null };
    }

    /**
     * Resolve an import source using configured aliases.
     * Returns the resolved path or null if no alias matches.
     */
    function resolveWithAliases(source, fromDir) {
        for (const [aliasPrefix, aliasPath] of Object.entries(packageAliases)) {
            if (source === aliasPrefix || source.startsWith(aliasPrefix + '/')) {
                // Replace the alias prefix with the actual path
                const remainder = source.slice(aliasPrefix.length);
                let resolved = aliasPath + remainder;

                // If aliasPath is relative, resolve from fromDir
                if (!nodePath.isAbsolute(resolved)) {
                    resolved = nodePath.resolve(fromDir, resolved);
                }

                log('Resolved alias:', source, '->', resolved);
                return resolved;
            }
        }
        return null;
    }

    /**
     * Resolve and analyze a base theme from an import.
     */
    function analyzeBaseTheme(varName) {
        const importInfo = imports.get(varName);
        if (!importInfo) {
            log('Could not find import for base theme:', varName);
            return;
        }

        log('Base theme', varName, 'imported from', importInfo.source);

        let baseThemePath;
        try {
            if (importInfo.source.startsWith('.')) {
                baseThemePath = nodePath.resolve(nodePath.dirname(themeFilePath), importInfo.source);
                if (!baseThemePath.endsWith('.ts') && !baseThemePath.endsWith('.tsx')) {
                    if (fs.existsSync(baseThemePath + '.ts')) baseThemePath += '.ts';
                    else if (fs.existsSync(baseThemePath + '.tsx')) baseThemePath += '.tsx';
                }
            } else {
                const packageDir = nodePath.dirname(themeFilePath);

                // First, try to resolve using configured aliases
                const aliasResolved = resolveWithAliases(importInfo.source, packageDir);
                if (aliasResolved) {
                    // Determine which theme file to look for based on variable name
                    const themeFileName = varName.includes('dark') ? 'darkTheme.ts' : 'lightTheme.ts';

                    // Check if alias points to a directory or a specific file
                    let possiblePaths = [
                        aliasResolved,
                        nodePath.join(aliasResolved, 'src', themeFileName),
                        nodePath.join(aliasResolved, themeFileName),
                    ];

                    // Add .ts extension if needed
                    possiblePaths = possiblePaths.flatMap(p => {
                        if (p.endsWith('.ts') || p.endsWith('.tsx')) return [p];
                        return [p, p + '.ts', p + '.tsx'];
                    });

                    log('Looking for aliased theme in:', possiblePaths);

                    for (const p of possiblePaths) {
                        if (fs.existsSync(p)) {
                            baseThemePath = p;
                            log('Found aliased theme at:', p);
                            break;
                        }
                    }
                }

                // If no alias match, use default resolution for @idealyst/theme
                if (!baseThemePath) {
                    // Determine which theme file to look for based on variable name
                    const themeFileName = varName.includes('dark') ? 'darkTheme.ts' : 'lightTheme.ts';
                    let possiblePaths = [];

                    if (importInfo.source === '@idealyst/theme') {
                        possiblePaths = [
                            // Symlinked packages at root level
                            `/idealyst-packages/theme/src/${themeFileName}`,
                            // Standard node_modules
                            nodePath.resolve(packageDir, `node_modules/@idealyst/theme/src/${themeFileName}`),
                            // Monorepo structure - walk up to find packages dir
                            nodePath.resolve(packageDir, `../theme/src/${themeFileName}`),
                            nodePath.resolve(packageDir, `../../theme/src/${themeFileName}`),
                            nodePath.resolve(packageDir, `../../../theme/src/${themeFileName}`),
                            nodePath.resolve(packageDir, `../../packages/theme/src/${themeFileName}`),
                            nodePath.resolve(packageDir, `../../../packages/theme/src/${themeFileName}`),
                            nodePath.resolve(packageDir, `../../../../packages/theme/src/${themeFileName}`),
                            nodePath.resolve(packageDir, `../../../../../packages/theme/src/${themeFileName}`),
                            nodePath.resolve(packageDir, `../../../../../../packages/theme/src/${themeFileName}`),
                            // This plugin's own package location
                            nodePath.resolve(__dirname, `../${themeFileName}`),
                        ];

                        log('Looking for base theme in:', possiblePaths);

                        for (const p of possiblePaths) {
                            if (fs.existsSync(p)) {
                                baseThemePath = p;
                                log('Found base theme at:', p);
                                break;
                            }
                        }
                    }
                }

                if (!baseThemePath) {
                    log('Could not resolve base theme path for:', importInfo.source);
                    return;
                }
            }

            log('Analyzing base theme file:', baseThemePath);

            const baseKeys = extractThemeKeysFromAST(baseThemePath, babelTypes, verboseMode);

            // Merge base keys
            keys.intents.push(...baseKeys.intents.filter(k => !keys.intents.includes(k)));
            keys.radii.push(...baseKeys.radii.filter(k => !keys.radii.includes(k)));
            keys.shadows.push(...baseKeys.shadows.filter(k => !keys.shadows.includes(k)));
            for (const [comp, sizes] of Object.entries(baseKeys.sizes)) {
                if (!keys.sizes[comp]) {
                    keys.sizes[comp] = sizes;
                }
            }

            log('Merged base theme keys');
        } catch (err) {
            log('Error analyzing base theme:', err.message);
        }
    }

    function getStringValue(node) {
        if (t.isStringLiteral(node)) return node.value;
        if (t.isIdentifier(node)) return node.name;
        return null;
    }

    function getObjectKeys(node) {
        if (!t.isObjectExpression(node)) return [];
        return node.properties
            .filter(prop => t.isObjectProperty(prop))
            .map(prop => {
                if (t.isIdentifier(prop.key)) return prop.key.name;
                if (t.isStringLiteral(prop.key)) return prop.key.value;
                return null;
            })
            .filter(Boolean);
    }

    function processBuilderCalls(calls) {
        log('Processing builder chain with', calls.length, 'method calls');

        for (const { method, args } of calls) {
            switch (method) {
                case 'addIntent': {
                    const name = getStringValue(args[0]);
                    if (name && !keys.intents.includes(name)) {
                        keys.intents.push(name);
                        log('  Found intent:', name);
                    }
                    break;
                }
                case 'addRadius': {
                    const name = getStringValue(args[0]);
                    if (name && !keys.radii.includes(name)) {
                        keys.radii.push(name);
                        log('  Found radius:', name);
                    }
                    break;
                }
                case 'addShadow': {
                    const name = getStringValue(args[0]);
                    if (name && !keys.shadows.includes(name)) {
                        keys.shadows.push(name);
                        log('  Found shadow:', name);
                    }
                    break;
                }
                case 'setSizes': {
                    const sizesObj = args[0];
                    if (t.isObjectExpression(sizesObj)) {
                        for (const prop of sizesObj.properties) {
                            if (!t.isObjectProperty(prop)) continue;
                            const componentName = t.isIdentifier(prop.key) ? prop.key.name :
                                                  t.isStringLiteral(prop.key) ? prop.key.value : null;
                            if (componentName && t.isObjectExpression(prop.value)) {
                                keys.sizes[componentName] = getObjectKeys(prop.value);
                                log('  Found sizes for', componentName + ':', keys.sizes[componentName]);
                            }
                        }
                    }
                    break;
                }
                case 'build':
                    break;
                default:
                    log('  Skipping unknown method:', method);
            }
        }
    }

    /**
     * Process a builder chain that ends with .build() - extracts theme keys.
     * Can be called on any node that is a .build() call expression.
     */
    function processBuilderChainNode(node) {
        if (!t.isCallExpression(node)) return;
        if (!t.isMemberExpression(node.callee)) return;
        if (!t.isIdentifier(node.callee.property, { name: 'build' })) return;

        const { calls, baseThemeVar } = traceBuilderChain(node);

        if (baseThemeVar) {
            log('Found fromTheme with base:', baseThemeVar);
            analyzeBaseTheme(baseThemeVar);
        }

        processBuilderCalls(calls);
    }

    // Second pass: find theme builder chains
    traverse(ast, {
        VariableDeclarator(path) {
            const init = path.node.init;
            if (!init) return;

            if (t.isCallExpression(init) &&
                t.isMemberExpression(init.callee) &&
                t.isIdentifier(init.callee.property, { name: 'build' })) {

                processBuilderChainNode(init);
            }
        },

        ExportNamedDeclaration(path) {
            if (!path.node.declaration) return;
            if (!t.isVariableDeclaration(path.node.declaration)) return;

            for (const decl of path.node.declaration.declarations) {
                const init = decl.init;
                if (!init) continue;

                if (t.isCallExpression(init) &&
                    t.isMemberExpression(init.callee) &&
                    t.isIdentifier(init.callee.property, { name: 'build' })) {

                    processBuilderChainNode(init);
                }
            }
        },

        // Handle StyleSheet.configure({ themes: { light: ..., dark: ... } })
        CallExpression(path) {
            const { node } = path;

            // Check for StyleSheet.configure(...)
            if (!t.isMemberExpression(node.callee)) return;
            if (!t.isIdentifier(node.callee.object, { name: 'StyleSheet' })) return;
            if (!t.isIdentifier(node.callee.property, { name: 'configure' })) return;

            log('Found StyleSheet.configure call');

            const configArg = node.arguments[0];
            if (!t.isObjectExpression(configArg)) return;

            // Find the 'themes' property
            for (const prop of configArg.properties) {
                if (!t.isObjectProperty(prop)) continue;

                const keyName = t.isIdentifier(prop.key) ? prop.key.name :
                               t.isStringLiteral(prop.key) ? prop.key.value : null;

                if (keyName !== 'themes') continue;
                if (!t.isObjectExpression(prop.value)) continue;

                log('Found themes object in StyleSheet.configure');

                // Process each theme definition
                for (const themeProp of prop.value.properties) {
                    if (!t.isObjectProperty(themeProp)) continue;

                    const themeName = t.isIdentifier(themeProp.key) ? themeProp.key.name :
                                     t.isStringLiteral(themeProp.key) ? themeProp.key.value : null;

                    if (!themeName) continue;

                    const themeValue = themeProp.value;
                    log(`  Processing theme '${themeName}'`);

                    // Case 1: Inline builder chain - fromTheme(x).build() or createTheme().build()
                    if (t.isCallExpression(themeValue) &&
                        t.isMemberExpression(themeValue.callee) &&
                        t.isIdentifier(themeValue.callee.property, { name: 'build' })) {

                        log(`    Found inline builder chain for '${themeName}'`);
                        processBuilderChainNode(themeValue);
                    }
                    // Case 2: Variable reference - analyze the referenced variable's file
                    else if (t.isIdentifier(themeValue)) {
                        log(`    Found variable reference '${themeValue.name}' for '${themeName}'`);
                        analyzeBaseTheme(themeValue.name);
                    }
                }
            }
        }
    });

    return keys;
}

/**
 * Load theme keys by statically analyzing the theme file.
 *
 * REQUIRED Options:
 * - themePath: Path to the consumer's theme file (e.g., './src/theme/styles.ts')
 *
 * OPTIONAL Options:
 * - aliases: Object mapping package prefixes to paths for resolution
 *   Example: { '@idealyst/theme': '/path/to/packages/theme' }
 */
function loadThemeKeys(opts, rootDir, babelTypes, verboseMode) {
    if (themeLoadAttempted) return themeKeys;
    themeLoadAttempted = true;

    // Set up package aliases for resolution
    if (opts.aliases && typeof opts.aliases === 'object') {
        packageAliases = opts.aliases;
        if (verboseMode) {
            console.log('[idealyst-plugin] Configured aliases:', packageAliases);
        }
    }

    const themePath = opts.themePath;

    if (!themePath) {
        throw new Error(
            '[idealyst-plugin] themePath is required!\n' +
            'Add it to your babel config:\n' +
            '  ["@idealyst/theme/plugin", { themePath: "./src/theme/styles.ts" }]'
        );
    }

    // First try to resolve using aliases
    let resolvedPath;
    const aliasResolved = resolveWithAliasesStatic(themePath, rootDir);
    if (aliasResolved && fs.existsSync(aliasResolved)) {
        resolvedPath = aliasResolved;
    } else {
        resolvedPath = themePath.startsWith('.')
            ? nodePath.resolve(rootDir, themePath)
            : require.resolve(themePath, { paths: [rootDir] });
    }

    if (verboseMode) {
        console.log('[idealyst-plugin] Analyzing theme file:', resolvedPath);
    }

    themeKeys = extractThemeKeysFromAST(resolvedPath, babelTypes, verboseMode);

    // Log extracted keys in verbose mode
    if (verboseMode) {
        console.log('[idealyst-plugin] Extracted theme keys:');
        console.log('  intents:', themeKeys.intents);
        console.log('  radii:', themeKeys.radii);
        console.log('  shadows:', themeKeys.shadows);
        console.log('  sizes:');
        for (const [component, sizes] of Object.entries(themeKeys.sizes)) {
            console.log(`    ${component}:`, sizes);
        }
    }

    return themeKeys;
}

/**
 * Reset the theme cache (useful for testing or hot reload).
 */
function resetThemeCache() {
    themeKeys = null;
    themeLoadAttempted = false;
}

module.exports = {
    extractThemeKeysFromAST,
    loadThemeKeys,
    resetThemeCache,
};
