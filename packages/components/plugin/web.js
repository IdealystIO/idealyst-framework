/**
 * MDI Icon Registry Babel Plugin
 *
 * This plugin scans for icon names used in components and registers them
 * with the IconRegistry at build time. Icons are looked up from the registry
 * at runtime.
 *
 * Features:
 * 1. Static analysis - scans JSX for icon names
 * 2. Config icons - force-include icons via babel config
 * 3. Registry population - generates code to register discovered icons
 * 4. Validates against actual @mdi/js exports
 *
 * Config options:
 * - debug: boolean - enable debug logging
 * - icons: string[] - array of icon names to always include
 */

// Load @mdi/js exports for validation
let mdiExports = null;
try {
  mdiExports = require('@mdi/js');
} catch (e) {
  console.warn('[mdi-registry-plugin] Could not load @mdi/js for validation. Icons will not be validated.');
}

module.exports = function ({ types: t }, options = {}) {
  const debug = options.debug || false;
  const configIcons = options.icons || [];

  const debugLog = (...args) => {
    if (debug) {
      console.log('[mdi-registry-plugin]', ...args);
    }
  };

  debugLog('Plugin loaded with config icons:', configIcons);
  debugLog('@mdi/js loaded:', mdiExports ? 'yes' : 'no');

  /**
   * Convert kebab-case icon name to MDI import name
   * e.g., "home" -> "mdiHome", "account-circle" -> "mdiAccountCircle"
   */
  function toMdiImportName(name) {
    if (!name || typeof name !== 'string') {
      return null;
    }

    // Strip mdi: prefix if present
    const cleanName = name.startsWith('mdi:') ? name.slice(4) : name;

    // Validate: only allow alphanumeric and hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(cleanName)) {
      debugLog(`Invalid icon name format: "${name}"`);
      return null;
    }

    // Convert kebab-case to PascalCase and prefix with mdi
    const pascalCase = cleanName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');

    const mdiName = `mdi${pascalCase}`;

    // Validate against actual @mdi/js exports
    if (mdiExports && !(mdiName in mdiExports)) {
      debugLog(`Icon "${name}" (${mdiName}) not found in @mdi/js`);
      return null;
    }

    return mdiName;
  }

  /**
   * Normalize icon name for registry key (lowercase, no prefix)
   * Returns null for invalid icon names
   */
  function normalizeIconName(name) {
    if (!name || typeof name !== 'string') return null;
    const clean = name.startsWith('mdi:') ? name.slice(4) : name;
    const normalized = clean.toLowerCase();

    // Only allow alphanumeric and hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(normalized)) {
      return null;
    }

    // Validate by checking if toMdiImportName succeeds
    const mdiName = toMdiImportName(normalized);
    if (!mdiName) {
      return null;
    }

    return normalized;
  }

  /**
   * Extract icon name from a string value
   */
  function extractIconName(str) {
    if (!str || typeof str !== 'string') return null;
    // Strip mdi: prefix if present
    return str.startsWith('mdi:') ? str.slice(4) : str;
  }

  return {
    name: 'mdi-registry-plugin',
    visitor: {
      Program: {
        enter(path, state) {
          // Initialize state for this file
          state.iconNames = new Set();
          state.hasIconUsage = false;

          debugLog('Processing file:', state.filename || 'unknown');

          // Add config icons
          configIcons.forEach(iconName => {
            const normalized = normalizeIconName(iconName);
            if (normalized) {
              state.iconNames.add(normalized);
              debugLog(`Added config icon: ${normalized}`);
            }
          });
        },

        exit(path, state) {
          // If no icons found, nothing to do
          if (state.iconNames.size === 0) {
            debugLog('No icons found, skipping registration');
            return;
          }

          debugLog(`Found ${state.iconNames.size} icons:`, Array.from(state.iconNames));

          // Build the import specifiers for @mdi/js
          const iconImports = [];
          const registryEntries = [];

          state.iconNames.forEach(iconName => {
            const mdiName = toMdiImportName(iconName);
            if (mdiName) {
              // Create unique local identifier
              const localId = `_${mdiName}`;
              iconImports.push(
                t.importSpecifier(t.identifier(localId), t.identifier(mdiName))
              );
              // Create registry entry: 'icon-name': _mdiIconName
              registryEntries.push(
                t.objectProperty(
                  t.stringLiteral(iconName),
                  t.identifier(localId)
                )
              );
            }
          });

          if (iconImports.length === 0) {
            debugLog('No valid icons to register');
            return;
          }

          // Create: import { mdiHome as _mdiHome, ... } from '@mdi/js';
          const mdiImport = t.importDeclaration(
            iconImports,
            t.stringLiteral('@mdi/js')
          );

          // Determine the import path for IconRegistry
          // If we're inside the components package, use relative import to avoid circular deps
          const filename = state.filename || '';
          const isInsideComponentsPackage = filename.includes('packages/components/src') ||
                                            filename.includes('packages\\components\\src');

          let registryImportPath = '@idealyst/components';
          if (isInsideComponentsPackage) {
            // Calculate relative path to Icon/IconRegistry
            const path = require('path');
            const fileDir = path.dirname(filename);
            const registryPath = path.join(filename.split('packages/components/src')[0] || filename.split('packages\\components\\src')[0], 'packages/components/src/Icon/IconRegistry');
            let relativePath = path.relative(fileDir, registryPath).replace(/\\/g, '/');
            if (!relativePath.startsWith('.')) {
              relativePath = './' + relativePath;
            }
            registryImportPath = relativePath;
            debugLog(`Using relative import for IconRegistry: ${registryImportPath}`);
          }

          // Create: import { IconRegistry } from '...' ;
          const registryImport = t.importDeclaration(
            [t.importSpecifier(t.identifier('IconRegistry'), t.identifier('IconRegistry'))],
            t.stringLiteral(registryImportPath)
          );

          // Create: IconRegistry.registerMany({ 'home': _mdiHome, ... });
          const registerCall = t.expressionStatement(
            t.callExpression(
              t.memberExpression(
                t.identifier('IconRegistry'),
                t.identifier('registerMany')
              ),
              [t.objectExpression(registryEntries)]
            )
          );

          // Insert at the top of the file (after existing imports)
          // Find the last import declaration
          let lastImportIndex = -1;
          path.node.body.forEach((node, index) => {
            if (t.isImportDeclaration(node)) {
              lastImportIndex = index;
            }
          });

          // Insert after last import, or at the beginning if no imports
          const insertIndex = lastImportIndex + 1;

          // Insert in reverse order so they end up in correct order
          path.node.body.splice(insertIndex, 0, mdiImport);
          path.node.body.splice(insertIndex, 0, registryImport);
          path.node.body.splice(insertIndex + 2, 0, registerCall);

          debugLog('Injected registration code');
        }
      },

      // Track icon names in JSX elements
      JSXElement(path, state) {
        const { node } = path;

        if (!t.isJSXIdentifier(node.openingElement.name)) {
          return;
        }

        const componentName = node.openingElement.name.name;

        // Map of components to their icon prop names
        const iconPropMap = {
          'Icon': ['name'],
          'IconSvg': ['name'],  // Internal component also uses name prop now
          'Button': ['leftIcon', 'rightIcon'],
          'Badge': ['icon'],
          'Breadcrumb': ['icon'],
          'Menu': ['icon'],
          'MenuItem': ['icon'],
          'ListItem': ['leading', 'trailing'],
          'Alert': ['icon'],
          'Chip': ['icon', 'deleteIcon'],
          'Input': ['leftIcon', 'rightIcon'],
        };

        const iconProps = iconPropMap[componentName];
        if (!iconProps) return;

        state.hasIconUsage = true;

        // Check each icon prop
        iconProps.forEach(propName => {
          const attr = node.openingElement.attributes.find(attr =>
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attr.name.name === propName
          );

          if (!attr) return;

          // Handle string literal: icon="home"
          if (t.isStringLiteral(attr.value)) {
            const iconName = extractIconName(attr.value.value);
            if (iconName) {
              const normalized = normalizeIconName(iconName);
              if (normalized) {
                state.iconNames.add(normalized);
                debugLog(`Found icon in ${componentName}.${propName}: ${normalized}`);
              }
            }
          }
          // Handle JSX expression: icon={"home"} or icon={variable}
          else if (t.isJSXExpressionContainer(attr.value)) {
            const expr = attr.value.expression;

            if (t.isStringLiteral(expr)) {
              const iconName = extractIconName(expr.value);
              if (iconName) {
                const normalized = normalizeIconName(iconName);
                if (normalized) {
                  state.iconNames.add(normalized);
                  debugLog(`Found icon in ${componentName}.${propName}: ${normalized}`);
                }
              }
            }
            // Handle ternary: condition ? "icon1" : "icon2"
            else if (t.isConditionalExpression(expr)) {
              [expr.consequent, expr.alternate].forEach(branch => {
                if (t.isStringLiteral(branch)) {
                  const iconName = extractIconName(branch.value);
                  if (iconName) {
                    const normalized = normalizeIconName(iconName);
                    if (normalized) {
                      state.iconNames.add(normalized);
                      debugLog(`Found icon in ternary: ${normalized}`);
                    }
                  }
                }
              });
            }
            // Handle logical expression: condition && "icon"
            else if (t.isLogicalExpression(expr)) {
              [expr.left, expr.right].forEach(side => {
                if (t.isStringLiteral(side)) {
                  const iconName = extractIconName(side.value);
                  if (iconName) {
                    const normalized = normalizeIconName(iconName);
                    if (normalized) {
                      state.iconNames.add(normalized);
                      debugLog(`Found icon in logical expr: ${normalized}`);
                    }
                  }
                }
              });
            }
            // Handle variable reference - try to resolve
            else if (t.isIdentifier(expr)) {
              const binding = path.scope.getBinding(expr.name);
              if (binding && binding.path.isVariableDeclarator()) {
                const init = binding.path.node.init;
                if (t.isStringLiteral(init)) {
                  const iconName = extractIconName(init.value);
                  if (iconName) {
                    const normalized = normalizeIconName(iconName);
                    if (normalized) {
                      state.iconNames.add(normalized);
                      debugLog(`Found icon via variable ${expr.name}: ${normalized}`);
                    }
                  }
                }
                // Handle ternary expression in variable: const iconName = cond ? 'eye' : 'eye-off'
                else if (t.isConditionalExpression(init)) {
                  [init.consequent, init.alternate].forEach(branch => {
                    if (t.isStringLiteral(branch)) {
                      const iconName = extractIconName(branch.value);
                      if (iconName) {
                        const normalized = normalizeIconName(iconName);
                        if (normalized) {
                          state.iconNames.add(normalized);
                          debugLog(`Found icon via variable ternary ${expr.name}: ${normalized}`);
                        }
                      }
                    }
                  });
                }
                // Handle logical expression in variable: const iconName = hasIcon && 'home'
                else if (t.isLogicalExpression(init)) {
                  [init.left, init.right].forEach(side => {
                    if (t.isStringLiteral(side)) {
                      const iconName = extractIconName(side.value);
                      if (iconName) {
                        const normalized = normalizeIconName(iconName);
                        if (normalized) {
                          state.iconNames.add(normalized);
                          debugLog(`Found icon via variable logical ${expr.name}: ${normalized}`);
                        }
                      }
                    }
                  });
                }
              }
            }
          }
        });
      },

      // Also check for icon names in object properties (for menu items, list items, etc.)
      ObjectProperty(path, state) {
        const { node } = path;

        // Check if this is an icon-related property
        const iconPropNames = ['icon', 'leftIcon', 'rightIcon', 'leading', 'trailing', 'deleteIcon'];

        if (t.isIdentifier(node.key) && iconPropNames.includes(node.key.name)) {
          if (t.isStringLiteral(node.value)) {
            const iconName = extractIconName(node.value.value);
            if (iconName) {
              const normalized = normalizeIconName(iconName);
              if (normalized) {
                state.iconNames.add(normalized);
                debugLog(`Found icon in object property ${node.key.name}: ${normalized}`);
              }
            }
          }
        }
      }
    }
  };
};
