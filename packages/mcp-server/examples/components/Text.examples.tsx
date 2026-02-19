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
      <Text typography="body2">Small text</Text>
      <Text typography="body1">Medium text</Text>
      <Text typography="subtitle1">Large text</Text>
      <Text typography="h5">Extra large text</Text>
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
      <Text color="primary">Primary text color</Text>
      <Text color="secondary">Secondary text color</Text>
      <Text color="tertiary">Tertiary text color</Text>
      <Text color="inverse">Inverse text color</Text>
    </View>
  );
}

// Example 6: Combining Typography, Weight, and Color
export function CombinedTextStyles() {
  return (
    <View spacing="md">
      <Text typography="h5" weight="bold" color="primary">
        Heading 1
      </Text>
      <Text typography="subtitle1" weight="semibold" color="primary">
        Heading 2
      </Text>
      <Text typography="body1" weight="medium" color="secondary">
        Subheading
      </Text>
      <Text typography="body2" weight="normal" color="tertiary">
        Body text
      </Text>
    </View>
  );
}

// Example 7: Paragraph Text
export function ParagraphText() {
  return (
    <View spacing="md">
      <Text typography="subtitle1" weight="bold">
        Article Title
      </Text>
      <Text typography="body1">
        This is a paragraph of text that demonstrates how the Text component can be used for
        longer content. It maintains good readability with appropriate sizing and spacing.
      </Text>
      <Text typography="body1">
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
        <Text typography="body2" weight="semibold">
          Username
        </Text>
        <Text typography="body1">
          johndoe
        </Text>
      </View>
      <View spacing="xs">
        <Text typography="body2" weight="semibold">
          Email
        </Text>
        <Text typography="body1">
          john.doe@example.com
        </Text>
      </View>
      <View spacing="xs">
        <Text typography="body2" weight="semibold">
          Status
        </Text>
        <Text typography="body1" weight="medium">
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
      <Text typography="body2" weight="medium">
        ✓ Form submitted successfully
      </Text>
      <Text typography="body2" weight="medium">
        ✗ Please fill out all required fields
      </Text>
      <Text typography="body2" weight="medium">
        ℹ Your changes have been saved
      </Text>
      <Text typography="body2" weight="medium">
        ⚠ This action cannot be undone
      </Text>
    </View>
  );
}

// Example 10: Typography Hierarchy
export function TypographyHierarchy() {
  return (
    <View spacing="lg">
      <Text typography="h5" weight="bold">
        Page Title
      </Text>
      <Text typography="subtitle1" weight="semibold">
        Section Heading
      </Text>
      <Text typography="body1" weight="medium">
        Subsection Title
      </Text>
      <Text typography="body1">
        Body text content goes here with regular weight and medium size for optimal readability.
      </Text>
      <Text typography="body2">
        Small print or supplementary information can use smaller text size.
      </Text>
    </View>
  );
}
