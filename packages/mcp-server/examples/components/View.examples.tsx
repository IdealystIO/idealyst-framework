/**
 * View Component Examples
 *
 * These examples are type-checked against the actual ViewProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { View, Text } from '@idealyst/components';

// Example 1: Basic View
export function BasicView() {
  return (
    <View>
      <Text>This is a basic view container</Text>
    </View>
  );
}

// Example 2: View with Spacing
export function ViewWithSpacing() {
  return (
    <View spacing="none">
      <Text>No spacing</Text>
      <View spacing="xs">
        <Text>Extra small spacing</Text>
      </View>
      <View spacing="sm">
        <Text>Small spacing</Text>
      </View>
      <View spacing="md">
        <Text>Medium spacing</Text>
      </View>
      <View spacing="lg">
        <Text>Large spacing</Text>
      </View>
      <View spacing="xl">
        <Text>Extra large spacing</Text>
      </View>
    </View>
  );
}

// Example 3: View with Background
export function ViewWithBackground() {
  return (
    <View spacing="md">
      <View background="primary" spacing="md">
        <Text>Primary surface</Text>
      </View>
      <View background="secondary" spacing="md">
        <Text>Secondary surface</Text>
      </View>
      <View background="tertiary" spacing="md">
        <Text>Tertiary surface</Text>
      </View>
      <View background="transparent" spacing="md">
        <Text>Transparent background</Text>
      </View>
    </View>
  );
}

// Example 4: View with Border Radius
export function ViewWithRadius() {
  return (
    <View spacing="md">
      <View background="primary" radius="none" spacing="md">
        <Text>No radius</Text>
      </View>
      <View background="primary" radius="xs" spacing="md">
        <Text>XS radius</Text>
      </View>
      <View background="primary" radius="sm" spacing="md">
        <Text>Small radius</Text>
      </View>
      <View background="primary" radius="md" spacing="md">
        <Text>Medium radius</Text>
      </View>
      <View background="primary" radius="lg" spacing="md">
        <Text>Large radius</Text>
      </View>
      <View background="primary" radius="xl" spacing="md">
        <Text>XL radius</Text>
      </View>
    </View>
  );
}

// Example 5: View with Borders
export function ViewWithBorders() {
  return (
    <View spacing="md">
      <View border="none" spacing="md">
        <Text>No border</Text>
      </View>
      <View border="thin" spacing="md">
        <Text>Thin border</Text>
      </View>
      <View border="thick" spacing="md">
        <Text>Thick border</Text>
      </View>
    </View>
  );
}

// Example 6: View with Custom Colors
export function ViewWithCustomColors() {
  return (
    <View spacing="md">
      <View backgroundColor="blue" spacing="md" radius="md">
        <Text >Blue background</Text>
      </View>
      <View backgroundColor="green" spacing="md" radius="md">
        <Text >Green background</Text>
      </View>
      <View backgroundColor="red" spacing="md" radius="md">
        <Text >Red background</Text>
      </View>
      <View
        border="thin"
        borderColor="purple"
        spacing="md"
        radius="md"
      >
        <Text>Purple border</Text>
      </View>
    </View>
  );
}

// Example 7: View with Custom Sizes
export function ViewWithCustomSizes() {
  return (
    <View spacing="md">
      <View padding={8} borderRadius={4} backgroundColor="gray.100">
        <Text>Custom padding: 8</Text>
      </View>
      <View padding={16} borderRadius={8} backgroundColor="gray.100">
        <Text>Custom padding: 16</Text>
      </View>
      <View padding={24} borderRadius={12} backgroundColor="gray.100">
        <Text>Custom padding: 24</Text>
      </View>
    </View>
  );
}

// Example 8: Nested Views
export function NestedViews() {
  return (
    <View spacing="lg" background="primary" radius="lg">
      <Text weight="bold" size="lg">
        Outer View
      </Text>
      <View spacing="md" background="secondary" radius="md">
        <Text weight="semibold">Middle View</Text>
        <View spacing="sm" background="tertiary" radius="sm">
          <Text>Inner View</Text>
        </View>
      </View>
    </View>
  );
}

// Example 9: Card-like Layout
export function CardLayout() {
  return (
    <View spacing="md">
      <View
        background="primary"
        spacing="lg"
        radius="lg"
        border="thin"
      >
        <Text size="lg" weight="bold">
          Card Title
        </Text>
        <Text size="md" >
          This is a card-like layout created using the View component with background, spacing,
          radius, and border properties.
        </Text>
      </View>
    </View>
  );
}

// Example 10: View with Margin
export function ViewWithMargin() {
  return (
    <View spacing="md">
      <View
        background="primary"
        spacing="md"
        marginVariant="none"
      >
        <Text>No margin</Text>
      </View>
      <View
        background="primary"
        spacing="md"
        marginVariant="sm"
      >
        <Text>Small margin</Text>
      </View>
      <View
        background="primary"
        spacing="md"
        marginVariant="md"
      >
        <Text>Medium margin</Text>
      </View>
      <View
        background="primary"
        spacing="md"
        marginVariant="lg"
      >
        <Text>Large margin</Text>
      </View>
    </View>
  );
}

// Example 11: Profile Card
export function ProfileCard() {
  return (
    <View
      background="primary"
      spacing="lg"
      radius="lg"
      border="thin"
    >
      <View spacing="md">
        <Text size="xl" weight="bold">
          John Doe
        </Text>
        <Text size="md" >
          Software Engineer
        </Text>
      </View>
      <View spacing="sm">
        <Text size="sm" >
          Email: john.doe@example.com
        </Text>
        <Text size="sm" >
          Location: San Francisco, CA
        </Text>
      </View>
    </View>
  );
}

// Example 12: Dashboard Grid
export function DashboardGrid() {
  return (
    <View spacing="md">
      <View spacing="md">
        <View
          background="primary"
          spacing="md"
          radius="md"
          border="thin"
        >
          <Text weight="semibold">Card 1</Text>
          <Text size="sm" >
            Content goes here
          </Text>
        </View>
        <View
          background="primary"
          spacing="md"
          radius="md"
          border="thin"
        >
          <Text weight="semibold">Card 2</Text>
          <Text size="sm" >
            Content goes here
          </Text>
        </View>
      </View>
      <View spacing="md">
        <View
          background="primary"
          spacing="md"
          radius="md"
          border="thin"
        >
          <Text weight="semibold">Card 3</Text>
          <Text size="sm" >
            Content goes here
          </Text>
        </View>
        <View
          background="primary"
          spacing="md"
          radius="md"
          border="thin"
        >
          <Text weight="semibold">Card 4</Text>
          <Text size="sm" >
            Content goes here
          </Text>
        </View>
      </View>
    </View>
  );
}
