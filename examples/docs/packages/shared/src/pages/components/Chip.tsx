import React from 'react';
import { View, Text, Chip, Screen } from '@idealyst/components';
import { ComponentPlayground, chipPropConfig } from '../../components/ComponentPlayground';

export function ChipPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Chip
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Compact elements that represent an input, attribute, or action. Chips can be
          interactive (clickable) or static, and support various styles and sizes.
        </Text>

        <ComponentPlayground
          component={Chip}
          componentName="Chip"
          propConfig={chipPropConfig}
          defaultChildren="Chip Label"
        />
      </View>
    </Screen>
  );
}
