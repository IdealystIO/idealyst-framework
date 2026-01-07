/**
 * Idealyst Styles Babel Plugin
 *
 * Transforms StyleSheet.create calls to enable Unistyles theme reactivity.
 *
 * Main transformations:
 * 1. Remove applyExtensions() wrapper - Unistyles can't trace through function calls
 * 2. Optionally inline helper function results from prebuild cache
 *
 * Configuration:
 * ['@idealyst/theme/plugin', {
 *   cachePath: '.cache/idealyst-styles.json',  // Optional prebuild cache
 *   autoProcessPaths: ['@idealyst/components'], // Paths to process
 *   removeApplyExtensions: true,               // Strip applyExtensions wrapper
 * }]
 */

const nodePath = require('path');
const fs = require('fs');

// ============================================================================
// Cache Management (Optional - for prebuild integration)
// ============================================================================

let styleCache = null;
let cacheLoadAttempted = false;

function loadCache(cachePath, rootDir) {
    if (cacheLoadAttempted) return styleCache;
    cacheLoadAttempted = true;

    if (!cachePath) return null;

    const resolved = nodePath.resolve(rootDir || process.cwd(), cachePath);

    try {
        if (fs.existsSync(resolved)) {
            const content = fs.readFileSync(resolved, 'utf-8');
            styleCache = JSON.parse(content);
        }
    } catch (err) {
        // Cache not available - that's ok
    }

    return styleCache;
}

// ============================================================================
// AST Generation from Cache
// ============================================================================

/**
 * Convert cached value to Babel AST.
 * Handles __themeRef markers, arrays, objects, and primitives.
 */
function cacheValueToAST(t, value, themeId = 'theme') {
    if (value === null) return t.nullLiteral();
    if (value === undefined) return t.identifier('undefined');

    if (typeof value === 'object' && value !== null) {
        // Theme reference: { __themeRef: "colors.primary" }
        if (value.__themeRef) {
            return pathToMemberExpr(t, themeId, value.__themeRef);
        }

        // Undefined marker
        if (value.__undefined) {
            return t.identifier('undefined');
        }

        // Function marker - keep as arrow function
        if (value.__fn) {
            if (value.error) {
                return t.arrowFunctionExpression(
                    [t.identifier('_props')],
                    t.objectExpression([])
                );
            }

            // Static function - just return the result directly
            if (value.static) {
                const resultAST = cacheValueToAST(t, value.result, themeId);
                return t.arrowFunctionExpression(
                    [t.identifier('_props')],
                    resultAST
                );
            }

            // Dynamic function with props - we need to preserve the function nature
            // but we've lost the exact props-to-theme mapping
            // For now, return as-is (function returning the captured result)
            const resultAST = cacheValueToAST(t, value.result, themeId);
            return t.arrowFunctionExpression(
                [t.identifier('_props')],
                resultAST
            );
        }

        // Array
        if (Array.isArray(value)) {
            return t.arrayExpression(
                value.map(v => cacheValueToAST(t, v, themeId))
            );
        }

        // Object
        const props = [];
        for (const key of Object.keys(value)) {
            const keyNode = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
                ? t.identifier(key)
                : t.stringLiteral(key);

            props.push(t.objectProperty(keyNode, cacheValueToAST(t, value[key], themeId)));
        }
        return t.objectExpression(props);
    }

    // Primitives
    if (typeof value === 'string') return t.stringLiteral(value);
    if (typeof value === 'number') {
        if (Number.isNaN(value)) return t.identifier('NaN');
        if (!Number.isFinite(value)) {
            return value > 0
                ? t.identifier('Infinity')
                : t.unaryExpression('-', t.identifier('Infinity'));
        }
        return t.numericLiteral(value);
    }
    if (typeof value === 'boolean') return t.booleanLiteral(value);

    return t.identifier('undefined');
}

/**
 * Convert dot path to MemberExpression: "a.b.c" -> theme.a.b.c
 */
function pathToMemberExpr(t, base, path) {
    let expr = t.identifier(base);

    for (const part of path.split('.')) {
        const arrayMatch = part.match(/^\[(\d+)\]$/);
        if (arrayMatch) {
            const idx = parseInt(arrayMatch[1], 10);
            expr = t.memberExpression(expr, t.numericLiteral(idx), true);
        } else if (part) {
            expr = t.memberExpression(expr, t.identifier(part));
        }
    }

    return expr;
}

