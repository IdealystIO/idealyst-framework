import React from 'react';
import { View, Text, Screen } from '@idealyst/components';
import { useTranslation } from '@idealyst/translate';
import { CodeBlock } from '../components/CodeBlock';

export function InstallationPage() {
  const { t } = useTranslation('installation');

  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          {t('title')}
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          {t('description')}
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('prerequisites.title')}
        </Text>
        <Text typography="body1" color="tertiary" style={{ marginBottom: 24 }}>
          {t('prerequisites.items')}
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('createWorkspace.title')}
        </Text>
        <Text typography="body1" color="tertiary" style={{ marginBottom: 8 }}>
          {t('createWorkspace.description')}
        </Text>

        <CodeBlock
          code={`npx @idealyst/cli init my-app
cd my-app`}
          language="bash"
          title="Terminal"
        />

        <Text typography="body1" color="tertiary" style={{ marginBottom: 24 }}>
          {t('createWorkspace.result')}
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('projectStructure.title')}
        </Text>

        <CodeBlock
          code={`my-app/
├── packages/
│   ├── web/          # ${t('projectStructure.comments.web')}
│   ├── native/       # ${t('projectStructure.comments.native')}
│   ├── api/          # ${t('projectStructure.comments.api')}
│   ├── database/     # ${t('projectStructure.comments.database')}
│   └── shared/       # ${t('projectStructure.comments.shared')}
├── package.json
├── tsconfig.json
└── yarn.lock`}
          language="text"
          title="Project Structure"
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          {t('configureBabel.title')}
        </Text>
        <Text typography="body1" color="tertiary" style={{ marginBottom: 8 }}>
          {t('configureBabel.description')}
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
          {t('startDevelopment.title')}
        </Text>

        <CodeBlock
          code={`# ${t('startDevelopment.comments.web')}
cd packages/web
yarn dev

# ${t('startDevelopment.comments.native')}
cd packages/native
yarn start

# ${t('startDevelopment.comments.api')}
cd packages/api
yarn dev`}
          language="bash"
          title="Terminal"
        />
      </View>
    </Screen>
  );
}
