export const frameworkGuides: Record<string, string> = {
  "idealyst://framework/getting-started": `# Getting Started with Idealyst

Idealyst is a modern, cross-platform framework for building React and React Native applications with a powerful component library, type-safe APIs, and monorepo tooling.

## Quick Start

### 1. Create a New Workspace

\`\`\`bash
npx @idealyst/cli init my-app
cd my-app
\`\`\`

This single command creates a **complete monorepo workspace** with all 5 packages:
- \`packages/web/\` - React web app (Vite)
- \`packages/native/\` - React Native mobile app
- \`packages/api/\` - tRPC API server with GraphQL
- \`packages/database/\` - Prisma database layer
- \`packages/shared/\` - Shared utilities and tRPC client

Plus:
- Yarn 3 workspace setup
- TypeScript configuration
- Jest testing setup
- Git repository
- Dev container configuration

### 2. Start Development

\`\`\`bash
# Start web dev server
cd packages/web
yarn dev

# Start native dev (in another terminal)
cd packages/native
yarn start

# Start API server (in another terminal)
cd packages/api
yarn dev
\`\`\`

### 3. Configure Babel (Required for Styling)

Add the Idealyst plugin to your babel.config.js:

\`\`\`javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@idealyst/theme/plugin', {
      themePath: './src/theme/styles.ts', // Path to your theme file
    }],
  ],
};
\`\`\`

## Project Structure

\`\`\`
my-app/
├── packages/
│   ├── web/          # React web app (Vite)
│   ├── native/       # React Native app
│   ├── api/          # tRPC + GraphQL API server
│   ├── database/     # Prisma database layer
│   └── shared/       # Shared utilities & tRPC client
├── package.json
├── tsconfig.json
└── yarn.lock
\`\`\`

## Key Features

- **Cross-Platform Components**: Use the same components for web and native
- **Type-Safe APIs**: End-to-end type safety with tRPC
- **Modern Tooling**: Vite, TypeScript, Jest, Prisma
- **Monorepo Structure**: Share code across packages
- **Theme System**: Consistent styling with react-native-unistyles
- **Style Extensions**: Customize component styles at build time
- **Navigation**: Unified navigation for web and native

## Next Steps

1. Explore the component library: \`@idealyst/components\`
2. Learn the style system: \`idealyst://framework/style-system\`
3. Set up your database schema in \`packages/database\`
4. Define your API routes in \`packages/api\`
5. Build your UI using Idealyst components
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
- \`sm\`, \`md\`, \`lg\`
- Sometimes 'xs' and 'xl', but varies by component

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

Idealyst uses react-native-unistyles for cross-platform theming with full TypeScript support. Themes are created using a fluent builder pattern.

## Theme Builder API

Create themes using the builder pattern:

\`\`\`typescript
import { createTheme } from '@idealyst/theme';

export const myTheme = createTheme()
  // Add semantic intents
  .addIntent('primary', {
    primary: '#3b82f6',    // Main color
    contrast: '#ffffff',   // Text on primary background
    light: '#bfdbfe',      // Lighter variant
    dark: '#1e40af',       // Darker variant
  })
  .addIntent('success', {
    primary: '#22c55e',
    contrast: '#ffffff',
    light: '#a7f3d0',
    dark: '#165e29',
  })
  .addIntent('error', {
    primary: '#ef4444',
    contrast: '#ffffff',
    light: '#fca5a1',
    dark: '#9b2222',
  })

  // Add border radii
  .addRadius('none', 0)
  .addRadius('sm', 4)
  .addRadius('md', 8)
  .addRadius('lg', 12)

  // Add shadows (cross-platform)
  .addShadow('sm', {
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', // web-only
  })

  // Set colors
  .setColors({
    pallet: { /* color palette */ },
    surface: {
      screen: '#ffffff',
      primary: '#ffffff',
      secondary: '#f5f5f5',
      inverse: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
      inverse: '#ffffff',
    },
    border: {
      primary: '#e0e0e0',
      disabled: '#f0f0f0',
    },
  })

  // Set component sizes (xs, sm, md, lg, xl)
  .setSizes({
    button: {
      xs: { paddingVertical: 4, paddingHorizontal: 8, minHeight: 24, fontSize: 12 },
      sm: { paddingVertical: 6, paddingHorizontal: 12, minHeight: 32, fontSize: 14 },
      md: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 40, fontSize: 16 },
      lg: { paddingVertical: 10, paddingHorizontal: 20, minHeight: 48, fontSize: 18 },
      xl: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 56, fontSize: 20 },
    },
    // ... other components (chip, badge, icon, input, etc.)
  })

  // Set interaction styles
  .setInteraction({
    focusedBackground: 'rgba(59, 130, 246, 0.08)',
    focusBorder: 'rgba(59, 130, 246, 0.3)',
    opacity: { hover: 0.9, active: 0.75, disabled: 0.5 },
  })

  // Set responsive breakpoints
  .setBreakpoints({
    xs: 0,      // Portrait phones
    sm: 576,    // Landscape phones
    md: 768,    // Tablets
    lg: 992,    // Desktops
    xl: 1200,   // Large desktops
  })

  .build();
\`\`\`

## Intent Structure

Each intent defines four color values:

| Property   | Purpose                           |
|------------|-----------------------------------|
| \`primary\`  | Main color used for backgrounds   |
| \`contrast\` | Text color on primary background  |
| \`light\`    | Lighter tint for subtle states    |
| \`dark\`     | Darker shade for pressed states   |

## Extending an Existing Theme

Use \`fromTheme()\` to extend a base theme:

\`\`\`typescript
import { fromTheme, lightTheme } from '@idealyst/theme';

export const brandTheme = fromTheme(lightTheme)
  .addIntent('brand', {
    primary: '#6366f1',
    contrast: '#ffffff',
    light: '#818cf8',
    dark: '#4f46e5',
  })
  .build();
\`\`\`

## Registering Your Theme

For full TypeScript inference:

\`\`\`typescript
// src/theme/styles.ts
export const myTheme = createTheme()
  // ... builder chain
  .build();

// Register the theme type
declare module '@idealyst/theme' {
  interface RegisteredTheme {
    theme: typeof myTheme;
  }
}
\`\`\`

## Using Themes with Unistyles

\`\`\`typescript
import { UnistylesRegistry } from 'react-native-unistyles';
import { lightTheme, darkTheme } from '@idealyst/theme';

UnistylesRegistry
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'light',
  });
\`\`\`

## Platform-Specific Styles

\`\`\`typescript
const styles = StyleSheet.create((theme) => ({
  button: {
    padding: 16,

    _web: {
      cursor: 'pointer',
      transition: 'all 0.1s ease',
      _hover: { opacity: 0.9 },
      _active: { opacity: 0.75 },
    },

    _native: {
      elevation: 2,
    },
  },
}));
\`\`\`

## See Also

- \`idealyst://framework/style-system\` - Style definition APIs (defineStyle, extendStyle)
- \`idealyst://framework/babel-plugin\` - Babel plugin configuration
- \`idealyst://framework/breakpoints\` - Responsive breakpoint system
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

  "idealyst://framework/spacing-system": `# Spacing System

Idealyst components use a variant-based spacing system for consistent layouts. Instead of specifying numeric values, you use Size variants (xs, sm, md, lg, xl) that map to theme-defined values.

## Spacing Prop Interfaces

Different component types receive different spacing props based on their use case:

### ContainerStyleProps (Layout Containers)
**Components**: View, Card, Screen, List, Accordion, Table, TabBar

\`\`\`typescript
interface ContainerStyleProps {
  gap?: Size;              // Space between children
  padding?: Size;          // Padding on all sides
  paddingVertical?: Size;  // Top and bottom padding
  paddingHorizontal?: Size; // Left and right padding
  margin?: Size;           // Margin on all sides
  marginVertical?: Size;   // Top and bottom margin
  marginHorizontal?: Size; // Left and right margin
}
\`\`\`

### TextSpacingStyleProps (Text Components)
**Components**: Text

\`\`\`typescript
interface TextSpacingStyleProps {
  gap?: Size;              // Space between nested elements
  padding?: Size;          // Padding on all sides
  paddingVertical?: Size;  // Top and bottom padding
  paddingHorizontal?: Size; // Left and right padding
}
\`\`\`

### PressableSpacingStyleProps (Interactive Elements)
**Components**: Pressable

\`\`\`typescript
interface PressableSpacingStyleProps {
  padding?: Size;          // Padding on all sides
  paddingVertical?: Size;  // Top and bottom padding
  paddingHorizontal?: Size; // Left and right padding
}
\`\`\`

### FormInputStyleProps (Form Inputs)
**Components**: Input, Select, TextArea, Checkbox, RadioButton, Switch, Slider

\`\`\`typescript
interface FormInputStyleProps {
  margin?: Size;           // Margin on all sides
  marginVertical?: Size;   // Top and bottom margin
  marginHorizontal?: Size; // Left and right margin
}
\`\`\`

## Size Values

Size variants map to theme values:

| Size | Padding | Spacing (Gap) |
|------|---------|---------------|
| xs   | 4px     | 4px           |
| sm   | 8px     | 8px           |
| md   | 16px    | 16px          |
| lg   | 24px    | 24px          |
| xl   | 32px    | 32px          |

## Usage Examples

### Container Spacing

\`\`\`tsx
import { View, Card, Text } from '@idealyst/components';

// Gap between children
<View gap="md">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>

// Padding inside container
<Card padding="lg" gap="sm">
  <Text weight="bold">Card Title</Text>
  <Text>Card content</Text>
</Card>

// Directional padding
<View paddingVertical="md" paddingHorizontal="lg">
  <Text>Content with different vertical/horizontal padding</Text>
</View>

// Margin for spacing between containers
<Card margin="md" padding="lg">
  <Text>Card with margin</Text>
</Card>
\`\`\`

### Form Input Spacing

\`\`\`tsx
import { Input, Checkbox, View } from '@idealyst/components';

// Use margin to space form fields
<View>
  <Input placeholder="Email" marginVertical="sm" />
  <Input placeholder="Password" marginVertical="sm" />
  <Checkbox label="Remember me" marginVertical="md" />
</View>
\`\`\`

### Combining with Style Prop

The spacing props work alongside the style prop:

\`\`\`tsx
<View
  gap="md"
  padding="lg"
  style={{ backgroundColor: '#f5f5f5', borderRadius: 8 }}
>
  <Text>Content</Text>
</View>
\`\`\`

## Custom Components

You can use the exported builder functions to add spacing variants to custom components:

\`\`\`typescript
import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildMarginVariants,
} from '@idealyst/components';

export const customStyles = StyleSheet.create((theme: Theme) => ({
  container: {
    variants: {
      gap: buildGapVariants(theme),
      padding: buildPaddingVariants(theme),
      margin: buildMarginVariants(theme),
    },
  },
}));
\`\`\`

## Best Practices

1. **Use variants for consistency**: Prefer Size variants over numeric values for consistent spacing across your app
2. **Gap over margins for children**: Use \`gap\` to space children instead of margins on individual items
3. **Directional props for precision**: Use paddingVertical/paddingHorizontal when you need different spacing
4. **Form spacing with margin**: Use marginVertical on form inputs to create consistent form layouts
5. **Combine with theme values**: The variant values come from the theme, ensuring consistency
`,

  "idealyst://framework/api-overview": `# API Architecture Overview

Idealyst provides a dual API architecture with both tRPC and GraphQL, giving you flexibility for different use cases.

## When to Use Each

### tRPC (Type-Safe RPC)
- **Best for**: Internal clients, same-team consumption
- **Benefits**: End-to-end type safety, no code generation, fast development
- **Use when**: Your frontend and backend are TypeScript

### GraphQL
- **Best for**: Public APIs, third-party integrations, mobile apps
- **Benefits**: Flexible queries, schema documentation, wide ecosystem
- **Use when**: You need schema introspection or have non-TypeScript clients

## Architecture

Both APIs run on the same Express server:

\`\`\`
Server (port 3000)
├── /trpc/*    → tRPC handlers
├── /graphql   → GraphQL Yoga endpoint
└── Shared context (database, auth)
\`\`\`

## File Structure

\`\`\`
packages/api/src/
├── routers/           # tRPC routers
│   ├── index.ts       # Root router
│   └── test.ts        # Example router
├── graphql/           # GraphQL setup
│   ├── builder.ts     # Pothos schema builder
│   ├── index.ts       # Yoga server setup
│   └── types/         # GraphQL type definitions
│       └── test.ts    # Example types
├── context.ts         # Shared context
├── server.ts          # Express server
└── index.ts           # Entry point
\`\`\`

## Shared Context

Both APIs share the same context:

\`\`\`typescript
// context.ts
export interface Context {
  db: PrismaClient;
  // Add auth, session, etc.
}

export async function createContext(): Promise<Context> {
  return {
    db: prisma,
  };
}
\`\`\`

## Client Setup

The shared package provides clients for both:

\`\`\`typescript
// In your App component
import { createTRPCClient, createGraphQLClient } from '@your-app/shared';

// tRPC - automatic type inference
const trpcClient = createTRPCClient({ apiUrl: 'http://localhost:3000/trpc' });

// GraphQL - manual queries with graphql-request
createGraphQLClient({ apiUrl: 'http://localhost:3000/graphql' });
\`\`\`

## Migration Path

Start with tRPC for rapid development, add GraphQL when you need:
- Public API documentation
- Third-party integrations
- Schema-first development
- Non-TypeScript clients
`,

  "idealyst://framework/graphql-setup": `# GraphQL Setup Guide

Idealyst uses Pothos (code-first schema) with GraphQL Yoga server, integrated with Prisma.

## Server Setup

### 1. Schema Builder (builder.ts)

\`\`\`typescript
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from './generated';
import { prisma } from '@your-app/database';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: { db: typeof prisma };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

// Initialize Query and Mutation types
builder.queryType({});
builder.mutationType({});
\`\`\`

### 2. Generate Prisma Types

\`\`\`bash
# In packages/api
npx prisma generate --generator pothos
\`\`\`

Add to your prisma schema:

\`\`\`prisma
generator pothos {
  provider = "prisma-pothos-types"
  output   = "../src/graphql/generated.ts"
}
\`\`\`

### 3. Define Types (types/example.ts)

\`\`\`typescript
import { builder } from '../builder';

// Object type from Prisma model
builder.prismaObject('Test', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    message: t.exposeString('message'),
    status: t.exposeString('status'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});

// Input type for mutations
const CreateTestInput = builder.inputType('CreateTestInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    message: t.string({ required: true }),
    status: t.string({ required: true }),
  }),
});

// Query
builder.queryField('tests', (t) =>
  t.prismaField({
    type: ['Test'],
    args: {
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) =>
      ctx.db.test.findMany({
        ...query,
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        orderBy: { createdAt: 'desc' },
      }),
  })
);

// Mutation
builder.mutationField('createTest', (t) =>
  t.prismaField({
    type: 'Test',
    args: {
      input: t.arg({ type: CreateTestInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) =>
      ctx.db.test.create({
        ...query,
        data: args.input,
      }),
  })
);
\`\`\`

### 4. Yoga Server (index.ts)

\`\`\`typescript
import { createYoga } from 'graphql-yoga';
import { builder } from './builder';
import './types/test'; // Import all type definitions

export const yoga = createYoga({
  schema: builder.toSchema(),
  graphqlEndpoint: '/graphql',
});
\`\`\`

### 5. Mount in Express (server.ts)

\`\`\`typescript
import express from 'express';
import { yoga } from './graphql';

const app = express();

// GraphQL endpoint
app.use('/graphql', yoga);

// tRPC endpoint
app.use('/trpc', trpcMiddleware);
\`\`\`

## Client Setup

### 1. GraphQL Client (shared/src/graphql/client.ts)

\`\`\`typescript
import { GraphQLClient } from 'graphql-request';

let client: GraphQLClient | null = null;

export function createGraphQLClient(config: { apiUrl: string }) {
  client = new GraphQLClient(config.apiUrl);
  return client;
}

export function getGraphQLClient(): GraphQLClient {
  if (!client) throw new Error('GraphQL client not initialized');
  return client;
}

export { gql } from 'graphql-request';
\`\`\`

### 2. Using with React Query

\`\`\`typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGraphQLClient, gql } from '../graphql/client';

const TESTS_QUERY = gql\`
  query GetTests($take: Int) {
    tests(take: $take) {
      id
      name
      message
    }
  }
\`;

const CREATE_TEST = gql\`
  mutation CreateTest($input: CreateTestInput!) {
    createTest(input: $input) {
      id
      name
    }
  }
\`;

// Query hook
const { data, isLoading } = useQuery({
  queryKey: ['graphql', 'tests'],
  queryFn: () => getGraphQLClient().request(TESTS_QUERY, { take: 10 }),
});

// Mutation hook
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (input) => getGraphQLClient().request(CREATE_TEST, { input }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['graphql', 'tests'] });
  },
});
\`\`\`

## GraphQL Playground

Access the GraphQL playground at:
\`\`\`
http://localhost:3000/graphql
\`\`\`

Features:
- Schema explorer
- Query autocompletion
- Documentation browser
- Query history

## Best Practices

1. **Use Input Types**: Always use input types for mutations
2. **Pagination**: Implement cursor-based pagination for lists
3. **Error Handling**: Use Pothos error types
4. **Authorization**: Add auth checks in resolvers
5. **N+1 Prevention**: Use Prisma's query optimization
`,

  "idealyst://framework/style-system": `# Style Definition System

Idealyst provides a powerful style definition system with build-time transformations via Babel plugin.

## Overview

The style system provides:
- **defineStyle()**: Define base styles for components
- **extendStyle()**: Merge additional styles with base styles
- **overrideStyle()**: Completely replace component styles
- **$iterator pattern**: Expand styles for all theme keys

## defineStyle()

Define base styles for a component:

\`\`\`typescript
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
  button: {
    borderRadius: theme.radii.md,
    backgroundColor: theme.intents.primary.primary,

    variants: {
      size: {
        // $iterator expands to all size keys (xs, sm, md, lg, xl)
        paddingVertical: theme.sizes.$button.paddingVertical,
        paddingHorizontal: theme.sizes.$button.paddingHorizontal,
      },
      disabled: {
        true: { opacity: 0.5 },
        false: { opacity: 1 },
      },
    },
  },
  text: {
    color: theme.intents.primary.contrast,
    variants: {
      size: {
        fontSize: theme.sizes.$button.fontSize,
      },
    },
  },
}));
\`\`\`

## Dynamic Style Functions

For styles depending on runtime props:

\`\`\`typescript
export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
  button: ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => ({
    backgroundColor: type === 'contained'
      ? theme.intents[intent].primary
      : 'transparent',
    borderColor: type === 'outlined'
      ? theme.intents[intent].primary
      : 'transparent',
  }),
}));
\`\`\`

## Using Styles in Components

\`\`\`typescript
import { buttonStyles } from './Button.styles';

const Button = ({ size = 'md', disabled = false, intent, type }) => {
  // Apply variants
  buttonStyles.useVariants({ size, disabled });

  // Static styles - no function call
  const staticStyle = buttonStyles.button;

  // Dynamic styles - function call with props
  const dynamicStyle = (buttonStyles.button as any)({ intent, type });

  return (
    <TouchableOpacity style={dynamicStyle}>
      <Text style={buttonStyles.text}>Click me</Text>
    </TouchableOpacity>
  );
};
\`\`\`

## extendStyle()

Merge additional styles with base component styles:

\`\`\`typescript
// style-extensions.ts
import { extendStyle } from '@idealyst/theme';

extendStyle('Button', (theme) => ({
  button: {
    borderRadius: 9999, // Make all buttons pill-shaped
  },
  text: {
    fontFamily: 'CustomFont',
  },
}));
\`\`\`

## overrideStyle()

Completely replace component styles:

\`\`\`typescript
import { overrideStyle } from '@idealyst/theme';

overrideStyle('Button', (theme) => ({
  button: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 2,
    borderColor: theme.intents.primary.primary,
  },
  text: {
    color: theme.intents.primary.primary,
  },
}));
\`\`\`

## Import Order Matters

Extensions must be imported **before** components:

\`\`\`typescript
// App.tsx
import './style-extensions';           // FIRST - registers extensions
import { Button } from '@idealyst/components';  // SECOND - uses extensions
\`\`\`

## When to Use Each

| API | Use When |
|-----|----------|
| \`defineStyle()\` | Creating component library styles |
| \`extendStyle()\` | Adding/modifying specific properties |
| \`overrideStyle()\` | Completely custom styling |

## See Also

- \`idealyst://framework/theming\` - Theme builder API
- \`idealyst://framework/babel-plugin\` - Plugin configuration
- \`idealyst://framework/iterator-pattern\` - $iterator expansion
`,

  "idealyst://framework/babel-plugin": `# Idealyst Babel Plugin

The Idealyst Babel plugin transforms style definitions at build time.

## Installation

The plugin is included with \`@idealyst/theme\`.

## Configuration

\`\`\`javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@idealyst/theme/plugin', {
      // REQUIRED: Path to your theme file
      themePath: './src/theme/styles.ts',

      // Optional: Enable debug logging
      debug: false,
      verbose: false,

      // Optional: Paths to auto-process
      autoProcessPaths: [
        '@idealyst/components',
        '@idealyst/datepicker',
        'src/',
      ],
    }],
  ],
};
\`\`\`

## What the Plugin Does

### 1. Transforms defineStyle() to StyleSheet.create()

**Input:**
\`\`\`typescript
defineStyle('Button', (theme) => ({
  button: { backgroundColor: theme.intents.primary.primary }
}));
\`\`\`

**Output:**
\`\`\`typescript
StyleSheet.create((theme) => ({
  button: { backgroundColor: theme.intents.primary.primary }
}));
\`\`\`

### 2. Expands $iterator Patterns

**Input:**
\`\`\`typescript
defineStyle('Button', (theme) => ({
  button: {
    variants: {
      size: {
        paddingVertical: theme.sizes.$button.paddingVertical,
      },
    },
  },
}));
\`\`\`

**Output:**
\`\`\`typescript
StyleSheet.create((theme) => ({
  button: {
    variants: {
      size: {
        xs: { paddingVertical: theme.sizes.button.xs.paddingVertical },
        sm: { paddingVertical: theme.sizes.button.sm.paddingVertical },
        md: { paddingVertical: theme.sizes.button.md.paddingVertical },
        lg: { paddingVertical: theme.sizes.button.lg.paddingVertical },
        xl: { paddingVertical: theme.sizes.button.xl.paddingVertical },
      },
    },
  },
}));
\`\`\`

### 3. Merges Extensions at Build Time

\`\`\`typescript
// Extension (processed first)
extendStyle('Button', (theme) => ({
  button: { borderRadius: 9999 },
}));

// Base (merges with extension)
defineStyle('Button', (theme) => ({
  button: { padding: 16 },
}));

// Result: { padding: 16, borderRadius: 9999 }
\`\`\`

### 4. Removes extendStyle/overrideStyle Calls

After capturing extension definitions, the plugin removes the calls from the output since all merging happens at build time.

## Theme Analysis

The plugin statically analyzes your theme file to extract:
- Intent names (primary, success, error, etc.)
- Size keys (xs, sm, md, lg, xl)
- Radius names (none, sm, md, lg)
- Shadow names (none, sm, md, lg, xl)

This enables $iterator expansion without runtime overhead.

## Troubleshooting

### Styles Not Applying

1. Verify \`themePath\` points to your theme file
2. Clear bundler cache: \`yarn start --reset-cache\`
3. Check \`void StyleSheet;\` marker exists in style files

### Theme Changes Not Detected

1. Restart Metro bundler (theme is analyzed once)
2. Verify theme exports correctly

### Debug Mode

Enable verbose logging:

\`\`\`javascript
['@idealyst/theme/plugin', {
  themePath: './src/theme/styles.ts',
  verbose: true,
}],
\`\`\`
`,

  "idealyst://framework/breakpoints": `# Responsive Breakpoints

Idealyst provides a responsive breakpoint system built on Unistyles v3, enabling width-based responsive styling across web and native platforms.

## Default Breakpoints

The default themes include 5 breakpoints:

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| \`xs\` | 0px | Portrait phones |
| \`sm\` | 576px | Landscape phones |
| \`md\` | 768px | Tablets |
| \`lg\` | 992px | Desktops |
| \`xl\` | 1200px | Large desktops |

## Defining Breakpoints

### Using setBreakpoints()

Set all breakpoints at once:

\`\`\`typescript
import { createTheme } from '@idealyst/theme';

const theme = createTheme()
  // ... other theme config
  .setBreakpoints({
    xs: 0,      // Must have one breakpoint at 0
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  })
  .build();
\`\`\`

### Using addBreakpoint()

Add breakpoints individually:

\`\`\`typescript
import { fromTheme, lightTheme } from '@idealyst/theme';

const theme = fromTheme(lightTheme)
  .addBreakpoint('xxl', 1400)  // Add extra large breakpoint
  .addBreakpoint('xxxl', 1800) // Add even larger
  .build();
\`\`\`

## Using Breakpoints in Styles

### In StyleSheet.create()

Use object notation for responsive values:

\`\`\`typescript
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    // Responsive padding
    padding: {
      xs: 8,
      md: 16,
      xl: 24,
    },

    // Responsive flex direction
    flexDirection: {
      xs: 'column',
      md: 'row',
    },

    // Responsive gap
    gap: {
      xs: 8,
      sm: 12,
      lg: 16,
    },
  },

  text: {
    fontSize: {
      xs: 14,
      md: 16,
      lg: 18,
    },
  },
}));
\`\`\`

### Cascading Behavior

Values cascade up - if a breakpoint isn't defined, it uses the nearest smaller one:

\`\`\`typescript
padding: {
  xs: 8,   // Used for xs, sm (no sm defined)
  md: 16,  // Used for md, lg (no lg defined)
  xl: 24,  // Used for xl
}
\`\`\`

## Runtime Utilities

### getCurrentBreakpoint()

Get the current active breakpoint:

\`\`\`typescript
import { getCurrentBreakpoint } from '@idealyst/theme';

const current = getCurrentBreakpoint();
console.log(current); // 'md'
\`\`\`

### getBreakpoints()

Get all registered breakpoints:

\`\`\`typescript
import { getBreakpoints } from '@idealyst/theme';

const breakpoints = getBreakpoints();
// { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }
\`\`\`

### isBreakpointUp() / isBreakpointDown()

Check viewport against breakpoints:

\`\`\`typescript
import { isBreakpointUp, isBreakpointDown } from '@idealyst/theme';

if (isBreakpointUp('md')) {
  // Tablet or larger
}

if (isBreakpointDown('md')) {
  // Mobile only (below tablet)
}
\`\`\`

### resolveResponsive()

Resolve a responsive value for the current breakpoint:

\`\`\`typescript
import { resolveResponsive } from '@idealyst/theme';

const padding = resolveResponsive({ xs: 8, md: 16, xl: 24 });
// Returns 8 on mobile, 16 on tablet, 24 on desktop
\`\`\`

## Responsive Type

The \`Responsive<T>\` type makes any value responsive:

\`\`\`typescript
import { Responsive, Size } from '@idealyst/theme';

// Can be either a direct value or breakpoint map
type Props = {
  size: Responsive<Size>;
};

// Both are valid:
<Component size="md" />
<Component size={{ xs: 'sm', md: 'lg' }} />
\`\`\`

### Type Guard

Check if a value is responsive:

\`\`\`typescript
import { isResponsiveValue, Responsive, Size } from '@idealyst/theme';

function handleSize(size: Responsive<Size>) {
  if (isResponsiveValue(size)) {
    // size is Partial<Record<Breakpoint, Size>>
    console.log(size.xs, size.md);
  } else {
    // size is Size
    console.log(size);
  }
}
\`\`\`

## TypeScript Support

Custom breakpoints are fully typed:

\`\`\`typescript
const theme = createTheme()
  .setBreakpoints({
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  })
  .build();

// Register for type inference
declare module '@idealyst/theme' {
  interface CustomThemeRegistry {
    theme: typeof theme;
  }
}

// Now Breakpoint = 'mobile' | 'tablet' | 'desktop'
import { Breakpoint } from '@idealyst/theme';
\`\`\`

## Unistyles Integration

Breakpoints are automatically registered with Unistyles:

\`\`\`typescript
import { UnistylesRegistry } from 'react-native-unistyles';
import { lightTheme, darkTheme } from '@idealyst/theme';

UnistylesRegistry
  .addThemes({ light: lightTheme, dark: darkTheme })
  .addBreakpoints(lightTheme.breakpoints)  // Register breakpoints
  .addConfig({ initialTheme: 'light' });
\`\`\`

## Cross-Platform Behavior

- **Web**: Breakpoints convert to CSS media queries automatically
- **Native**: Uses device screen width (works with tablets, phones, etc.)
- **Same API**: Write once, works everywhere

## Best Practices

1. **Mobile-first**: Start with \`xs\` and add larger breakpoints as needed
2. **Use cascading**: Don't define every breakpoint - let values cascade
3. **Consistent breakpoints**: Use the same breakpoints across themes
4. **Test on devices**: Verify layouts on actual device widths
5. **Avoid over-responsiveness**: Not everything needs to change per breakpoint
`,

  "idealyst://framework/iterator-pattern": `# The $iterator Pattern

The \`$iterator\` pattern allows defining styles once that expand to all keys of a theme object.

## ThemeStyleWrapper

Wrap your theme type to enable $iterator properties:

\`\`\`typescript
import { ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

type Theme = ThemeStyleWrapper<BaseTheme>;
\`\`\`

This adds \`$property\` versions of iterable theme properties:

| Original Path            | $iterator Path            |
|--------------------------|---------------------------|
| \`theme.intents.primary\`  | \`theme.$intents.primary\`  |
| \`theme.sizes.button.md\`  | \`theme.sizes.$button.md\`  |

## Usage Examples

### Expand Intents

\`\`\`typescript
// Single definition
variants: {
  intent: {
    backgroundColor: theme.$intents.light,
    borderColor: theme.$intents.primary,
  },
}

// Expands to all intent keys (primary, success, error, warning, etc.)
// Result:
// intent: {
//   primary: { backgroundColor: theme.intents.primary.light, borderColor: theme.intents.primary.primary },
//   success: { backgroundColor: theme.intents.success.light, borderColor: theme.intents.success.primary },
//   error: { ... },
//   ...
// }
\`\`\`

### Expand Sizes

\`\`\`typescript
// Single definition
variants: {
  size: {
    paddingVertical: theme.sizes.$button.paddingVertical,
    fontSize: theme.sizes.$button.fontSize,
  },
}

// Expands to all size keys (xs, sm, md, lg, xl)
// Result:
// size: {
//   xs: { paddingVertical: theme.sizes.button.xs.paddingVertical, fontSize: theme.sizes.button.xs.fontSize },
//   sm: { paddingVertical: theme.sizes.button.sm.paddingVertical, fontSize: theme.sizes.button.sm.fontSize },
//   md: { ... },
//   ...
// }
\`\`\`

## Complete Example

\`\`\`typescript
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

type Theme = ThemeStyleWrapper<BaseTheme>;

export const chipStyles = defineStyle('Chip', (theme: Theme) => ({
  chip: {
    borderRadius: 999,

    variants: {
      // Expand for all sizes
      size: {
        paddingVertical: theme.sizes.$chip.paddingVertical,
        paddingHorizontal: theme.sizes.$chip.paddingHorizontal,
        minHeight: theme.sizes.$chip.minHeight,
      },

      // Expand for all intents
      intent: {
        backgroundColor: theme.$intents.light,
        borderColor: theme.$intents.primary,
      },
    },
  },

  text: {
    variants: {
      size: {
        fontSize: theme.sizes.$chip.fontSize,
        lineHeight: theme.sizes.$chip.lineHeight,
      },

      intent: {
        color: theme.$intents.dark,
      },
    },
  },
}));
\`\`\`

## createIteratorStyles()

Alternative to defineStyle for custom components:

\`\`\`typescript
import { createIteratorStyles } from '@idealyst/theme';

export const styles = createIteratorStyles((theme) => ({
  box: {
    variants: {
      intent: {
        backgroundColor: theme.$intents.light,
      },
    },
  },
}));
\`\`\`

## Benefits

1. **DRY Code**: Define once, expand to many
2. **Type Safety**: TypeScript validates iterator properties
3. **Maintainable**: Adding new sizes/intents to theme auto-expands
4. **Zero Runtime Cost**: Expansion happens at build time
`,
};
