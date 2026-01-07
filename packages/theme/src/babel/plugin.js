/**
 * Idealyst StyleBuilder Babel Plugin
 *
 * Transforms defineStyle/extendStyle calls to expand $iterator patterns,
 * enabling Unistyles theme reactivity.
 *
 * Transformation:
 *   defineStyle('Button', (theme) => ({
 *     button: {
 *       variants: {
 *         intent: { backgroundColor: theme.$intents.primary }
 *       }
 *     }
 *   }))
 *
 *   → defineStyle('Button', (theme) => ({
 *     button: {
 *       variants: {
 *         intent: {
 *           primary: { backgroundColor: theme.intents.primary.primary },
 *           success: { backgroundColor: theme.intents.success.primary },
 *           ...
 *         }
 *       }
 *     }
 *   }))
 *
 * Configuration:
 * ['@idealyst/theme/plugin', {
 *   autoProcessPaths: ['@idealyst/components'], // Paths to process
 *   themePath: '@idealyst/theme',               // Path to theme for key extraction
 *   debug: true,                                // Enable debug logging
 * }]
 */

const nodePath = require('path');

// ============================================================================
// Theme Key Extraction - Dynamically loads theme to get keys
// ============================================================================

let themeKeys = null;
let themeLoadAttempted = false;

/**
 * Extract keys from theme object structure.
 * Identifies Record-like properties (objects with string keys).
 */
function extractThemeKeys(theme) {
    const keys = {
        intents: [],
        sizes: {},      // sizes.button, sizes.typography, etc.
        radii: [],
        shadows: [],
    };

    // Extract intent keys
    if (theme.intents && typeof theme.intents === 'object') {
        keys.intents = Object.keys(theme.intents);
    }

    // Extract radii keys
    if (theme.radii && typeof theme.radii === 'object') {
        keys.radii = Object.keys(theme.radii);
    }

    // Extract shadow keys
    if (theme.shadows && typeof theme.shadows === 'object') {
        keys.shadows = Object.keys(theme.shadows);
    }

    // Extract size keys per component
    if (theme.sizes && typeof theme.sizes === 'object') {
        for (const [componentName, sizeObj] of Object.entries(theme.sizes)) {
            if (sizeObj && typeof sizeObj === 'object') {
                keys.sizes[componentName] = Object.keys(sizeObj);
            }
        }
    }

    return keys;
}

/**
 * Try to load theme and extract keys.
 * Falls back to default keys if theme can't be loaded.
 */
function loadThemeKeys(themePath, rootDir) {
    if (themeLoadAttempted) return themeKeys;
    themeLoadAttempted = true;

    try {
        // Try to resolve the theme module
        const resolvedPath = themePath.startsWith('.')
            ? nodePath.resolve(rootDir, themePath)
            : themePath;

        // Clear require cache to get fresh theme
        const resolved = require.resolve(resolvedPath);
        delete require.cache[resolved];

        const themeModule = require(resolved);
        const theme = themeModule.lightTheme || themeModule.theme || themeModule.default;

        if (theme) {
            themeKeys = extractThemeKeys(theme);
            console.log('[idealyst-plugin] Loaded theme keys:', {
                intents: themeKeys.intents,
                sizeComponents: Object.keys(themeKeys.sizes),
            });
        }
    } catch (err) {
        // Fall back to defaults if theme can't be loaded
        themeKeys = {
            intents: ['primary', 'success', 'error', 'warning', 'info', 'neutral'],
            sizes: {
                button: ['xs', 'sm', 'md', 'lg', 'xl'],
                text: ['xs', 'sm', 'md', 'lg', 'xl'],
                view: ['xs', 'sm', 'md', 'lg', 'xl'],
                typography: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption'],
            },
            radii: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
            shadows: ['none', 'sm', 'md', 'lg', 'xl'],
        };
    }

    return themeKeys;
}

// ============================================================================
// $iterator Expansion Logic
// ============================================================================

/**
 * Expand $iterator patterns in the style callback.
 *
 * Patterns:
 * - theme.$intents.primary → expands for each intent key
 * - theme.sizes.$button.padding → expands for each button size key
 */
