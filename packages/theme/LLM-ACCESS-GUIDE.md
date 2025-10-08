# LLM Documentation Access Guide - Theme

This guide explains exactly how LLMs can access @idealyst/theme documentation in real-world scenarios.

## Scenario 1: Working in a Project with the Package Installed

When helping a developer who has `@idealyst/theme` installed in their project:

### Quick Overview
```bash
# Read the main documentation file
cat node_modules/@idealyst/theme/CLAUDE.md
```
This gives you everything in one file - all theming concepts, color systems, and usage patterns.

### Specific Component Details
```bash
# Theme system overview
cat node_modules/@idealyst/theme/src/README.md

# Core theme creation utilities
cat node_modules/@idealyst/theme/src/themeBuilder.md

# Color palette definitions
cat node_modules/@idealyst/theme/src/colors.md

# Default themes (light and dark)
cat node_modules/@idealyst/theme/src/defaultThemes.md
```

### Component Discovery
```bash
# See all available documentation
ls node_modules/@idealyst/theme/src/*.md

# Will show:
# node_modules/@idealyst/theme/src/README.md
# node_modules/@idealyst/theme/src/themeBuilder.md
# node_modules/@idealyst/theme/src/colors.md
# node_modules/@idealyst/theme/src/defaultThemes.md
```

## Scenario 2: Repository/GitHub Access

When working with the source repository or GitHub:

### Main Documentation
- `packages/theme/README.md` - Complete overview with examples
- `packages/theme/CLAUDE.md` - LLM-optimized quick reference

### Component Documentation
- `packages/theme/src/README.md` - Theme system overview
- `packages/theme/src/themeBuilder.md` - Core utilities
- `packages/theme/src/colors.md` - Color palette system
- `packages/theme/src/defaultThemes.md` - Default light/dark themes

## Scenario 3: Package Manager Info

```bash
# View package information
npm info @idealyst/theme

# View package README
npm docs @idealyst/theme

# Download and examine (if needed)
npm pack @idealyst/theme
tar -tf idealyst-theme-*.tgz | grep README
```

## Recommended LLM Workflow

### Step 1: Quick Reference
Start with `CLAUDE.md` for:
- Complete theming system overview
- Color system structure (palettes, intents, component colors)
- Typography, spacing, and layout systems
- Quick setup and usage patterns

### Step 2: Specific Component Help
When user asks about specific theming features:
1. Read relevant .md file for complete details
2. Use the detailed API reference, examples, and best practices

### Step 3: Theme Creation Discovery
When user asks "how do I create custom themes":
1. Point to `src/themeBuilder.md` for core creation utilities
2. Show `src/colors.md` for palette understanding
3. Explain extension vs creation from scratch

## File Locations Summary

```
@idealyst/theme/
├── README.md                    # Complete overview + examples
├── CLAUDE.md                    # LLM quick reference (START HERE)
├── LLM-ACCESS-GUIDE.md         # This access guide
├── src/
│   ├── README.md               # Theme system overview
│   ├── themeBuilder.md         # Core theme creation utilities
│   ├── colors.md               # Color palette definitions  
│   └── defaultThemes.md        # Default light and dark themes
```

## Pro Tips for LLMs

1. **Always start with `CLAUDE.md`** - it has everything you need for 90% of theming questions
2. **Color system is key** - Understand palettes → intents → component colors hierarchy
3. **Default themes first** - Start with `defaultLightTheme`/`defaultDarkTheme`, extend as needed
4. **Intent-based colors** - Prefer `theme.intents.primary.main` over direct palette access
5. **Component color system** - Use `theme.colors.text.primary` for consistent styling
6. **Generation over manual** - Use `generateColorPalette()` for brand colors

## Quick Command Reference

```bash
# Essential reads for any LLM session
cat CLAUDE.md                           # Complete theming reference
cat README.md                           # Overview + comprehensive examples

# Specific component help
cat src/README.md                       # Theme system overview
cat src/themeBuilder.md                 # Theme creation utilities
cat src/colors.md                       # Color palette system
cat src/defaultThemes.md                # Default themes

# Discovery
ls src/*.md                             # List all component docs
```

## Theme-Specific Guidance

### For "How do I set up theming?" questions:
1. Start with `CLAUDE.md` quick setup section
2. Show default theme registration

### For "How do I customize colors?" questions:
1. Read `src/colors.md` for palette understanding
2. Read `src/themeBuilder.md` for `generateColorPalette` and `extendTheme`
3. Show intent system usage

### For "What colors are available?" questions:
1. Reference `src/colors.md` for complete palette overview
2. Explain shade system (50-900)
3. Show 8 available palettes: blue, green, red, amber, gray, cyan, purple, pink

### For "How do I create dark themes?" questions:
1. Reference `src/defaultThemes.md` for dark theme patterns
2. Show color system differences between light and dark
3. Explain automatic theme switching

## Common User Questions and File References

| User Question | Primary Reference | Secondary References |
|---------------|------------------|---------------------|
| "How do I set up theming?" | `CLAUDE.md` | `README.md` |
| "What colors are available?" | `src/colors.md` | `CLAUDE.md` |
| "How do I create custom themes?" | `src/themeBuilder.md` | `src/colors.md` |
| "How do dark themes work?" | `src/defaultThemes.md` | `CLAUDE.md` |
| "How do I use themes in components?" | `CLAUDE.md` | `README.md` |
| "What's the color system structure?" | `src/README.md` | `src/colors.md` |

## Color System Quick Reference

### Hierarchy
1. **Palettes** (8 palettes × 10 shades) → Raw color definitions
2. **Intents** (semantic mappings) → primary, success, error, warning, neutral
3. **Component Colors** (UI system) → text, surface, border, interactive

### Key Concepts for LLMs
- **Shade 500** = base color in each palette
- **Shades 50-200** = light backgrounds, subtle elements
- **Shades 600-900** = text, high contrast elements
- **Intent system** = semantic meaning (primary = main brand actions)
- **Component colors** = structured system for UI elements

## Usage Patterns for LLMs

### Basic Theme Usage
```bash
# Show this pattern for component styling
const styles = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.md,
  },
}));
```

### Theme Creation
```bash
# Show this pattern for custom themes
const customTheme = extendTheme(defaultLightTheme, {
  palettes: { brand: generateColorPalette('#8b5cf6') },
  intents: { primary: 'brand' },
});
```

### Color Access
```bash
# Recommend this hierarchy:
# 1. Intent colors: theme.intents.primary.main
# 2. Component colors: theme.colors.text.primary  
# 3. Direct palette: theme.palettes.blue[500]
```

This approach ensures LLMs have clear, practical access to all theming documentation while understanding the color system hierarchy and best practices.