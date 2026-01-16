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
      <View gap="lg">
        <Text typography="h3">RadioButton Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic RadioGroup</Text>
        <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
          <RadioButton value="option1" label="Option 1" />
          <RadioButton value="option2" label="Option 2" />
          <RadioButton value="option3" label="Option 3" />
        </RadioGroup>
        <Text typography="caption" color="secondary">Selected: {selectedValue}</Text>
      </View>

      <View gap="md">
        <Text typography="h5">Horizontal RadioGroup</Text>
        <RadioGroup
          value={selectedColor}
          onValueChange={setSelectedColor}
          orientation="horizontal"
        >
          <RadioButton value="red" label="Red" />
          <RadioButton value="green" label="Green" />
          <RadioButton value="blue" label="Blue" />
        </RadioGroup>
        <Text typography="caption" color="secondary">Selected: {selectedColor}</Text>
      </View>

      <View gap="md">
        <Text typography="h5">With Disabled Options</Text>
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
          <RadioButton value="sm" label="Small" />
          <RadioButton value="md" label="Medium" />
          <RadioButton value="lg" label="Large" disabled />
          <RadioButton value="xl" label="Extra Large" />
        </RadioGroup>
      </View>

      <View gap="md">
        <Text typography="h5">Disabled Group</Text>
        <RadioGroup value="option1" disabled>
          <RadioButton value="option1" label="Option A" />
          <RadioButton value="option2" label="Option B" />
          <RadioButton value="option3" label="Option C" />
        </RadioGroup>
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm">
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

      <View gap="md">
        <Text typography="h5">Intents</Text>
        <View gap="sm">
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
            value="danger"
            label="Danger"
            intent="danger"
            checked={selectedIntent === 'danger'}
            onPress={() => setSelectedIntent('danger')}
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

      <View gap="md">
        <Text typography="h5">Standalone RadioButtons</Text>
        <View gap="sm">
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