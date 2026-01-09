import React from 'react';
import { View, Text, Icon, Screen } from '@idealyst/components';
import { ComponentPlayground, iconPropConfig } from '../../components/ComponentPlayground';

export function IconPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Icon
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Material Design icons component with 7,000+ icons available.
          Supports size variants, intent colors, and custom styling.
        </Text>

        <ComponentPlayground
          component={Icon}
          componentName="Icon"
          propConfig={iconPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
