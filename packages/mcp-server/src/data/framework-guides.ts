export const frameworkGuides: Record<string, string> = {
  "idealyst://framework/getting-started": `# Getting Started with Idealyst

Idealyst is a modern, cross-platform framework for building React and React Native applications with a powerful component library, type-safe APIs, and monorepo tooling.

## Quick Start

### 1. Create a New Workspace

\`\`\`bash
npx @idealyst/cli init my-app
cd my-app
\`\`\`

This creates a monorepo workspace with:
- Yarn 3 workspace setup
- TypeScript configuration
- Jest testing setup
- Git repository
- Dev container configuration

### 2. Create Packages

Create a web app:
\`\`\`bash
npx @idealyst/cli create web --type web --with-trpc
\`\`\`

Create a native app:
\`\`\`bash
npx @idealyst/cli create mobile --type native --app-name "My App" --with-trpc
\`\`\`

Create an API server:
\`\`\`bash
npx @idealyst/cli create api --type api
\`\`\`

Create a database layer:
\`\`\`bash
npx @idealyst/cli create database --type database
\`\`\`

### 3. Start Development

\`\`\`bash
# Start web dev server
cd packages/web
yarn dev

# Start native dev
cd packages/mobile
yarn dev
\`\`\`

## Project Structure

\`\`\`
my-app/
├── packages/
│   ├── web/          # React web app (Vite)
│   ├── mobile/       # React Native app
│   ├── api/          # tRPC API server
│   ├── database/     # Prisma database layer
│   └── shared/       # Shared utilities
├── package.json
└── yarn.lock
\`\`\`

## Key Features

- **Cross-Platform Components**: Use the same components for web and native
- **Type-Safe APIs**: End-to-end type safety with tRPC
- **Modern Tooling**: Vite, TypeScript, Jest, Prisma
- **Monorepo Structure**: Share code across packages
- **Theme System**: Consistent styling with react-native-unistyles
- **Navigation**: Unified navigation for web and native

## Next Steps

1. Explore the component library: \`@idealyst/components\`
2. Set up your database schema in \`packages/database\`
3. Define your API routes in \`packages/api\`
4. Build your UI in \`packages/web\` or \`packages/mobile\`
`,

  "idealyst://framework/components-overview": `# Idealyst Components Overview

Idealyst provides a comprehensive library of cross-platform React components organized into categories.

## Component Categories

### Layout Components
- **View**: Flex container with spacing system
- **Screen**: Full-screen container with safe area handling
- **Divider**: Visual separator with orientation options

### Form Components
- **Button**: Interactive button with variants, intents, and icons
- **Input**: Text input with label, validation, and helper text
- **Checkbox**: Form checkbox with label support
- **Select**: Dropdown selection component
- **Switch**: Toggle switch component
- **RadioButton**: Radio button group
- **Slider**: Range slider component
- **TextArea**: Multi-line text input

### Display Components
- **Text**: Styled text with sizes and weights
- **Card**: Content container with variants
- **Badge**: Status indicator
- **Chip**: Compact element for tags and filters
- **Avatar**: User profile image
- **Icon**: MDI icon with theming
- **Skeleton**: Loading placeholder
- **Alert**: Notification message

### Navigation Components
- **Tabs**: Tab navigation
- **TabBar**: Bottom tab bar
- **Breadcrumb**: Breadcrumb navigation
- **Menu**: Dropdown menu
- **List**: Vertical list with sections

### Overlay Components
- **Dialog**: Modal dialog
- **Popover**: Contextual overlay
- **Tooltip**: Hover tooltip

### Data Components
- **Table**: Data table with sorting and filtering
- **DataGrid**: Advanced data grid
- **DatePicker**: Date selection component
- **Progress**: Progress indicator

## Common Props

Most components share common props:
- \`style\`: Custom styles
- \`testID\`: Test identifier
- \`disabled\`: Disable interaction

### Intent Colors
Components support intent-based colors:
- \`primary\`: Main brand actions
- \`neutral\`: Secondary actions
- \`success\`: Positive actions
- \`error\`: Destructive actions
- \`warning\`: Caution actions

### Variants
Many components offer visual variants:
- Buttons: \`contained\`, \`outlined\`, \`text\`
- Cards: \`default\`, \`outlined\`, \`elevated\`, \`filled\`
- Chips: \`filled\`, \`outlined\`, \`soft\`

### Sizes
Most components support size variants:
- \`small\`, \`medium\`, \`large\`

## Icon Support

Components with icon support accept:
- **String icon names**: Material Design Icons
- **React elements**: Custom icon components

Example:
\`\`\`tsx
<Button icon="check">Save</Button>
<Button icon={<CustomIcon />}>Save</Button>
\`\`\`

## Theming

All components use the Unistyles theming system:
- Light and dark mode support
- Customizable color palettes
- Responsive breakpoints
- Platform-specific styles

## Import Pattern

\`\`\`tsx
import { Button, Card, Text, View } from '@idealyst/components';
\`\`\`
`,

  "idealyst://framework/theming": `# Theming Guide

Idealyst uses react-native-unistyles for cross-platform theming with full TypeScript support.

## Theme Structure

Themes are defined with:
- **Colors**: Text, surface, border, intent colors
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corner sizes
- **Breakpoints**: Responsive design breakpoints

## Default Theme

\`\`\`typescript
{
  colors: {
    text: {
      primary: '#000000',
      secondary: '#666666',
      inverse: '#FFFFFF',
      disabled: '#999999',
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#EEEEEE',
      inverse: '#000000',
    },
    border: {
      primary: '#E0E0E0',
      secondary: '#CCCCCC',
    },
  },
  intents: {
    primary: {
      main: '#3B82F6',
      container: '#DBEAFE',
      onContainer: '#1E40AF',
    },
    success: {
      main: '#10B981',
      container: '#D1FAE5',
      onContainer: '#065F46',
    },
    error: {
      main: '#EF4444',
      container: '#FEE2E2',
      onContainer: '#991B1B',
    },
    warning: {
      main: '#F59E0B',
      container: '#FEF3C7',
      onContainer: '#92400E',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    fontFamily: {
      sans: 'System',
      mono: 'Monospace',
    },
    fontSize: {
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 20,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
}
\`\`\`

## Custom Themes

Create custom themes in your app:

\`\`\`typescript
// theme.ts
export const customTheme = {
  colors: {
    // Override colors
    text: {
      primary: '#1A1A1A',
      // ...
    },
  },
  intents: {
    primary: {
      main: '#6366F1', // Custom brand color
      // ...
    },
  },
  // ... rest of theme
};
\`\`\`

## Using Themes

\`\`\`typescript
import { UnistylesRegistry } from 'react-native-unistyles';
import { lightTheme, darkTheme } from './themes';

UnistylesRegistry
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'light',
  });
\`\`\`

## Dark Mode

Toggle between themes:

\`\`\`typescript
import { useStyles } from 'react-native-unistyles';

function ThemeToggle() {
  const { theme } = useStyles();

  const toggleTheme = () => {
    theme.setTheme(theme.name === 'light' ? 'dark' : 'light');
  };

  return <Button onPress={toggleTheme}>Toggle Theme</Button>;
}
\`\`\`

## Responsive Design

Use breakpoints for responsive layouts:

\`\`\`typescript
const styles = StyleSheet.create(theme => ({
  container: {
    padding: theme.spacing.md,

    variants: {
      breakpoint: {
        sm: { maxWidth: 640 },
        md: { maxWidth: 768 },
        lg: { maxWidth: 1024 },
      },
    },
  },
}));
\`\`\`

## Platform-Specific Styles

\`\`\`typescript
const styles = StyleSheet.create(theme => ({
  button: {
    padding: theme.spacing.md,

    _web: {
      cursor: 'pointer',
      ':hover': {
        backgroundColor: theme.colors.surface.secondary,
      },
    },

    _native: {
      elevation: 2,
    },
  },
}));
\`\`\`
`,

  "idealyst://framework/cli": `# Idealyst CLI Reference

The Idealyst CLI provides commands for creating and managing Idealyst projects.

## Installation

\`\`\`bash
npm install -g @idealyst/cli
# or
npx @idealyst/cli <command>
\`\`\`

## Commands

### init

Initialize a new Idealyst workspace.

\`\`\`bash
idealyst init <workspace-name> [options]
\`\`\`

**Arguments:**
- \`workspace-name\`: Name for the workspace directory

**Options:**
- \`--git\`: Initialize git repository (default: true)
- \`--no-git\`: Skip git initialization
- \`--install\`: Install dependencies (default: true)
- \`--no-install\`: Skip dependency installation

**Examples:**
\`\`\`bash
idealyst init my-app
idealyst init my-company-app --no-git
\`\`\`

**Creates:**
- Monorepo workspace structure
- package.json with workspaces
- TypeScript configuration
- Jest setup
- Git repository (optional)
- Dev container configuration

### create

Create a new package in the workspace.

\`\`\`bash
idealyst create <name> --type <type> [options]
\`\`\`

**Arguments:**
- \`name\`: Package name

**Options:**
- \`--type <type>\`: Package type (required)
  - \`web\`: React web app with Vite
  - \`native\`: React Native app
  - \`api\`: tRPC API server
  - \`database\`: Prisma database layer
  - \`shared\`: Shared utilities library
- \`--app-name <name>\`: Display name for native apps (required for native)
- \`--with-trpc\`: Include tRPC setup (web/native)
- \`--no-trpc\`: Exclude tRPC setup (web/native)

**Examples:**
\`\`\`bash
# Web app
idealyst create web --type web --with-trpc

# Native app
idealyst create mobile --type native --app-name "My App" --with-trpc

# API server
idealyst create api --type api

# Database
idealyst create database --type database

# Shared library
idealyst create shared --type shared
\`\`\`

## Package Types

### Web Package
- Vite + React 19
- TypeScript
- React Router
- Optional tRPC client
- @idealyst/components
- @idealyst/theme

### Native Package
- React Native 0.80
- TypeScript
- React Navigation
- Optional tRPC client
- @idealyst/components
- @idealyst/navigation

### API Package
- tRPC server
- Express
- TypeScript
- CORS enabled
- WebSocket support

### Database Package
- Prisma ORM
- TypeScript
- Schema definition
- Migration support
- Multiple database support

### Shared Package
- TypeScript library
- Utility functions
- Type definitions
- Shared between packages

## Workspace Commands

Run these from workspace root:

\`\`\`bash
# Install all dependencies
yarn install

# Run tests
yarn test
yarn test:watch
yarn test:coverage

# Build all packages
yarn workspaces foreach run build

# Version management
yarn version:patch    # Bump patch version
yarn version:minor    # Bump minor version
yarn version:major    # Bump major version

# Publish
yarn publish:all
\`\`\`

## Package Commands

Run these from package directory:

\`\`\`bash
# Development
yarn dev

# Build
yarn build

# Test
yarn test

# Type check
yarn type-check

# Lint
yarn lint
\`\`\`

## Project Structure

\`\`\`
workspace/
├── packages/
│   ├── web/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── mobile/
│   │   ├── src/
│   │   ├── android/
│   │   ├── ios/
│   │   └── package.json
│   ├── api/
│   │   ├── src/
│   │   ├── trpc/
│   │   └── package.json
│   ├── database/
│   │   ├── prisma/
│   │   └── package.json
│   └── shared/
│       ├── src/
│       └── package.json
├── package.json
├── tsconfig.json
└── jest.config.js
\`\`\`

## Best Practices

1. **Use workspaces**: Keep related packages in the same workspace
2. **Share code**: Use the shared package for utilities
3. **Type safety**: Enable strict TypeScript
4. **Testing**: Write tests for critical functionality
5. **Versioning**: Keep package versions synchronized
6. **Documentation**: Add README files to packages
7. **Git**: Use conventional commits
8. **Dependencies**: Share dependencies across packages when possible
`,
};
