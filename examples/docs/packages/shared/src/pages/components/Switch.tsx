import React from 'react';
import { View, Text, Switch, Screen } from '@idealyst/components';
import { ComponentPlayground, switchPropConfig } from '../../components/ComponentPlayground';

export function SwitchPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Switch
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Toggle control for binary on/off states. Switches provide immediate visual feedback
          and are ideal for settings that take effect immediately.
        </Text>

        <ComponentPlayground
          component={Switch}
          componentName="Switch"
          propConfig={switchPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
