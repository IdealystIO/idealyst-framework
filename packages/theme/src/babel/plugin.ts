/**
 * Babel plugin that transforms applyExtensions calls into Unistyles-compatible code.
 *
 * This plugin runs BEFORE Unistyles' Babel plugin to transform:
 *
 * ```typescript
 * // INPUT:
 * StyleSheet.create((theme) => {
 *     return applyExtensions('View', theme, {
 *         view: createViewStyles(theme),
 *     });
 * });
 *
 * // OUTPUT:
 * StyleSheet.create((theme) => ({
 *     view: __withExtension('View', 'view', theme, createViewStyles(theme)),
 * }));
 * ```
 *
 * This transformation allows Unistyles to:
 * 1. See an ObjectExpression return (required for analysis)
 * 2. Track theme dependencies through the __withExtension call
 * 3. Update styles reactively when theme changes
 */

import type { PluginObj, NodePath, types as BabelTypes } from '@babel/core';

interface PluginState {
    file: {
        path: NodePath;
    };
    needsImport: boolean;
    importAdded: boolean;
}

export default function idealystExtensionsPlugin(
    { types: t }: { types: typeof BabelTypes }
): PluginObj<PluginState> {
    return {
        name: 'idealyst-extensions',

        pre() {
            this.needsImport = false;
            this.importAdded = false;
        },

        visitor: {
            // Transform applyExtensions calls
            CallExpression(path, state) {
                const { node } = path;

                // Check if this is applyExtensions(...)
                if (!t.isIdentifier(node.callee, { name: 'applyExtensions' })) {
                    return;
                }

                // Get arguments: applyExtensions(componentName, theme, styleCreators)
                const [componentNameNode, themeNode, styleCreatorsNode] = node.arguments;

                // Validate argument types
                if (!t.isStringLiteral(componentNameNode)) {
                    return;
                }

                if (!t.isIdentifier(themeNode)) {
                    return;
                }

                if (!t.isObjectExpression(styleCreatorsNode)) {
                    return;
                }

                const componentName = componentNameNode.value;
                const themeName = themeNode.name;

                // Transform each property in styleCreators
                const transformedProperties = styleCreatorsNode.properties.map((prop) => {
                    // Skip spread elements and methods
                    if (!t.isObjectProperty(prop)) {
                        return prop;
                    }

                    // Get the key name
                    let elementName: string;
                    if (t.isIdentifier(prop.key)) {
                        elementName = prop.key.name;
                    } else if (t.isStringLiteral(prop.key)) {
                        elementName = prop.key.value;
                    } else {
                        return prop; // Can't handle computed keys
                    }

                    // Wrap value: __withExtension('Component', 'element', theme, originalValue)
                    const wrappedValue = t.callExpression(
                        t.identifier('__withExtension'),
                        [
                            t.stringLiteral(componentName),
                            t.stringLiteral(elementName),
                            t.identifier(themeName),
                            prop.value as BabelTypes.Expression,
                        ]
                    );

                    return t.objectProperty(prop.key, wrappedValue);
                });

                // Replace applyExtensions(...) with the transformed object
                path.replaceWith(t.objectExpression(transformedProperties));

                // Mark that we need to add the import
                state.needsImport = true;
            },

            // Add import at the end of the program
            Program: {
                exit(path, state) {
                    if (!state.needsImport || state.importAdded) {
                        return;
                    }

                    // Check if import already exists
                    const hasImport = path.node.body.some((node) => {
                        if (!t.isImportDeclaration(node)) return false;
                        return (
                            node.source.value === '@idealyst/theme/extensions' ||
                            node.source.value === '@idealyst/theme'
                        );
                    });

                    if (hasImport) {
                        // Check if __withExtension is already imported
                        const existingImport = path.node.body.find((node) => {
                            if (!t.isImportDeclaration(node)) return false;
                            return node.source.value === '@idealyst/theme/extensions';
                        });

                        if (existingImport && t.isImportDeclaration(existingImport)) {
                            const hasWithExtension = existingImport.specifiers.some(
                                (spec) =>
                                    t.isImportSpecifier(spec) &&
                                    t.isIdentifier(spec.imported, { name: '__withExtension' })
                            );

                            if (!hasWithExtension) {
                                existingImport.specifiers.push(
                                    t.importSpecifier(
                                        t.identifier('__withExtension'),
                                        t.identifier('__withExtension')
                                    )
                                );
                            }
                        }
                        state.importAdded = true;
                        return;
                    }

                    // Add new import
                    const importDecl = t.importDeclaration(
                        [
                            t.importSpecifier(
                                t.identifier('__withExtension'),
                                t.identifier('__withExtension')
                            ),
                        ],
                        t.stringLiteral('@idealyst/theme/extensions')
                    );

                    // Insert after other imports
                    let insertIndex = 0;
                    for (let i = 0; i < path.node.body.length; i++) {
                        if (t.isImportDeclaration(path.node.body[i])) {
                            insertIndex = i + 1;
                        } else {
                            break;
                        }
                    }

                    path.node.body.splice(insertIndex, 0, importDecl);
                    state.importAdded = true;
                },
            },
        },
    };
}

// Also export as module.exports for CommonJS compatibility
module.exports = idealystExtensionsPlugin;
