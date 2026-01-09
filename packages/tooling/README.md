# @idealyst/tooling

Code analysis and validation utilities for Idealyst Framework. Provides shared tools for babel plugins, CLI, and MCP to validate cross-platform React/React Native code.

## Installation

```bash
yarn add @idealyst/tooling
# or
npm install @idealyst/tooling
```

## Features

- **Platform Import Analyzer**: Validates that component files don't use platform-specific primitives unless appropriately suffixed
- **File Classifier**: Classifies files by their extension (.web.tsx, .native.tsx, etc.)
- **Import Parser**: Parses TypeScript/JavaScript imports using the TypeScript compiler API
- **Primitive Rules**: Built-in lists of React Native and React DOM primitives

## Usage

### Platform Import Analysis

The main feature is validating that shared component files don't accidentally use platform-specific imports:

```typescript
import { analyzePlatformImports, analyzeFiles } from '@idealyst/tooling';

// Single file analysis
const result = analyzePlatformImports(
  'src/components/Button.tsx',
  sourceCode,
  { severity: 'error' }
);

if (!result.passed) {
  for (const violation of result.violations) {
    console.error(`${violation.filePath}:${violation.line}:${violation.column}`);
    console.error(`  ${violation.message}`);
  }
}

// Batch analysis
const results = analyzeFiles(
  [
    { path: 'Button.tsx', content: buttonSource },
    { path: 'Button.web.tsx', content: webSource },
    { path: 'Button.native.tsx', content: nativeSource },
  ],
  {
    severity: 'warning',
    ignoredPatterns: ['**/*.test.tsx'],
  }
);

const failedFiles = results.filter(r => !r.passed);
```

### File Classification

Classify files based on their extension patterns:

```typescript
import { classifyFile, isSharedFile } from '@idealyst/tooling';

classifyFile('Button.tsx');        // 'shared'
classifyFile('Button.web.tsx');    // 'web'
classifyFile('Button.native.tsx'); // 'native'
classifyFile('Button.styles.tsx'); // 'styles'
classifyFile('types.ts');          // 'types'

// Check if a file should be validated for cross-platform imports
if (isSharedFile(filePath)) {
  // This file should NOT have platform-specific imports
}
```

### Import Parsing

Parse imports from source code:

```typescript
import { parseImports } from '@idealyst/tooling';

const imports = parseImports(sourceCode, 'Button.tsx');

for (const imp of imports) {
  console.log(`${imp.name} from '${imp.source}' (${imp.platform})`);
}
```

### Primitive Rules

Access built-in primitive lists:

```typescript
import {
  REACT_NATIVE_PRIMITIVES,
  REACT_DOM_PRIMITIVES,
  isReactNativePrimitive,
  isReactDomPrimitive,
} from '@idealyst/tooling';

// Check if a name is a known primitive
isReactNativePrimitive('View');      // true
isReactNativePrimitive('div');       // false
isReactDomPrimitive('createPortal'); // true
```

## API Reference

### `analyzePlatformImports(filePath, sourceCode, options?)`

Analyze a single file for platform import violations.

**Options:**
- `severity`: Default severity level (`'error'` | `'warning'` | `'info'`)
- `additionalNativePrimitives`: Extra primitives to flag as React Native
- `additionalDomPrimitives`: Extra primitives to flag as React DOM
- `ignoredPrimitives`: Primitives to skip validation for
- `ignoredPatterns`: Glob patterns for files to skip
- `additionalNativeSources`: Extra module sources treated as React Native
- `additionalDomSources`: Extra module sources treated as React DOM

**Returns:** `AnalysisResult` with violations and metadata.

### `analyzeFiles(files, options?)`

Analyze multiple files at once.

### `classifyFile(filePath)`

Classify a file by its extension pattern.

**Returns:** `'shared'` | `'web'` | `'native'` | `'styles'` | `'types'` | `'other'`

### `parseImports(sourceCode, filePath?, options?)`

Parse all imports from source code.

**Returns:** Array of `ImportInfo` objects.

## Validation Rules

### Shared Files (`.tsx`, `.jsx`)

Should NOT import:
- React Native primitives (`View`, `Text`, `TouchableOpacity`, etc.)
- React DOM APIs (`createPortal`, `flushSync`, etc.)

### Web Files (`.web.tsx`, `.web.jsx`)

Should NOT import:
- React Native primitives

### Native Files (`.native.tsx`, `.native.jsx`)

Should NOT import:
- React DOM APIs

## Built-in Primitives

### React Native

Core: `View`, `Text`, `Image`, `ScrollView`, `FlatList`, `SectionList`

Interactive: `TouchableOpacity`, `TouchableHighlight`, `Pressable`, `Button`

Input: `TextInput`, `Switch`

Modal: `Modal`, `Alert`, `StatusBar`

Animation: `Animated`, `Easing`, `LayoutAnimation`

Platform: `Platform`, `Dimensions`, `BackHandler`, `Keyboard`

Safety: `SafeAreaView`, `KeyboardAvoidingView`

### React DOM

APIs: `createPortal`, `flushSync`, `createRoot`, `hydrateRoot`

## License

MIT
