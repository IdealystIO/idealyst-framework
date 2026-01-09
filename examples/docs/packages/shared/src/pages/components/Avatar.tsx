import React from 'react';
import { View, Text, Avatar, Screen } from '@idealyst/components';
import { ComponentPlayground, avatarPropConfig } from '../../components/ComponentPlayground';

export function AvatarPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Avatar
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          User profile image component with fallback initials display.
          Supports circular and square shapes with multiple size variants.
        </Text>

        <ComponentPlayground
          component={Avatar}
          componentName="Avatar"
          propConfig={avatarPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
