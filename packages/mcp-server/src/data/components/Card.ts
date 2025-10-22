export const Card = {
category: "display",
    description: "Container component for grouping related content with various visual styles",
    props: `
- \`variant\`: 'default' | 'outlined' | 'elevated' | 'filled' - Visual style
- \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
- \`padding\`: 'none' | 'sm' | 'md' | 'lg' - Internal padding
- \`radius\`: 'none' | 'sm' | 'md' | 'lg' - Border radius
- \`clickable\`: boolean - Make card interactive
- \`onPress\`: () => void - Press handler (when clickable)
- \`children\`: ReactNode - Card content
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

<Card variant="elevated" padding="md">
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

<Card variant="default"><Text>Default</Text></Card>
<Card variant="outlined"><Text>Outlined</Text></Card>
<Card variant="elevated"><Text>Elevated</Text></Card>
<Card variant="filled"><Text>Filled</Text></Card>`,
      "with-icons": `import { Card, View, Text, Icon } from '@idealyst/components';

<Card variant="outlined">
  <View spacing="sm">
    <Icon name="information" size="lg" />
    <Text>Card with icon header</Text>
  </View>
</Card>`,
      interactive: `import { Card, Text } from '@idealyst/components';

<Card
  clickable
  onPress={() => console.log('Card clicked')}
  variant="outlined"
>
  <Text>Click this card</Text>
</Card>`,
    }
};
