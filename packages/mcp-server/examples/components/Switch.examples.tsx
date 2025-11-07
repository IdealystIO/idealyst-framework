/**
 * Switch Component Examples
 *
 * These examples are type-checked against the actual SwitchProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Switch, View, Text } from '@idealyst/components';

// Example 1: Basic Switch
export function BasicSwitch() {
  const [checked, setChecked] = React.useState(false);

  return (
    <Switch checked={checked} onCheckedChange={setChecked} />
  );
}

// Example 2: Switch Sizes
export function SwitchSizes() {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <Switch checked={checked} onCheckedChange={setChecked} size="xs" />
      <Switch checked={checked} onCheckedChange={setChecked} size="sm" />
      <Switch checked={checked} onCheckedChange={setChecked} size="md" />
      <Switch checked={checked} onCheckedChange={setChecked} size="lg" />
      <Switch checked={checked} onCheckedChange={setChecked} size="xl" />
    </>
  );
}

// Example 3: Switch Intents
export function SwitchIntents() {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <Switch checked={checked} onCheckedChange={setChecked} intent="primary" />
      <Switch checked={checked} onCheckedChange={setChecked} intent="success" />
      <Switch checked={checked} onCheckedChange={setChecked} intent="error" />
      <Switch checked={checked} onCheckedChange={setChecked} intent="warning" />
      <Switch checked={checked} onCheckedChange={setChecked} intent="info" />
    </>
  );
}

// Example 4: Disabled Switch
export function DisabledSwitch() {
  return (
    <>
      <Switch checked={false} onCheckedChange={() => {}} disabled />
      <Switch checked={true} onCheckedChange={() => {}} disabled />
    </>
  );
}

// Example 5: Switch with Label
export function SwitchWithLabel() {
  const [checked, setChecked] = React.useState(false);

  return (
    <View spacing="sm" style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Switch checked={checked} onCheckedChange={setChecked} />
      <Text>Enable notifications</Text>
    </View>
  );
}

// Example 6: Form with Switches
export function FormWithSwitches() {
  const [notifications, setNotifications] = React.useState(true);
  const [emailUpdates, setEmailUpdates] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <View spacing="md">
      <View spacing="sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Push Notifications</Text>
        <Switch checked={notifications} onCheckedChange={setNotifications} />
      </View>
      <View spacing="sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Email Updates</Text>
        <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
      </View>
      <View spacing="sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Dark Mode</Text>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </View>
    </View>
  );
}
