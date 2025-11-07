# MCP Server Type-Driven Architecture

## Problem Statement

The MCP server documentation is manually maintained and has drifted from the actual TypeScript type definitions in `@idealyst/components` and `@idealyst/theme`. This causes:
- Incorrect prop names and values in documentation
- TypeScript compilation errors when using documented examples
- High maintenance burden to keep docs in sync
- Loss of developer trust

## Solution: Type-Driven Documentation System

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ @idealyst/components & @idealyst/theme (Source of Truth)│
│ - Button/types.ts                                       │
│ - Card/types.ts                                         │
│ - theme/size.ts (Size type)                            │
│ - theme/intent.ts (Intent type)                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Build-Time Type Extraction (packages/mcp-server/build) │
│ - extract-types.ts                                      │
│   • Uses TypeScript Compiler API                       │
│   • Parses all component types.ts files                │
│   • Extracts Size, Intent, Color from theme            │
│   • Generates JSON schema                              │
│ - validate-examples.ts                                  │
│   • Validates all examples against extracted types     │
│   • Fails build if examples have type errors           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Generated Type Definitions (auto-generated)             │
│ - src/generated/types.json                             │
│   {                                                     │
│     "Button": {                                         │
│       "props": {                                        │
│         "type": { "type": "ButtonType", "values": [...]}│
│         "size": { "type": "Size", "values": ["xs",...]  │
│         "leftIcon": { "type": "IconName | ReactNode" } │
│       }                                                 │
│     }                                                   │
│   }                                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ MCP Server Runtime                                      │
│ - New Tool: get_component_types(componentName)         │
│   Returns: Raw TypeScript interface + extracted JSON   │
│                                                         │
│ - Enhanced Tool: get_component_docs(componentName)     │
│   Generates docs from types.json + manual content      │
│                                                         │
│ - Validated Examples                                    │
│   All examples are TypeScript-validated at build time  │
└─────────────────────────────────────────────────────────┘
```

### Implementation Phases

#### Phase 1: Add Type Extraction System
**Files to Create:**
- `packages/mcp-server/scripts/extract-types.ts`
- `packages/mcp-server/scripts/validate-examples.ts`
- `packages/mcp-server/scripts/type-extractor.ts` (utility)

**What It Does:**
- Reads TypeScript type files from components/theme packages
- Extracts prop definitions, enums, types
- Generates `src/generated/types.json`
- Runs as part of MCP server build process

#### Phase 2: Add Type Export Tool
**File to Modify:**
- `packages/mcp-server/src/index.ts`

**New Tool:**
```typescript
{
  name: "get_component_types",
  description: "Get TypeScript type definitions for a component",
  inputSchema: {
    type: "object",
    properties: {
      component: { type: "string" },
      format: {
        type: "string",
        enum: ["typescript", "json", "both"],
        description: "typescript=raw .d.ts, json=parsed schema, both=combined"
      }
    }
  }
}
```

**Returns:**
```typescript
{
  component: "Button",
  typescript: `export interface ButtonProps {
    type?: 'contained' | 'outlined' | 'text';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    // ...
  }`,
  schema: {
    props: {
      type: { type: "ButtonType", values: ["contained", "outlined", "text"] },
      size: { type: "Size", values: ["xs", "sm", "md", "lg", "xl"] }
    }
  }
}
```

#### Phase 3: Refactor Documentation Generation
**Files to Modify:**
- `packages/mcp-server/src/data/components/*.ts`

**New Structure:**
```typescript
// Button.ts
import buttonTypes from '../../generated/types.json';

export const Button = {
  category: "form",
  description: "Interactive button component...",

  // Props are now auto-generated from types.json
  // Manual override only for additional context
  propsOverride: {
    leftIcon: "Icon to display on the left. Supports icon names (e.g., 'check') or custom React elements"
  },

  // Types come from extracted schema
  types: buttonTypes.Button,

  features: [...],
  bestPractices: [...],

  examples: {
    basic: `...`,
    // Examples are validated at build time
  }
};
```

#### Phase 4: Add Validation Testing
**Files to Create:**
- `packages/mcp-server/tests/type-accuracy.test.ts`
- `packages/mcp-server/tests/example-validation.test.ts`

**Tests:**
1. Verify extracted types match source files
2. Validate all examples compile with TypeScript
3. Check that documentation prop names exist in types
4. Ensure enum values in docs match type definitions

### Developer Experience Improvements

#### For Component Library Developers
- Change types in `@idealyst/components` → Types auto-update in MCP docs
- Build fails if examples become invalid
- No manual documentation sync required

#### For AI Assistants (Claude, etc.)
- Can request raw TypeScript types: `get_component_types("Button", "typescript")`
- Can get both human docs + machine-readable schema
- Examples are guaranteed to be type-correct

#### For End Users
- Generated code works on first try
- No more "property doesn't exist" errors
- Documentation always matches reality

### Migration Strategy

#### Step 1: Extract Types (Non-Breaking)
Add type extraction as opt-in feature, keep current docs working

#### Step 2: Validate Examples (Breaking if invalid)
Add example validation, fix any broken examples

#### Step 3: Generate Props Docs (Enhancement)
Auto-generate prop documentation from types, merge with manual overrides

#### Step 4: Add Type Export Tool (New Feature)
Add new MCP tool for direct type access

### File Structure

```
packages/mcp-server/
├── scripts/
│   ├── extract-types.ts          # Main extraction script
│   ├── validate-examples.ts      # Example validation
│   └── type-extractor.ts         # Shared utilities
├── src/
│   ├── generated/
│   │   ├── types.json            # Auto-generated type schemas
│   │   └── types.d.ts            # TypeScript definitions
│   ├── data/
│   │   └── components/
│   │       ├── Button.ts         # Now references types.json
│   │       └── ...
│   ├── tools/
│   │   ├── get-types.ts          # New type export tool
│   │   └── ...
│   └── index.ts
├── tests/
│   ├── type-accuracy.test.ts     # Validation tests
│   └── example-validation.test.ts
└── package.json                   # Add build scripts
```

### Required Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-morph": "^21.0.0",        // TypeScript Compiler API wrapper
    "@types/node": "^20.0.0"
  }
}
```

### Build Process

```json
{
  "scripts": {
    "extract-types": "tsx scripts/extract-types.ts",
    "validate-examples": "tsx scripts/validate-examples.ts",
    "prebuild": "yarn extract-types && yarn validate-examples",
    "build": "tsc && chmod +x dist/index.js"
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/validate-mcp.yml
name: Validate MCP Documentation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: yarn install
      - name: Extract types
        run: yarn extract-types
      - name: Validate examples
        run: yarn validate-examples
      - name: Build
        run: yarn build
```

## Benefits

### Accuracy
✅ Types are always correct (single source of truth)
✅ Examples are validated at build time
✅ No manual synchronization needed

### Developer Experience
✅ AI assistants can access raw TypeScript types
✅ Documentation is always up-to-date
✅ Type-correct code generation

### Maintenance
✅ Reduced manual work
✅ Automated validation prevents drift
✅ Clear error messages when examples break

### Scalability
✅ Adding new components is easier
✅ Type changes propagate automatically
✅ Multi-package support (components, navigation, theme)

## Next Steps

1. **Immediate**: Fix current documentation issues manually
2. **Short-term**: Implement type extraction system (Phase 1)
3. **Medium-term**: Add validation and type export tool (Phases 2-3)
4. **Long-term**: Full migration to auto-generated docs (Phase 4)

## Questions & Considerations

### Q: What about documentation that isn't in types?
A: Keep manual content for features, best practices, and examples. Auto-generate only the prop definitions.

### Q: How do we handle custom types that aren't exported?
A: Type extractor can be configured to follow type references and extract related types.

### Q: What about web vs native differences?
A: Extract from both `.web.tsx` and `.native.tsx` type files, mark platform-specific props.

### Q: Performance impact of type extraction?
A: Runs at build time only, not at runtime. No performance impact on MCP server.

### Q: What if TypeScript types are too complex to display?
A: Provide both raw TypeScript (for AI/tools) and simplified JSON schema (for humans).
