/**
 * Button Component Examples
 *
 * These examples are type-checked against the actual ButtonProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Button } from '@idealyst/components';

// Example 1: Basic Button
export function BasicButton() {
  return (
    <Button onPress={() => console.log('Clicked')}>
      Click Me
    </Button>
  );
}

// Example 2: Button Variants (types)
export function ButtonTypes() {
  return (
    <>
      <Button type="contained" intent="primary">Contained</Button>
      <Button type="outlined" intent="primary">Outlined</Button>
      <Button type="text" intent="primary">Text</Button>
    </>
  );
}

// Example 3: Button Sizes
export function ButtonSizes() {
  return (
    <>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </>
  );
}

// Example 4: Button Intents
export function ButtonIntents() {
  return (
    <>
      <Button intent="primary">Primary</Button>
      <Button intent="success">Success</Button>
      <Button intent="error">Error</Button>
      <Button intent="warning">Warning</Button>
      <Button intent="neutral">Neutral</Button>
      <Button intent="info">Info</Button>
    </>
  );
}

// Example 5: Button with Icons
export function ButtonWithIcons() {
  return (
    <>
      <Button leftIcon="check" onPress={() => {}}>
        Save
      </Button>
      <Button rightIcon="arrow-right" onPress={() => {}}>
        Next
      </Button>
      <Button leftIcon="plus" rightIcon="arrow-down" onPress={() => {}}>
        Add Item
      </Button>
    </>
  );
}

// Example 6: Disabled Button
export function DisabledButton() {
  return (
    <Button disabled onPress={() => {}}>
      Disabled
    </Button>
  );
}

// Example 7: Full Width Button
export function FullWidthButton() {
  return (
    <Button fullWidth type="contained" intent="primary">
      Full Width Button
    </Button>
  );
}

// Example 8: Interactive Example with Loading State
export function InteractiveButton() {
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Button
      loading={loading}
      onPress={handlePress}
      type="contained"
      intent="primary"
    >
      {loading ? 'Saving...' : 'Save'}
    </Button>
  );
}
