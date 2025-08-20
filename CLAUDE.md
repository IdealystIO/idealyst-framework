# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Testing
```bash
yarn test                    # Run all tests across workspace
yarn test:watch             # Run tests in watch mode
yarn test:coverage          # Run tests with coverage
jest                        # Run Jest directly
```

### Building & Development
```bash
# CLI package
cd packages/cli
yarn build                  # Build CLI for distribution
yarn build:validate        # Build and validate
yarn dev                   # Watch mode for development

# Components package
cd packages/components
yarn prepublishOnly         # Validate before publishing

# Individual package testing
cd packages/cli
yarn test:integration      # Run integration tests
```

### Publishing & Versioning
```bash
yarn version:patch          # Bump patch version for all packages
yarn version:minor          # Bump minor version for all packages  
yarn version:major          # Bump major version for all packages
yarn version:sync           # Sync versions across packages
yarn publish:all           # Publish all packages to npm
```

## Architecture Overview

### Monorepo Structure
This is a Yarn workspace containing multiple related packages:

- **`packages/cli/`** - Command-line tool for generating projects (`@idealyst/cli`)
- **`packages/components/`** - Cross-platform React/React Native UI components (`@idealyst/components`)
- **`packages/navigation/`** - Navigation system for web and native (`@idealyst/navigation`)
- **`packages/theme/`** - Shared theming system using Unistyles (`@idealyst/theme`)
- **`examples/`** - Example applications demonstrating framework usage

### CLI Generator System
The CLI uses a template-based generation system located in `packages/cli/templates/`:

- **`workspace/`** - Monorepo workspace template
- **`native/`** - React Native app template
- **`web/`** - React web app template with Vite
- **`api/`** - tRPC API server template  
- **`database/`** - Prisma database layer template
- **`shared/`** - Shared library template

Key CLI files:
- `packages/cli/src/generators/` - Generation logic for each project type
- `packages/cli/src/types.ts` - TypeScript definitions
- `packages/cli/docs/` - LLM reference documentation

### Cross-Platform Component Architecture
Components use platform-specific files:
- `Component.web.tsx` - Web-specific implementation
- `Component.native.tsx` - React Native implementation  
- `Component.styles.tsx` - Shared Unistyles styling
- `index.ts` / `index.web.ts` / `index.native.ts` - Platform exports

### Theme System
Uses `react-native-unistyles` for cross-platform styling:
- Responsive breakpointsy
- Theme variants (light/dark)
- Color resolution system
- Platform-specific adaptations

## Development Workflow

### Making Changes to CLI
1. Edit templates in `packages/cli/templates/`
2. Update generators in `packages/cli/src/generators/`
3. Run `yarn build` to compile
4. Test with `yarn test:integration`

### Adding New Components
1. Create component directory in `packages/components/src/`
2. Implement `.web.tsx` and `.native.tsx` variants
3. Add `.styles.tsx` for Unistyles
4. Export from `index.ts` files
5. Add examples in `src/examples/`

### Testing Strategy
- Unit tests for individual components and utilities
- Integration tests for CLI generators
- Template tests verify generated projects compile
- 30-second timeout for CLI operations

## CLI Usage for LLMs

When using the CLI programmatically, always provide all required arguments to avoid interactive prompts:

```bash
# Safe commands (no prompts)
idealyst init <workspace-name>
idealyst create <name> --type database
idealyst create <name> --type api  
idealyst create <name> --type shared
idealyst create <name> --type native --app-name "App Name" --with-trpc
idealyst create <name> --type web --with-trpc
```

**Critical**: Native projects require `--app-name` and web/native projects require `--with-trpc` or `--no-trpc` flags.

## Key Dependencies

- **React 19.1.0** - Latest React version
- **React Native 0.80.1** - Mobile development
- **TypeScript 5.x** - Type safety
- **Jest** - Testing framework
- **Yarn 3.6.4** - Package management
- **Unistyles 3.x** - Cross-platform styling
- **tRPC** - Type-safe APIs (in templates)
- **Prisma** - Database ORM (in templates)

## Package Relationships

All packages maintain version synchronization. The CLI generates projects that consume the theme, components, and navigation packages as peer dependencies, enabling shared design systems across generated applications.