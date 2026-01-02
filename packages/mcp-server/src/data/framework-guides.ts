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
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
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
};
