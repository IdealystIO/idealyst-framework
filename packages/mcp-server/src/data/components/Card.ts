export const Card = {
category: "display",
    description: "Container component for grouping related content with various visual styles",
        props: `
- \`children\`: React.ReactNode - The content to display inside the card
- \`type\`: CardType - The visual style variant of the card
- \`padding\`: CardPaddingVariant - The padding size inside the card
- \`radius\`: CardRadiusVariant - The border radius of the card
- \`intent\`: CardIntentVariant - The intent/color scheme of the card
- \`clickable\`: boolean - Whether the card is clickable
- \`onPress\`: function - Called when the card is pressed (if clickable)
- \`disabled\`: boolean - Whether the card is disabled
`,
    features: [
      "Four visual variants",
      "Intent-based color schemes",
      "Configurable padding and border radius",
      "Clickable with press handler",
      "Flexible content container",
    ],
    bestPractices: [
      "Use 'elevated' variant for prominent content",
      "Group related content within cards",
      "Use appropriate padding for content density",
      "Make cards clickable only when they represent an action",
    ],
    usage: `
import { Card, Text, View } from '@idealyst/components';

<Card type="elevated" padding="md">
  <View spacing="sm">
    <Text weight="bold">Card Title</Text>
    <Text size="sm">Card content goes here</Text>
  </View>
</Card>
`,
    examples: {
      basic: `import { Card, Text } from '@idealyst/components';

<Card>
  <Text>Simple card content</Text>
</Card>`,
      variants: `import { Card, Text } from '@idealyst/components';

<Card type="default"><Text>Default</Text></Card>
<Card type="outlined"><Text>Outlined</Text></Card>
<Card type="elevated"><Text>Elevated</Text></Card>
<Card type="filled"><Text>Filled</Text></Card>`,
      "with-icons": `import { Card, View, Text, Icon } from '@idealyst/components';

<Card type="outlined">
  <View spacing="sm">
    <Icon name="information" size="lg" />
    <Text>Card with icon header</Text>
  </View>
</Card>`,
      interactive: `import { Card, Text } from '@idealyst/components';

<Card
  clickable
  onPress={() => console.log('Card clicked')}
  type="outlined"
>
  <Text>Click this card</Text>
</Card>`,
    }
};
