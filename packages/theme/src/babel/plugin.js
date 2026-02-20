/**
 * Idealyst StyleBuilder Babel Plugin
 *
 * Transforms defineStyle/extendStyle calls to StyleSheet.create with $iterator expansion.
 * All merging happens at BUILD TIME so Unistyles can properly trace theme dependencies.
 *
 * IMPORTANT: For extensions to work, the extension file must be imported BEFORE
 * the components that use defineStyle. Example:
 *
 *   // App.tsx
 *   import './style-extensions'; // FIRST - registers extensions
 *   import { Text } from '@idealyst/components'; // SECOND - uses extensions
 *
 * Transformation:
 *   defineStyle('Button', (theme) => ({
 *     button: { backgroundColor: theme.$intents.primary }
 *   }))
 *
 *   → StyleSheet.create((theme) => ({
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
 */

// Theme analysis is provided by @idealyst/tooling (single source of truth)
// This uses the TypeScript Compiler API for accurate theme extraction
let loadThemeKeys;
try {
  // Try to load from @idealyst/tooling (TypeScript-based analyzer)
  // This is the preferred path as it's the single source of truth
  const tooling = require('@idealyst/tooling');
  loadThemeKeys = tooling.loadThemeKeys;
} catch (e) {
  // Fallback to local implementation if tooling can't be loaded
  // (e.g., when TypeScript runtime is not available)
  loadThemeKeys = require('./theme-analyzer').loadThemeKeys;
}

// ============================================================================
// Global Extension Registry - Persists across files during build
// ============================================================================

// Map of componentName -> { base: AST | null, extensions: AST[], overrides: AST | null }
const styleRegistry = {};

function getOrCreateEntry(componentName) {
    if (!styleRegistry[componentName]) {
        styleRegistry[componentName] = {
            base: null,
            extensions: [],
            override: null,
            themeParam: 'theme',
        };
    }
    return styleRegistry[componentName];
}

// ============================================================================
// AST Deep Merge - Merges style object ASTs at build time
// ============================================================================

// Platform-specific keys used by Unistyles
const PLATFORM_KEYS = new Set(['_web', '_ios', '_android']);

/**
 * Deep merge two ObjectExpression ASTs.
 * Source properties override target properties.
 * Nested objects are recursively merged.
 *
 * Also propagates extension properties into platform-specific blocks (_web, _ios, _android)
 * when those blocks already contain the same key. This ensures that e.g. setting
 * `fontFamily: 'MyFont'` in an extension properly overrides `_web: { fontFamily: 'inherit' }`
 * in the base styles.
 */
