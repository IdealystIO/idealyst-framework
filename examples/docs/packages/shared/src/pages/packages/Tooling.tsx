import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function ToolingPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Tooling
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Public utilities for component validation, theme analysis, and documentation
          generation. Use these tools to validate your components against Idealyst
          standards and generate component documentation automatically.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          title="Import"
          code={`import {
  // Component Analysis
  analyzeComponents,
  analyzeTheme,
  componentRegistry,

  // Linting
  lintComponent,
  lintComponents,

  // Vite Plugin
  idealystDocsPlugin,
} from '@idealyst/tooling';`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Component Registry
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Access component metadata at runtime. The registry is populated by the
          Vite plugin at build time, providing prop definitions, types, and documentation.
        </Text>

        <CodeBlock
          title="Using the Component Registry"
          code={`import { componentRegistry, componentNames, getComponentsByCategory } from '@idealyst/tooling';

// List all component names
console.log(componentNames);
// ['Button', 'Card', 'Input', 'Text', ...]

// Get components by category
const formComponents = getComponentsByCategory('form');
// ['Button', 'Input', 'Select', 'Checkbox', ...]

// Access component definition
const buttonDef = componentRegistry['Button'];
console.log(buttonDef.description);
console.log(buttonDef.props);
// {
//   intent: { type: 'Intent', values: ['primary', 'success', ...], required: false },
//   size: { type: 'Size', values: ['xs', 'sm', 'md', ...], required: false },
//   ...
// }

// Get prop config for interactive playground
import { getPropConfig } from '@idealyst/tooling';
const config = getPropConfig('Button');
// { intent: { type: 'select', options: [...] }, size: { type: 'select', options: [...] } }`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Component Linting
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Validate components against Idealyst standards. Catches issues that
          TypeScript cannot detect, like hardcoded colors or incorrect platform imports.
        </Text>

        <CodeBlock
          title="Linting Components"
          code={`import { lintComponent, lintComponents, formatLintResults } from '@idealyst/tooling';
import fs from 'fs';

// Lint a single file
const sourceCode = fs.readFileSync('src/components/MyButton.tsx', 'utf-8');
const result = lintComponent('src/components/MyButton.tsx', sourceCode, {
  rules: {
    hardcodedColors: 'error',      // Detect '#fff', 'red', etc.
    directPlatformImports: 'warning', // Detect 'react-native' imports in shared files
  },
  allowedColors: ['transparent', 'inherit'], // Colors to ignore
});

if (!result.passed) {
  console.error('Linting failed:');
  for (const issue of result.issues) {
    console.error(\`  \${issue.line}:\${issue.column} - \${issue.message}\`);
    if (issue.suggestion) {
      console.error(\`    Suggestion: \${issue.suggestion}\`);
    }
  }
}

// Lint multiple files
const files = [
  { path: 'src/Button.tsx', content: buttonSource },
  { path: 'src/Card.tsx', content: cardSource },
];
const results = lintComponents(files);

// Format for console output
const formatted = formatLintResults(results);
formatted.forEach(line => console.log(line));`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 24 }}>
          Lint Rules
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>hardcoded-color</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Detects hardcoded color values like '#fff', 'red', 'rgb(0,0,0)'.
              Colors should come from theme.colors or theme.intents instead.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>direct-platform-import</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Detects direct imports from 'react-native' in shared files.
              Use @idealyst/components for cross-platform compatibility.
            </Text>
          </Card>
        </View>

        <CodeBlock
          title="Lint Result Type"
          code={`interface LintResult {
  filePath: string;
  issues: LintIssue[];
  passed: boolean;      // true if no errors (warnings OK)
  counts: {
    error: number;
    warning: number;
    info: number;
  };
}

interface LintIssue {
  type: 'hardcoded-color' | 'direct-platform-import';
  severity: 'error' | 'warning' | 'info';
  line: number;
  column: number;
  code: string;         // The problematic code
  message: string;      // Human-readable description
  suggestion?: string;  // How to fix it
}`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Vite Plugin
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Generate component documentation at build time. The plugin analyzes your
          component source files and populates the component registry.
        </Text>

        <CodeBlock
          title="vite.config.ts"
          code={`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { idealystDocsPlugin } from '@idealyst/tooling';
import path from 'path';

export default defineConfig({
  plugins: [
    // Idealyst docs plugin - generates component registry
    idealystDocsPlugin({
      // Paths to scan for components
      componentPaths: [
        path.resolve(__dirname, '../../packages/components/src'),
      ],
      // Path to theme file for extracting design tokens
      themePath: path.resolve(__dirname, '../shared/src/styles.ts'),
      // Enable debug logging
      debug: true,
    }),
    react(),
  ],
});`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 24 }}>
          Plugin Options
        </Text>

        <View style={{ gap: 8, marginBottom: 24 }}>
          <OptionRow name="componentPaths" type="string[]" description="Paths to scan for component files" required />
          <OptionRow name="themePath" type="string" description="Path to theme file for design tokens" required />
          <OptionRow name="include" type="string[]" description="Component names to include (default: all)" />
          <OptionRow name="exclude" type="string[]" description="Component names to exclude" />
          <OptionRow name="includeInternal" type="boolean" description="Include internal/private components" />
          <OptionRow name="output" type="'virtual' | 'file'" description="Output mode (default: virtual)" />
          <OptionRow name="outputPath" type="string" description="File path when output is 'file'" />
          <OptionRow name="debug" type="boolean" description="Enable debug logging" />
        </View>

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Component Analysis
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Analyze components programmatically. Useful for CLI tools, MCP servers,
          or custom documentation generators.
        </Text>

        <CodeBlock
          title="Analyzing Components"
          code={`import { analyzeComponents, analyzeTheme } from '@idealyst/tooling';

// Analyze all components in a directory
const registry = analyzeComponents({
  componentPaths: ['packages/components/src'],
  themePath: 'packages/theme/src/lightTheme.ts',
  exclude: ['Internal*'], // Skip internal components
});

// Access component definitions
for (const [name, def] of Object.entries(registry)) {
  console.log(\`\${name}: \${def.description}\`);
  console.log(\`  Category: \${def.category}\`);
  console.log(\`  Props: \${Object.keys(def.props).join(', ')}\`);
}

// Analyze theme for design tokens
const theme = analyzeTheme('packages/theme/src/lightTheme.ts');
console.log('Intents:', theme.intents);
// ['primary', 'secondary', 'success', 'warning', 'error', ...]
console.log('Sizes:', theme.sizes);
// { button: ['xs', 'sm', 'md', 'lg', 'xl'], ... }
console.log('Typography:', theme.typography);
// ['h1', 'h2', 'h3', 'body1', 'body2', ...]`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Platform Import Analysis
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Validate that your cross-platform code doesn't accidentally import
          platform-specific modules in shared files.
        </Text>

        <CodeBlock
          title="Platform Import Analysis"
          code={`import {
  analyzePlatformImports,
  analyzeFiles,
  formatViolations,
  summarizeResults,
} from '@idealyst/tooling';

// Analyze a single file's imports
const violations = analyzePlatformImports(sourceCode, filePath);
for (const v of violations) {
  console.log(\`\${v.source} cannot be imported in \${v.fileType} files\`);
}

// Analyze multiple files
const results = analyzeFiles([
  { path: 'src/Button.tsx', content: buttonCode },
  { path: 'src/Button.web.tsx', content: webCode },
  { path: 'src/Button.native.tsx', content: nativeCode },
]);

// Format for output
const formatted = formatViolations(results);
formatted.forEach(line => console.log(line));

// Get summary
const summary = summarizeResults(results);
console.log(\`Total files: \${summary.totalFiles}\`);
console.log(\`Files with violations: \${summary.violatingFiles}\`);`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Utility Functions
        </Text>

        <CodeBlock
          title="File Classification"
          code={`import {
  classifyFile,
  isComponentFile,
  isSharedFile,
  isPlatformSpecificFile,
  getExpectedPlatform,
} from '@idealyst/tooling';

// Classify a file
const classification = classifyFile('src/components/Button.web.tsx');
// { type: 'component', platform: 'web', isShared: false }

// Check file type
isComponentFile('Button.tsx');        // true
isSharedFile('Button.tsx');           // true
isPlatformSpecificFile('Button.web.tsx'); // true

// Get expected platform
getExpectedPlatform('Button.web.tsx');    // 'web'
getExpectedPlatform('Button.native.tsx'); // 'native'
getExpectedPlatform('Button.tsx');        // 'shared'`}
        />

        <CodeBlock
          title="Import Parsing"
          code={`import { parseImports, groupImportsBySource } from '@idealyst/tooling';

const imports = parseImports(sourceCode);
// [
//   { source: 'react', specifiers: ['useState', 'useEffect'] },
//   { source: '@idealyst/components', specifiers: ['Button', 'Card'] },
// ]

const grouped = groupImportsBySource(imports);
// {
//   'react': ['useState', 'useEffect'],
//   '@idealyst/components': ['Button', 'Card'],
// }`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Platform Rules
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Access the built-in rules for React Native and React DOM primitives.
        </Text>

        <CodeBlock
          title="Platform Rules"
          code={`import {
  // React Native
  REACT_NATIVE_PRIMITIVES,
  isReactNativePrimitive,

  // React DOM
  REACT_DOM_PRIMITIVES,
  HTML_INTRINSIC_ELEMENTS,
  isReactDomPrimitive,
  isHtmlElement,
} from '@idealyst/tooling';

// Check React Native primitives
isReactNativePrimitive('View');      // true
isReactNativePrimitive('div');       // false

// Check React DOM primitives
isReactDomPrimitive('button');       // false (use semantic check)
isHtmlElement('div');                // true
isHtmlElement('View');               // false

// Access primitive lists
console.log(REACT_NATIVE_PRIMITIVES);
// ['View', 'Text', 'Image', 'ScrollView', ...]

console.log(HTML_INTRINSIC_ELEMENTS);
// ['div', 'span', 'button', 'input', ...]`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Use Cases
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Documentation Sites</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Use the Vite plugin to generate component documentation automatically.
              The component registry provides prop definitions, types, and examples
              for building interactive playgrounds.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>CI/CD Validation</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Run the linter in your CI pipeline to catch hardcoded colors and
              platform import issues before they reach production.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>MCP Servers</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Use analyzeComponents() to provide component metadata to AI assistants.
              The Idealyst MCP server uses this to help with component usage.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Custom Tooling</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Build custom CLI tools or IDE extensions that understand your
              component library's structure and design tokens.
            </Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
}

function OptionRow({
  name,
  type,
  description,
  required,
}: {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
    >
      <View style={{ width: 160 }}>
        <Text weight="semibold" style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {name}
          {required && <Text color="error">*</Text>}
        </Text>
      </View>
      <View style={{ width: 140 }}>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {type}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text typography="body2" color="tertiary">
          {description}
        </Text>
      </View>
    </View>
  );
}
