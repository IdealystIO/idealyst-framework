import React from 'react';
import { View, Text, Divider, Screen } from '@idealyst/components';
import { ComponentPlayground, dividerPropConfig } from '../../components/ComponentPlayground';

export function DividerPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Divider
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Visual separator for content sections.
          Supports horizontal and vertical orientations with various line styles.
        </Text>

        <ComponentPlayground
          component={Divider}
          componentName="Divider"
          propConfig={dividerPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