function mergeObjectExpressions(t, target, source) {
    if (!t.isObjectExpression(target) || !t.isObjectExpression(source)) {
        // If source is not an object, it replaces target entirely
        return source;
    }

    const targetProps = new Map();
    for (const prop of target.properties) {
        if (t.isObjectProperty(prop)) {
            const key = t.isIdentifier(prop.key) ? prop.key.name :
                        t.isStringLiteral(prop.key) ? prop.key.value : null;
            if (key) {
                targetProps.set(key, prop);
            }
        }
    }

    const resultProps = [...target.properties];

    // Collect non-platform source property keys and values for propagation
    const sourceNonPlatformProps = new Map();

    for (const prop of source.properties) {
        if (!t.isObjectProperty(prop)) continue;

        const key = t.isIdentifier(prop.key) ? prop.key.name :
                    t.isStringLiteral(prop.key) ? prop.key.value : null;
        if (!key) continue;

        if (!PLATFORM_KEYS.has(key)) {
            sourceNonPlatformProps.set(key, prop);
        }

        const existingProp = targetProps.get(key);

        if (existingProp) {
            // Both have this property - need to merge or replace
            const existingValue = existingProp.value;
            const newValue = prop.value;

            // If both are objects, deep merge
            if (t.isObjectExpression(existingValue) && t.isObjectExpression(newValue)) {
                const mergedValue = mergeObjectExpressions(t, existingValue, newValue);
                // Replace the existing prop's value
                const idx = resultProps.indexOf(existingProp);
                resultProps[idx] = t.objectProperty(existingProp.key, mergedValue);
            }
            // If both are arrow functions (dynamic styles), merge their return values
            else if (t.isArrowFunctionExpression(existingValue) && t.isArrowFunctionExpression(newValue)) {
                const mergedFn = mergeDynamicStyleFunctions(t, existingValue, newValue);
                const idx = resultProps.indexOf(existingProp);
                resultProps[idx] = t.objectProperty(existingProp.key, mergedFn);
            }
            // Otherwise, source replaces target
            else {
                const idx = resultProps.indexOf(existingProp);
                resultProps[idx] = prop;
            }
        } else {
            // New property from source
            resultProps.push(prop);
        }
    }

    // Propagate extension properties into platform-specific blocks.
    // If the base has _web: { fontFamily: 'inherit' } and the extension sets
    // fontFamily: 'MyFont' at the top level, we need to also override fontFamily
    // inside the _web block so the platform-specific value doesn't shadow the extension.
    if (sourceNonPlatformProps.size > 0) {
        for (let i = 0; i < resultProps.length; i++) {
            const prop = resultProps[i];
            if (!t.isObjectProperty(prop)) continue;

            const key = t.isIdentifier(prop.key) ? prop.key.name :
                        t.isStringLiteral(prop.key) ? prop.key.value : null;
            if (!key || !PLATFORM_KEYS.has(key)) continue;
            if (!t.isObjectExpression(prop.value)) continue;

            // Check if any source properties conflict with keys in this platform block
            const platformProps = prop.value.properties;
            let modified = false;
            const newPlatformProps = [...platformProps];

            for (let j = 0; j < newPlatformProps.length; j++) {
                const platProp = newPlatformProps[j];
                if (!t.isObjectProperty(platProp)) continue;

                const platKey = t.isIdentifier(platProp.key) ? platProp.key.name :
                                t.isStringLiteral(platProp.key) ? platProp.key.value : null;
                if (!platKey) continue;

                const extProp = sourceNonPlatformProps.get(platKey);
                if (extProp) {
                    // Extension has a property that conflicts with this platform block key.
                    // Override the platform block value with the extension value.
                    newPlatformProps[j] = t.objectProperty(platProp.key, t.cloneDeep(extProp.value));
                    modified = true;
                }
            }

            if (modified) {
                resultProps[i] = t.objectProperty(prop.key, t.objectExpression(newPlatformProps));
            }
        }
    }

    return t.objectExpression(resultProps);
}

/**
 * Merge two dynamic style functions (arrow functions that return style objects).
 * Creates a new function that merges both return values.
 */
function mergeDynamicStyleFunctions(t, baseFn, extFn) {
    // Get the bodies (assuming they return ObjectExpressions)
    let baseBody = baseFn.body;
    let extBody = extFn.body;

    // Handle parenthesized expressions
    if (t.isParenthesizedExpression(baseBody)) {
        baseBody = baseBody.expression;
    }
    if (t.isParenthesizedExpression(extBody)) {
        extBody = extBody.expression;
    }

    // If both return ObjectExpressions directly, merge them
    if (t.isObjectExpression(baseBody) && t.isObjectExpression(extBody)) {
        const mergedBody = mergeObjectExpressions(t, baseBody, extBody);
        return t.arrowFunctionExpression(baseFn.params, mergedBody);
    }

    // For block statements, this is more complex - just use extension for now
    return extFn;
}

/**
 * Merge a callback body (the object returned by theme => ({ ... }))
 */
function mergeCallbackBodies(t, baseCallback, extCallback) {
    let baseBody = baseCallback.body;
    let extBody = extCallback.body;

    // Handle parenthesized expressions
    if (t.isParenthesizedExpression(baseBody)) {
        baseBody = baseBody.expression;
    }
    if (t.isParenthesizedExpression(extBody)) {
        extBody = extBody.expression;
    }

    if (t.isObjectExpression(baseBody) && t.isObjectExpression(extBody)) {
        const mergedBody = mergeObjectExpressions(t, baseBody, extBody);
        return t.arrowFunctionExpression(baseCallback.params, mergedBody);
    }

    // If can't merge, use base
    return baseCallback;
}

// ============================================================================
// $iterator Expansion Logic
// ============================================================================

