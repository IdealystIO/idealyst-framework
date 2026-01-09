import React from 'react';
import { View, Text, Slider, Screen } from '@idealyst/components';
import { ComponentPlayground, sliderPropConfig } from '../../components/ComponentPlayground';

export function SliderPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Slider
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Range input control for selecting a value within a specified range.
          Supports different sizes, colors, and accessibility features.
        </Text>

        <ComponentPlayground
          component={Slider}
          componentName="Slider"
          propConfig={sliderPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
