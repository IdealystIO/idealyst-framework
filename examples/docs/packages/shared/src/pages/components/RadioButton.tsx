import React from 'react';
import { View, Text, RadioButton, Screen } from '@idealyst/components';
import { ComponentPlayground, radioButtonPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper that provides required value prop
function DemoRadioButton(props: any) {
  return <RadioButton {...props} value="option1" />;
}

export function RadioButtonPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          RadioButton
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Single selection control for choosing one option from a set.
          Use RadioGroup to manage multiple radio buttons together.
        </Text>

        <ComponentPlayground
          component={DemoRadioButton}
          componentName="RadioButton"
          propConfig={radioButtonPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
