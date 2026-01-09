import React from 'react';
import { View, Text, Alert, Screen } from '@idealyst/components';
import { ComponentPlayground, alertPropConfig } from '../../components/ComponentPlayground';

export function AlertPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Alert
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Feedback messages that inform users about important information, success states,
          warnings, or errors. Alerts can include icons and be dismissible.
        </Text>

        <ComponentPlayground
          component={Alert}
          componentName="Alert"
          propConfig={alertPropConfig}
          defaultChildren="This is an alert message"
        />
      </View>
    </Screen>
  );
}
