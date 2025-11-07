/**
 * Divider Component Examples
 *
 * These examples are type-checked against the actual DividerProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Divider, View, Text } from '@idealyst/components';

// Example 1: Basic Divider
export function BasicDivider() {
  return (
    <View spacing="md">
      <Text>Content above</Text>
      <Divider />
      <Text>Content below</Text>
    </View>
  );
}

// Example 2: Divider Orientations
export function DividerOrientations() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Horizontal Divider</Text>
        <Divider orientation="horizontal" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Vertical Divider</Text>
        <View spacing="sm">
          <Text>Left</Text>
          <Divider orientation="vertical" />
          <Text>Right</Text>
        </View>
      </View>
    </View>
  );
}

// Example 3: Divider Types
export function DividerTypes() {
  return (
    <View spacing="md">
      <Text>Solid divider</Text>
      <Divider type="solid" />
      <Text>Dashed divider</Text>
      <Divider type="dashed" />
      <Text>Dotted divider</Text>
      <Divider type="dotted" />
    </View>
  );
}

// Example 4: Divider Thickness
export function DividerThickness() {
  return (
    <View spacing="md">
      <Text>Thin divider</Text>
      <Divider thickness="thin" />
      <Text>Medium divider</Text>
      <Divider thickness="md" />
      <Text>Thick divider</Text>
      <Divider thickness="thick" />
    </View>
  );
}

// Example 5: Divider with Intent Colors
export function DividerWithIntent() {
  return (
    <View spacing="md">
      <Text>Primary intent</Text>
      <Divider intent="primary" />
      <Text>Success intent</Text>
      <Divider intent="success" />
      <Text>Error intent</Text>
      <Divider intent="error" />
      <Text>Warning intent</Text>
      <Divider intent="warning" />
      <Text>Info intent</Text>
      <Divider intent="info" />
      <Text>Neutral intent</Text>
      <Divider intent="neutral" />
    </View>
  );
}

// Example 6: Divider with Text
export function DividerWithText() {
  return (
    <View spacing="md">
      <Text>Section 1 content</Text>
      <Divider>OR</Divider>
      <Text>Section 2 content</Text>
      <Divider>
        <Text size="sm" >
          Continue Reading
        </Text>
      </Divider>
      <Text>More content here</Text>
    </View>
  );
}

// Example 7: Divider Spacing
export function DividerSpacing() {
  return (
    <View spacing="md">
      <Text>No spacing</Text>
      <Divider spacing="none" />
      <Text>Small spacing</Text>
      <Divider spacing="sm" />
      <Text>Medium spacing</Text>
      <Divider spacing="md" />
      <Text>Large spacing</Text>
      <Divider spacing="lg" />
      <Text>Extra large spacing</Text>
      <Divider spacing="xl" />
      <Text>After content</Text>
    </View>
  );
}

// Example 8: Divider Length Variants
export function DividerLength() {
  return (
    <View spacing="md">
      <Text>Full length divider</Text>
      <Divider length="full" />
      <Text>Auto length divider</Text>
      <Divider length="auto" />
      <Text>Custom length divider (80%)</Text>
      <Divider length={80} />
    </View>
  );
}

// Example 9: Section Dividers
export function SectionDividers() {
  return (
    <View spacing="lg">
      <View spacing="md">
        <Text size="lg" weight="bold">
          Section 1
        </Text>
        <Text>
          This is the first section of content with some important information.
        </Text>
      </View>

      <Divider spacing="lg" thickness="md" />

      <View spacing="md">
        <Text size="lg" weight="bold">
          Section 2
        </Text>
        <Text>
          This is the second section with more content to display.
        </Text>
      </View>

      <Divider spacing="lg" thickness="md" />

      <View spacing="md">
        <Text size="lg" weight="bold">
          Section 3
        </Text>
        <Text>
          This is the third and final section.
        </Text>
      </View>
    </View>
  );
}

// Example 10: Styled Dividers
export function StyledDividers() {
  return (
    <View spacing="md">
      <Text weight="bold">Thick Primary Divider</Text>
      <Divider thickness="thick" intent="primary" spacing="md" />

      <Text weight="bold">Dashed Success Divider</Text>
      <Divider type="dashed" intent="success" spacing="md" />

      <Text weight="bold">Dotted Warning Divider</Text>
      <Divider type="dotted" intent="warning" thickness="md" spacing="md" />

      <Text weight="bold">Thick Error Divider</Text>
      <Divider thickness="thick" intent="error" spacing="md" />
    </View>
  );
}

// Example 11: Form Section Dividers
export function FormSectionDividers() {
  return (
    <View spacing="lg">
      <View spacing="md">
        <Text size="lg" weight="bold">
          Personal Information
        </Text>
        <View spacing="sm">
          <Text size="sm">Name: John Doe</Text>
          <Text size="sm">Email: john@example.com</Text>
        </View>
      </View>

      <Divider spacing="lg">
        <Text size="sm" weight="semibold" >
          CONTACT DETAILS
        </Text>
      </Divider>

      <View spacing="md">
        <View spacing="sm">
          <Text size="sm">Phone: (555) 123-4567</Text>
          <Text size="sm">Address: 123 Main St</Text>
        </View>
      </View>

      <Divider spacing="lg">
        <Text size="sm" weight="semibold" >
          PREFERENCES
        </Text>
      </Divider>

      <View spacing="md">
        <View spacing="sm">
          <Text size="sm">Theme: Dark</Text>
          <Text size="sm">Notifications: Enabled</Text>
        </View>
      </View>
    </View>
  );
}

// Example 12: List Item Dividers
export function ListItemDividers() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <View spacing="none">
      {items.map((item, index) => (
        <React.Fragment key={item}>
          <View spacing="md">
            <Text>{item}</Text>
          </View>
          {index < items.length - 1 && (
            <Divider spacing="none" thickness="thin" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
