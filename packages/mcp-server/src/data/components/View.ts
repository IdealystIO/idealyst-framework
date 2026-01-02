export const View = {
  category: "layout",
  description: "Container component with margin, padding, and background variants",
      props: `
- \`children\`: React.ReactNode - The content to display inside the view
- \`marginVariant\`: ViewMarginVariant - Margin variant ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none')
- \`background\`: ViewBackgroundVariant - Background variant (Surface | 'transparent')
- \`radius\`: ViewRadiusVariant - Border radius variant ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none')
- \`border\`: ViewBorderVariant - Border variant ('none' | 'thin' | 'thick')
- \`backgroundColor\`: string - Custom background color (overrides background variant)
- \`padding\`: number - Custom padding
- \`margin\`: number - Custom margin (overrides marginVariant)
- \`borderRadius\`: number - Custom border radius (overrides radius variant)
- \`borderWidth\`: number - Custom border width (overrides border variant)
- \`borderColor\`: string - Custom border color
- \`scrollable\`: boolean - Enable scrollable content (uses ScrollView on native, overflow:auto on web)
- \`testID\`: string - Test ID for testing
`,
  features: [
    "Flexible layout container",
    "Margin variants for consistent spacing",
    "Surface-based background variants",
    "Border radius variants",
    "Border support with thin/thick options",
    "Custom overrides for all variants",
    "Scrollable content support",
    "Flexbox-based layout",
  ],
  bestPractices: [
    "Use View for all layout containers",
    "Use marginVariant for consistent spacing between components",
    "Use style prop with gap for spacing between children",
    "Prefer variants over custom values",
    "Combine with Screen for full-screen layouts",
    "Use background variants for semantic surface colors",
  ],
  usage: `
import { View, Text, Button } from '@idealyst/components';

<View background="surface" radius="md" style={{ padding: 16, gap: 12 }}>
  <Text size="lg" weight="bold">Card Title</Text>
  <Text>Card content with consistent spacing</Text>
  <Button>Action</Button>
</View>
`,
  examples: {
    basic: `import { View, Text } from '@idealyst/components';

<View style={{ gap: 12 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</View>`,

    variants: `import { View, Text } from '@idealyst/components';

<View style={{ gap: 24 }}>
  <View background="surface" radius="sm" style={{ padding: 12, gap: 8 }}>
    <Text>Small padding container</Text>
    <Text>Second item</Text>
  </View>

  <View background="surface" radius="md" style={{ padding: 16, gap: 12 }}>
    <Text>Medium padding container</Text>
    <Text>Second item</Text>
  </View>

  <View background="surface" radius="lg" style={{ padding: 20, gap: 16 }}>
    <Text>Large padding container</Text>
    <Text>Second item</Text>
  </View>
</View>`,

    "with-icons": `import { View, Icon, Text } from '@idealyst/components';

<View
  background="surface"
  radius="md"
  border="thin"
  style={{ padding: 16 }}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <Icon name="information-outline" size="lg" color="primary" />
    <View style={{ flex: 1, gap: 4 }}>
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
    <View style={{ padding: 16, gap: 24 }}>
      <Card type="outlined" padding="md">
        <View style={{ gap: 16 }}>
          <Text weight="bold">Dynamic List</Text>
          <View style={{ gap: 8 }}>
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