// ============================================================================
// Babel Plugin
// ============================================================================

module.exports = function idealystStylesPlugin({ types: t }) {
    let debugMode = false;
    // Map of function name -> function node (for inlining)
    let localFunctions = new Map();

    function debug(...args) {
        if (debugMode) {
            console.log('[idealyst-plugin]', ...args);
        }
    }

    /**
     * Clone an AST node deeply, replacing identifier references.
     * @param {Object} node - AST node to clone
     * @param {Map<string, Object>} replacements - Map of identifier name -> replacement node
     */
    function cloneWithReplacements(node, replacements) {
        if (!node || typeof node !== 'object') return node;

        // Handle identifier replacement
        if (t.isIdentifier(node) && replacements.has(node.name)) {
            return t.cloneDeep(replacements.get(node.name));
        }

        // Clone the node
        const cloned = t.cloneDeep(node);
        return cloned;
    }

    /**
     * Inline a function call if the function is defined locally.
     * Returns the inlined body or null if can't inline.
     * @param {Set<string>} inliningStack - Track functions being inlined to prevent recursion
     */
    function tryInlineFunction(callExpr, themeParamName, inliningStack = new Set()) {
        if (!t.isIdentifier(callExpr.callee)) return null;

        const fnName = callExpr.callee.name;

        // Prevent infinite recursion
        if (inliningStack.has(fnName)) {
            debug(`    Skipping ${fnName}: already in inlining stack (would cause recursion)`);
            return null;
        }

        const fnNode = localFunctions.get(fnName);
        if (!fnNode) return null;

        debug(`  Attempting to inline function: ${fnName}`);

        // Get the function body
        let body = fnNode.body;
        const params = fnNode.params;

        // Build replacement map for parameters
        const replacements = new Map();
        for (let i = 0; i < params.length; i++) {
            if (t.isIdentifier(params[i]) && callExpr.arguments[i]) {
                replacements.set(params[i].name, callExpr.arguments[i]);
            }
        }

        // If body is a block statement with a return, extract the return value
        if (t.isBlockStatement(body)) {
            const returnStmt = body.body.find(stmt => t.isReturnStatement(stmt));
            if (returnStmt && returnStmt.argument) {
                body = returnStmt.argument;
            } else {
                debug(`    Cannot inline ${fnName}: no return statement found`);
                return null;
            }
        }

        // Clone the body and replace parameter references
        const cloned = t.cloneDeep(body);

        // Add current function to stack before recursing
        const newStack = new Set(inliningStack);
        newStack.add(fnName);

        // Simple replacement without traverse (to avoid recursion issues)
        // Replace identifiers that match parameter names
        function replaceInNode(node) {
            if (!node || typeof node !== 'object') return node;

            // Handle arrays
            if (Array.isArray(node)) {
                return node.map(replaceInNode);
            }

            // Handle identifier replacement
            if (t.isIdentifier(node) && replacements.has(node.name)) {
                return t.cloneDeep(replacements.get(node.name));
            }

            // Handle nested function calls - inline them too
            if (t.isCallExpression(node) && t.isIdentifier(node.callee) && localFunctions.has(node.callee.name)) {
                // First replace parameters in the arguments
                const newArgs = node.arguments.map(replaceInNode);
                const newCall = t.callExpression(node.callee, newArgs);
                const inlined = tryInlineFunction(newCall, themeParamName, newStack);
                if (inlined) {
                    return inlined;
                }
            }

            // Recursively process object properties
            const newNode = { ...node };
            for (const key of Object.keys(node)) {
                if (key === 'type' || key === 'start' || key === 'end' || key === 'loc') continue;
                if (node[key] && typeof node[key] === 'object') {
                    newNode[key] = replaceInNode(node[key]);
                }
            }
            return newNode;
        }

        const result = replaceInNode(cloned);
        debug(`    Successfully inlined ${fnName}`);
        return result;
    }

    return {
        name: 'idealyst-styles',

        visitor: {
            Program: {
                enter(path, state) {
                    const opts = state.opts || {};
                    debugMode = opts.debug === true;
                    const cachePath = opts.cachePath;
                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    loadCache(cachePath, rootDir);

                    // Reset local functions map for each file
                    localFunctions = new Map();

                    // Collect all function declarations in the file
                    path.traverse({
                        FunctionDeclaration(fnPath) {
                            if (fnPath.node.id && t.isIdentifier(fnPath.node.id)) {
                                const name = fnPath.node.id.name;
                                localFunctions.set(name, fnPath.node);
                                debug(`Collected function: ${name}`);
                            }
                        },
                        VariableDeclarator(varPath) {
                            // Also collect arrow functions assigned to variables
                            // const foo = (theme) => { ... }
                            if (t.isIdentifier(varPath.node.id) &&
                                (t.isArrowFunctionExpression(varPath.node.init) ||
                                 t.isFunctionExpression(varPath.node.init))) {
                                const name = varPath.node.id.name;
                                localFunctions.set(name, varPath.node.init);
                                debug(`Collected arrow function: ${name}`);
                            }
                        },
                    });
                },
            },

            CallExpression(path, state) {
                const { node } = path;
                const opts = state.opts || {};
                debugMode = opts.debug === true;
                const filename = state.filename || '';

                // Check if we should process this file
                const shouldProcess =
                    opts.processAll ||
                    (opts.autoProcessPaths?.some(p => filename.includes(p)));

                if (!shouldProcess) {
                    // Only log once per file for skipped files
                    if (debugMode && t.isIdentifier(node.callee, { name: 'applyExtensions' })) {
                        debug(`SKIP (path not matched): ${filename}`);
                        debug(`  autoProcessPaths: ${JSON.stringify(opts.autoProcessPaths)}`);
                    }
                    return;
                }

                // ============================================================
                // Transform 1: Remove applyExtensions wrapper
                // ============================================================
                // Pattern A - Direct return:
                //   return applyExtensions('Button', theme, { button: ... })
                //   -> return { button: ... }
                //
                // Pattern B - Variable + spread (handled in parent):
                //   const extended = applyExtensions(...);
                //   return { ...extended };
                //   -> return { ... }

                if (opts.removeApplyExtensions !== false) {
                    if (t.isIdentifier(node.callee, { name: 'applyExtensions' })) {
                        debug(`FOUND applyExtensions in: ${filename}`);

                        // applyExtensions(componentName, theme, stylesObject)
                        const [componentNameArg, , stylesArg] = node.arguments;

                        if (stylesArg && (t.isObjectExpression(stylesArg) || t.isIdentifier(stylesArg))) {
                            const componentName = t.isStringLiteral(componentNameArg)
                                ? componentNameArg.value
                                : 'unknown';

                            // Check if this is Pattern B: const extended = applyExtensions(...)
                            const varDeclarator = path.parentPath;
                            if (varDeclarator && t.isVariableDeclarator(varDeclarator.node)) {
                                const varName = varDeclarator.node.id.name;
                                const varDeclaration = varDeclarator.parentPath;
                                const blockStatement = varDeclaration?.parentPath;

                                // Find return statement with { ...extended }
                                if (blockStatement && t.isBlockStatement(blockStatement.node)) {
                                    const returnStmt = blockStatement.node.body.find(
                                        stmt => t.isReturnStatement(stmt)
                                    );

                                    if (returnStmt &&
                                        t.isObjectExpression(returnStmt.argument) &&
                                        returnStmt.argument.properties.length === 1 &&
                                        t.isSpreadElement(returnStmt.argument.properties[0]) &&
                                        t.isIdentifier(returnStmt.argument.properties[0].argument, { name: varName })) {

                                        debug(`TRANSFORMING Pattern B: const ${varName} = applyExtensions('${componentName}', ...) + spread`);

                                        // Find the arrow function and replace its body with direct return
                                        const arrowFn = blockStatement.parentPath;
                                        if (arrowFn && (t.isArrowFunctionExpression(arrowFn.node) || t.isFunctionExpression(arrowFn.node))) {
                                            // Replace block body with direct expression return
                                            arrowFn.node.body = stylesArg;
                                            debug(`  -> Converted to direct return`);
                                            return;
                                        }
                                    }
                                }
                            }

                            // Pattern A: Direct return - convert block body to expression body
                            // Find if we're inside: return applyExtensions(...)
                            const parentReturn = path.parentPath;
                            if (parentReturn && t.isReturnStatement(parentReturn.node)) {
                                const blockPath = parentReturn.parentPath;
                                if (blockPath && t.isBlockStatement(blockPath.node)) {
                                    const fnPath = blockPath.parentPath;
                                    if (fnPath && t.isArrowFunctionExpression(fnPath.node)) {
                                        // Check if return is the only statement
                                        if (blockPath.node.body.length === 1) {
                                            debug(`TRANSFORMING Pattern A: applyExtensions('${componentName}', ...) -> expression body`);
                                            // Replace the entire arrow function body with expression body
                                            fnPath.get('body').replaceWith(stylesArg);
                                            return;
                                        }
                                    }
                                }
                            }

                            // Fallback: just replace the call (keeps return statement)
                            debug(`TRANSFORMING Pattern A (fallback): applyExtensions('${componentName}', ...) -> styles object`);
                            path.replaceWith(stylesArg);
                            return;
                        } else {
                            debug(`SKIP transform - stylesArg is not ObjectExpression or Identifier`);
                            debug(`  stylesArg type: ${stylesArg?.type}`);
                        }
                    }
                }

                // ============================================================
                // Transform 2: Inline local function calls in StyleSheet.create
                // ============================================================
                // StyleSheet.create((theme) => ({ view: createViewStyles(theme) }))
                // -> StyleSheet.create((theme) => ({ view: { ...inlined body... } }))

                if (!t.isMemberExpression(node.callee)) return;
                if (!t.isIdentifier(node.callee.object, { name: 'StyleSheet' })) return;
                if (!t.isIdentifier(node.callee.property, { name: 'create' })) return;

                debug(`FOUND StyleSheet.create in: ${filename}`);

                const callback = node.arguments[0];
                if (!t.isArrowFunctionExpression(callback) && !t.isFunctionExpression(callback)) return;

                let themeParam = 'theme';
                if (callback.params?.[0] && t.isIdentifier(callback.params[0])) {
                    themeParam = callback.params[0].name;
                }

                // Inline function calls if enabled
                if (opts.inlineFunctions !== false && localFunctions.size > 0) {
                    debug(`  Inlining functions in StyleSheet.create (${localFunctions.size} local functions available)`);

                    // Traverse the callback body and inline function calls
                    path.traverse({
                        CallExpression(callPath) {
                            if (!t.isIdentifier(callPath.node.callee)) return;

                            const fnName = callPath.node.callee.name;
                            if (!localFunctions.has(fnName)) return;

                            const inlined = tryInlineFunction(callPath.node, themeParam);
                            if (inlined) {
                                debug(`    Inlined: ${fnName}`);
                                callPath.replaceWith(inlined);
                            }
                        },
                    });
                }

                // If we have cache data, try to use it (legacy support)
                if (styleCache?.files && opts.cachePath) {
                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    const relativePath = nodePath.relative(rootDir, filename).replace(/\\/g, '/');

                    const cachedData = styleCache.files[relativePath];
                    if (cachedData?.[0]?.styles) {
                        const cachedStyles = cachedData[0].styles;
                        const newBody = cacheValueToAST(t, cachedStyles, themeParam);
                        callback.body = newBody;
                    }
                }
            },

            // ============================================================
            // Transform 3: Remove applyExtensions import
            // ============================================================
            ImportDeclaration(path, state) {
                const opts = state.opts || {};
                debugMode = opts.debug === true;
                const filename = state.filename || '';

                const shouldProcess =
                    opts.processAll ||
                    (opts.autoProcessPaths?.some(p => filename.includes(p)));

                if (!shouldProcess) return;
                if (opts.removeApplyExtensions === false) return;

                const source = path.node.source.value;

                // Check if this imports applyExtensions
                if (source.includes('extensions/applyExtension') ||
                    source === '../extensions/applyExtension') {

                    debug(`FOUND applyExtensions import in: ${filename}`);
                    debug(`  source: ${source}`);

                    // Filter out applyExtensions from specifiers
                    const remaining = path.node.specifiers.filter(spec => {
                        if (t.isImportSpecifier(spec)) {
                            const name = t.isIdentifier(spec.imported)
                                ? spec.imported.name
                                : spec.imported.value;
                            return name !== 'applyExtensions';
                        }
                        return true;
                    });

                    if (remaining.length === 0) {
                        // Remove entire import
                        debug(`REMOVING entire import`);
                        path.remove();
                    } else if (remaining.length < path.node.specifiers.length) {
                        // Update specifiers
                        debug(`REMOVING applyExtensions from import specifiers`);
                        path.node.specifiers = remaining;
                    }
                }
            },
        },
    };
};

// Export for testing
module.exports.cacheValueToAST = cacheValueToAST;
module.exports.pathToMemberExpr = pathToMemberExpr;
