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
    <View gap="lg">
      <Text typography="h3">Switch Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic Switch</Text>
        <Switch
          checked={basicChecked}
          onChange={setBasicChecked}
        />
      </View>

      <View gap="md">
        <Text typography="h5">With Label</Text>
        <Switch
          checked={labelledChecked}
          onChange={setLabelledChecked}
          label="Enable notifications"
        />
      </View>

      <View gap="md">
        <Text typography="h5">Label Position</Text>
        <Switch
          checked={labelledChecked}
          onChange={setLabelledChecked}
          label="Left label"
          labelPosition="left"
        />
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm">
          <Switch
            checked={basicChecked}
            onChange={setBasicChecked}
            size="sm"
            label="Small"
          />
          <Switch
            checked={basicChecked}
            onChange={setBasicChecked}
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

      <View gap="md">
        <Text typography="h5">Intent Colors</Text>
        <View gap="sm">
          <Switch
            checked={intentChecked.primary}
            onChange={(checked) => setIntentChecked(prev => ({ ...prev, primary: checked }))}
            intent="primary"
            label="Primary"
          />
          <Switch
            checked={intentChecked.success}
            onChange={(checked) => setIntentChecked(prev => ({ ...prev, success: checked }))}
            intent="success"
            label="Success"
          />
          <Switch
            checked={intentChecked.error}
            onChange={(checked) => setIntentChecked(prev => ({ ...prev, error: checked }))}
            intent="danger"
            label="Error"
          />
          <Switch
            checked={intentChecked.warning}
            onChange={(checked) => setIntentChecked(prev => ({ ...prev, warning: checked }))}
            intent="warning"
            label="Warning"
          />
          <Switch
            checked={intentChecked.neutral}
            onChange={(checked) => setIntentChecked(prev => ({ ...prev, neutral: checked }))}
            intent="neutral"
            label="Neutral"
          />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">With Icons</Text>
        <View gap="sm">
          <Switch
            checked={iconChecked.basic}
            onChange={(checked) => setIconChecked(prev => ({ ...prev, basic: checked }))}
            onIcon="check"
            offIcon="close"
            label="On/Off"
          />
          <Switch
            checked={iconChecked.notifications}
            onChange={(checked) => setIconChecked(prev => ({ ...prev, notifications: checked }))}
            onIcon="bell"
            offIcon="bell-off"
            intent="success"
            label="Notifications"
          />
          <Switch
            checked={iconChecked.visibility}
            onChange={(checked) => setIconChecked(prev => ({ ...prev, visibility: checked }))}
            onIcon="eye"
            offIcon="eye-off"
            intent="primary"
            label="Visibility"
          />
          <Switch
            checked={iconChecked.volume}
            onChange={(checked) => setIconChecked(prev => ({ ...prev, volume: checked }))}
            onIcon="volume-high"
            offIcon="volume-off"
            intent="warning"
            label="Sound"
            size="lg"
          />
          <Switch
            checked={iconChecked.wifi}
            onCheckedChange={(checked) => setIconChecked(prev => ({ ...prev, wifi: checked }))}
            onIcon="wifi"
            offIcon="wifi-off"
            intent="danger"
            label="WiFi Connection"
            size="sm"
          />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Disabled States</Text>
        <View gap="sm">
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