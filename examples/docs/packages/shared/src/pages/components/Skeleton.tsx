import React from 'react';
import { View, Text, Skeleton, Screen } from '@idealyst/components';
import { ComponentPlayground, skeletonPropConfig } from '../../components/ComponentPlayground';

export function SkeletonPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Skeleton
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Loading placeholder that mimics content layout while data is being fetched.
          Supports pulse and wave animations with customizable shapes.
        </Text>

        <ComponentPlayground
          component={Skeleton}
          componentName="Skeleton"
          propConfig={skeletonPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