function expandIterators(t, callback, themeParam, keys, verbose, expandedVariants) {
    const cloned = t.cloneDeep(callback);

    function processNode(node, depth = 0) {
        if (!node || typeof node !== 'object') return node;

        if (Array.isArray(node)) {
            return node.map(n => processNode(n, depth));
        }

        // Look for variants: { intent: { ... }, size: { ... } }
        if (t.isObjectProperty(node) && t.isIdentifier(node.key, { name: 'variants' })) {
            if (t.isObjectExpression(node.value)) {
                const expanded = expandVariantsObject(t, node.value, themeParam, keys, verbose, expandedVariants);
                return t.objectProperty(node.key, expanded);
            } else if (t.isTSAsExpression(node.value)) {
                const innerValue = node.value.expression;
                if (t.isObjectExpression(innerValue)) {
                    const expanded = expandVariantsObject(t, innerValue, themeParam, keys, verbose, expandedVariants);
                    return t.objectProperty(node.key, t.tsAsExpression(expanded, node.value.typeAnnotation));
                }
            }
        }

        // Look for compoundVariants: [ { type: 'filled', selected: true, styles: { ... } }, ... ]
        if (t.isObjectProperty(node) && t.isIdentifier(node.key, { name: 'compoundVariants' })) {
            if (t.isArrayExpression(node.value)) {
                const expanded = expandCompoundVariantsArray(t, node.value, themeParam, keys, verbose, expandedVariants);
                return t.objectProperty(node.key, expanded);
            }
        }

        if (t.isObjectExpression(node)) {
            return t.objectExpression(
                node.properties.map(prop => processNode(prop, depth + 1))
            );
        }

        if (t.isObjectProperty(node)) {
            return t.objectProperty(
                node.key,
                processNode(node.value, depth + 1),
                node.computed,
                node.shorthand
            );
        }

        if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node)) {
            let processedBody = processNode(node.body, depth + 1);

            // Convert block body with single return to arrow notation for Unistyles compatibility
            // This transforms: (props) => { return { ... } }
            // Into:            (props) => ({ ... })
            if (t.isBlockStatement(processedBody) && processedBody.body.length === 1) {
                const singleStmt = processedBody.body[0];
                if (t.isReturnStatement(singleStmt) && singleStmt.argument) {
                    // Use the return argument directly as the arrow function body
                    processedBody = singleStmt.argument;
                }
            }

            return t.arrowFunctionExpression(
                node.params,
                processedBody
            );
        }

        // Handle TSAsExpression (e.g., { ... } as const)
        if (t.isTSAsExpression(node)) {
            const processedExpr = processNode(node.expression, depth + 1);
            return t.tsAsExpression(processedExpr, node.typeAnnotation);
        }

        // Handle ParenthesizedExpression
        if (t.isParenthesizedExpression(node)) {
            const processedExpr = processNode(node.expression, depth + 1);
            return t.parenthesizedExpression(processedExpr);
        }

        // Handle BlockStatement (for nested arrow functions with block bodies)
        if (t.isBlockStatement(node)) {
            const newBody = node.body.map(stmt => {
                if (t.isReturnStatement(stmt) && stmt.argument) {
                    return t.returnStatement(processNode(stmt.argument, depth + 1));
                }
                // Handle variable declarations that might contain style objects
                if (t.isVariableDeclaration(stmt)) {
                    return t.variableDeclaration(
                        stmt.kind,
                        stmt.declarations.map(decl => {
                            if (decl.init) {
                                return t.variableDeclarator(decl.id, processNode(decl.init, depth + 1));
                            }
                            return decl;
                        })
                    );
                }
                return stmt;
            });
            return t.blockStatement(newBody);
        }

        return node;
    }

    // Handle the callback body - may be ObjectExpression, TSAsExpression, ParenthesizedExpression, or BlockStatement
    let bodyToProcess = cloned.body;

    // Unwrap ParenthesizedExpression
    if (t.isParenthesizedExpression(bodyToProcess)) {
        bodyToProcess = bodyToProcess.expression;
    }

    // Unwrap TSAsExpression
    if (t.isTSAsExpression(bodyToProcess)) {
        const processedExpr = processNode(bodyToProcess.expression);
        cloned.body = t.tsAsExpression(processedExpr, bodyToProcess.typeAnnotation);
    } else if (t.isObjectExpression(bodyToProcess)) {
        cloned.body = processNode(bodyToProcess);
    } else if (t.isBlockStatement(cloned.body)) {
        cloned.body.body = cloned.body.body.map(stmt => {
            if (t.isReturnStatement(stmt) && stmt.argument) {
                return t.returnStatement(processNode(stmt.argument));
            }
            return stmt;
        });
    }

    return cloned;
}

