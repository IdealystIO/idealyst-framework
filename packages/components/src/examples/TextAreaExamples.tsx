import React, { useState } from 'react';
import { View, Text } from '@idealyst/components';
import TextArea from '../TextArea';

export const TextAreaExamples: React.FC = () => {
  const [basicValue, setBasicValue] = useState('');
  const [limitedValue, setLimitedValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [autoGrowValue, setAutoGrowValue] = useState('');

  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">TextArea Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic TextArea</Text>
        <TextArea
          value={basicValue}
          onChange={setBasicValue}
          placeholder="Enter your text here..."
          rows={4}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Auto-Growing TextArea</Text>
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

      <View spacing="md">
        <Text size="large" weight="semibold">With Label</Text>
        <TextArea
          label="Description"
          value={basicValue}
          onChange={setBasicValue}
          placeholder="Enter description..."
          helperText="Provide a detailed description"
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <TextArea
            size="small"
            placeholder="Small textarea"
            rows={3}
          />
          <TextArea
            size="medium"
            placeholder="Medium textarea (default)"
            rows={3}
          />
          <TextArea
            size="large"
            placeholder="Large textarea"
            rows={3}
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent Colors</Text>
        <View spacing="sm">
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

      <View spacing="md">
        <Text size="large" weight="semibold">With Character Limit</Text>
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

      <View spacing="md">
        <Text size="large" weight="semibold">Error State</Text>
        <TextArea
          label="Required Field"
          value={errorValue}
          onChange={setErrorValue}
          placeholder="This field is required"
          error="This field cannot be empty"
          rows={3}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Resize Options</Text>
        <View spacing="sm">
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

      <View spacing="md">
        <Text size="large" weight="semibold">Custom Styling</Text>
        <TextArea
          label="Monospace Font"
          placeholder="Code or monospace text..."
          textareaStyle={{ fontFamily: 'monospace' }}
          rows={4}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled State</Text>
        <TextArea
          label="Disabled"
          value="This textarea is disabled"
          disabled
          rows={3}
        />
      </View>
    </View>
  );
};

export default TextAreaExamples;
