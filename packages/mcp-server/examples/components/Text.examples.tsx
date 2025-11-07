/**
 * Text Component Examples
 *
 * These examples are type-checked against the actual TextProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Text, View } from '@idealyst/components';

// Example 1: Basic Text
export function BasicText() {
  return <Text>This is basic text content</Text>;
}

// Example 2: Text Sizes
export function TextSizes() {
  return (
    <View spacing="md">
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra large text</Text>
    </View>
  );
}

// Example 3: Text Weights
export function TextWeights() {
  return (
    <View spacing="md">
      <Text weight="light">Light weight text</Text>
      <Text weight="normal">Normal weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
    </View>
  );
}

// Example 4: Text Alignment
export function TextAlignment() {
  return (
    <View spacing="md">
      <Text align="left">Left aligned text</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
    </View>
  );
}

// Example 5: Text with Color
export function TextWithColor() {
  return (
    <View spacing="md">
      <Text >Blue text</Text>
      <Text >Green text</Text>
      <Text >Red text</Text>
      <Text >Gray text</Text>
      <Text >Purple text</Text>
    </View>
  );
}

// Example 6: Combining Size, Weight, and Color
export function CombinedTextStyles() {
  return (
    <View spacing="md">
      <Text size="xl" weight="bold" >
        Heading 1
      </Text>
      <Text size="lg" weight="semibold" >
        Heading 2
      </Text>
      <Text size="md" weight="medium" >
        Subheading
      </Text>
      <Text size="sm" weight="normal" >
        Body text
      </Text>
    </View>
  );
}

// Example 7: Paragraph Text
export function ParagraphText() {
  return (
    <View spacing="md">
      <Text size="lg" weight="bold" >
        Article Title
      </Text>
      <Text size="md" >
        This is a paragraph of text that demonstrates how the Text component can be used for
        longer content. It maintains good readability with appropriate sizing and spacing.
      </Text>
      <Text size="md" >
        You can create multiple paragraphs by using multiple Text components, each with their own
        styling and configuration.
      </Text>
    </View>
  );
}

// Example 8: Labels and Descriptions
export function LabelsAndDescriptions() {
  return (
    <View spacing="lg">
      <View spacing="xs">
        <Text size="sm" weight="semibold" >
          Username
        </Text>
        <Text size="md" >
          johndoe
        </Text>
      </View>
      <View spacing="xs">
        <Text size="sm" weight="semibold" >
          Email
        </Text>
        <Text size="md" >
          john.doe@example.com
        </Text>
      </View>
      <View spacing="xs">
        <Text size="sm" weight="semibold" >
          Status
        </Text>
        <Text size="md"  weight="medium">
          Active
        </Text>
      </View>
    </View>
  );
}

// Example 9: Error and Success Messages
export function StatusMessages() {
  return (
    <View spacing="md">
      <Text size="sm"  weight="medium">
        ✓ Form submitted successfully
      </Text>
      <Text size="sm"  weight="medium">
        ✗ Please fill out all required fields
      </Text>
      <Text size="sm"  weight="medium">
        ℹ Your changes have been saved
      </Text>
      <Text size="sm"  weight="medium">
        ⚠ This action cannot be undone
      </Text>
    </View>
  );
}

// Example 10: Typography Hierarchy
export function TypographyHierarchy() {
  return (
    <View spacing="lg">
      <Text size="xl" weight="bold" >
        Page Title
      </Text>
      <Text size="lg" weight="semibold" >
        Section Heading
      </Text>
      <Text size="md" weight="medium" >
        Subsection Title
      </Text>
      <Text size="md" >
        Body text content goes here with regular weight and medium size for optimal readability.
      </Text>
      <Text size="sm" >
        Small print or supplementary information can use smaller text size.
      </Text>
    </View>
  );
}
