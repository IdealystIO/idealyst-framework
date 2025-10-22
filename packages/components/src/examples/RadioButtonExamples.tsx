import React, { useState } from 'react';
import { Screen, View, Text } from '@idealyst/components';
import { RadioButton, RadioGroup } from '../RadioButton';

export const RadioButtonExamples: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState('option1');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('md');
  const [selectedIntent, setSelectedIntent] = useState('primary');

  return (
    <Screen background="primary" padding="lg">
      <View spacing="lg">
        <Text size="xl" weight="bold">RadioButton Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic RadioGroup</Text>
        <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
          <RadioButton value="option1" label="Option 1" />
          <RadioButton value="option2" label="Option 2" />
          <RadioButton value="option3" label="Option 3" />
        </RadioGroup>
        <Text size="sm" color="secondary">Selected: {selectedValue}</Text>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Horizontal RadioGroup</Text>
        <RadioGroup
          value={selectedColor}
          onValueChange={setSelectedColor}
          orientation="horizontal"
        >
          <RadioButton value="red" label="Red" />
          <RadioButton value="green" label="Green" />
          <RadioButton value="blue" label="Blue" />
        </RadioGroup>
        <Text size="sm" color="secondary">Selected: {selectedColor}</Text>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">With Disabled Options</Text>
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
          <RadioButton value="sm" label="Small" />
          <RadioButton value="md" label="Medium" />
          <RadioButton value="lg" label="Large" disabled />
          <RadioButton value="xl" label="Extra Large" />
        </RadioGroup>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Disabled Group</Text>
        <RadioGroup value="option1" disabled>
          <RadioButton value="option1" label="Option A" />
          <RadioButton value="option2" label="Option B" />
          <RadioButton value="option3" label="Option C" />
        </RadioGroup>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <RadioButton
            value="sm"
            label="Small"
            size="sm"
            checked={selectedSize === 'sm'}
            onPress={() => setSelectedSize('sm')}
          />
          <RadioButton
            value="md"
            label="Medium"
            size="md"
            checked={selectedSize === 'md'}
            onPress={() => setSelectedSize('md')}
          />
          <RadioButton
            value="lg"
            label="Large"
            size="lg"
            checked={selectedSize === 'lg'}
            onPress={() => setSelectedSize('lg')}
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Intents</Text>
        <View spacing="sm">
          <RadioButton
            value="primary"
            label="Primary"
            intent="primary"
            checked={selectedIntent === 'primary'}
            onPress={() => setSelectedIntent('primary')}
          />
          <RadioButton
            value="success"
            label="Success"
            intent="success"
            checked={selectedIntent === 'success'}
            onPress={() => setSelectedIntent('success')}
          />
          <RadioButton
            value="error"
            label="Error"
            intent="error"
            checked={selectedIntent === 'error'}
            onPress={() => setSelectedIntent('error')}
          />
          <RadioButton
            value="warning"
            label="Warning"
            intent="warning"
            checked={selectedIntent === 'warning'}
            onPress={() => setSelectedIntent('warning')}
          />
          <RadioButton
            value="neutral"
            label="Neutral"
            intent="neutral"
            checked={selectedIntent === 'neutral'}
            onPress={() => setSelectedIntent('neutral')}
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Standalone RadioButtons</Text>
        <View spacing="sm">
          <RadioButton
            value="standalone1"
            label="Unchecked"
            checked={false}
            onPress={() => console.log('Pressed')}
          />
          <RadioButton
            value="standalone2"
            label="Checked"
            checked={true}
            onPress={() => console.log('Pressed')}
          />
          <RadioButton
            value="standalone3"
            label="Disabled Unchecked"
            checked={false}
            disabled
          />
          <RadioButton
            value="standalone4"
            label="Disabled Checked"
            checked={true}
            disabled
          />
        </View>
      </View>
      </View>
    </Screen>
  );
};

export default RadioButtonExamples;