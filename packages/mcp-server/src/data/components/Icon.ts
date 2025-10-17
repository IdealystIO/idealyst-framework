export const Icon = {
  category: "display",
  description: "Material Design icon display component with size and color variants",
  props: `
- \`name\`: IconName - The name of the Material Design icon
- \`size\`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number - Icon size variant or custom number
- \`color\`: DisplayColorVariant - Predefined theme color variant
- \`style\`: any - Additional custom styles
- \`testID\`: string - Test identifier
- \`accessibilityLabel\`: string - Accessibility label for screen readers
`,
  features: [
    "Material Design Icons library",
    "Five predefined sizes plus custom numeric size",
    "Theme color variants",
    "Custom color support",
    "Accessible with labels",
    "Cross-platform support",
  ],
  bestPractices: [
    "Use semantic icon names that clearly convey meaning",
    "Provide accessibilityLabel for screen readers",
    "Use theme color variants for consistency",
    "Match icon size to surrounding text size",
    "Don't rely solely on icons - provide text labels when possible",
  ],
  usage: `
import { Icon } from '@idealyst/components';

<Icon name="home" size="md" color="primary" />
`,
  examples: {
    basic: `import { Icon } from '@idealyst/components';

<Icon name="star" size="md" />`,

    variants: `import { Icon, View } from '@idealyst/components';

<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
  <Icon name="check" size="xs" />
  <Icon name="check" size="sm" />
  <Icon name="check" size="md" />
  <Icon name="check" size="lg" />
  <Icon name="check" size="xl" />
</View>`,

    "with-icons": `import { Icon, View, Text } from '@idealyst/components';

<View spacing="sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Icon name="information" size="md" color="primary" />
  <Text>Informational message with icon</Text>
</View>`,

    interactive: `import { Icon, Button, View } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [favorited, setFavorited] = useState(false);

  return (
    <Button
      icon={favorited ? 'heart' : 'heart-outline'}
      intent={favorited ? 'error' : 'neutral'}
      variant="text"
      onPress={() => setFavorited(!favorited)}
    >
      {favorited ? 'Favorited' : 'Favorite'}
    </Button>
  );
}`,
  },
};
