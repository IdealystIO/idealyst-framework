export const Divider = {
  category: "layout",
  description: "Visual separator for content sections with horizontal or vertical orientation",
  props: `
- \`orientation\`: 'horizontal' | 'vertical' - The orientation of the divider
- \`variant\`: 'solid' | 'dashed' | 'dotted' - The visual style
- \`thickness\`: 'thin' | 'medium' | 'thick' - The thickness of the divider
- \`intent\`: IntentVariant - The color intent
- \`length\`: 'full' | 'auto' | number - The length (percentage or fixed)
- \`spacing\`: 'none' | 'small' | 'medium' | 'large' - Spacing around divider
- \`children\`: ReactNode - Content in center (horizontal dividers)
- \`style\`: any - Additional custom styles
- \`testID\`: string - Test identifier
- \`accessibilityLabel\`: string - Accessibility label
`,
  features: [
    "Horizontal and vertical orientations",
    "Three line styles (solid, dashed, dotted)",
    "Three thickness options",
    "Configurable spacing",
    "Text content in center (horizontal)",
    "Intent-based colors",
  ],
  bestPractices: [
    "Use horizontal dividers to separate vertical content",
    "Use vertical dividers in horizontal layouts (toolbars, menus)",
    "Keep divider thickness subtle unless emphasizing separation",
    "Use 'medium' spacing for standard content separation",
    "Add text content sparingly for important section breaks",
  ],
  usage: `
import { Divider, View, Text } from '@idealyst/components';

<View spacing="md">
  <Text>Content above</Text>
  <Divider spacing="medium" />
  <Text>Content below</Text>
</View>
`,
  examples: {
    basic: `import { Divider } from '@idealyst/components';

<Divider />`,

    variants: `import { Divider, View } from '@idealyst/components';

<View spacing="md">
  <Divider variant="solid" />
  <Divider variant="dashed" />
  <Divider variant="dotted" />
</View>`,

    "with-icons": `import { Divider, View, Text } from '@idealyst/components';

<View spacing="lg">
  <Text>Section 1</Text>
  <Divider spacing="medium">
    <Text size="small" color="secondary">OR</Text>
  </Divider>
  <Text>Section 2</Text>
</View>`,

    interactive: `import { Divider, View, Text } from '@idealyst/components';

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
  <Text>Left</Text>
  <Divider orientation="vertical" thickness="medium" style={{ height: 40 }} />
  <Text>Center</Text>
  <Divider orientation="vertical" thickness="medium" style={{ height: 40 }} />
  <Text>Right</Text>
</View>`,
  },
};
