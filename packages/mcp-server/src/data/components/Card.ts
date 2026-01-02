export const Card = {
category: "display",
    description: "Container component for grouping related content with spacing variants and visual styles",
        props: `
- \`children\`: React.ReactNode - The content to display inside the card
- \`type\`: CardType - The visual style variant of the card
- \`gap\`: Size - Space between children ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`padding\`: Size - Padding on all sides ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`paddingVertical\`: Size - Top and bottom padding
- \`paddingHorizontal\`: Size - Left and right padding
- \`margin\`: Size - Margin on all sides
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
- \`radius\`: CardRadiusVariant - The border radius of the card
- \`intent\`: CardIntentVariant - The intent/color scheme of the card
- \`clickable\`: boolean - Whether the card is clickable
- \`onPress\`: function - Called when the card is pressed (if clickable)
- \`disabled\`: boolean - Whether the card is disabled
`,
    features: [
      "Four visual variants",
      "Intent-based color schemes",
      "Gap variant for spacing between children",
      "Padding variants (uniform and directional)",
      "Margin variants (uniform and directional)",
      "Configurable border radius",
      "Clickable with press handler",
      "Flexible content container",
    ],
    bestPractices: [
      "Use 'elevated' variant for prominent content",
      "Group related content within cards",
      "Use gap prop for spacing between children",
      "Use padding prop for consistent internal spacing",
      "Make cards clickable only when they represent an action",
    ],
    usage: `
import { Card, Text } from '@idealyst/components';

<Card type="elevated" padding="md" gap="sm">
  <Text weight="bold">Card Title</Text>
  <Text size="sm">Card content goes here</Text>
</Card>
`,
    examples: {
      basic: `import { Card, Text } from '@idealyst/components';

<Card padding="md">
  <Text>Simple card content</Text>
</Card>`,
      variants: `import { Card, Text } from '@idealyst/components';

<Card type="default" padding="md"><Text>Default</Text></Card>
<Card type="outlined" padding="md"><Text>Outlined</Text></Card>
<Card type="elevated" padding="md"><Text>Elevated</Text></Card>
<Card type="filled" padding="md"><Text>Filled</Text></Card>`,
      "with-icons": `import { Card, View, Text, Icon } from '@idealyst/components';

<Card type="outlined" padding="md" gap="sm">
  <Icon name="information" size="lg" />
  <Text>Card with icon header</Text>
</Card>`,
      interactive: `import { Card, Text } from '@idealyst/components';

<Card
  clickable
  onPress={() => console.log('Card clicked')}
  type="outlined"
  padding="md"
>
  <Text>Click this card</Text>
</Card>`,
    }
};