function expandVariantsObject(t, variantsObj, themeParam, keys, verbose, expandedVariants) {
    const newProperties = [];

    verbose(`    expandVariantsObject: processing ${variantsObj.properties?.length || 0} properties`);

    for (const prop of variantsObj.properties) {
        if (!t.isObjectProperty(prop)) {
            newProperties.push(prop);
            continue;
        }

        let variantName;
        if (t.isIdentifier(prop.key)) {
            variantName = prop.key.name;
        } else if (t.isStringLiteral(prop.key)) {
            variantName = prop.key.value;
        } else {
            newProperties.push(prop);
            continue;
        }

        verbose(`      Checking variant: ${variantName}`);
        const iteratorInfo = findIteratorPattern(t, prop.value, themeParam);
        verbose(`      Iterator info for ${variantName}: ${JSON.stringify(iteratorInfo)}`);

        if (iteratorInfo) {
            verbose(`      Expanding ${variantName} variant with ${iteratorInfo.type} iterator`);
            verbose(`      Keys available: ${JSON.stringify(keys?.sizes?.[iteratorInfo.componentName] || keys?.intents || [])}`);
            const expanded = expandVariantWithIterator(t, prop.value, themeParam, keys, iteratorInfo, verbose);
            newProperties.push(t.objectProperty(prop.key, expanded));

            const iteratorKey = iteratorInfo.componentName
                ? `${iteratorInfo.type}.${iteratorInfo.componentName}`
                : iteratorInfo.type;
            expandedVariants.push({ variant: variantName, iterator: iteratorKey });
        } else {
            newProperties.push(prop);
        }
    }

    return t.objectExpression(newProperties);
}

/**
 * Expand $iterator patterns in compoundVariants arrays.
 *
 * Input:
 *   compoundVariants: [
 *     { type: 'filled', selected: true, styles: { backgroundColor: theme.$intents.contrast } }
 *   ]
 *
 * Output (for intents = ['primary', 'success', 'danger', ...]):
 *   compoundVariants: [
 *     { type: 'filled', selected: true, intent: 'primary', styles: { backgroundColor: theme.intents.primary.contrast } },
 *     { type: 'filled', selected: true, intent: 'success', styles: { backgroundColor: theme.intents.success.contrast } },
 *     { type: 'filled', selected: true, intent: 'danger', styles: { backgroundColor: theme.intents.danger.contrast } },
 *     ...
 *   ]
 */
