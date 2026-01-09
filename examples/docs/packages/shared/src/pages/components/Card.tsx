import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { ComponentPlayground, cardPropConfig } from '../../components/ComponentPlayground';

export function CardPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Card
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Container component for grouping related content. Cards support different visual
          variants including elevated, outlined, and filled styles.
        </Text>

        <ComponentPlayground
          component={Card}
          componentName="Card"
          propConfig={cardPropConfig}
          defaultChildren="Card Content"
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
