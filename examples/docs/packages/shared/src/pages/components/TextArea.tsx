import React from 'react';
import { View, Text, TextArea, Screen } from '@idealyst/components';
import { ComponentPlayground, textAreaPropConfig } from '../../components/ComponentPlayground';

export function TextAreaPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          TextArea
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Multi-line text input for longer content like descriptions or messages.
          Supports auto-grow, character counting, and validation states.
        </Text>

        <ComponentPlayground
          component={TextArea}
          componentName="TextArea"
          propConfig={textAreaPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