function expandIterators(t, callback, themeParam, keys, verbose, expandedVariants) {
    // Clone the callback to avoid mutating the original
    const cloned = t.cloneDeep(callback);

    // Find variants objects and expand $iterator patterns
    function processNode(node, depth = 0) {
        if (!node || typeof node !== 'object') return node;

        if (Array.isArray(node)) {
            return node.map(n => processNode(n, depth));
        }

        const indent = '  '.repeat(depth);

        // Look for variants: { intent: { ... }, size: { ... } }
        if (t.isObjectProperty(node) && t.isIdentifier(node.key, { name: 'variants' })) {
            verbose(`${indent}Found 'variants' property, value type: ${node.value?.type}`);
            if (t.isObjectExpression(node.value)) {
                verbose(`${indent}  -> Expanding variants object`);
                const expanded = expandVariantsObject(t, node.value, themeParam, keys, verbose, expandedVariants);
                return t.objectProperty(node.key, expanded);
            } else if (t.isTSAsExpression(node.value)) {
                verbose(`${indent}  -> variants value is TSAsExpression, unwrapping`);
                const innerValue = node.value.expression;
                if (t.isObjectExpression(innerValue)) {
                    const expanded = expandVariantsObject(t, innerValue, themeParam, keys, verbose, expandedVariants);
                    return t.objectProperty(node.key, t.tsAsExpression(expanded, node.value.typeAnnotation));
                }
            }
        }

        // Recursively process other nodes
        if (t.isObjectExpression(node)) {
            verbose(`${indent}Processing ObjectExpression with ${node.properties.length} properties at depth ${depth}`);
            return t.objectExpression(
                node.properties.map(prop => processNode(prop, depth + 1))
            );
        }

        if (t.isObjectProperty(node)) {
            const keyName = t.isIdentifier(node.key) ? node.key.name : 'computed';
            verbose(`${indent}Processing ObjectProperty '${keyName}' at depth ${depth}`);
            return t.objectProperty(
                node.key,
                processNode(node.value, depth + 1),
                node.computed,
                node.shorthand
            );
        }

        if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node)) {
            verbose(`${indent}Processing arrow function at depth ${depth}, body type: ${node.body?.type}`);
            const processedBody = processNode(node.body, depth + 1);
            verbose(`${indent}  Processed body type: ${processedBody?.type}`);
            return t.arrowFunctionExpression(
                node.params,
                processedBody
            );
        }

        return node;
    }

    // Process the callback body
    if (t.isObjectExpression(cloned.body)) {
        cloned.body = processNode(cloned.body);
    } else if (t.isBlockStatement(cloned.body)) {
        // Handle block statement with return
        cloned.body.body = cloned.body.body.map(stmt => {
            if (t.isReturnStatement(stmt) && stmt.argument) {
                return t.returnStatement(processNode(stmt.argument));
            }
            return stmt;
        });
    }

    return cloned;
}

/**
 * Expand a variants object.
 * Detects $iterator patterns and expands them to concrete keys.
 */
function expandVariantsObject(t, variantsObj, themeParam, keys, verbose, expandedVariants) {
    const newProperties = [];

    for (const prop of variantsObj.properties) {
        if (!t.isObjectProperty(prop)) {
            newProperties.push(prop);
            continue;
        }

        // Get variant name (e.g., 'intent', 'size')
        let variantName;
        if (t.isIdentifier(prop.key)) {
            variantName = prop.key.name;
        } else if (t.isStringLiteral(prop.key)) {
            variantName = prop.key.value;
        } else {
            newProperties.push(prop);
            continue;
        }

        // Check if the value needs expansion (has $iterator patterns)
        const iteratorInfo = findIteratorPattern(t, prop.value, themeParam);

        if (iteratorInfo) {
            verbose(`      Expanding ${variantName} variant with ${iteratorInfo.type} iterator`);
            const expanded = expandVariantWithIterator(t, prop.value, themeParam, keys, iteratorInfo, verbose);
            newProperties.push(t.objectProperty(prop.key, expanded));

            // Track for summary
            const iteratorKey = iteratorInfo.componentName
                ? `${iteratorInfo.type}.${iteratorInfo.componentName}`
                : iteratorInfo.type;
            expandedVariants.push({ variant: variantName, iterator: iteratorKey });
        } else {
            // No iterator, keep as-is
            newProperties.push(prop);
        }
    }

    return t.objectExpression(newProperties);
}

/**
 * Find $iterator patterns in a node.
 * Returns { type: 'intents' | 'sizes', componentName?: string, accessPath: string[] } or null
 */
