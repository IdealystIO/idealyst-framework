import React from 'react';
import { View, Text, Badge, Screen } from '@idealyst/components';
import { ComponentPlayground, badgePropConfig } from '../../components/ComponentPlayground';

export function BadgePage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Badge
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Small status indicators that appear alongside other UI elements. Perfect for
          notification counts, status labels, and highlighting new content.
        </Text>

        <ComponentPlayground
          component={Badge}
          componentName="Badge"
          propConfig={badgePropConfig}
          defaultChildren="New"
        />
      </View>
    </Screen>
  );
}
