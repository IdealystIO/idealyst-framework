import React, { useState } from 'react';
import { View, Text } from '@idealyst/components';
import Switch from '../Switch';

export const SwitchExamples: React.FC = () => {
  const [basicChecked, setBasicChecked] = useState(false);
  const [labelledChecked, setLabelledChecked] = useState(false);
  const [intentChecked, setIntentChecked] = useState({
    primary: false,
    success: false,
    error: false,
    warning: false,
    neutral: false,
  });

  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Switch Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic Switch</Text>
        <Switch
          checked={basicChecked}
          onCheckedChange={setBasicChecked}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Label</Text>
        <Switch
          checked={labelledChecked}
          onCheckedChange={setLabelledChecked}
          label="Enable notifications"
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Label Position</Text>
        <Switch
          checked={labelledChecked}
          onCheckedChange={setLabelledChecked}
          label="Left label"
          labelPosition="left"
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <Switch
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            size="small"
            label="Small"
          />
          <Switch
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            size="medium"
            label="Medium (default)"
          />
          <Switch
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            size="large"
            label="Large"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent Colors</Text>
        <View spacing="sm">
          <Switch
            checked={intentChecked.primary}
            onCheckedChange={(checked) => setIntentChecked(prev => ({ ...prev, primary: checked }))}
            intent="primary"
            label="Primary"
          />
          <Switch
            checked={intentChecked.success}
            onCheckedChange={(checked) => setIntentChecked(prev => ({ ...prev, success: checked }))}
            intent="success"
            label="Success"
          />
          <Switch
            checked={intentChecked.error}
            onCheckedChange={(checked) => setIntentChecked(prev => ({ ...prev, error: checked }))}
            intent="error"
            label="Error"
          />
          <Switch
            checked={intentChecked.warning}
            onCheckedChange={(checked) => setIntentChecked(prev => ({ ...prev, warning: checked }))}
            intent="warning"
            label="Warning"
          />
          <Switch
            checked={intentChecked.neutral}
            onCheckedChange={(checked) => setIntentChecked(prev => ({ ...prev, neutral: checked }))}
            intent="neutral"
            label="Neutral"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled States</Text>
        <View spacing="sm">
          <Switch
            checked={false}
            disabled
            label="Disabled unchecked"
          />
          <Switch
            checked={true}
            disabled
            label="Disabled checked"
          />
        </View>
      </View>
    </View>
  );
};

export default SwitchExamples;