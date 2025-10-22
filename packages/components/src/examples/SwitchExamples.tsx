import React, { useState } from 'react';
import { Screen, View, Text } from '@idealyst/components';
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
  const [iconChecked, setIconChecked] = useState({
    basic: false,
    notifications: true,
    visibility: false,
    volume: true,
    wifi: false,
  });

  return (
    <Screen background="primary" padding="lg">
    <View spacing="lg">
      <Text size="xl" weight="bold">Switch Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic Switch</Text>
        <Switch
          checked={basicChecked}
          onCheckedChange={setBasicChecked}
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">With Label</Text>
        <Switch
          checked={labelledChecked}
          onCheckedChange={setLabelledChecked}
          label="Enable notifications"
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Label Position</Text>
        <Switch
          checked={labelledChecked}
          onCheckedChange={setLabelledChecked}
          label="Left label"
          labelPosition="left"
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <Switch
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            size="sm"
            label="Small"
          />
          <Switch
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            size="md"
            label="Medium (default)"
          />
          <Switch
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            size="lg"
            label="Large"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Intent Colors</Text>
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
        <Text size="lg" weight="semibold">With Icons</Text>
        <View spacing="sm">
          <Switch
            checked={iconChecked.basic}
            onCheckedChange={(checked) => setIconChecked(prev => ({ ...prev, basic: checked }))}
            enabledIcon="check"
            disabledIcon="close"
            label="On/Off"
          />
          <Switch
            checked={iconChecked.notifications}
            onCheckedChange={(checked) => setIconChecked(prev => ({ ...prev, notifications: checked }))}
            enabledIcon="bell"
            disabledIcon="bell-off"
            intent="success"
            label="Notifications"
          />
          <Switch
            checked={iconChecked.visibility}
            onCheckedChange={(checked) => setIconChecked(prev => ({ ...prev, visibility: checked }))}
            enabledIcon="eye"
            disabledIcon="eye-off"
            intent="primary"
            label="Visibility"
          />
          <Switch
            checked={iconChecked.volume}
            onCheckedChange={(checked) => setIconChecked(prev => ({ ...prev, volume: checked }))}
            enabledIcon="volume-high"
            disabledIcon="volume-off"
            intent="warning"
            label="Sound"
            size="lg"
          />
          <Switch
            checked={iconChecked.wifi}
            onCheckedChange={(checked) => setIconChecked(prev => ({ ...prev, wifi: checked }))}
            enabledIcon="wifi"
            disabledIcon="wifi-off"
            intent="error"
            label="WiFi Connection"
            size="sm"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Disabled States</Text>
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
    </Screen>
  );
};

export default SwitchExamples;