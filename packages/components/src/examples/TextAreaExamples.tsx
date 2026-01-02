import React, { useState } from 'react';
import { Screen, View, Text } from '@idealyst/components';
import TextArea from '../TextArea';

export const TextAreaExamples: React.FC = () => {
  const [basicValue, setBasicValue] = useState('');
  const [limitedValue, setLimitedValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [autoGrowValue, setAutoGrowValue] = useState('');

  return (
    <Screen background="primary" padding="lg">
    <View gap="lg">
      <Text typography="h3">TextArea Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic TextArea</Text>
        <TextArea
          value={basicValue}
          onChange={setBasicValue}
          placeholder="Enter your text here..."
          rows={4}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Auto-Growing TextArea</Text>
        <TextArea
          label="Auto-grow with min/max height"
          value={autoGrowValue}
          onChange={setAutoGrowValue}
          placeholder="Type multiple lines to see auto-grow in action..."
          autoGrow
          minHeight={60}
          maxHeight={200}
          helperText="This textarea grows as you type, up to 200px"
        />
      </View>

      <View gap="md">
        <Text typography="h5">With Label</Text>
        <TextArea
          label="Description"
          value={basicValue}
          onChange={setBasicValue}
          placeholder="Enter description..."
          helperText="Provide a detailed description"
        />
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm">
          <TextArea
            size="sm"
            placeholder="Small textarea"
            rows={3}
          />
          <TextArea
            size="md"
            placeholder="Medium textarea (default)"
            rows={3}
          />
          <TextArea
            size="lg"
            placeholder="Large textarea"
            rows={3}
          />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Intent Colors</Text>
        <View gap="sm">
          <TextArea
            intent="primary"
            placeholder="Primary intent"
            rows={2}
          />
          <TextArea
            intent="success"
            placeholder="Success intent"
            rows={2}
          />
          <TextArea
            intent="warning"
            placeholder="Warning intent"
            rows={2}
          />
          <TextArea
            intent="neutral"
            placeholder="Neutral intent"
            rows={2}
          />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">With Character Limit</Text>
        <TextArea
          label="Limited Input"
          value={limitedValue}
          onChange={setLimitedValue}
          placeholder="Maximum 100 characters"
          maxLength={100}
          showCharacterCount
          rows={3}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Error State</Text>
        <TextArea
          label="Required Field"
          value={errorValue}
          onChange={setErrorValue}
          placeholder="This field is required"
          error="This field cannot be empty"
          rows={3}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Resize Options</Text>
        <View gap="sm">
          <TextArea
            placeholder="Resize: none"
            resize="none"
            rows={2}
          />
          <TextArea
            placeholder="Resize: vertical"
            resize="vertical"
            rows={2}
          />
          <TextArea
            placeholder="Resize: horizontal"
            resize="horizontal"
            rows={2}
          />
          <TextArea
            placeholder="Resize: both"
            resize="both"
            rows={2}
          />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Custom Styling</Text>
        <TextArea
          label="Monospace Font"
          placeholder="Code or monospace text..."
          textareaStyle={{ fontFamily: 'monospace' }}
          rows={4}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Disabled State</Text>
        <TextArea
          label="Disabled"
          value="This textarea is disabled"
          disabled
          rows={3}
        />
      </View>
    </View>
    </Screen>
  );
};

export default TextAreaExamples;
