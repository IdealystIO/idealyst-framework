#!/usr/bin/env node

/**
 * Script to compare component props between TypeScript definitions and MCP server documentation
 */

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'packages/components/src');
const mcpDir = path.join(__dirname, 'packages/mcp-server/src/data/components');

// List of all components to check
const components = [
  'Accordion', 'ActivityIndicator', 'Alert', 'Avatar', 'Badge', 'Breadcrumb',
  'Button', 'Card', 'Checkbox', 'Chip', 'Dialog', 'Divider', 'Icon', 'Image',
  'Input', 'List', 'Menu', 'Popover', 'Pressable', 'Progress', 'RadioButton',
  'Screen', 'Select', 'Skeleton', 'Slider', 'SVGImage', 'Switch', 'TabBar',
  'Table', 'Text', 'TextArea', 'Tooltip', 'Video', 'View'
];

function extractPropsFromTypeFile(componentName) {
  const typesPath = path.join(componentsDir, componentName, 'types.ts');

  if (!fs.existsSync(typesPath)) {
    return null;
  }

  const content = fs.readFileSync(typesPath, 'utf-8');

  // Extract interface definition
  const interfaceMatch = content.match(new RegExp(`export interface ${componentName}Props \\{([\\s\\S]*?)\\n\\}`));
  if (!interfaceMatch) {
    return null;
  }

  // Parse props from interface
  const propsSection = interfaceMatch[1];
  const propMatches = propsSection.matchAll(/^\s*([a-zA-Z]+)\??:\s*(.+?);/gm);

  const props = {};
  for (const match of propMatches) {
    const propName = match[1];
    const propType = match[2].trim();
    props[propName] = propType;
  }

  return props;
}

function extractPropsFromMCPFile(componentName) {
  const mcpPath = path.join(mcpDir, `${componentName}.ts`);

  if (!fs.existsSync(mcpPath)) {
    return null;
  }

  const content = fs.readFileSync(mcpPath, 'utf-8');

  // Extract props section
  const propsMatch = content.match(/props:\s*`([^`]+)`/s);
  if (!propsMatch) {
    return null;
  }

  // Parse props from documentation
  const propsSection = propsMatch[1];
  const propLines = propsSection.split('\n').filter(line => line.trim().startsWith('- `'));

  const props = {};
  for (const line of propLines) {
    const match = line.match(/- `([^`]+)`:/);
    if (match) {
      const propName = match[1];
      props[propName] = true;
    }
  }

  return props;
}

console.log('Component Props Comparison Report');
console.log('==================================\n');

const issues = [];

for (const componentName of components) {
  const actualProps = extractPropsFromTypeFile(componentName);
  const mcpProps = extractPropsFromMCPFile(componentName);

  if (!actualProps) {
    console.log(`⚠️  ${componentName}: No types.ts file found`);
    continue;
  }

  if (!mcpProps) {
    console.log(`⚠️  ${componentName}: No MCP documentation file found`);
    continue;
  }

  const actualPropNames = Object.keys(actualProps);
  const mcpPropNames = Object.keys(mcpProps);

  // Find props in actual but not in MCP
  const missingInMCP = actualPropNames.filter(prop =>
    !mcpPropNames.includes(prop) &&
    !['style', 'testID', 'children'].includes(prop) // Common props usually documented separately
  );

  // Find props in MCP but not in actual
  const extraInMCP = mcpPropNames.filter(prop => !actualPropNames.includes(prop));

  if (missingInMCP.length > 0 || extraInMCP.length > 0) {
    console.log(`\n❌ ${componentName}:`);

    if (missingInMCP.length > 0) {
      console.log(`   Missing in MCP docs: ${missingInMCP.join(', ')}`);
      issues.push({ component: componentName, type: 'missing', props: missingInMCP });
    }

    if (extraInMCP.length > 0) {
      console.log(`   Extra in MCP docs (not in types): ${extraInMCP.join(', ')}`);
      issues.push({ component: componentName, type: 'extra', props: extraInMCP });
    }
  } else {
    console.log(`✅ ${componentName}: Props match`);
  }
}

console.log('\n\nSummary');
console.log('=======');
console.log(`Total issues found: ${issues.length}`);

if (issues.length > 0) {
  console.log('\nComponents needing updates:');
  const componentsWithIssues = [...new Set(issues.map(i => i.component))];
  componentsWithIssues.forEach(comp => console.log(`  - ${comp}`));
}
