export const Screen = {
  category: "layout",
  description: "Full-screen container component with background variants, padding, and safe area support",
  props: `
- \`children\`: ReactNode - Content to display inside the screen
- \`background\`: 'primary' | 'secondary' | 'tertiary' | 'inverse' - Background color variant
- \`padding\`: 'none' | 'sm' | 'md' | 'lg' | 'xl' - Screen padding variant
- \`safeArea\`: boolean - Apply safe area padding for mobile devices
- \`style\`: any - Additional custom styles
- \`testID\`: string - Test identifier
- \`scrollable\`: boolean - Make content scrollable
`,
  features: [
    "Four background color variants",
    "Five padding options",
    "Safe area support for notches/home indicators",
    "Optional scrollable content",
    "Full-screen container",
    "Cross-platform support",
  ],
  bestPractices: [
    "Use as root container for app screens",
    "Enable safeArea for mobile apps",
    "Use 'primary' background for main content",
    "Use 'inverse' background for dark mode or special screens",
    "Combine with View for internal spacing",
    "Enable scrollable for long content",
  ],
  usage: `
import { Screen, View, Text } from '@idealyst/components';

<Screen background="primary" padding="md" safeArea>
  <View spacing="lg">
    <Text size="xlarge" weight="bold">Screen Title</Text>
    <Text>Screen content goes here</Text>
  </View>
</Screen>
`,
  examples: {
    basic: `import { Screen, Text } from '@idealyst/components';

<Screen background="primary" padding="md">
  <Text>Basic screen content</Text>
</Screen>`,

    variants: `import { Screen, Text } from '@idealyst/components';

// Different backgrounds
<Screen background="primary"><Text>Primary</Text></Screen>
<Screen background="secondary"><Text>Secondary</Text></Screen>
<Screen background="tertiary"><Text>Tertiary</Text></Screen>
<Screen background="inverse"><Text>Inverse</Text></Screen>`,

    "with-icons": `import { Screen, View, Icon, Text } from '@idealyst/components';

<Screen background="primary" padding="lg" safeArea>
  <View spacing="md">
    <View style={{ alignItems: 'center' }}>
      <Icon name="check-circle" size="xl" color="success" />
    </View>
    <Text align="center" size="xlarge" weight="bold">
      Success!
    </Text>
    <Text align="center">
      Your action was completed successfully
    </Text>
  </View>
</Screen>`,

    interactive: `import { Screen, View, Text, Button } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Screen
      background={darkMode ? 'inverse' : 'primary'}
      padding="md"
      safeArea
      scrollable
    >
      <View spacing="lg">
        <Text size="xlarge" weight="bold">
          Settings
        </Text>
        <Button
          onPress={() => setDarkMode(!darkMode)}
          variant="outlined"
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </Button>
        <Text>
          Current theme: {darkMode ? 'Dark' : 'Light'}
        </Text>
      </View>
    </Screen>
  );
}`,
  },
};
