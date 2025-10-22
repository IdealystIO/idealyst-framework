/**
 * Enhanced MDI Auto-Import Babel Plugin v2.0
 *
 * Features:
 * 1. Context-aware string replacement - only transforms strings used with Icon component
 * 2. Namespace prefix support - "mdi:iconname" guarantees transformation
 * 3. Variable tracking with scope analysis - follows variables back to their declarations
 * 4. No false positives - only transforms Icon-related strings
 * 5. Button/Badge/Breadcrumb/Menu icon prop transformation with path injection
 */

module.exports = function ({ types: t }, options = {}) {
  const debug = options.debug || false;
  const manifestPath = options.manifestPath || './icons.manifest.json';

  // Debug logging function that only logs when debug is enabled
  const debugLog = (...args) => {
    if (debug) {
      console.log(...args);
    }
  };

  debugLog('[mdi-auto-import-enhanced] Plugin loaded');

  const importedIcons = new Set();
  const iconImportIdentifiers = new Map();
  let hasIconImport = false;
  let manifestIcons = new Set();

  // Track variables that are used with Icon component
  const iconRelatedVariables = new Set();

  // Load icon manifest if it exists
  function loadIconManifest() {
    try {
      const fs = require('fs');
      const path = require('path');

      const fullPath = path.resolve(process.cwd(), manifestPath);

      if (fs.existsSync(fullPath)) {
        const manifestContent = fs.readFileSync(fullPath, 'utf8');
        const manifest = JSON.parse(manifestContent);

        if (manifest.icons && Array.isArray(manifest.icons)) {
          manifest.icons.forEach(iconName => {
            if (typeof iconName === 'string') {
              manifestIcons.add(iconName);
            }
          });
          debugLog(`[mdi-auto-import-enhanced] Loaded ${manifestIcons.size} icons from manifest: ${fullPath}`);
        } else {
          console.warn(`[mdi-auto-import-enhanced] Invalid manifest format in ${fullPath}. Expected { "icons": ["icon-name", ...] }`);
        }
      }
    } catch (error) {
      console.warn(`[mdi-auto-import-enhanced] Error loading manifest from ${manifestPath}: ${error.message}`);
    }
  }

  function formatIconName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error(`Invalid icon name: ${name}`);
    }

    // Strip mdi: prefix if it exists (safety check, should already be stripped)
    const cleanName = name.startsWith('mdi:') ? name.substring(4) : name;

    // Check if the name contains only valid characters (letters, numbers, hyphens, underscores)
    if (!/^[a-zA-Z0-9-_]+$/.test(cleanName)) {
      debugLog(`[mdi-auto-import-enhanced] formatIconName: Invalid icon name "${name}" (contains special characters), using "help-circle" as fallback`);
      return 'HelpCircle';
    }

    const formatted = cleanName
      .replace(/[-_:]/g, ' ')  // Also handle colons
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');

    debugLog(`[mdi-auto-import-enhanced] formatIconName: ${name} -> ${formatted}`);
    return formatted;
  }

  function getMdiIconName(name) {
    // First ensure the name has mdi: prefix stripped (safety check)
    const cleanName = name.startsWith('mdi:') ? name.substring(4) : name;
    const mdiName = `mdi${formatIconName(cleanName)}`;
    debugLog(`[mdi-auto-import-enhanced] getMdiIconName: ${name} -> ${mdiName}`);
    return mdiName;
  }

  function getIconIdentifier(iconName) {
    if (!iconImportIdentifiers.has(iconName)) {
      // Sanitize the icon name to create a valid JavaScript identifier
      // Remove any characters that aren't valid in identifiers
      const sanitized = iconName.replace(/[^a-zA-Z0-9_$]/g, '');
      iconImportIdentifiers.set(iconName, `_${sanitized}`);
    }
    const identifier = iconImportIdentifiers.get(iconName);
    debugLog(`[mdi-auto-import-enhanced] getIconIdentifier: ${iconName} -> ${identifier}`);
    return identifier;
  }

  /**
   * Extract icon name from string, handling namespace prefix
   * Returns null if not a valid icon string
   */
  function extractIconName(str) {
    if (!str || typeof str !== 'string') return null;

    // Handle namespace prefix: "mdi:home" -> "home"
    if (str.startsWith('mdi:')) {
      return str.substring(4);
    }

    return str;
  }

  /**
   * Check if a string literal is icon-related based on context
   */
  function isIconRelatedString(path, stringValue) {
    // Always transform if it has the mdi: prefix
    if (stringValue.startsWith('mdi:')) {
      debugLog(`[mdi-auto-import-enhanced] String "${stringValue}" has mdi: prefix - will transform`);
      return true;
    }

    // Check if this string is in the manifest
    if (manifestIcons.has(stringValue)) {
      debugLog(`[mdi-auto-import-enhanced] String "${stringValue}" is in manifest - will transform`);
      return true;
    }

    // Icon prop names to check
    const iconPropNames = ['name', 'leftIcon', 'rightIcon', 'icon'];

    // Walk up the tree to find context
    let currentPath = path;
    while (currentPath) {
      const node = currentPath.node;

      // Check if we're in a JSXAttribute with an icon-related prop name
      if (t.isJSXAttribute(currentPath.parent)) {
        const attr = currentPath.parent;
        if (t.isJSXIdentifier(attr.name) && iconPropNames.includes(attr.name.name)) {
          // Now check if the parent JSXOpeningElement is Icon, Button, Badge, etc.
          const openingElement = currentPath.parentPath.parent;
          if (t.isJSXOpeningElement(openingElement)) {
            if (t.isJSXIdentifier(openingElement.name)) {
              const componentName = openingElement.name.name;
              debugLog(`[mdi-auto-import-enhanced] String "${stringValue}" is in ${componentName}.${attr.name.name} prop - will transform`);
              return true;
            }
          }
        }
      }

      // Check if we're assigned to a variable that's used with Icon
      if (t.isVariableDeclarator(currentPath.parent)) {
        const declarator = currentPath.parent;
        if (t.isIdentifier(declarator.id)) {
          const varName = declarator.id.name;
          if (iconRelatedVariables.has(varName)) {
            debugLog(`[mdi-auto-import-enhanced] String "${stringValue}" is in icon-related variable "${varName}" - will transform`);
            return true;
          }
        }
      }

      currentPath = currentPath.parentPath;
    }

    return false;
  }

  /**
   * Track variables that are used with Icon component
   * This runs in a first pass to identify which variables are icon-related
   */
  function trackIconRelatedVariables(programPath) {
    // Components that accept icon props
    const componentsWithIconProps = {
      'Icon': ['name'],
      'Button': ['leftIcon', 'rightIcon'],
      'Badge': ['icon'],
      'Breadcrumb': ['icon'],
      'Menu': ['icon']
    };

    programPath.traverse({
      JSXElement(path) {
        const { node } = path;

        if (t.isJSXIdentifier(node.openingElement.name)) {
          const componentName = node.openingElement.name.name;
          const iconProps = componentsWithIconProps[componentName];

          if (iconProps) {
            // Find all icon-related attributes
            iconProps.forEach(propName => {
              const attr = node.openingElement.attributes.find(attr =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === propName
              );

              if (attr && t.isJSXExpressionContainer(attr.value)) {
                const expression = attr.value.expression;

                // Track any identifiers used in the icon prop
                if (t.isIdentifier(expression)) {
                  iconRelatedVariables.add(expression.name);
                  debugLog(`[mdi-auto-import-enhanced] Tracked icon-related variable: ${expression.name} (from ${componentName}.${propName})`);

                  // Follow the binding to find its declaration
                  const binding = path.scope.getBinding(expression.name);
                  if (binding && binding.path.isVariableDeclarator()) {
                    const init = binding.path.node.init;
                    if (t.isStringLiteral(init)) {
                      debugLog(`[mdi-auto-import-enhanced] Variable ${expression.name} = "${init.value}"`);
                    }
                  }
                }

                // Track variables in ternaries and logical expressions
                path.traverse({
                  Identifier(idPath) {
                    // Only track top-level identifiers, not property accesses
                    if (!t.isMemberExpression(idPath.parent)) {
                      iconRelatedVariables.add(idPath.node.name);
                      debugLog(`[mdi-auto-import-enhanced] Tracked icon-related variable in expression: ${idPath.node.name} (from ${componentName}.${propName})`);
                    }
                  }
                });
              }
            });
          }
        }
      }
    });
  }

  /**
   * Extract all icon names from an expression, now with context awareness
   */
  function extractIconNames(expression, path) {
    const iconNames = new Set();

    function traverse(node, nodePath) {
      if (!node) return;

      if (t.isStringLiteral(node)) {
        const iconName = extractIconName(node.value);
        if (iconName) {
          iconNames.add(iconName);
          debugLog(`[mdi-auto-import-enhanced] Found icon name: ${iconName} (from "${node.value}")`);
        }
      }
      else if (t.isConditionalExpression(node)) {
        debugLog('[mdi-auto-import-enhanced] Processing conditional expression');
        traverse(node.consequent, nodePath);
        traverse(node.alternate, nodePath);
      }
      else if (t.isLogicalExpression(node)) {
        debugLog('[mdi-auto-import-enhanced] Processing logical expression');
        traverse(node.left, nodePath);
        traverse(node.right, nodePath);
      }
      else if (t.isTemplateLiteral(node)) {
        if (node.expressions.length === 0 && node.quasis.length === 1) {
          const value = node.quasis[0].value.cooked;
          const iconName = extractIconName(value);
          if (iconName) {
            iconNames.add(iconName);
            debugLog(`[mdi-auto-import-enhanced] Found icon name in template literal: ${iconName}`);
          }
        }
      }
      else if (t.isIdentifier(node)) {
        debugLog(`[mdi-auto-import-enhanced] Following identifier: ${node.name}`);

        // Try to resolve the identifier to its value
        const binding = path.scope.getBinding(node.name);
        if (binding && binding.path.isVariableDeclarator()) {
          const init = binding.path.node.init;
          if (init) {
            traverse(init, binding.path);
          }
        }
      }
    }

    traverse(expression, path);
    return Array.from(iconNames);
  }

  return {
    name: 'mdi-auto-import-enhanced',
    visitor: {
      Program: {
        enter(path) {
          // Reset state for each file
          importedIcons.clear();
          iconImportIdentifiers.clear();
          hasIconImport = false;
          manifestIcons.clear();
          iconRelatedVariables.clear();

          // Load icon manifest
          loadIconManifest();

          // Add all manifest icons to the import list
          manifestIcons.forEach(iconName => {
            try {
              const mdiIconName = getMdiIconName(iconName);
              importedIcons.add(mdiIconName);
              debugLog(`[mdi-auto-import-enhanced] Added manifest icon to import list: ${mdiIconName}`);
            } catch (error) {
              console.error(`[mdi-auto-import-enhanced] Error processing manifest icon "${iconName}": ${error.message}`);
            }
          });

          // First pass: track which variables are icon-related
          trackIconRelatedVariables(path);

          // Check if Icon is already imported from @mdi/react
          path.node.body.forEach(node => {
            if (t.isImportDeclaration(node) && node.source.value === '@mdi/react') {
              debugLog('[mdi-auto-import-enhanced] Found @mdi/react import');
              const hasIconSpecifier = node.specifiers.some(spec =>
                t.isImportDefaultSpecifier(spec) && spec.local.name === 'MdiIcon'
              );
              if (hasIconSpecifier) {
                debugLog('[mdi-auto-import-enhanced] MdiIcon already imported');
                hasIconImport = true;
              }
            }
          });
        },
        exit(path) {
          if (importedIcons.size === 0) {
            return;
          }
          debugLog(`[mdi-auto-import-enhanced] importedIcons.size: ${importedIcons.size}`);

          // Add imports at the top of the file if any icons were used
          if (importedIcons.size > 0) {
            debugLog('[mdi-auto-import-enhanced] Adding imports for icons:', Array.from(importedIcons));

            // Import individual icons from @mdi/js
            const iconImportSpecifiers = Array.from(importedIcons).map(iconName => {
              const identifier = getIconIdentifier(iconName);
              return t.importSpecifier(
                t.identifier(identifier),
                t.identifier(iconName)
              );
            });

            const iconImportDeclaration = t.importDeclaration(
              iconImportSpecifiers,
              t.stringLiteral('@mdi/js')
            );

            // Import Icon component from @mdi/react if not already imported
            if (!hasIconImport) {
              debugLog('[mdi-auto-import-enhanced] Adding MdiIcon import from @mdi/react');
              const iconComponentImport = t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('MdiIcon'))],
                t.stringLiteral('@mdi/react')
              );
              path.unshiftContainer('body', iconComponentImport);
            } else {
              debugLog('[mdi-auto-import-enhanced] MdiIcon already imported, skipping');
            }

            // Add icon imports
            path.unshiftContainer('body', iconImportDeclaration);
            debugLog('[mdi-auto-import-enhanced] Imports added successfully');
          } else {
            debugLog('[mdi-auto-import-enhanced] No icons to import');
          }
        }
      },

      JSXElement(path) {
        const { node } = path;

        // Handle Badge, Button, Breadcrumb, Menu components with icon props
        if (t.isJSXIdentifier(node.openingElement.name)) {
          const componentName = node.openingElement.name.name;
          const iconPropMapping = {
            'Button': { props: ['leftIcon', 'rightIcon'], pathProps: ['leftIconPath', 'rightIconPath'] },
            'Badge': { props: ['icon'], pathProps: ['iconPath'] },
            'Breadcrumb': { props: ['icon'], pathProps: ['iconPath'] },
            'Menu': { props: ['icon'], pathProps: ['iconPath'] }
          };

          const iconConfig = iconPropMapping[componentName];
          if (iconConfig) {
            debugLog(`[mdi-auto-import-enhanced] JSXElement visitor - Found ${componentName}`);

            // Process each icon prop
            iconConfig.props.forEach((propName, index) => {
              const attr = node.openingElement.attributes.find(attr =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === propName
              );

              if (attr && t.isStringLiteral(attr.value)) {
                const stringValue = attr.value.value;
                const iconName = extractIconName(stringValue);

                if (iconName) {
                  debugLog(`[mdi-auto-import-enhanced]   - Found ${propName}="${stringValue}" (StringLiteral)`);

                  try {
                    const mdiIconName = getMdiIconName(iconName);
                    const iconIdentifier = getIconIdentifier(mdiIconName);
                    importedIcons.add(mdiIconName);
                    debugLog(`[mdi-auto-import-enhanced]   - Added icon from ${componentName}.${propName}: ${mdiIconName}`);

                    // Add the corresponding path prop (e.g., leftIconPath, rightIconPath, iconPath)
                    const pathPropName = iconConfig.pathProps[index];
                    const pathAttr = t.jsxAttribute(
                      t.jsxIdentifier(pathPropName),
                      t.jsxExpressionContainer(t.identifier(iconIdentifier))
                    );

                    // Add the path attribute to the component
                    node.openingElement.attributes.push(pathAttr);
                    debugLog(`[mdi-auto-import-enhanced]   - Added ${pathPropName}={${iconIdentifier}} to ${componentName}`);
                  } catch (error) {
                    console.error(`[mdi-auto-import-enhanced] Error processing icon "${iconName}" from ${componentName}.${propName}: ${error.message}`);
                  }
                }
              } else if (attr) {
                const attrType = attr.value?.type || 'unknown';
                debugLog(`[mdi-auto-import-enhanced]   - Found ${propName} (${attrType})`);
              }
            });
          }
        }

        // Check if this is an Icon component from @idealyst/components
        if (
          t.isJSXIdentifier(node.openingElement.name) &&
          node.openingElement.name.name === 'Icon'
        ) {

          // Find the name attribute
          const nameAttr = node.openingElement.attributes.find(attr =>
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attr.name.name === 'name'
          );

          if (!nameAttr) {
            debugLog('[mdi-auto-import-enhanced] No name attribute found');
            return;
          }

          let iconNames = [];

          // Handle both string literals and JSX expressions
          if (nameAttr && t.isStringLiteral(nameAttr.value)) {
            const iconName = extractIconName(nameAttr.value.value);
            if (iconName) {
              iconNames = [iconName];
              debugLog(`[mdi-auto-import-enhanced] Found direct string literal: ${iconName}`);
            }
          } else if (nameAttr && t.isJSXExpressionContainer(nameAttr.value)) {
            // Handle JSX expressions with enhanced detection
            const expression = nameAttr.value.expression;
            iconNames = extractIconNames(expression, path);

            if (iconNames.length === 0) {
              debugLog(`[mdi-auto-import-enhanced] Cannot determine icon name for dynamic expression`);
              return;
            }
          }

          if (iconNames.length > 0) {
            debugLog(`[mdi-auto-import-enhanced] Processing icons: ${iconNames.join(', ')}`);

            // Process each icon name found
            const processedIcons = [];
            iconNames.forEach(iconName => {
              try {
                const mdiIconName = getMdiIconName(iconName);
                const iconIdentifier = getIconIdentifier(mdiIconName);

                // Track that we need to import this icon
                importedIcons.add(mdiIconName);
                processedIcons.push({ iconName, mdiIconName, iconIdentifier });
                debugLog(`[mdi-auto-import-enhanced] Added icon to import list: ${mdiIconName}`);
              } catch (error) {
                console.error(`[mdi-auto-import-enhanced] Error processing icon "${iconName}": ${error.message}`);
              }
            });

            // If we have exactly one icon, we can transform the component
            if (processedIcons.length === 1) {
              const { iconIdentifier } = processedIcons[0];

              // Replace name="iconName" with path={iconIdentifier}
              const pathAttr = t.jsxAttribute(
                t.jsxIdentifier('path'),
                t.jsxExpressionContainer(t.identifier(iconIdentifier))
              );

              // Remove the name attribute and add the path attribute
              node.openingElement.attributes = node.openingElement.attributes
                .filter(attr => !(
                  t.isJSXAttribute(attr) &&
                  t.isJSXIdentifier(attr.name) &&
                  attr.name.name === 'name'
                ))
                .concat(pathAttr);

              debugLog(`[mdi-auto-import-enhanced] Transformed Icon component: name="${processedIcons[0].iconName}" -> path={${iconIdentifier}}`);
            } else if (processedIcons.length > 1) {
              debugLog(`[mdi-auto-import-enhanced] Found multiple possible icons (${processedIcons.length}), adding imports but not transforming component`);
            }
          } else {
            debugLog('[mdi-auto-import-enhanced] No icon names found');
          }
        }
      },

      /**
       * Handle JSX attributes with string values for icon props
       * This handles: <Badge icon="information" />, <Button leftIcon="plus" />
       */
      JSXAttribute(path) {
        const { node } = path;

        debugLog(`[mdi-auto-import-enhanced] JSXAttribute visitor called for: ${node.name ? node.name.name || 'unknown' : 'no-name'}`);

        // Check if this is an icon-related attribute
        if (!t.isJSXIdentifier(node.name)) {
          return;
        }

        const attrName = node.name.name;
        const iconPropNames = ['name', 'leftIcon', 'rightIcon', 'icon'];

        if (!iconPropNames.includes(attrName)) {
          return;
        }

        // Check if the value is a string literal
        if (!t.isStringLiteral(node.value)) {
          return;
        }

        const stringValue = node.value.value;
        const iconName = extractIconName(stringValue);

        if (!iconName) {
          return;
        }

        // Check if the parent element is a component that supports icons
        const openingElement = path.parentPath.node;
        if (!t.isJSXOpeningElement(openingElement) || !t.isJSXIdentifier(openingElement.name)) {
          return;
        }

        const componentName = openingElement.name.name;
        const supportedComponents = ['Icon', 'Button', 'Badge', 'Breadcrumb', 'Menu'];

        if (!supportedComponents.includes(componentName)) {
          return;
        }

        try {
          const mdiIconName = getMdiIconName(iconName);
          importedIcons.add(mdiIconName);
          debugLog(`[mdi-auto-import-enhanced] Added icon from ${componentName}.${attrName}="${stringValue}": ${mdiIconName}`);
        } catch (error) {
          console.error(`[mdi-auto-import-enhanced] Error processing icon "${iconName}" from ${componentName}.${attrName}: ${error.message}`);
        }
      },

      /**
       * Second pass: Transform string literals that are icon-related
       * This handles cases like: const iconName = "home"; <Icon name={iconName} />
       */
      StringLiteral(path) {
        // Skip if we're already in a JSX attribute (handled above)
        if (t.isJSXAttribute(path.parent)) {
          return;
        }

        const stringValue = path.node.value;

        // Check if this string is icon-related based on context
        if (isIconRelatedString(path, stringValue)) {
          const iconName = extractIconName(stringValue);
          if (iconName) {
            try {
              const mdiIconName = getMdiIconName(iconName);
              importedIcons.add(mdiIconName);
              debugLog(`[mdi-auto-import-enhanced] Added icon from context-aware string: ${mdiIconName}`);
            } catch (error) {
              console.error(`[mdi-auto-import-enhanced] Error processing icon string "${iconName}": ${error.message}`);
            }
          }
        }
      }
    }
  };
};
