import React from 'react';
import { View, Text, Button, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';
import { ComponentPlayground, buttonPropConfig } from '../../components/ComponentPlayground';

export function ButtonPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text size="xl" weight="bold" style={{ marginBottom: 16 }}>
          Button
        </Text>

        <Text style={{ marginBottom: 32, lineHeight: 26, color: '#333333' }}>
          Interactive button component with multiple variants, sizes, and icon support.
          Buttons support intent colors for semantic meaning and work identically on
          web and native platforms.
        </Text>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          Import
        </Text>

        <CodeBlock code={`import { Button } from '@idealyst/components';`} />

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Playground
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          Experiment with different prop combinations. The code below updates automatically.
        </Text>

        <ComponentPlayground
          component={Button}
          componentName="Button"
          propConfig={buttonPropConfig}
          defaultChildren="Click Me"
        />
      </View>
    </Screen>
  );
}
