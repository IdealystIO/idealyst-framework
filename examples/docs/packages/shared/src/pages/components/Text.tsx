import React from 'react';
import { View, Text, Screen } from '@idealyst/components';
import { ComponentPlayground, textPropConfig } from '../../components/ComponentPlayground';

export function TextPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Text
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Typography component for displaying text with semantic variants, weights, and colors.
          Supports responsive sizing and theme-based color schemes.
        </Text>

        <ComponentPlayground
          component={Text}
          componentName="Text"
          propConfig={textPropConfig}
          defaultChildren="Hello World"
        />
      </View>
    </Screen>
  );
}
