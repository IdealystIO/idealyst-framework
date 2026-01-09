export const Text = {
  category: "typography",
  description: "Styled text component with typography variants, weight, color, and spacing options",
      props: `
- \`children\`: React.ReactNode - The text content to display
- \`typography\`: Typography - The typography variant (h1, h2, h3, h4, h5, h6, body1, body2, caption). Sets fontSize, lineHeight, and fontWeight automatically.
- \`weight\`: TextWeightVariant - Override the weight ('light' | 'normal' | 'medium' | 'semibold' | 'bold')
- \`color\`: TextColorVariant - The color of the text (theme text colors)
- \`align\`: TextAlignVariant - Text alignment ('left' | 'center' | 'right')
- \`gap\`: Size - Space between nested elements ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`padding\`: Size - Padding on all sides
- \`paddingVertical\`: Size - Top and bottom padding
- \`paddingHorizontal\`: Size - Left and right padding
`,
  features: [
    "Semantic typography variants (headings h1-h6, body1, body2, caption)",
    "Typography automatically sets fontSize, lineHeight, fontWeight",
    "Weight can be overridden independently",
    "Theme color variants",
    "Three alignment options",
    "Gap variant for nested elements",
    "Padding variants (uniform and directional)",
    "Cross-platform support",
    "Inherits parent text styles",
  ],
  bestPractices: [
    "Use semantic typography variants (h1-h6 for headings, body1/body2 for content, caption for small text)",
    "Override weight only when needed - typography variants include sensible defaults",
    "Prefer theme colors over custom colors",
    "Use 'left' alignment for body text",
    "Use 'center' for short, important text",
    "Use padding prop for text blocks that need internal spacing",
    "Nest Text components for mixed styles",
  ],
  usage: `
import { Text } from '@idealyst/components';

<Text typography="h1" color="primary">
  Main Heading
</Text>

<Text typography="body1" color="secondary">
  Body text with normal weight
</Text>

<Text typography="caption" color="tertiary">
  Small caption text
</Text>
`,
  examples: {
    basic: `import { Text } from '@idealyst/components';

<Text>Simple text content</Text>`,

    variants: `import { Text, View } from '@idealyst/components';

<View spacing="md">
  <Text typography="h1">Heading 1</Text>
  <Text typography="h2">Heading 2</Text>
  <Text typography="h3">Heading 3</Text>
  <Text typography="body1">Body text (default)</Text>
  <Text typography="body2">Smaller body text</Text>
  <Text typography="caption">Caption text</Text>
</View>`,

    "with-icons": `import { Text, View, Icon } from '@idealyst/components';

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Icon name="check-circle" color="success" />
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
      <Text typography="h2" weight="bold" align="center">
        Counter: {count}
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        <Button onPress={() => setCount(count - 1)}>-</Button>
        <Button onPress={() => setCount(count + 1)}>+</Button>
      </View>

      <Text typography="body2" color="secondary" align="center">
        Click buttons to change the count
      </Text>
    </View>
  );
}`,
  },
};