function findIteratorPattern(t, node, themeParam) {
    let result = null;

    function walk(n) {
        if (!n || typeof n !== 'object' || result) return;

        if (t.isMemberExpression(n)) {
            const chain = getMemberChain(t, n, themeParam);
            if (chain) {
                for (let i = 0; i < chain.length; i++) {
                    const part = chain[i];
                    if (part.startsWith('$')) {
                        const iteratorName = part.slice(1);

                        if (iteratorName === 'intents') {
                            result = {
                                type: 'intents',
                                accessPath: chain.slice(i + 1),
                            };
                            return;
                        }

                        // Size iterator: sizes.$button, sizes.$typography, etc.
                        if (i > 0 && chain[i - 1] === 'sizes') {
                            result = {
                                type: 'sizes',
                                componentName: iteratorName,
                                accessPath: chain.slice(i + 1),
                            };
                            return;
                        }
                    }
                }
            }
        }

        // Recursively check children
        for (const key of Object.keys(n)) {
            if (key === 'type' || key === 'start' || key === 'end' || key === 'loc') continue;
            if (n[key] && typeof n[key] === 'object') {
                walk(n[key]);
            }
        }
    }

    walk(node);
    return result;
}

/**
 * Get member expression chain as array.
 * theme.intents.primary → ['intents', 'primary']
 */
function getMemberChain(t, node, themeParam) {
    const parts = [];

    function walk(n) {
        if (t.isIdentifier(n)) {
            if (n.name === themeParam) {
                return true;
            }
            return false;
        }

        if (t.isMemberExpression(n)) {
            if (!walk(n.object)) return false;

            if (t.isIdentifier(n.property)) {
                parts.push(n.property.name);
            } else if (t.isStringLiteral(n.property)) {
                parts.push(n.property.value);
            }
            return true;
        }

        return false;
    }

    return walk(node) ? parts : null;
}

/**
 * Expand a variant value using iterator info.
 */
function expandVariantWithIterator(t, valueNode, themeParam, keys, iteratorInfo, verbose) {
    let keysToExpand = [];

    if (iteratorInfo.type === 'intents') {
        keysToExpand = keys?.intents || [];
    } else if (iteratorInfo.type === 'sizes' && iteratorInfo.componentName) {
        keysToExpand = keys?.sizes?.[iteratorInfo.componentName] || [];
        verbose(`        Looking for sizes.${iteratorInfo.componentName}, available: ${Object.keys(keys?.sizes || {}).join(', ')}`);
    }

    if (keysToExpand.length === 0) {
        verbose(`        No keys found for ${iteratorInfo.type}${iteratorInfo.componentName ? '.' + iteratorInfo.componentName : ''}`);
        verbose(`        Keys object: ${JSON.stringify(keys)}`);
        return valueNode;
    }

    verbose(`        Expanding to keys: ${keysToExpand.join(', ')}`);

    const expandedProps = [];

    for (const key of keysToExpand) {
        const expandedValue = replaceIteratorRefs(t, valueNode, themeParam, iteratorInfo, key);
        expandedProps.push(
            t.objectProperty(
                t.identifier(key),
                expandedValue
            )
        );
    }

    return t.objectExpression(expandedProps);
}

/**
 * Replace $iterator references in a node with concrete key access.
 *
 * theme.$intents.primary → theme.intents.primary.primary (when key='primary')
 * theme.sizes.$button.padding → theme.sizes.button.xs.padding (when key='xs')
 */
function replaceIteratorRefs(t, node, themeParam, iteratorInfo, key) {
    if (!node || typeof node !== 'object') return node;

    const cloned = t.cloneDeep(node);

    function walk(n) {
        if (!n || typeof n !== 'object') return n;

        if (Array.isArray(n)) {
            return n.map(walk);
        }

        if (t.isMemberExpression(n)) {
            const chain = getMemberChain(t, n, themeParam);
            if (chain) {
                let hasIterator = false;
                let dollarIndex = -1;

                for (let i = 0; i < chain.length; i++) {
                    if (chain[i].startsWith('$')) {
                        const iterName = chain[i].slice(1);
                        if (iteratorInfo.type === 'intents' && iterName === 'intents') {
                            hasIterator = true;
                            dollarIndex = i;
                            break;
                        }
                        if (iteratorInfo.type === 'sizes' && iterName === iteratorInfo.componentName && i > 0 && chain[i - 1] === 'sizes') {
                            hasIterator = true;
                            dollarIndex = i;
                            break;
                        }
                    }
                }

                if (hasIterator) {
                    const newChain = [];
                    for (let i = 0; i < chain.length; i++) {
                        if (i === dollarIndex) {
                            const iterName = chain[i].slice(1);
                            newChain.push(iterName);
                            newChain.push(key);
                        } else {
                            newChain.push(chain[i]);
                        }
                    }
                    return buildMemberExpression(t, themeParam, newChain);
                }
            }
        }

        if (t.isObjectExpression(n)) {
            return t.objectExpression(
                n.properties.map(prop => walk(prop))
            );
        }

        if (t.isObjectProperty(n)) {
            return t.objectProperty(
                n.key,
                walk(n.value),
                n.computed,
                n.shorthand
            );
        }

        return n;
    }

    return walk(cloned);
}

