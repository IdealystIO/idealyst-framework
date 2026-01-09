import React from 'react';
import { View, Text, Input, Screen } from '@idealyst/components';
import { ComponentPlayground, inputPropConfig } from '../../components/ComponentPlayground';

export function InputPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Input
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Text input field with icon support, password visibility toggle, and various
          input types. Optimized for both web and mobile with appropriate keyboard types.
        </Text>

        <ComponentPlayground
          component={Input}
          componentName="Input"
          propConfig={inputPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
