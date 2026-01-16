/**
 * Chip Component Examples
 *
 * These examples are type-checked against the actual ChipProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Chip } from '@idealyst/components';

// Example 1: Basic Chip
export function BasicChip() {
  return <Chip label="React" />;
}

// Example 2: Chip Types
export function ChipTypes() {
  return (
    <>
      <Chip label="Filled" type="filled" />
      <Chip label="Outlined" type="outlined" />
      <Chip label="Soft" type="soft" />
    </>
  );
}

// Example 3: Chip Sizes
export function ChipSizes() {
  return (
    <>
      <Chip label="XS" size="xs" />
      <Chip label="SM" size="sm" />
      <Chip label="MD" size="md" />
      <Chip label="LG" size="lg" />
      <Chip label="XL" size="xl" />
    </>
  );
}

// Example 4: Chip Intents
export function ChipIntents() {
  return (
    <>
      <Chip label="Primary" intent="primary" />
      <Chip label="Success" intent="success" />
      <Chip label="Error" intent="danger" />
      <Chip label="Warning" intent="warning" />
      <Chip label="Neutral" intent="neutral" />
      <Chip label="Info" intent="info" />
    </>
  );
}

// Example 5: Chip with Icon
export function ChipWithIcon() {
  return (
    <>
      <Chip label="React" icon="react" />
      <Chip label="TypeScript" icon="language-typescript" />
    </>
  );
}

// Example 6: Deletable Chip
export function DeletableChip() {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <Chip
      label="Deletable"
      onDelete={() => setVisible(false)}
    />
  );
}

// Example 7: Clickable Chip
export function ClickableChip() {
  return (
    <Chip
      label="Clickable"
      onPress={() => console.log('Chip clicked')}
      type="outlined"
    />
  );
}
