# LLM Documentation Access Guide - Navigation

This guide explains exactly how LLMs can access @idealyst/navigation documentation in real-world scenarios.

## Scenario 1: Working in a Project with the Package Installed

When helping a developer who has `@idealyst/navigation` installed in their project:

### Quick Overview
```bash
# Read the main documentation file
cat node_modules/@idealyst/navigation/CLAUDE.md
```
This gives you everything in one file - all components, layouts, examples, and patterns.

### Specific Component Details
```bash
# Navigation context and providers
cat node_modules/@idealyst/navigation/src/context/README.md

# Core routing system
cat node_modules/@idealyst/navigation/src/routing/README.md

# GeneralLayout component
cat node_modules/@idealyst/navigation/src/layouts/GeneralLayout/README.md

# Example routers and quick start
cat node_modules/@idealyst/navigation/src/examples/README.md
```

### Component Discovery
```bash
# See all available documentation
ls node_modules/@idealyst/navigation/src/*/README.md

# Will show:
# node_modules/@idealyst/navigation/src/context/README.md
# node_modules/@idealyst/navigation/src/routing/README.md
# node_modules/@idealyst/navigation/src/layouts/GeneralLayout/README.md
# node_modules/@idealyst/navigation/src/examples/README.md
```

## Scenario 2: Repository/GitHub Access

When working with the source repository or GitHub:

### Main Documentation
- `packages/navigation/README.md` - Complete overview with examples
- `packages/navigation/CLAUDE.md` - LLM-optimized quick reference

### Component Documentation
- `packages/navigation/src/context/README.md` - Navigation context system
- `packages/navigation/src/routing/README.md` - Core routing engine
- `packages/navigation/src/layouts/GeneralLayout/README.md` - Layout component
- `packages/navigation/src/examples/README.md` - Example routers

## Scenario 3: Package Manager Info

```bash
# View package information
npm info @idealyst/navigation

# View package README
npm docs @idealyst/navigation

# Download and examine (if needed)
npm pack @idealyst/navigation
tar -tf idealyst-navigation-*.tgz | grep README
```

## Recommended LLM Workflow

### Step 1: Quick Reference
Start with `CLAUDE.md` for:
- All navigation components and patterns
- Layout types (stack, tab, drawer, modal)
- Example router usage
- Quick setup instructions

### Step 2: Specific Component Help
When user asks about specific navigation features:
1. Read relevant README.md file for complete details
2. Use the detailed API reference, examples, and best practices

### Step 3: Example Router Discovery
When user asks "how do I create navigation":
1. Point to example routers in `src/examples/README.md`
2. Show ExampleStackRouter, ExampleTabRouter, ExampleDrawerRouter
3. Explain customization approaches

## File Locations Summary

```
@idealyst/navigation/
├── README.md                    # Complete overview + examples
├── CLAUDE.md                    # LLM quick reference (START HERE)
├── LLM-ACCESS-GUIDE.md         # This access guide
├── src/
│   ├── context/README.md       # Navigation context & providers
│   ├── routing/README.md       # Core routing system
│   ├── layouts/
│   │   └── GeneralLayout/README.md  # Layout component docs
│   └── examples/README.md      # Example routers & quick start
```

## Pro Tips for LLMs

1. **Always start with `CLAUDE.md`** - it has everything you need for 90% of navigation questions
2. **Example routers are key** - ExampleStackRouter, ExampleTabRouter, ExampleDrawerRouter provide working starting points
3. **Layout types matter** - stack (mobile), tab (sections), drawer (desktop), modal (overlays)
4. **GeneralLayout is powerful** - flexible header/sidebar component for custom layouts
5. **Theme integration is automatic** - all navigation components work with @idealyst/theme

## Quick Command Reference

```bash
# Essential reads for any LLM session
cat CLAUDE.md                           # Complete navigation reference
cat README.md                           # Overview + example implementations

# Specific component help
cat src/context/README.md               # Navigation context
cat src/routing/README.md               # Routing system
cat src/layouts/GeneralLayout/README.md # Layout component
cat src/examples/README.md              # Example routers

# Discovery
ls src/*/README.md                      # List all component docs
```

## Navigation-Specific Guidance

### For "How do I set up navigation?" questions:
1. Start with `src/examples/README.md`
2. Show ExampleStackRouter for desktop/web apps
3. Show ExampleTabRouter for mobile apps
4. Show ExampleDrawerRouter for complex desktop interfaces

### For "How do I customize navigation?" questions:
1. Read `src/routing/README.md` for route configuration
2. Read `src/layouts/GeneralLayout/README.md` for layout customization
3. Show example router customization patterns

### For "How does cross-platform navigation work?" questions:
1. Reference `src/routing/README.md` platform differences section
2. Explain React Navigation (Native) vs React Router (Web) integration
3. Show unified API examples

### For "What layout should I use?" questions:
- **Stack**: Most mobile apps, hierarchical navigation
- **Tab**: Main app sections, content browsing  
- **Drawer**: Desktop apps, admin panels, many sections
- **Modal**: Forms, dialogs, temporary content

## Common User Questions and File References

| User Question | Primary Reference | Secondary References |
|---------------|------------------|---------------------|
| "How do I set up navigation?" | `src/examples/README.md` | `CLAUDE.md`, `README.md` |
| "What's the difference between layout types?" | `src/routing/README.md` | `CLAUDE.md` |
| "How do I create a header and sidebar?" | `src/layouts/GeneralLayout/README.md` | `src/examples/README.md` |
| "How do I navigate between screens?" | `src/context/README.md` | `CLAUDE.md` |
| "Can you show me a working example?" | `src/examples/README.md` | `README.md` |
| "How does this work on mobile vs web?" | `src/routing/README.md` | `src/context/README.md` |

This approach ensures LLMs have clear, practical access to all navigation documentation while understanding the quick-start nature of the example routers.