export const RadioButton = {
  category: "form",
  description: "Radio button with margin variants for single-choice selection within a group",
      props: `
- \`value\`: string - The value of this radio button option
- \`checked\`: boolean - Whether this radio button is selected
- \`onPress\`: function - Called when the radio button is pressed
- \`disabled\`: boolean - Whether the radio button is disabled
- \`label\`: string - Label text to display next to the radio button
- \`size\`: RadioButtonSizeVariant - The size variant of the radio button
- \`intent\`: RadioButtonIntentVariant - The intent/color scheme of the radio button
- \`margin\`: Size - Margin on all sides ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
`,
  features: [
    "Single selection within group",
    "Horizontal and vertical layouts",
    "Label support",
    "Three sizes",
    "Five intent colors",
    "Disabled state (individual or group)",
    "Controlled component",
  ],
  bestPractices: [
    "Use RadioGroup to manage selection state",
    "Always provide labels for accessibility",
    "Use for mutually exclusive options (3-5 choices)",
    "For 2 options, consider Switch or Checkbox",
    "For many options (>5), consider Select",
    "Group related options visually",
  ],
  usage: `
import { RadioGroup, RadioButton } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [value, setValue] = useState('option1');

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <RadioButton value="option1" label="Option 1" />
      <RadioButton value="option2" label="Option 2" />
      <RadioButton value="option3" label="Option 3" />
    </RadioGroup>
  );
}
`,
  examples: {
    basic: `import { RadioGroup, RadioButton } from '@idealyst/components';

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioButton value="a" label="Choice A" />
  <RadioButton value="b" label="Choice B" />
</RadioGroup>`,

    variants: `import { RadioGroup, RadioButton, View } from '@idealyst/components';

<View spacing="md">
  {/* Vertical (default) */}
  <RadioGroup value={value} onValueChange={setValue}>
    <RadioButton value="1" label="Option 1" />
    <RadioButton value="2" label="Option 2" />
  </RadioGroup>

  {/* Horizontal */}
  <RadioGroup value={value} onValueChange={setValue} orientation="horizontal">
    <RadioButton value="1" label="Small" size="sm" />
    <RadioButton value="2" label="Medium" size="md" />
    <RadioButton value="3" label="Large" size="lg" />
  </RadioGroup>
</View>`,

    "with-icons": `import { RadioGroup, RadioButton } from '@idealyst/components';

<RadioGroup value={plan} onValueChange={setPlan}>
  <RadioButton
    value="free"
    label="Free Plan"
    intent="neutral"
  />
  <RadioButton
    value="pro"
    label="Pro Plan"
    intent="primary"
  />
  <RadioButton
    value="enterprise"
    label="Enterprise Plan"
    intent="success"
  />
</RadioGroup>`,

    interactive: `import { RadioGroup, RadioButton, View, Text, Card } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [shipping, setShipping] = useState('standard');

  const options = [
    { value: 'standard', label: 'Standard (5-7 days)', price: 'Free' },
    { value: 'express', label: 'Express (2-3 days)', price: '$10' },
    { value: 'overnight', label: 'Overnight', price: '$25' },
  ];

  return (
    <View spacing="md">
      <Text weight="bold">Select Shipping Method</Text>
      <RadioGroup value={shipping} onValueChange={setShipping}>
        {options.map((option) => (
          <Card
            key={option.value}
            type={shipping === option.value ? 'outlined' : 'elevated'}
            padding="sm"
            clickable
            onPress={() => setShipping(option.value)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <RadioButton
                value={option.value}
                label={option.label}
                checked={shipping === option.value}
              />
              <Text weight="bold">{option.price}</Text>
            </View>
          </Card>
        ))}
      </RadioGroup>
    </View>
  );
}`,
  },
};
