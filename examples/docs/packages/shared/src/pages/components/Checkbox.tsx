import React from 'react';
import { View, Text, Checkbox, Screen } from '@idealyst/components';
import { ComponentPlayground, checkboxPropConfig } from '../../components/ComponentPlayground';

export function CheckboxPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Checkbox
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Selection control that allows users to select one or more options from a set.
          Checkboxes can be used independently or as part of a group.
        </Text>

        <ComponentPlayground
          component={Checkbox}
          componentName="Checkbox"
          propConfig={checkboxPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
