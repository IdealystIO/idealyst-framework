import React from 'react';
import { Screen, View, Text } from '../index';

export const TextExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Text Examples
      </Text>
      
      {/* Text Sizes */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Sizes</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text size="small">Small text - Lorem ipsum dolor sit amet</Text>
          <Text size="medium">Medium text - Lorem ipsum dolor sit amet</Text>
          <Text size="large">Large text - Lorem ipsum dolor sit amet</Text>
          <Text size="xlarge">Extra large text - Lorem ipsum dolor sit amet</Text>
        </View>
      </View>

      {/* Text Weights */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Weights</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text weight="light">Light weight text</Text>
          <Text weight="normal">Normal weight text</Text>
          <Text weight="medium">Medium weight text</Text>
          <Text weight="semibold">Semibold weight text</Text>
          <Text weight="bold">Bold weight text</Text>
        </View>
      </View>

      {/* Text Colors */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Color Variants</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text color="primary">Primary color text</Text>
          <Text color="secondary">Secondary color text</Text>
          <Text color="blue">Blue color text</Text>
          <Text color="green">Green color text</Text>
          <Text color="red">Red color text</Text>
          <Text color="orange">Orange color text</Text>
        </View>
      </View>

      {/* Text Color Shades */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Color Shades</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text color="blue.300">Blue 300 text</Text>
          <Text color="blue.500">Blue 500 text</Text>
          <Text color="blue.700">Blue 700 text</Text>
          <Text color="red.200">Red 200 text</Text>
          <Text color="red.600">Red 600 text</Text>
          <Text color="red.900">Red 900 text</Text>
        </View>
      </View>

      {/* Text Alignment */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Alignment</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text align="left">Left aligned text</Text>
          <Text align="center">Center aligned text</Text>
          <Text align="right">Right aligned text</Text>
        </View>
      </View>

      {/* Combined Examples */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Combined Examples</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text size="large" weight="bold" color="primary" align="center">
            Large Bold Primary Centered
          </Text>
          <Text size="small" weight="light" color="secondary" align="right">
            Small Light Secondary Right
          </Text>
          <Text size="medium" weight="semibold" color="green">
            Medium Semibold Green
          </Text>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 