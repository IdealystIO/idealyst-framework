import React from 'react';
import { View, Text, Progress, Screen } from '@idealyst/components';
import { ComponentPlayground, progressPropConfig } from '../../components/ComponentPlayground';

export function ProgressPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Progress
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Visual indicator showing the completion status of a task or process.
          Supports different sizes and intent colors for various use cases.
        </Text>

        <ComponentPlayground
          component={Progress}
          componentName="Progress"
          propConfig={progressPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
