module.exports = function ({ types: t }, options = {}) {
  const debug = options.debug || false;
  const manifestPath = options.manifestPath || './icons.manifest.json';
  
  // Debug logging function that only logs when debug is enabled
  const debugLog = (...args) => {
    if (debug) {
      console.log(...args);
    }
  };
  
  debugLog('[mdi-auto-import] Plugin loaded');
  
  const importedIcons = new Set();
  const iconImportIdentifiers = new Map();
  let hasIconImport = false;
  let manifestIcons = new Set();
  
  // Load icon manifest if it exists
  function loadIconManifest() {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Try to resolve the manifest path relative to the current working directory
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
          debugLog(`[mdi-auto-import] Loaded ${manifestIcons.size} icons from manifest: ${fullPath}`);
          debugLog('[mdi-auto-import] Manifest icons:', Array.from(manifestIcons));
        } else {
          console.warn(`[mdi-auto-import] Invalid manifest format in ${fullPath}. Expected { "icons": ["icon-name", ...] }`);
        }
      } else {
        debugLog(`[mdi-auto-import] No manifest found at ${fullPath}`);
      }
    } catch (error) {
      console.warn(`[mdi-auto-import] Error loading manifest from ${manifestPath}: ${error.message}`);
    }
  }
  
  function formatIconName(name) {
    // Handle empty or invalid names
    if (!name || typeof name !== 'string') {
      throw new Error(`Invalid icon name: ${name}`);
    }
    
    const formatted = name
      // Convert kebab-case and snake_case to PascalCase
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
    
    debugLog(`[mdi-auto-import] formatIconName: ${name} -> ${formatted}`);
    return formatted;
  }
  
  function getMdiIconName(name) {
    const mdiName = `mdi${formatIconName(name)}`;
    debugLog(`[mdi-auto-import] getMdiIconName: ${name} -> ${mdiName}`);
    return mdiName;
  }
  
  function getIconIdentifier(iconName) {
    if (!iconImportIdentifiers.has(iconName)) {
      iconImportIdentifiers.set(iconName, `_${iconName}`);
    }
    const identifier = iconImportIdentifiers.get(iconName);
    debugLog(`[mdi-auto-import] getIconIdentifier: ${iconName} -> ${identifier}`);
    return identifier;
  }

  // Recursively extract all possible string literal values from an expression
  function extractIconNames(expression, path) {
    const iconNames = new Set();
    
    function traverse(node) {
      if (!node) return;
      
      if (t.isStringLiteral(node)) {
        iconNames.add(node.value);
        debugLog(`[mdi-auto-import] Found string literal: ${node.value}`);
      } 
      else if (t.isConditionalExpression(node)) {
        // Handle ternary: condition ? 'icon1' : 'icon2'
        debugLog('[mdi-auto-import] Processing conditional expression');
        traverse(node.consequent);
        traverse(node.alternate);
      }
      else if (t.isLogicalExpression(node)) {
        // Handle logical: condition && 'icon1' || 'icon2'
        debugLog('[mdi-auto-import] Processing logical expression');
        traverse(node.left);
        traverse(node.right);
      }
      else if (t.isTemplateLiteral(node)) {
        // Handle template literals with no expressions (static strings)
        if (node.expressions.length === 0 && node.quasis.length === 1) {
          const value = node.quasis[0].value.cooked;
          iconNames.add(value);
          debugLog(`[mdi-auto-import] Found template literal: ${value}`);
        } else {
          debugLog('[mdi-auto-import] Skipping dynamic template literal');
        }
      }
      else if (t.isMemberExpression(node)) {
        // Handle object.property where object is static
        if (t.isIdentifier(node.object) && t.isIdentifier(node.property)) {
          debugLog(`[mdi-auto-import] Found member expression: ${node.object.name}.${node.property.name}`);
          // We could potentially resolve this if we track object declarations
          // For now, just warn that we found it but can't resolve it
        }
      }
      else if (t.isCallExpression(node)) {
        debugLog('[mdi-auto-import] Found function call - cannot statically analyze');
        console.warn(`[mdi-auto-import] Function call detected at ${path.node.loc ? `${path.node.loc.start.line}:${path.node.loc.start.column}` : 'unknown location'}. Consider adding icon names to manifest (${manifestPath}) for auto-import support.`);
        // For function calls, we can't statically determine the result
        // But we could potentially add runtime analysis or hints
      }
      else if (t.isIdentifier(node)) {
        debugLog(`[mdi-auto-import] Found identifier: ${node.name}`);
        // We could potentially trace variable declarations
        // For now, just note that we found it
      }
      else {
        debugLog(`[mdi-auto-import] Unhandled expression type: ${node.type}`);
      }
    }
    
    traverse(expression);
    return Array.from(iconNames);
  }

  return {
    name: 'mdi-auto-import',
    visitor: {
      Program: {
        enter(path) {
          // Reset state for each file
          importedIcons.clear();
          iconImportIdentifiers.clear();
          hasIconImport = false;
          manifestIcons.clear();
          
          // Load icon manifest
          loadIconManifest();
          
          // Add all manifest icons to the import list
          manifestIcons.forEach(iconName => {
            try {
              const mdiIconName = getMdiIconName(iconName);
              importedIcons.add(mdiIconName);
              debugLog(`[mdi-auto-import] Added manifest icon to import list: ${mdiIconName}`);
            } catch (error) {
              console.error(`[mdi-auto-import] Error processing manifest icon "${iconName}": ${error.message}`);
            }
          });
          
          // Check if Icon is already imported from @mdi/react
          path.node.body.forEach(node => {
            if (t.isImportDeclaration(node) && node.source.value === '@mdi/react') {
              debugLog('[mdi-auto-import] Found @mdi/react import');
              const hasIconSpecifier = node.specifiers.some(spec => 
                t.isImportDefaultSpecifier(spec) && spec.local.name === 'MdiIcon'
              );
              if (hasIconSpecifier) {
                debugLog('[mdi-auto-import] MdiIcon already imported');
                hasIconImport = true;
              }
            }
          });
        },
        exit(path) {
          if (importedIcons.size === 0) {
            return;
          }
          debugLog(`[mdi-auto-import] importedIcons.size: ${importedIcons.size}`);
          
          // Add imports at the top of the file if any icons were used
          if (importedIcons.size > 0) {
            debugLog('[mdi-auto-import] Adding imports for icons:', Array.from(importedIcons));
            
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
              debugLog('[mdi-auto-import] Adding MdiIcon import from @mdi/react');
              const iconComponentImport = t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('MdiIcon'))],
                t.stringLiteral('@mdi/react')
              );
              path.unshiftContainer('body', iconComponentImport);
            } else {
              debugLog('[mdi-auto-import] MdiIcon already imported, skipping');
            }
            
            // Add icon imports
            path.unshiftContainer('body', iconImportDeclaration);
            debugLog('[mdi-auto-import] Imports added successfully');
          } else {
            debugLog('[mdi-auto-import] No icons to import');
          }
        }
      },
      
      JSXElement(path) {
        const { node } = path;
        
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
            debugLog('[mdi-auto-import] No name attribute found');
            return;
          }
          
          let iconNames = [];
          
          // Handle both string literals and JSX expressions
          if (nameAttr && t.isStringLiteral(nameAttr.value)) {
            iconNames = [nameAttr.value.value];
            debugLog(`[mdi-auto-import] Found direct string literal: ${nameAttr.value.value}`);
          } else if (nameAttr && t.isJSXExpressionContainer(nameAttr.value)) {
            // Handle JSX expressions with enhanced detection
            const expression = nameAttr.value.expression;
            iconNames = extractIconNames(expression, path);
            
            if (iconNames.length === 0) {
              // For dynamic expressions we can't resolve, leave a helpful comment
              console.warn(`[mdi-auto-import] Cannot determine icon name for dynamic expression at ${path.node.loc ? `${path.node.loc.start.line}:${path.node.loc.start.column}` : 'unknown location'}. Consider adding icon names to manifest (${manifestPath}) for auto-import support.`);
              return;
            }
          }
          
          if (iconNames.length > 0) {
            debugLog(`[mdi-auto-import] Processing icons: ${iconNames.join(', ')}`);
            
            // Process each icon name found
            const processedIcons = [];
            iconNames.forEach(iconName => {
              try {
                const mdiIconName = getMdiIconName(iconName);
                const iconIdentifier = getIconIdentifier(mdiIconName);
                
                // Track that we need to import this icon
                importedIcons.add(mdiIconName);
                processedIcons.push({ iconName, mdiIconName, iconIdentifier });
                debugLog(`[mdi-auto-import] Added icon to import list: ${mdiIconName}`);
              } catch (error) {
                console.error(`[mdi-auto-import] Error processing icon "${iconName}": ${error.message}`);
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
              
              debugLog(`[mdi-auto-import] Transformed Icon component: name="${processedIcons[0].iconName}" -> path={${iconIdentifier}}`);
            } else if (processedIcons.length > 1) {
              // For multiple possible icons (like conditionals), we add all imports but don't transform
              debugLog(`[mdi-auto-import] Found multiple possible icons (${processedIcons.length}), adding imports but not transforming component`);
              console.warn(`[mdi-auto-import] Found conditional icon usage at ${path.node.loc ? `${path.node.loc.start.line}:${path.node.loc.start.column}` : 'unknown location'}. All possible icons will be imported, but the component will not be auto-transformed. Consider manual transformation if needed.`);
            }
          } else {
            debugLog('[mdi-auto-import] No icon names found');
          }
        }
      }
    }
  };
}; 