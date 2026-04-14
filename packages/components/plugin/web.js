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
 * - components: Record<string, string[]> - custom components with their icon prop names
 *   e.g. { "NavItem": ["icon"], "SidebarLink": ["icon", "activeIcon"] }
 *
 * For icons that can't be statically detected, register them manually in your entry point:
 *   import { IconRegistry } from '@idealyst/components';
 *   import { mdiArrowUpDown } from '@mdi/js';
 *   IconRegistry.register('arrow-up-down', mdiArrowUpDown);
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
  const customComponents = options.components || {};

  const debugLog = (...args) => {
    if (debug) {
      console.log('[mdi-registry-plugin]', ...args);
    }
  };

  debugLog('@mdi/js loaded:', mdiExports ? 'yes' : 'no');

  // Built-in component → icon prop mapping, merged with custom components
  const iconPropMap = {
    'Icon': ['name'],
    'IconSvg': ['name'],
    'Button': ['leftIcon', 'rightIcon'],
    'Badge': ['icon'],
    'Breadcrumb': ['icon'],
    'Menu': ['icon'],
    'MenuItem': ['icon'],
    'ListItem': ['leading', 'trailing'],
    'Alert': ['icon'],
    'Chip': ['icon', 'deleteIcon'],
    'Input': ['leftIcon', 'rightIcon'],
    'TextInput': ['leftIcon', 'rightIcon'],
    'IconButton': ['icon'],
    ...customComponents,
  };

  // Collect unique prop names for ObjectProperty scanning.
  // Exclude 'name' — too generic, only meaningful as JSX prop on Icon/IconSvg.
  const iconPropNames = new Set();
  for (const [, props] of Object.entries(iconPropMap)) {
    for (const p of props) {
      if (p !== 'name') {
        iconPropNames.add(p);
      }
    }
  }

  if (Object.keys(customComponents).length > 0) {
    debugLog('Custom components registered:', customComponents);
  }

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

          // Check if the file already imports IconRegistry (e.g., internal components package files)
          let hasExistingRegistryImport = false;
          let lastImportIndex = -1;
          path.node.body.forEach((node, index) => {
            if (t.isImportDeclaration(node)) {
              lastImportIndex = index;
              if (node.specifiers.some(s =>
                t.isImportSpecifier(s) &&
                t.isIdentifier(s.imported) &&
                s.imported.name === 'IconRegistry'
              )) {
                hasExistingRegistryImport = true;
              }
            }
          });

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

          const insertIndex = lastImportIndex + 1;

          if (hasExistingRegistryImport) {
            // File already imports IconRegistry — just add the @mdi/js import and registerMany call
            debugLog('File already imports IconRegistry, skipping duplicate import');
            path.node.body.splice(insertIndex, 0, mdiImport);
            path.node.body.splice(insertIndex + 1, 0, registerCall);
          } else {
            // Determine the import path for IconRegistry
            const filename = state.filename || '';
            const nodePath = require('path');

            // Check if we're inside the components package source (monorepo dev or node_modules)
            const componentsSrcMatch = filename.match(/^(.*[/\\](?:packages|@idealyst)[/\\]components[/\\]src)[/\\]/);

            let registryImportPath = '@idealyst/components';
            if (componentsSrcMatch) {
              // Calculate relative path from this file to Icon/IconRegistry
              const fileDir = nodePath.dirname(filename);
              const registryPath = nodePath.join(componentsSrcMatch[1], 'Icon', 'IconRegistry');
              let relativePath = nodePath.relative(fileDir, registryPath).replace(/\\/g, '/');
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

            // Insert in reverse order so they end up in correct order
            path.node.body.splice(insertIndex, 0, mdiImport);
            path.node.body.splice(insertIndex, 0, registryImport);
            path.node.body.splice(insertIndex + 2, 0, registerCall);
          }

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

        if (t.isIdentifier(node.key) && iconPropNames.has(node.key.name)) {
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
