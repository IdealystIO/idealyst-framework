# LLM Documentation Access Guide

This guide explains exactly how LLMs can access @idealyst/components documentation in real-world scenarios.

## Scenario 1: Working in a Project with the Package Installed

When helping a developer who has `@idealyst/components` installed in their project:

### Quick Overview
```bash
# Read the main documentation file
cat node_modules/@idealyst/components/CLAUDE.md
```
This gives you everything in one file - all components, patterns, and usage examples.

### Specific Component Details
```bash
# For detailed Button documentation
cat node_modules/@idealyst/components/src/Button/README.md

# For detailed Card documentation  
cat node_modules/@idealyst/components/src/Card/README.md

# And so on for each component...
```

### Component Discovery
```bash
# See all available components
ls node_modules/@idealyst/components/src/*/README.md

# Will show:
# node_modules/@idealyst/components/src/Avatar/README.md
# node_modules/@idealyst/components/src/Badge/README.md
# node_modules/@idealyst/components/src/Button/README.md
# ... etc
```

## Scenario 2: Repository/GitHub Access

When working with the source repository or GitHub:

### Main Documentation
- `packages/components/README.md` - Complete overview with component table
- `packages/components/CLAUDE.md` - LLM-optimized quick reference

### Individual Component Docs
- `packages/components/src/Avatar/README.md`
- `packages/components/src/Button/README.md`
- `packages/components/src/Card/README.md`
- ... etc for all 11 components

## Scenario 3: Package Manager Info

```bash
# View package information
npm info @idealyst/components

# View package README
npm docs @idealyst/components

# Download and examine (if needed)
npm pack @idealyst/components
tar -tf idealyst-components-*.tgz | grep README
```

## Scenario 4: Examples and Live Code

For working examples and demonstrations:

```bash
# Import component examples
import { ButtonExamples, CardExamples } from '@idealyst/components/examples';

# Or read example source code
cat node_modules/@idealyst/components/src/examples/ButtonExamples.tsx
cat node_modules/@idealyst/components/src/examples/CardExamples.tsx
```

## Recommended LLM Workflow

### Step 1: Quick Reference
Start with `CLAUDE.md` for:
- All component names and categories
- Common usage patterns
- Intent system explanation
- Quick examples

### Step 2: Specific Component Help
When user asks about a specific component:
1. Read `src/ComponentName/README.md` for complete details
2. Use the detailed props table, examples, and best practices

### Step 3: Component Discovery
When user asks "what components are available for X":
1. Check the component table in main README.md
2. Use component categories (layout, form, display, etc.)
3. Read individual component descriptions

## File Locations Summary

```
@idealyst/components/
├── README.md                    # Complete overview + component table
├── CLAUDE.md                    # LLM quick reference (START HERE)
├── src/
│   ├── Avatar/README.md         # Detailed Avatar docs
│   ├── Badge/README.md          # Detailed Badge docs  
│   ├── Button/README.md         # Detailed Button docs
│   ├── Card/README.md           # Detailed Card docs
│   ├── Checkbox/README.md       # Detailed Checkbox docs
│   ├── Divider/README.md        # Detailed Divider docs
│   ├── Icon/README.md           # Detailed Icon docs
│   ├── Input/README.md          # Detailed Input docs
│   ├── Screen/README.md         # Detailed Screen docs
│   ├── Text/README.md           # Detailed Text docs
│   └── View/README.md           # Detailed View docs
```

## Pro Tips for LLMs

1. **Always start with `CLAUDE.md`** - it has everything you need for 90% of questions
2. **Component table in main README** - perfect for "what components are available" questions  
3. **Individual README files** - use when user needs specific component details
4. **Check the examples/** folder - contains working code examples for all components
5. **Intent system is key** - primary, neutral, success, error, warning are used across all components

## Quick Command Reference

```bash
# Essential reads for any LLM session
cat CLAUDE.md                           # Complete LLM reference
cat README.md                           # Overview + component table

# Specific component help
cat src/Button/README.md                # Button documentation
cat src/Card/README.md                  # Card documentation

# Discovery
ls src/*/README.md                      # List all component docs
```

This approach ensures LLMs have clear, practical access to all documentation without cluttering the main component API.