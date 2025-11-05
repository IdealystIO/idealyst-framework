export const View = {
  category: "layout",
  description: "Container component with spacing, padding, and background variants",
      props: `
- \`children\`: React.ReactNode - The content to display inside the view
- \`spacing\`: ViewSpacingVariant - Padding/spacing variant
- \`marginVariant\`: ViewSpacingVariant - Margin variant
- \`background\`: ViewBackgroundVariant - Background variant
- \`radius\`: ViewRadiusVariant - Border radius variant
- \`border\`: ViewBorderVariant - Border variant
- \`backgroundColor\`: string - Custom background color (overrides background variant)
- \`padding\`: number - Custom padding (overrides spacing variant)
- \`margin\`: number - Custom margin (overrides marginVariant)
- \`borderRadius\`: number - Custom border radius (overrides radius variant)
- \`borderWidth\`: number - Custom border width (overrides border variant)
- \`borderColor\`: string - Custom border color
`,
  features: [
    "Automatic gap spacing between children",
    "Six spacing/margin variants",
    "Four background variants",
    "Six border radius variants",
    "Border support",
    "Custom overrides for all variants",
    "Flexbox-based layout",
  ],
  bestPractices: [
    "Use View for all layout containers",
    "Use spacing prop for consistent gaps",
    "Prefer variants over custom values",
    "Use 'md' spacing for standard layouts",
    "Combine with Screen for full-screen layouts",
    "Use background variants for semantic colors",
  ],
  usage: `
import { View, Text, Button } from '@idealyst/components';

<View spacing="md" background="surface" radius="md" style={{ padding: 16 }}>
  <Text size="lg" weight="bold">Card Title</Text>
  <Text>Card content with consistent spacing</Text>
  <Button>Action</Button>
</View>
`,
  examples: {
    basic: `import { View, Text } from '@idealyst/components';

<View spacing="md">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</View>`,

    variants: `import { View, Text } from '@idealyst/components';

<View spacing="lg">
  <View spacing="xs" background="surface" radius="sm" style={{ padding: 12 }}>
    <Text>Extra small spacing</Text>
    <Text>Second item</Text>
  </View>

  <View spacing="md" background="surface" radius="md" style={{ padding: 16 }}>
    <Text>Medium spacing</Text>
    <Text>Second item</Text>
  </View>

  <View spacing="xl" background="surface" radius="lg" style={{ padding: 20 }}>
    <Text>Extra large spacing</Text>
    <Text>Second item</Text>
  </View>
</View>`,

    "with-icons": `import { View, Icon, Text } from '@idealyst/components';

<View
  spacing="sm"
  background="surface"
  radius="md"
  border="thin"
  style={{ padding: 16 }}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <Icon name="information-outline" size="lg" color="primary" />
    <View spacing="xs" style={{ flex: 1 }}>
      <Text weight="bold">Important Information</Text>
      <Text size="sm">This is an informational message</Text>
    </View>
  </View>
</View>`,

    interactive: `import { View, Text, Button, Card } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [items, setItems] = useState(['Item 1', 'Item 2']);

  const addItem = () => {
    setItems([...items, \`Item \${items.length + 1}\`]);
  };

  return (
    <View spacing="lg" style={{ padding: 16 }}>
      <Card type="outlined" padding="md">
        <View spacing="md">
          <Text weight="bold">Dynamic List</Text>
          <View spacing="sm">
            {items.map((item, index) => (
              <View
                key={index}
                background="surface"
                radius="sm"
                style={{ padding: 12 }}
              >
                <Text>{item}</Text>
              </View>
            ))}
          </View>
          <Button onPress={addItem} type="outlined">
            Add Item
          </Button>
        </View>
      </Card>
    </View>
  );
}`,
  },
};
