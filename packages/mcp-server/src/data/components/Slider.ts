export const Slider = {
  category: "form",
  description: "Input slider for selecting numeric values from a range",
  props: `
- \`value\`: number - Current slider value
- \`defaultValue\`: number - Default value (uncontrolled)
- \`min\`: number - Minimum value (default: 0)
- \`max\`: number - Maximum value (default: 100)
- \`step\`: number - Step increment (default: 1)
- \`disabled\`: boolean - Whether slider is disabled
- \`showValue\`: boolean - Show current value label
- \`showMinMax\`: boolean - Show min/max labels
- \`marks\`: SliderMark[] - Custom marks on slider
  - \`value\`: number - Mark position
  - \`label\`: string - Mark label (optional)
- \`intent\`: 'primary' | 'success' | 'error' | 'warning' | 'neutral' - Color scheme
- \`size\`: 'small' | 'medium' | 'large' - Slider size
- \`icon\`: IconName | React.ReactNode - Icon displayed in thumb
- \`onValueChange\`: (value: number) => void - Called during drag
- \`onValueCommit\`: (value: number) => void - Called when drag ends
- \`style\`: ViewStyle - Additional styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Controlled and uncontrolled modes",
    "Min/max value constraints",
    "Step increment",
    "Custom marks",
    "Value display",
    "Min/max labels",
    "Three sizes",
    "Five intent colors",
    "Icon support in thumb",
    "Change and commit callbacks",
  ],
  bestPractices: [
    "Use for continuous numeric values",
    "Show current value for user feedback",
    "Use marks for important values",
    "Set appropriate step size for precision",
    "Use onValueCommit for expensive operations",
    "Provide min/max labels for context",
  ],
  usage: `
import { Slider } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [value, setValue] = useState(50);

  return (
    <Slider
      value={value}
      onValueChange={setValue}
      min={0}
      max={100}
      step={5}
      showValue
      showMinMax
    />
  );
}
`,
  examples: {
    basic: `import { Slider } from '@idealyst/components';

<Slider min={0} max={100} defaultValue={50} />`,

    variants: `import { Slider, View } from '@idealyst/components';

<View spacing="md">
  <Slider size="small" value={25} />
  <Slider size="medium" value={50} />
  <Slider size="large" value={75} />
</View>`,

    "with-icons": `import { Slider, View, Text, Icon } from '@idealyst/components';
import { useState } from 'react';

function VolumeControl() {
  const [volume, setVolume] = useState(50);

  return (
    <View spacing="sm">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Icon name="volume-low" size="md" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          min={0}
          max={100}
          icon="volume-medium"
          style={{ flex: 1 }}
        />
        <Icon name="volume-high" size="md" />
      </View>
      <Text align="center">{volume}%</Text>
    </View>
  );
}

// Brightness control with icon in thumb
function BrightnessControl() {
  const [brightness, setBrightness] = useState(75);

  return (
    <View spacing="sm">
      <Text>Brightness: {brightness}%</Text>
      <Slider
        value={brightness}
        onValueChange={setBrightness}
        min={0}
        max={100}
        icon="brightness-6"
        intent="warning"
        showMinMax
      />
    </View>
  );
}`,

    interactive: `import { Slider, View, Text, Button } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [price, setPrice] = useState(50);

  const marks = [
    { value: 0, label: '$0' },
    { value: 50, label: '$50' },
    { value: 100, label: '$100' },
  ];

  return (
    <View spacing="md">
      <Text weight="bold">Price Range: \${price}</Text>
      <Slider
        value={price}
        onValueChange={setPrice}
        min={0}
        max={100}
        step={5}
        marks={marks}
        showValue
        intent="primary"
      />
      <Button onPress={() => console.log('Filter:', price)}>
        Apply Filter
      </Button>
    </View>
  );
}`,
  },
};
