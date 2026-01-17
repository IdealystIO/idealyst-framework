import React, { useState } from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';
import ActivityIndicator from '../ActivityIndicator';

export const ActivityIndicatorExamples: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <Screen background="primary" padding="lg">
      <View gap="lg">
        <Text typography="h3">ActivityIndicator Examples</Text>

        <View gap="md">
          <Text typography="h5">Basic</Text>
          <View gap="sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <ActivityIndicator />
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Sizes</Text>
          <View gap="sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="xs" />
              <Text typography="caption">xs</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="sm" />
              <Text typography="caption">sm</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="md" />
              <Text typography="caption">md</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="lg" />
              <Text typography="caption">lg</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="xl" />
              <Text typography="caption">xl</Text>
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Intent Colors</Text>
          <View gap="sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator intent="primary" />
              <Text typography="caption">primary</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator intent="success" />
              <Text typography="caption">success</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator intent="warning" />
              <Text typography="caption">warning</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator intent="danger" />
              <Text typography="caption">danger</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <ActivityIndicator intent="neutral" />
              <Text typography="caption">neutral</Text>
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Custom Color</Text>
          <View gap="sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            <ActivityIndicator color="#9333ea" />
            <ActivityIndicator color="#ec4899" />
            <ActivityIndicator color="#06b6d4" />
            <ActivityIndicator color="#f97316" />
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Toggle Animation</Text>
          <View gap="sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <ActivityIndicator animating={isAnimating} hidesWhenStopped={false} />
            <Button size="sm" onPress={() => setIsAnimating(!isAnimating)}>
              {isAnimating ? 'Stop' : 'Start'}
            </Button>
          </View>
          <Text typography="caption" color="secondary">
            hidesWhenStopped=false keeps the indicator visible when stopped
          </Text>
        </View>

        <View gap="md">
          <Text typography="h5">Hides When Stopped (default)</Text>
          <View gap="sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator animating={isAnimating} />
            </View>
            <Text typography="body2">
              {isAnimating ? 'Visible (animating)' : 'Hidden (stopped)'}
            </Text>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Loading States</Text>
          <View gap="sm">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: 8,
              }}
            >
              <ActivityIndicator size="sm" />
              <Text>Loading data...</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: 8,
              }}
            >
              <ActivityIndicator size="lg" />
              <Text typography="body2" color="secondary" style={{ marginTop: 12 }}>
                Please wait...
              </Text>
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Inline with Text</Text>
          <View gap="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text>Saving</Text>
              <ActivityIndicator size="xs" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text>Processing request</Text>
              <ActivityIndicator size="sm" intent="success" />
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">On Dark Background</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 24,
              padding: 24,
              backgroundColor: '#1f2937',
              borderRadius: 8,
            }}
          >
            <ActivityIndicator color="#ffffff" />
            <ActivityIndicator color="#60a5fa" />
            <ActivityIndicator color="#34d399" />
            <ActivityIndicator color="#fbbf24" />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default ActivityIndicatorExamples;
