# Type-Driven Documentation System

## Overview

The Idealyst MCP Server uses a **type-driven architecture** to ensure documentation accuracy. Instead of manually maintaining prop definitions, we extract TypeScript types directly from the source packages and validate all examples against them.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│ Source Packages (Single Source of Truth)                 │
│ • @idealyst/components/src/*/types.ts                   │
│ • @idealyst/theme/src/theme/*.ts                        │
│ • @idealyst/navigation/src/routing/types.ts             │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ Build-Time Type Extraction                               │
│ • scripts/extract-types.ts                              │
│ • scripts/type-extractor.ts                             │
│ Uses TypeScript Compiler API (ts-morph)                 │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ Generated Type Definitions                               │
│ • src/generated/types.json                              │
│ Contains all extracted types and props                   │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ MCP Server Tools                                         │
│ • get_component_types(component, format)                │
│ • get_theme_types(format)                               │
│ • get_navigation_types(format)                          │
│ • get_component_examples_ts(component)                  │
└──────────────────────────────────────────────────────────┘
```

## Type Extraction

### What Gets Extracted

From **@idealyst/components**:
- Component props interfaces (`ButtonProps`, `CardProps`, etc.)
- All related types (enums, unions, type aliases)
- Individual prop details (name, type, required, description)

From **@idealyst/theme**:
- `Size` type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `Intent` type: `'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'info'`
- `Color` type: `Pallet.Shade` format
- `Pallet` and `Shade` types

From **@idealyst/navigation**:
- Navigator types (Stack, Tab, Drawer, Modal)
- Route configuration types
- Screen options types

### Running Type Extraction

```bash
# Extract types from all packages
yarn extract-types

# Output: src/generated/types.json
```

This generates a JSON file containing all type information structured for easy consumption by the MCP server.

## Example Validation

### TypeScript Example Files

All examples are stored as real TypeScript files in `examples/components/`:

```typescript
// examples/components/Button.examples.tsx
import React from 'react';
import { Button } from '@idealyst/components';

export function BasicButton() {
  return (
    <Button type="contained" intent="primary">
      Save
    </Button>
  );
}
```

### Running Validation

```bash
# Validate all examples against actual types
yarn validate-examples

# This runs TypeScript compiler on all example files
# Fails if any examples have type errors
```

### Benefits

✅ **Guaranteed Correctness**: Examples won't compile if they use wrong prop names or values
✅ **Auto-Discovery**: Type errors are caught immediately during build
✅ **Real Code**: Examples are actual TypeScript, not strings in documentation
✅ **IDE Support**: Examples can be developed with full autocomplete and type checking

## MCP Server Tools

### get_component_types

Get TypeScript type definitions for a component.

```typescript
// Request
{
  component: "Button",
  format: "both" // or "typescript" or "json"
}

// Response
{
  component: "Button",
  typescript: "export interface ButtonProps { ... }",
  schema: {
    propsInterface: "ButtonProps",
    props: [
      { name: "type", type: "ButtonType", required: false },
      { name: "size", type: "Size", required: false },
      { name: "leftIcon", type: "IconName | React.ReactNode", required: false }
    ],
    relatedTypes: {
      "ButtonType": "export type ButtonType = 'contained' | 'outlined' | 'text';"
    }
  }
}
```

**Formats:**
- `typescript`: Raw TypeScript interface definitions
- `json`: Parsed JSON schema with prop details
- `both`: Combined output (default)

### get_theme_types

Get all theme types (Size, Intent, Color, etc.)

```typescript
// Request
{ format: "json" }

// Response
{
  name: "Theme Types",
  schema: {
    "Size": {
      name: "Size",
      definition: "export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';",
      values: ["xs", "sm", "md", "lg", "xl"]
    },
    "Intent": {
      name: "Intent",
      definition: "export type Intent = 'primary' | 'success' | ...",
      values: ["primary", "success", "error", "warning", "neutral", "info"]
    }
  }
}
```

### get_navigation_types

Get navigation type definitions.

```typescript
// Request
{ format: "typescript" }

// Response
{
  name: "Navigation Types",
  typescript: "export type NavigatorParam = ...\nexport type RouteParam = ..."
}
```

### get_component_examples_ts

Get validated TypeScript examples for a component.

```typescript
// Request
{ component: "Button" }

// Response: Full content of examples/components/Button.examples.tsx
```

## Development Workflow

### Adding a New Component

1. **Create the component** in `@idealyst/components`
2. **Define types** in `ComponentName/types.ts`
3. **Run extraction** to generate types:
   ```bash
   yarn extract-types
   ```
4. **Create examples** in `examples/components/ComponentName.examples.tsx`
5. **Validate examples**:
   ```bash
   yarn validate-examples
   ```
6. **Build MCP server**:
   ```bash
   yarn build
   ```

### Updating Component Types

When you change a component's types:

1. **Edit types** in `@idealyst/components/src/ComponentName/types.ts`
2. **Rebuild packages** if necessary
3. **Run type extraction**:
   ```bash
   cd packages/mcp-server
   yarn extract-types
   ```
4. **Validation will catch** any examples that are now broken:
   ```bash
   yarn validate-examples
   ```
5. **Fix broken examples** if needed
6. **Rebuild** MCP server

## Build Process

The build process ensures type accuracy:

```json
{
  "scripts": {
    "prebuild": "yarn extract-types && yarn validate-examples",
    "build": "tsc && chmod +x dist/index.js"
  }
}
```

### What Happens

1. **Extract Types**: Parse TypeScript files from packages, generate `types.json`
2. **Validate Examples**: Type-check all example files
3. **Build Fails**: If examples have type errors
4. **Build Succeeds**: Only if all examples are type-correct

## CI/CD Integration

### Recommended GitHub Actions

```yaml
name: Validate MCP Documentation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: yarn install

      - name: Extract types
        run: |
          cd packages/mcp-server
          yarn extract-types

      - name: Validate examples
        run: |
          cd packages/mcp-server
          yarn validate-examples

      - name: Build
        run: |
          cd packages/mcp-server
          yarn build
```

## File Structure

```
packages/mcp-server/
├── scripts/
│   ├── extract-types.ts          # Main extraction script
│   ├── type-extractor.ts         # Type extraction utilities
│   └── validate-examples.ts      # Example validation script
├── src/
│   ├── generated/
│   │   └── types.json            # Auto-generated (gitignored)
│   ├── tools/
│   │   └── get-types.ts          # Type export tools
│   └── index.ts                   # MCP server entry
├── examples/
│   └── components/
│       ├── Button.examples.tsx    # Type-checked examples
│       ├── Card.examples.tsx
│       └── ...
├── tsconfig.json                  # Main TypeScript config
├── tsconfig.examples.json         # Config for validating examples
└── package.json
```

## Benefits

### For Component Library Developers
- ✅ Change types → Documentation updates automatically
- ✅ No manual synchronization required
- ✅ Build fails if examples become invalid

### For AI Assistants (Claude, etc.)
- ✅ Access to raw TypeScript types
- ✅ Validated examples guaranteed to work
- ✅ Both human-readable and machine-readable formats

### For End Users
- ✅ Documentation always matches reality
- ✅ Examples compile on first try
- ✅ No "property doesn't exist" errors

## Troubleshooting

### Build Fails: "Types file not found"

Run type extraction first:
```bash
yarn extract-types
```

### Validation Fails: Type Errors in Examples

The examples have type errors. This is intentional! Fix the examples to match the actual types:
```bash
# See specific errors
yarn validate-examples

# Fix the examples, then re-validate
yarn validate-examples
```

### Types Are Out of Date

Re-extract after changing component types:
```bash
yarn extract-types
```

### Can't Find Component Types

Ensure the component has a `types.ts` file in its directory:
```
packages/components/src/
  Button/
    types.ts         ← Required
    Button.tsx
    ...
```

## Future Enhancements

### Planned Features

1. **Auto-Generate Prop Documentation**: Generate human-readable prop tables from types
2. **Visual Type Inspector**: Web UI to browse extracted types
3. **Incremental Extraction**: Only re-extract changed components
4. **Cross-Package Type Resolution**: Better handling of types imported from other packages
5. **Markdown Generation**: Auto-generate markdown docs from types

### Contributing

To contribute to the type system:

1. Follow the architecture in `ARCHITECTURE.md`
2. Add tests for new extractors
3. Ensure all examples remain valid
4. Update this documentation

## References

- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [ts-morph Documentation](https://ts-morph.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
