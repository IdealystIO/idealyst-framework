/**
 * Card Component Examples
 *
 * These examples are type-checked against the actual CardProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Card, Text, View } from '@idealyst/components';

// Example 1: Basic Card
export function BasicCard() {
  return (
    <Card>
      <Text>Simple card content</Text>
    </Card>
  );
}

// Example 2: Card Types
export function CardTypes() {
  return (
    <>
      <Card type="outlined">
        <Text>Outlined Card</Text>
      </Card>
      <Card type="elevated">
        <Text>Elevated Card</Text>
      </Card>
      <Card type="filled">
        <Text>Filled Card</Text>
      </Card>
    </>
  );
}

// Example 3: Card with Padding Variants
export function CardPadding() {
  return (
    <>
      <Card padding="none">
        <Text>No Padding</Text>
      </Card>
      <Card padding="xs">
        <Text>Extra Small Padding</Text>
      </Card>
      <Card padding="sm">
        <Text>Small Padding</Text>
      </Card>
      <Card padding="md">
        <Text>Medium Padding</Text>
      </Card>
      <Card padding="lg">
        <Text>Large Padding</Text>
      </Card>
      <Card padding="xl">
        <Text>Extra Large Padding</Text>
      </Card>
    </>
  );
}

// Example 4: Card with Radius Variants
export function CardRadius() {
  return (
    <>
      <Card radius="none">
        <Text>No Radius</Text>
      </Card>
      <Card radius="sm">
        <Text>Small Radius</Text>
      </Card>
      <Card radius="md">
        <Text>Medium Radius</Text>
      </Card>
      <Card radius="lg">
        <Text>Large Radius</Text>
      </Card>
      <Card radius="xl">
        <Text>Extra Large Radius</Text>
      </Card>
    </>
  );
}

// Example 5: Card with Intent
export function CardWithIntent() {
  return (
    <>
      <Card intent="primary" type="filled">
        <Text>Primary Card</Text>
      </Card>
      <Card intent="success" type="filled">
        <Text>Success Card</Text>
      </Card>
      <Card intent="error" type="filled">
        <Text>Error Card</Text>
      </Card>
    </>
  );
}

// Example 6: Clickable Card
export function ClickableCard() {
  return (
    <Card
      clickable
      onPress={() => console.log('Card clicked')}
      type="outlined"
      padding="md"
    >
      <Text>Click this card</Text>
    </Card>
  );
}

// Example 7: Complex Card
export function ComplexCard() {
  return (
    <Card type="elevated" padding="lg" radius="md">
      <View spacing="md">
        <Text size="lg" weight="bold">Card Title</Text>
        <Text size="md">This is some card content with multiple elements.</Text>
        <Text size="sm" >Additional information</Text>
      </View>
    </Card>
  );
}
