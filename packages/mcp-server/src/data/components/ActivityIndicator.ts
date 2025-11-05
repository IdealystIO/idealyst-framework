export const ActivityIndicator = {
  category: "feedback",
  description: "Loading spinner/indicator for showing ongoing processes or loading states",
      props: `
- \`animating\`: boolean - Whether the indicator is animating (visible)
- \`size\`: ActivityIndicatorSizeVariant - The size of the indicator
- \`intent\`: ActivityIndicatorIntentVariant - The color/intent of the indicator
- \`color\`: string - Custom color to override intent
- \`hidesWhenStopped\`: boolean - Whether to hide the indicator when not animating
`,
  features: [
    "Animated loading spinner",
    "Three predefined sizes plus custom numeric size",
    "Five intent colors",
    "Custom color support",
    "Auto-hide when stopped",
    "Cross-platform support",
  ],
  bestPractices: [
    "Use 'primary' intent for general loading states",
    "Use 'sm' size for inline loading indicators",
    "Use 'lg' size for full-screen loading overlays",
    "Always provide context about what is loading",
    "Consider using with overlay for blocking operations",
  ],
  usage: `
import { ActivityIndicator, View, Text } from '@idealyst/components';

<View spacing="md">
  <ActivityIndicator size="lg" intent="primary" />
  <Text>Loading data...</Text>
</View>
`,
  examples: {
    basic: `import { ActivityIndicator } from '@idealyst/components';

<ActivityIndicator />`,

    variants: `import { ActivityIndicator, View } from '@idealyst/components';

<View spacing="md">
  <ActivityIndicator size="sm" />
  <ActivityIndicator size="md" />
  <ActivityIndicator size="lg" />
  <ActivityIndicator size={48} />
</View>`,

    "with-icons": `import { ActivityIndicator, View, Text } from '@idealyst/components';

<View spacing="sm" style={{ alignItems: 'center' }}>
  <ActivityIndicator intent="success" size="lg" />
  <Text>Processing...</Text>
</View>`,

    interactive: `import { ActivityIndicator, Button, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <View spacing="md">
      <Button onPress={handleLoad} disabled={loading}>
        Load Data
      </Button>
      {loading && (
        <View spacing="sm" style={{ alignItems: 'center' }}>
          <ActivityIndicator size="lg" />
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
}`,
  },
};
