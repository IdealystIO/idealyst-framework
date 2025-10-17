export const Text = {
  category: "typography",
  description: "Styled text component with size, weight, and color variants",
  props: `
- \`children\`: ReactNode - The text content to display
- \`size\`: 'small' | 'medium' | 'large' | 'xlarge' - Text size variant
- \`weight\`: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' - Font weight
- \`color\`: DisplayColorVariant - Text color from theme
- \`align\`: 'left' | 'center' | 'right' - Text alignment
- \`style\`: any - Additional custom styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Four size variants",
    "Five weight options",
    "Theme color variants",
    "Three alignment options",
    "Cross-platform support",
    "Inherits parent text styles",
  ],
  bestPractices: [
    "Use semantic sizes (xlarge for headings, small for captions)",
    "Use appropriate weights for hierarchy",
    "Prefer theme colors over custom colors",
    "Use 'left' alignment for body text",
    "Use 'center' for short, important text",
    "Nest Text components for mixed styles",
  ],
  usage: `
import { Text } from '@idealyst/components';

<Text size="xlarge" weight="bold" color="primary">
  Heading Text
</Text>

<Text size="medium" color="secondary">
  Body text with normal weight
</Text>
`,
  examples: {
    basic: `import { Text } from '@idealyst/components';

<Text>Simple text content</Text>`,

    variants: `import { Text, View } from '@idealyst/components';

<View spacing="md">
  <Text size="small">Small text</Text>
  <Text size="medium">Medium text</Text>
  <Text size="large">Large text</Text>
  <Text size="xlarge">Extra large text</Text>
</View>`,

    "with-icons": `import { Text, View, Icon } from '@idealyst/components';

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Icon name="check-circle" size="md" color="success" />
  <Text color="success" weight="medium">
    Verified Account
  </Text>
</View>`,

    interactive: `import { Text, View, Button } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <View spacing="md">
      <Text size="xlarge" weight="bold" align="center">
        Counter: {count}
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        <Button onPress={() => setCount(count - 1)}>-</Button>
        <Button onPress={() => setCount(count + 1)}>+</Button>
      </View>

      <Text size="small" color="secondary" align="center">
        Click buttons to change the count
      </Text>
    </View>
  );
}`,
  },
};
