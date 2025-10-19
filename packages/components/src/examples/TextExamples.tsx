import React from 'react';
import { Screen, View, Text } from '../index';

export const TextExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="lg" weight="bold" align="center">
        Text Examples
      </Text>

      {/* Text Sizes */}
      <View spacing="md">
        <Text size="md" weight="semibold">Sizes</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text size="sm">Small text - Lorem ipsum dolor sit amet</Text>
          <Text size="md">Medium text - Lorem ipsum dolor sit amet</Text>
          <Text size="lg">Large text - Lorem ipsum dolor sit amet</Text>
          <Text size="xl">Extra large text - Lorem ipsum dolor sit amet</Text>
        </View>
      </View>

      {/* Text Weights */}
      <View spacing="md">
        <Text size="md" weight="semibold">Weights</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text weight="light">Light weight text</Text>
          <Text weight="normal">Normal weight text</Text>
          <Text weight="medium">Medium weight text</Text>
          <Text weight="semibold">Semibold weight text</Text>
          <Text weight="bold">Bold weight text</Text>
        </View>
      </View>

      {/* Semantic Text Colors */}
      <View spacing="md">
        <Text size="md" weight="semibold">Semantic Text Colors</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text color="primary">Primary text - Main text color</Text>
          <Text color="secondary">Secondary text - Subdued text</Text>
          <Text color="tertiary">Tertiary text - More subdued text</Text>
        </View>
      </View>

      {/* Inverse Text Colors */}
      <View spacing="md">
        <Text size="md" weight="semibold">Inverse Text Colors (on dark backgrounds)</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <View background="inverse" spacing="sm" radius="sm">
            <Text color="inverse">Inverse (of primary) - Light text on dark background</Text>
          </View>
          <View background="inverse" spacing="sm" radius="sm">
            <Text color="inverse-secondary">Inverse secondary (90% opacity)</Text>
          </View>
          <View background="inverse" spacing="sm" radius="sm">
            <Text color="inverse-tertiary">Inverse tertiary (70% opacity)</Text>
          </View>
        </View>
      </View>

      {/* Utility Text Colors */}
      <View spacing="md">
        <Text size="md" weight="semibold">Utility Text Colors</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text color="disabled">Disabled text</Text>
          <Text color="muted">Muted text</Text>
          <Text color="placeholder">Placeholder text</Text>
        </View>
      </View>

      {/* Palette Text Colors */}
      <View spacing="md">
        <Text size="md" weight="semibold">Palette Colors</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text color="blue">Blue color text</Text>
          <Text color="green">Green color text</Text>
          <Text color="red">Red color text</Text>
          <Text color="orange">Orange color text</Text>
        </View>
      </View>

      {/* Text Color Shades */}
      <View spacing="md">
        <Text size="md" weight="semibold">Color Shades</Text>
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
        <Text size="md" weight="semibold">Alignment</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text align="left">Left aligned text</Text>
          <Text align="center">Center aligned text</Text>
          <Text align="right">Right aligned text</Text>
        </View>
      </View>

      {/* Combined Examples */}
      <View spacing="md">
        <Text size="md" weight="semibold">Combined Examples</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Text size="lg" weight="bold" color="primary" align="center">
            Large Bold Primary Centered
          </Text>
          <Text size="sm" weight="light" color="secondary" align="right">
            Small Light Secondary Right
          </Text>
          <Text size="md" weight="semibold" color="green">
            Medium Semibold Green
          </Text>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 