export const Divider = {
  category: "layout",
  description: "Visual separator for content sections with horizontal or vertical orientation",
      props: `
- \`orientation\`: DividerOrientationVariant - The orientation of the divider
- \`type\`: DividerType - The visual style type of the divider
- \`thickness\`: DividerThicknessVariant - The thickness of the divider
- \`intent\`: DividerIntentVariant - The color intent of the divider
- \`length\`: DividerLengthVariant - The length of the divider (percentage or fixed)
- \`spacing\`: DividerSpacingVariant - Spacing around the divider
- \`children\`: React.ReactNode - Content to display in the center of the divider (for horizontal dividers)
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
    "Use 'md' spacing for standard content separation",
    "Add text content sparingly for important section breaks",
  ],
  usage: `
import { Divider, View, Text } from '@idealyst/components';

<View spacing="md">
  <Text>Content above</Text>
  <Divider spacing="md" />
  <Text>Content below</Text>
</View>
`,
  examples: {
    basic: `import { Divider } from '@idealyst/components';

<Divider />`,

    variants: `import { Divider, View } from '@idealyst/components';

<View spacing="md">
  <Divider type="solid" />
  <Divider type="dashed" />
  <Divider type="dotted" />
</View>`,

    "with-icons": `import { Divider, View, Text } from '@idealyst/components';

<View spacing="lg">
  <Text>Section 1</Text>
  <Divider spacing="md">
    <Text size="sm" color="secondary">OR</Text>
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
