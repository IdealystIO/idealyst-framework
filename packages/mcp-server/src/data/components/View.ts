export const View = {
  category: "layout",
  description: "Container component with spacing variants (gap, padding, margin) and background variants",
      props: `
- \`children\`: React.ReactNode - The content to display inside the view
- \`gap\`: Size - Space between children ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`padding\`: Size - Padding on all sides ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`paddingVertical\`: Size - Top and bottom padding
- \`paddingHorizontal\`: Size - Left and right padding
- \`margin\`: Size - Margin on all sides ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
- \`background\`: ViewBackgroundVariant - Background variant (Surface | 'transparent')
- \`radius\`: ViewRadiusVariant - Border radius variant ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none')
- \`border\`: ViewBorderVariant - Border variant ('none' | 'thin' | 'thick')
- \`scrollable\`: boolean - Enable scrollable content (uses ScrollView on native, overflow:auto on web)
- \`testID\`: string - Test ID for testing
`,
  features: [
    "Flexible layout container",
    "Gap variant for spacing between children",
    "Padding variants (uniform and directional)",
    "Margin variants (uniform and directional)",
    "Surface-based background variants",
    "Border radius variants",
    "Border support with thin/thick options",
    "Scrollable content support",
    "Flexbox-based layout",
  ],
  bestPractices: [
    "Use View for all layout containers",
    "Use gap prop for consistent spacing between children",
    "Use padding prop instead of style for consistent spacing",
    "Use margin variants for spacing between containers",
    "Prefer Size variants over numeric values",
    "Combine with Screen for full-screen layouts",
    "Use background variants for semantic surface colors",
  ],
  usage: `
import { View, Text, Button } from '@idealyst/components';

<View background="primary" radius="md" padding="md" gap="sm">
  <Text size="lg" weight="bold">Card Title</Text>
  <Text>Card content with consistent spacing</Text>
  <Button>Action</Button>
</View>
`,
  examples: {
    basic: `import { View, Text } from '@idealyst/components';

<View gap="md">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</View>`,

    variants: `import { View, Text } from '@idealyst/components';

<View gap="lg">
  <View radius="sm" padding="sm" gap="xs">
    <Text>Small padding container</Text>
    <Text>Second item</Text>
  </View>

  <View background="secondary" radius="md" padding="md" gap="sm">
    <Text>Medium padding container</Text>
    <Text>Second item</Text>
  </View>

  <View background="inverted" radius="lg" padding="lg" gap="md">
    <Text>Large padding container</Text>
    <Text color="inverted">Second item</Text>
  </View>
</View>`,

    "with-icons": `import { View, Icon, Text } from '@idealyst/components';

<View
  background="tertiary"
  radius="md"
  border="thin"
  padding="md"
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }} gap="sm">
    <Icon name="information-outline" size="lg" color="primary" />
    <View style={{ flex: 1 }} gap="xs">
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
    <View padding="md" gap="lg">
      <Card type="outlined" padding="md">
        <View gap="md">
          <Text weight="bold">Dynamic List</Text>
          <View gap="sm">
            {items.map((item, index) => (
              <View
                key={index}
                background="primary"
                radius="sm"
                padding="sm"
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
