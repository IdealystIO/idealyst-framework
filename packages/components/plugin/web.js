module.exports = function ({ types: t }) {
  console.log('[mdi-auto-import] Plugin loaded');
  
  const importedIcons = new Set();
  const iconImportIdentifiers = new Map();
  let hasIconImport = false;
  
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
    
    console.log(`[mdi-auto-import] formatIconName: ${name} -> ${formatted}`);
    return formatted;
  }
  
  function getMdiIconName(name) {
    const mdiName = `mdi${formatIconName(name)}`;
    console.log(`[mdi-auto-import] getMdiIconName: ${name} -> ${mdiName}`);
    return mdiName;
  }
  
  function getIconIdentifier(iconName) {
    if (!iconImportIdentifiers.has(iconName)) {
      iconImportIdentifiers.set(iconName, `_${iconName}`);
    }
    const identifier = iconImportIdentifiers.get(iconName);
    console.log(`[mdi-auto-import] getIconIdentifier: ${iconName} -> ${identifier}`);
    return identifier;
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
          
          // Check if Icon is already imported from @mdi/react
          path.node.body.forEach(node => {
            if (t.isImportDeclaration(node) && node.source.value === '@mdi/react') {
              console.log('[mdi-auto-import] Found @mdi/react import');
              const hasIconSpecifier = node.specifiers.some(spec => 
                t.isImportDefaultSpecifier(spec) && spec.local.name === 'MdiIcon'
              );
              if (hasIconSpecifier) {
                console.log('[mdi-auto-import] MdiIcon already imported');
                hasIconImport = true;
              }
            }
          });
        },
        exit(path) {
          if (importedIcons.size === 0) {
            return;
          }
          console.log(`[mdi-auto-import] importedIcons.size: ${importedIcons.size}`);
          
          // Add imports at the top of the file if any icons were used
          if (importedIcons.size > 0) {
            console.log('[mdi-auto-import] Adding imports for icons:', Array.from(importedIcons));
            
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
              console.log('[mdi-auto-import] Adding MdiIcon import from @mdi/react');
              const iconComponentImport = t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('MdiIcon'))],
                t.stringLiteral('@mdi/react')
              );
              path.unshiftContainer('body', iconComponentImport);
            } else {
              console.log('[mdi-auto-import] MdiIcon already imported, skipping');
            }
            
            // Add icon imports
            path.unshiftContainer('body', iconImportDeclaration);
            console.log('[mdi-auto-import] Imports added successfully');
          } else {
            console.log('[mdi-auto-import] No icons to import');
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
            console.log('[mdi-auto-import] No name attribute found');
            return;
          }
          
          let iconName;
          
          // Handle both string literals and JSX expressions
          if (nameAttr && t.isStringLiteral(nameAttr.value)) {
            iconName = nameAttr.value.value;
          } else if (nameAttr && t.isJSXExpressionContainer(nameAttr.value)) {
            // Handle JSX expressions like name={'icon-name'} or name={iconVariable}
            const expression = nameAttr.value.expression;
            if (t.isStringLiteral(expression)) {
              iconName = expression.value;
            } else {
              // For dynamic expressions, we can't determine the icon at build time
              // Skip transformation but warn the user
              console.warn(`[mdi-auto-import] Cannot determine icon name for dynamic expression at ${path.node.loc ? `${path.node.loc.start.line}:${path.node.loc.start.column}` : 'unknown location'}`);
              return;
            }
          }
          
          if (iconName) {
            console.log(`[mdi-auto-import] Processing icon: ${iconName}`);
            try {
              const mdiIconName = getMdiIconName(iconName);
              const iconIdentifier = getIconIdentifier(mdiIconName);
              
              // Track that we need to import this icon
              importedIcons.add(mdiIconName);
              console.log(`[mdi-auto-import] Added icon to import list: ${mdiIconName}`);
              
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
              
              console.log(`[mdi-auto-import] Transformed Icon component: name="${iconName}" -> path={${iconIdentifier}}`);
            } catch (error) {
              console.error(`[mdi-auto-import] Error processing icon "${iconName}": ${error.message}`);
            }
          } else {
            console.log('[mdi-auto-import] No icon name found');
          }
        }
      }
    }
  };
}; 