import React from 'react';
import { View, Text, Link, Screen } from '@idealyst/components';
import { ComponentPlayground, linkPropConfig } from '../../components/ComponentPlayground';

export function LinkPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Link
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Navigation component for internal routing within the application.
          Integrates with the Idealyst navigation system for seamless page transitions.
        </Text>

        <ComponentPlayground
          component={Link}
          componentName="Link"
          propConfig={linkPropConfig}
          defaultChildren="Click here"
        />
      </View>
    </Screen>
  );
}