function expandCompoundVariantsArray(t, arrayNode, themeParam, keys, verbose, expandedVariants) {
    const newElements = [];

    verbose(`    expandCompoundVariantsArray: processing ${arrayNode.elements?.length || 0} compound variants`);

    for (const element of arrayNode.elements) {
        if (!t.isObjectExpression(element)) {
            newElements.push(element);
            continue;
        }

        // Find the 'styles' property in this compound variant entry
        let stylesProperty = null;
        const otherProperties = [];

        for (const prop of element.properties) {
            if (t.isObjectProperty(prop)) {
                const keyName = t.isIdentifier(prop.key) ? prop.key.name :
                               t.isStringLiteral(prop.key) ? prop.key.value : null;
                if (keyName === 'styles') {
                    stylesProperty = prop;
                } else {
                    otherProperties.push(prop);
                }
            } else {
                otherProperties.push(prop);
            }
        }

        if (!stylesProperty) {
            // No styles property, keep as-is
            newElements.push(element);
            continue;
        }

        // Check if the styles object contains $iterator patterns
        const iteratorInfo = findIteratorPattern(t, stylesProperty.value, themeParam);

        if (!iteratorInfo) {
            // No $iterator pattern, keep as-is
            newElements.push(element);
            continue;
        }

        verbose(`      Found $iterator in compoundVariant styles: ${iteratorInfo.type}`);

        // Get keys to expand
        let keysToExpand = [];
        let variantKeyName = 'intent'; // Default for intents

        if (iteratorInfo.type === 'intents') {
            keysToExpand = keys?.intents || [];
            variantKeyName = 'intent';
        } else if (iteratorInfo.type === 'typography') {
            keysToExpand = keys?.typography || [];
            variantKeyName = 'typography';
        } else if (iteratorInfo.type === 'sizes' && iteratorInfo.componentName) {
            keysToExpand = keys?.sizes?.[iteratorInfo.componentName] || [];
            variantKeyName = 'size';
        } else if (iteratorInfo.type === 'surfaceColors') {
            keysToExpand = keys?.surfaceColors || [];
            variantKeyName = 'background';
        } else if (iteratorInfo.type === 'textColors') {
            keysToExpand = keys?.textColors || [];
            variantKeyName = 'color';
        } else if (iteratorInfo.type === 'borderColors') {
            keysToExpand = keys?.borderColors || [];
            variantKeyName = 'borderColor';
        }

        if (keysToExpand.length === 0) {
            // No keys to expand, keep as-is
            newElements.push(element);
            continue;
        }

        verbose(`      Expanding compoundVariant for ${keysToExpand.length} ${variantKeyName} keys`);

        // Expand this compound variant for each key
        for (const key of keysToExpand) {
            // Replace $iterator refs in the styles
            const expandedStyles = replaceIteratorRefs(t, stylesProperty.value, themeParam, iteratorInfo, key);

            // Create new compound variant entry with the variant key added as a condition
            const newProps = [
                ...otherProperties.map(p => t.cloneDeep(p)),
                t.objectProperty(t.identifier(variantKeyName), t.stringLiteral(key)),
                t.objectProperty(t.identifier('styles'), expandedStyles),
            ];

            newElements.push(t.objectExpression(newProps));
        }

        expandedVariants.push({ variant: 'compoundVariants', iterator: iteratorInfo.type });
    }

    return t.arrayExpression(newElements);
}

