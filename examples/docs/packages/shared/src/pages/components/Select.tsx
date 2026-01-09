import React from 'react';
import { View, Text, Select, Screen } from '@idealyst/components';
import { ComponentPlayground, selectPropConfig } from '../../components/ComponentPlayground';

// Demo select component wrapper for playground (Select requires options prop)
function DemoSelect(props: any) {
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];
  return <Select {...props} options={options} value="apple" />;
}

export function SelectPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Select
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Dropdown selection component for choosing a single option from a list.
          Supports custom styling and works on both web and native platforms.
        </Text>

        <ComponentPlayground
          component={DemoSelect}
          componentName="Select"
          propConfig={selectPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
