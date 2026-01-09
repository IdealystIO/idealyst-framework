import React from 'react';
import { View, Text, Screen } from '@idealyst/components';
import { CodeBlock } from '../components/CodeBlock';

export function InstallationPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Installation
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Get started with Idealyst by creating a new workspace using the CLI.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Prerequisites
        </Text>
        <Text typography="body1" color="tertiary" style={{ marginBottom: 24 }}>
          - Node.js 18 or later{'\n'}
          - Yarn 3 or later (recommended) or npm{'\n'}
          - For mobile development: Xcode (iOS) or Android Studio (Android)
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Create a New Workspace
        </Text>
        <Text typography="body1" color="tertiary" style={{ marginBottom: 8 }}>
          Run the following command to create a new Idealyst workspace:
        </Text>

        <CodeBlock
          code={`npx @idealyst/cli init my-app
cd my-app`}
          language="bash"
          title="Terminal"
        />

        <Text typography="body1" color="tertiary" style={{ marginBottom: 24 }}>
          This creates a complete monorepo with all 5 packages: web, native, api, database, and shared.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Project Structure
        </Text>

        <CodeBlock
          code={`my-app/
├── packages/
│   ├── web/          # React web app (Vite)
│   ├── native/       # React Native app
│   ├── api/          # tRPC + GraphQL server
│   ├── database/     # Prisma database layer
│   └── shared/       # Shared utilities & tRPC client
├── package.json
├── tsconfig.json
└── yarn.lock`}
          language="text"
          title="Project Structure"
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Configure Babel
        </Text>
        <Text typography="body1" color="tertiary" style={{ marginBottom: 8 }}>
          Add the Idealyst Babel plugin to enable the style system:
        </Text>

        <CodeBlock
          code={`// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@idealyst/theme/plugin', {
      themePath: './src/theme/styles.ts',
    }],
  ],
};`}
          language="javascript"
          title="babel.config.js"
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Start Development
        </Text>

        <CodeBlock
          code={`# Start web dev server
cd packages/web
yarn dev

# In another terminal, start native
cd packages/native
yarn start

# In another terminal, start API
cd packages/api
yarn dev`}
          language="bash"
          title="Terminal"
        />
      </View>
    </Screen>
  );
}
