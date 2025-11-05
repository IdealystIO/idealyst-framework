export const Pressable = {
  category: "utility",
  description: "Wrapper component that detects various press interactions on children",
      props: `
- \`children\`: React.ReactNode - Content to render inside the pressable area
- \`onPress\`: function - Called when the press gesture is activated
- \`onPressIn\`: function - Called when the press gesture starts
- \`onPressOut\`: function - Called when the press gesture ends
- \`disabled\`: boolean - Whether the pressable is disabled
`,
  features: [
    "Press, press-in, press-out callbacks",
    "Disabled state",
    "Accessibility support",
    "Custom styling",
    "Cross-platform support",
    "Touch feedback",
  ],
  bestPractices: [
    "Use for custom interactive elements",
    "Prefer Button for standard button interactions",
    "Provide accessibilityLabel for screen readers",
    "Use accessibilityRole for semantic meaning",
    "Add visual feedback on press",
    "Ensure minimum 44x44px touch target",
  ],
  usage: `
import { Pressable, Text, View } from '@idealyst/components';

<Pressable onPress={() => console.log('Pressed')}>
  <View style={{ padding: 16, backgroundColor: '#f0f0f0' }}>
    <Text>Press me</Text>
  </View>
</Pressable>
`,
  examples: {
    basic: `import { Pressable, Text } from '@idealyst/components';

<Pressable onPress={() => console.log('Pressed')}>
  <Text>Tap here</Text>
</Pressable>`,

    variants: `import { Pressable, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View
        style={{
          padding: 16,
          backgroundColor: pressed ? '#e0e0e0' : '#f5f5f5',
          borderRadius: 8,
        }}
      >
        <Text>{pressed ? 'Pressing...' : 'Press me'}</Text>
      </View>
    </Pressable>
  );
}`,

    "with-icons": `import { Pressable, View, Icon, Text } from '@idealyst/components';

<Pressable
  onPress={() => handleAction()}
  accessibilityLabel="Perform action"
  accessibilityRole="button"
>
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
    }}
  >
    <Icon name="star" size="md" color="primary" />
    <Text>Custom Button</Text>
  </View>
</Pressable>`,

    interactive: `import { Pressable, View, Text, Icon } from '@idealyst/components';
import { useState } from 'react';

function CustomCard() {
  const [selected, setSelected] = useState(false);

  return (
    <Pressable
      onPress={() => setSelected(!selected)}
      accessibilityLabel="Toggle selection"
    >
      <View
        style={{
          padding: 16,
          backgroundColor: selected ? '#e3f2fd' : '#fff',
          borderWidth: 2,
          borderColor: selected ? '#2196f3' : '#e0e0e0',
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View spacing="xs">
            <Text weight="bold">Custom Card</Text>
            <Text size="sm">Tap to {selected ? 'deselect' : 'select'}</Text>
          </View>
          {selected && (
            <Icon name="check-circle" size="lg" color="primary" />
          )}
        </View>
      </View>
    </Pressable>
  );
}`,
  },
};
