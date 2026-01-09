import React from 'react';
import { View, Text, Button, Screen } from '@idealyst/components';
import { ComponentPlayground, buttonPropConfig } from '../../components/ComponentPlayground';

export function ButtonPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Button
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Interactive button component with multiple variants, sizes, and icon support.
          Supports intent colors for semantic meaning and works identically on web and native.
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