function findIteratorPattern(t, node, themeParam, debugLog = () => {}) {
    let result = null;

    function walk(n, path = '') {
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

                        // $typography is a top-level iterator (uses typography keys)
                        // Pattern: theme.sizes.$typography.fontSize expands to h1, h2, body1, etc.
                        if (iteratorName === 'typography') {
                            result = {
                                type: 'typography',
                                accessPath: chain.slice(i + 1),
                            };
                            return;
                        }

                        // Color iterators: theme.colors.$surface, theme.colors.$text, theme.colors.$border
                        // Pattern: theme.colors.$surface expands to screen, primary, secondary, etc.
                        if (i > 0 && chain[i - 1] === 'colors') {
                            if (iteratorName === 'surface') {
                                result = {
                                    type: 'surfaceColors',
                                    accessPath: chain.slice(i + 1),
                                };
                                return;
                            }
                            if (iteratorName === 'text') {
                                result = {
                                    type: 'textColors',
                                    accessPath: chain.slice(i + 1),
                                };
                                return;
                            }
                            if (iteratorName === 'border') {
                                result = {
                                    type: 'borderColors',
                                    accessPath: chain.slice(i + 1),
                                };
                                return;
                            }
                        }

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

function expandVariantWithIterator(t, valueNode, themeParam, keys, iteratorInfo, verbose) {
    let keysToExpand = [];

    if (iteratorInfo.type === 'intents') {
        keysToExpand = keys?.intents || [];
    } else if (iteratorInfo.type === 'typography') {
        // Typography is a top-level key array (h1, h2, body1, etc.)
        keysToExpand = keys?.typography || [];
    } else if (iteratorInfo.type === 'sizes' && iteratorInfo.componentName) {
        keysToExpand = keys?.sizes?.[iteratorInfo.componentName] || [];
    } else if (iteratorInfo.type === 'surfaceColors') {
        keysToExpand = keys?.surfaceColors || [];
    } else if (iteratorInfo.type === 'textColors') {
        keysToExpand = keys?.textColors || [];
    } else if (iteratorInfo.type === 'borderColors') {
        keysToExpand = keys?.borderColors || [];
    }

    if (keysToExpand.length === 0) {
        return valueNode;
    }

    verbose(`        Expanding to keys: ${keysToExpand.join(', ')}`);

    const expandedProps = [];

    for (const key of keysToExpand) {
        const expandedValue = replaceIteratorRefs(t, valueNode, themeParam, iteratorInfo, key);
        // Use string literal for keys with special characters (like hyphens)
        // e.g., 'inverse-secondary' cannot be a valid identifier
        const keyNode = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
            ? t.identifier(key)
            : t.stringLiteral(key);
        expandedProps.push(
            t.objectProperty(
                keyNode,
                expandedValue
            )
        );
    }

    return t.objectExpression(expandedProps);
}

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
                        // Typography iterator: theme.sizes.$typography.X -> theme.sizes.typography.{key}.X
                        if (iteratorInfo.type === 'typography' && iterName === 'typography') {
                            hasIterator = true;
                            dollarIndex = i;
                            break;
                        }
                        if (iteratorInfo.type === 'sizes' && iterName === iteratorInfo.componentName && i > 0 && chain[i - 1] === 'sizes') {
                            hasIterator = true;
                            dollarIndex = i;
                            break;
                        }
                        // Color iterators: theme.colors.$surface -> theme.colors.surface.{key}
                        if (iteratorInfo.type === 'surfaceColors' && iterName === 'surface' && i > 0 && chain[i - 1] === 'colors') {
                            hasIterator = true;
                            dollarIndex = i;
                            break;
                        }
                        if (iteratorInfo.type === 'textColors' && iterName === 'text' && i > 0 && chain[i - 1] === 'colors') {
                            hasIterator = true;
                            dollarIndex = i;
                            break;
                        }
                        if (iteratorInfo.type === 'borderColors' && iterName === 'border' && i > 0 && chain[i - 1] === 'colors') {
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

function buildMemberExpression(t, base, chain) {
    let expr = t.identifier(base);
    for (const part of chain) {
        // Use bracket notation for keys with special characters (like hyphens)
        // e.g., theme.colors.surface['inverse-secondary'] instead of theme.colors.surface.inverse-secondary
        const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(part);
        if (isValidIdentifier) {
            // Use optional chaining to avoid crashes when theme values are undefined
            expr = t.optionalMemberExpression(expr, t.identifier(part), false, true);
        } else {
            // computed = true, optional = true
            expr = t.optionalMemberExpression(expr, t.stringLiteral(part), true, true);
        }
    }
    return expr;
}

// ============================================================================
// Babel Plugin
// ============================================================================

module.exports = function idealystStylesPlugin({ types: t }) {
    // Store babel types for use in extractThemeKeysFromAST
    babelTypes = t;

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
                    const filename = state.filename || '';
                    const opts = state.opts || {};

                    // Check if this file should be processed
                    const shouldProcess =
                        opts.processAll ||
                        (opts.autoProcessPaths?.some(p => filename.includes(p)));

                    state.needsStyleSheetImport = false;
                    state.hasStyleSheetImport = false;

                    path.traverse({
                        ImportDeclaration(importPath) {
                            if (importPath.node.source.value === 'react-native-unistyles') {
                                for (const spec of importPath.node.specifiers) {
                                    if (t.isImportSpecifier(spec) &&
                                        t.isIdentifier(spec.imported, { name: 'StyleSheet' })) {
                                        state.hasStyleSheetImport = true;
                                    }
                                }
                                state.unistylesImportPath = importPath;
                            }
                        }
                    });
                },
                exit(path, state) {
                    // Always ensure StyleSheet import and marker when needed
                    // (existing import might have been removed by tree-shaking)
                    if (state.needsStyleSheetImport) {
                        // Check if StyleSheet is currently in the AST
                        let hasStyleSheet = false;
                        let hasVoidMarker = false;
                        let unistylesImport = null;

                        path.traverse({
                            ImportDeclaration(importPath) {
                                if (importPath.node.source.value === 'react-native-unistyles') {
                                    unistylesImport = importPath;
                                    for (const spec of importPath.node.specifiers) {
                                        if (t.isImportSpecifier(spec) &&
                                            t.isIdentifier(spec.imported, { name: 'StyleSheet' })) {
                                            hasStyleSheet = true;
                                        }
                                    }
                                }
                            },
                            // Check for existing void StyleSheet; marker
                            ExpressionStatement(exprPath) {
                                if (t.isUnaryExpression(exprPath.node.expression, { operator: 'void' }) &&
                                    t.isIdentifier(exprPath.node.expression.argument, { name: 'StyleSheet' })) {
                                    hasVoidMarker = true;
                                }
                            }
                        });

                        if (!hasStyleSheet) {
                            if (unistylesImport) {
                                // Add StyleSheet to existing import
                                unistylesImport.node.specifiers.push(
                                    t.importSpecifier(t.identifier('StyleSheet'), t.identifier('StyleSheet'))
                                );
                            } else {
                                // Create new import
                                const importDecl = t.importDeclaration(
                                    [t.importSpecifier(t.identifier('StyleSheet'), t.identifier('StyleSheet'))],
                                    t.stringLiteral('react-native-unistyles')
                                );
                                path.unshiftContainer('body', importDecl);
                            }
                        }

                        // Add void StyleSheet; marker so Unistyles detects the file
                        // This must be present for Unistyles to process the file
                        if (!hasVoidMarker) {
                            const voidMarker = t.expressionStatement(
                                t.unaryExpression('void', t.identifier('StyleSheet'))
                            );
                            // Insert after imports (find first non-import statement)
                            const body = path.node.body;
                            let insertIndex = 0;
                            for (let i = 0; i < body.length; i++) {
                                if (!t.isImportDeclaration(body[i])) {
                                    insertIndex = i;
                                    break;
                                }
                                insertIndex = i + 1;
                            }
                            body.splice(insertIndex, 0, voidMarker);
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

                const shouldProcess =
                    opts.processAll ||
                    (opts.autoProcessPaths?.some(p => filename.includes(p)));

                // extendStyle/overrideStyle must ALWAYS be processed regardless of
                // shouldProcess, since they are called from user code (not just from
                // @idealyst/* packages). Only defineStyle and StyleSheet.create
                // $iterator expansion are gated by autoProcessPaths.

                // ============================================================
                // Handle extendStyle - Store extension AST for later merging
                // ============================================================
                if (t.isIdentifier(node.callee, { name: 'extendStyle' })) {
                    debug(`FOUND extendStyle in: ${filename}`);

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
                    debug(`  Processing extendStyle('${componentName}')`);

                    // Get theme parameter name
                    let themeParam = 'theme';
                    if (stylesCallback.params?.[0] && t.isIdentifier(stylesCallback.params[0])) {
                        themeParam = stylesCallback.params[0].name;
                    }

                    // Load theme keys and expand iterators
                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    const keys = loadThemeKeys(opts, rootDir, t, verboseMode);
                    const expandedVariants = [];
                    const expandedCallback = expandIterators(t, stylesCallback, themeParam, keys, verbose, expandedVariants);

                    // Store in registry for later merging
                    const entry = getOrCreateEntry(componentName);
                    entry.extensions.push(expandedCallback);
                    entry.themeParam = themeParam;

                    debug(`  -> Stored extension for '${componentName}' (${entry.extensions.length} total)`);

                    // Remove the extendStyle call (it's been captured)
                    path.remove();
                    return;
                }

                // ============================================================
                // Handle overrideStyle - Store as override (replaces base)
                // ============================================================
                if (t.isIdentifier(node.callee, { name: 'overrideStyle' })) {
                    debug(`FOUND overrideStyle in: ${filename}`);

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
                    debug(`  Processing overrideStyle('${componentName}')`);

                    let themeParam = 'theme';
                    if (stylesCallback.params?.[0] && t.isIdentifier(stylesCallback.params[0])) {
                        themeParam = stylesCallback.params[0].name;
                    }

                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    const keys = loadThemeKeys(opts, rootDir, t, verboseMode);
                    const expandedVariants = [];
                    const expandedCallback = expandIterators(t, stylesCallback, themeParam, keys, verbose, expandedVariants);

                    // Store as override (replaces base entirely)
                    const entry = getOrCreateEntry(componentName);
                    entry.override = expandedCallback;
                    entry.themeParam = themeParam;

                    debug(`  -> Stored override for '${componentName}'`);

                    // Remove the overrideStyle call
                    path.remove();
                    return;
                }

                // defineStyle and StyleSheet.create are only processed for files
                // matching autoProcessPaths (i.e., framework packages)
                if (!shouldProcess) return;

                // ============================================================
                // Handle defineStyle - Merge with extensions and output StyleSheet.create
                // ============================================================
                if (t.isIdentifier(node.callee, { name: 'defineStyle' })) {
                    debug(`FOUND defineStyle in: ${filename}`);

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
                    debug(`  Processing defineStyle('${componentName}')`);

                    let themeParam = 'theme';
                    if (stylesCallback.params?.[0] && t.isIdentifier(stylesCallback.params[0])) {
                        themeParam = stylesCallback.params[0].name;
                    }

                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    const keys = loadThemeKeys(opts, rootDir, t, verboseMode);
                    const expandedVariants = [];

                    // Debug for View only (verbose mode)
                    if (verboseMode && componentName === 'View') {
                        verbose(`\n========== VIEW KEYS DEBUG ==========`);
                        verbose(`rootDir: ${rootDir}`);
                        verbose(`keys.sizes.view: ${JSON.stringify(keys?.sizes?.view)}`);
                        verbose(`keys.intents: ${JSON.stringify(keys?.intents)}`);
                        verbose(`======================================\n`);
                    }

                    try {
                        // Expand iterators in the base callback
                        let expandedCallback = expandIterators(t, stylesCallback, themeParam, keys, verbose, expandedVariants);

                        // Check for registered override or extensions
                        const entry = getOrCreateEntry(componentName);

                        if (entry.override) {
                            // Override completely replaces base
                            debug(`  -> Using override for '${componentName}'`);
                            expandedCallback = entry.override;
                        } else if (entry.extensions.length > 0) {
                            // Merge extensions into base
                            debug(`  -> Merging ${entry.extensions.length} extensions for '${componentName}'`);
                            for (const ext of entry.extensions) {
                                expandedCallback = mergeCallbackBodies(t, expandedCallback, ext);
                            }
                        }

                        if (!expandedCallback) {
                            console.error(`[idealyst-plugin] ERROR: expandedCallback is null/undefined for ${componentName}`);
                            return;
                        }

                        // Transform to StyleSheet.create
                        state.needsStyleSheetImport = true;

                        const newCall = t.callExpression(
                            t.memberExpression(
                                t.identifier('StyleSheet'),
                                t.identifier('create')
                            ),
                            [expandedCallback]
                        );

                        path.replaceWith(newCall);

                        debug(`  -> Transformed to StyleSheet.create`);
                        if (expandedVariants.length > 0) {
                            debug(`     Expanded: ${expandedVariants.map(v => `${v.variant}(${v.iterator})`).join(', ')}`);
                        }

                        // Output generated code when verbose
                        if (verboseMode) {
                            const generate = require('@babel/generator').default;
                            const output = generate(newCall);
                            console.log(`[idealyst-plugin] Generated code for ${componentName}:`);
                            console.log(output.code.substring(0, 2000) + (output.code.length > 2000 ? '...' : ''));
                        }
                    } catch (err) {
                        console.error(`[idealyst-plugin] ERROR transforming defineStyle('${componentName}'):`, err);
                    }
                    return;
                }

                // ============================================================
                // Handle StyleSheet.create - Just expand $iterator patterns
                // ============================================================
                if (t.isMemberExpression(node.callee) &&
                    t.isIdentifier(node.callee.object, { name: 'StyleSheet' }) &&
                    t.isIdentifier(node.callee.property, { name: 'create' })) {

                    const [stylesCallback] = node.arguments;

                    if (!t.isArrowFunctionExpression(stylesCallback) &&
                        !t.isFunctionExpression(stylesCallback)) {
                        return;
                    }

                    let themeParam = 'theme';
                    if (stylesCallback.params?.[0] && t.isIdentifier(stylesCallback.params[0])) {
                        themeParam = stylesCallback.params[0].name;
                    }

                    const rootDir = opts.rootDir || state.cwd || process.cwd();
                    const keys = loadThemeKeys(opts, rootDir, t, verboseMode);
                    const expandedVariants = [];

                    const expandedCallback = expandIterators(t, stylesCallback, themeParam, keys, verbose, expandedVariants);
                    node.arguments[0] = expandedCallback;

                    if (expandedVariants.length > 0) {
                        debug(`  -> Expanded $iterator patterns in StyleSheet.create: ${expandedVariants.map(v => `${v.variant}(${v.iterator})`).join(', ')}`);
                    }
                }
            },
        },
    };
};