/**
 * Build a member expression from a chain.
 */
function buildMemberExpression(t, base, chain) {
    let expr = t.identifier(base);
    for (const part of chain) {
        expr = t.memberExpression(expr, t.identifier(part));
    }
    return expr;
}

// ============================================================================
// Babel Plugin
// ============================================================================

module.exports = function idealystStylesPlugin({ types: t }) {
    let debugMode = false;
    let verboseMode = false;

    function debug(...args) {
        if (debugMode || verboseMode) {
            console.log('[idealyst-plugin]', ...args);
        }
    }

    function verbose(...args) {
        if (verboseMode) {
            console.log('[idealyst-plugin]', ...args);
        }
    }

    return {
        name: 'idealyst-styles',

        visitor: {
            Program: {
                enter(path, state) {
                    // Track if we need to add StyleSheet import
                    state.needsStyleSheetImport = false;
                    state.hasStyleSheetImport = false;

                    // Check existing imports for StyleSheet from react-native-unistyles
                    path.traverse({
                        ImportDeclaration(importPath) {
                            if (importPath.node.source.value === 'react-native-unistyles') {
                                for (const spec of importPath.node.specifiers) {
                                    if (t.isImportSpecifier(spec) &&
                                        t.isIdentifier(spec.imported, { name: 'StyleSheet' })) {
                                        state.hasStyleSheetImport = true;
                                    }
                                }
                                // Store reference to add StyleSheet to existing import if needed
                                state.unistylesImportPath = importPath;
                            }
                        }
                    });
                },
                exit(path, state) {
                    // Add StyleSheet import if needed
                    if (state.needsStyleSheetImport && !state.hasStyleSheetImport) {
                        if (state.unistylesImportPath) {
                            // Add StyleSheet to existing unistyles import
                            state.unistylesImportPath.node.specifiers.push(
                                t.importSpecifier(t.identifier('StyleSheet'), t.identifier('StyleSheet'))
                            );
                            debugMode && debug('Added StyleSheet to existing unistyles import');
                        } else {
                            // Add new import declaration
                            const importDecl = t.importDeclaration(
                                [t.importSpecifier(t.identifier('StyleSheet'), t.identifier('StyleSheet'))],
                                t.stringLiteral('react-native-unistyles')
                            );
                            path.unshiftContainer('body', importDecl);
                            debugMode && debug('Added new StyleSheet import');
                        }
                    }

                    // Add registry imports if needed
                    if (state.needsRegistryImport) {
                        const specifiers = [];
                        if (state.needsRegistryImport.__defineStyle) {
                            specifiers.push(t.importSpecifier(t.identifier('__defineStyle'), t.identifier('__defineStyle')));
                        }
                        if (state.needsRegistryImport.__extendStyle) {
                            specifiers.push(t.importSpecifier(t.identifier('__extendStyle'), t.identifier('__extendStyle')));
                        }
                        if (state.needsRegistryImport.__overrideStyle) {
                            specifiers.push(t.importSpecifier(t.identifier('__overrideStyle'), t.identifier('__overrideStyle')));
                        }
                        if (specifiers.length > 0) {
                            const importDecl = t.importDeclaration(
                                specifiers,
                                t.stringLiteral('@idealyst/theme')
                            );
                            path.unshiftContainer('body', importDecl);
                            debugMode && debug(`Added registry imports: ${specifiers.map(s => s.local.name).join(', ')}`);
                        }
                    }
                }
            },

            CallExpression(path, state) {
                const { node } = path;
                const opts = state.opts || {};
                debugMode = opts.debug === true;
                verboseMode = opts.verbose === true;
                const filename = state.filename || '';

                // Check if we should process this file
                const shouldProcess =
                    opts.processAll ||
                    (opts.autoProcessPaths?.some(p => filename.includes(p)));

                if (!shouldProcess) return;

                // Handle defineStyle/extendStyle/overrideStyle calls
                if (t.isIdentifier(node.callee, { name: 'defineStyle' }) ||
                    t.isIdentifier(node.callee, { name: 'extendStyle' }) ||
                    t.isIdentifier(node.callee, { name: 'overrideStyle' })) {

                    const fnName = node.callee.name;
                    const registryFn = fnName === 'defineStyle' ? '__defineStyle'
                        : fnName === 'extendStyle' ? '__extendStyle'
                        : '__overrideStyle';
                    debug(`FOUND ${fnName} in: ${filename}`);

                    const [componentNameArg, stylesCallback] = node.arguments;

                    if (!t.isStringLiteral(componentNameArg)) {
                        debug(`  SKIP - componentName is not a string literal`);
                        return;
                    }

                    if (!t.isArrowFunctionExpression(stylesCallback) &&
                        !t.isFunctionExpression(stylesCallback)) {
                        debug(`  SKIP - callback is not a function`);
                        return;
                    }

                    const componentName = componentNameArg.value;
                    debug(`  Processing ${fnName}('${componentName}')`);

                    // Get theme parameter name
                    let themeParam = 'theme';
                    if (stylesCallback.params?.[0] && t.isIdentifier(stylesCallback.params[0])) {
                        themeParam = stylesCallback.params[0].name;
                    }

                    // Load theme keys for expansion
                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    const themePath = opts.themePath || '@idealyst/theme';
                    const keys = loadThemeKeys(themePath, rootDir);

                    // Track expanded variants for summary
                    const expandedVariants = [];

                    // Transform the callback body to expand $iterator patterns
                    const expandedCallback = expandIterators(t, stylesCallback, themeParam, keys, verbose, expandedVariants);

                    // Replace defineStyle/extendStyle with registry call
                    path.replaceWith(
                        t.callExpression(
                            t.identifier(registryFn),
                            [componentNameArg, expandedCallback]
                        )
                    );

                    // Mark that we need registry import
                    state.needsRegistryImport = state.needsRegistryImport || {};
                    state.needsRegistryImport[registryFn] = true;

                    debug(`  -> Replaced ${fnName}('${componentName}') with ${registryFn}`);
                    if (expandedVariants.length > 0) {
                        debug(`     Expanded: ${expandedVariants.map(v => `${v.variant}(${v.iterator})`).join(', ')}`);
                    }
                }

                // Handle StyleSheet.create calls - expand $iterator patterns inside
                if (t.isMemberExpression(node.callee) &&
                    t.isIdentifier(node.callee.object, { name: 'StyleSheet' }) &&
                    t.isIdentifier(node.callee.property, { name: 'create' })) {

                    debug(`FOUND StyleSheet.create in: ${filename}`);

                    const [stylesCallback] = node.arguments;

                    if (!t.isArrowFunctionExpression(stylesCallback) &&
                        !t.isFunctionExpression(stylesCallback)) {
                        debug(`  SKIP - callback is not a function`);
                        return;
                    }

                    // Get theme parameter name
                    let themeParam = 'theme';
                    if (stylesCallback.params?.[0] && t.isIdentifier(stylesCallback.params[0])) {
                        themeParam = stylesCallback.params[0].name;
                    }

                    // Load theme keys for expansion
                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    const themePath = opts.themePath || '@idealyst/theme';
                    const keys = loadThemeKeys(themePath, rootDir);

                    // Track expanded variants for summary
                    const expandedVariants = [];

                    // Transform the callback body to expand $iterator patterns
                    const expandedCallback = expandIterators(t, stylesCallback, themeParam, keys, verbose, expandedVariants);

                    // Replace the callback argument
                    node.arguments[0] = expandedCallback;

                    debug(`  -> Expanded $iterator patterns in StyleSheet.create`);
                    if (expandedVariants.length > 0) {
                        debug(`     Expanded: ${expandedVariants.map(v => `${v.variant}(${v.iterator})`).join(', ')}`);
                    }
                }
            },
        },
    };
};
