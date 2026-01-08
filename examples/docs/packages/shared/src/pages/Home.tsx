import React from 'react';
import { View, Text, Button, Card, Screen } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';

export function HomePage() {
  const { navigate } = useNavigator();

  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text
          size="xl"
          weight="bold"
          style={{ marginBottom: 16 }}
        >
          Idealyst Documentation
        </Text>

        <Text
          size="md"
          style={{ color: '#666666', marginBottom: 32, lineHeight: 28 }}
        >
          Idealyst is a modern, cross-platform framework for building React and React Native
          applications. It provides a powerful component library, type-safe APIs, and unified
          theming system that works seamlessly across web and mobile.
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 48 }}>
          <Button
            intent="primary"
            size="lg"
            onPress={() => navigate({ path: '/installation' })}
          >
            Get Started
          </Button>
          <Button
            intent="neutral"
            type="outlined"
            size="lg"
            onPress={() => navigate({ path: '/components/overview' })}
          >
            View Components
          </Button>
        </View>

        <Text
          weight="semibold"
          size="lg"
          style={{ marginBottom: 16 }}
        >
          Key Features
        </Text>

        <View style={{ gap: 16 }}>
          <FeatureCard
            title="Cross-Platform Components"
            description="Build once, run everywhere. Components work identically on web and native with platform-specific optimizations."
          />
          <FeatureCard
            title="Powerful Theme System"
            description="Define themes using a fluent builder API with full TypeScript inference. Customize colors, typography, and component sizes."
          />
          <FeatureCard
            title="Style Extensions"
            description="Extend or override component styles at build time without modifying source code."
          />
          <FeatureCard
            title="Type-Safe APIs"
            description="End-to-end type safety with tRPC and GraphQL support, including automatic TypeScript inference."
          />
          <FeatureCard
            title="Unified Navigation"
            description="Single navigation API for both web and mobile with type-safe routes and deep linking."
          />
        </View>
      </View>
    </Screen>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card
      variant="outlined"
      style={{ padding: 20 }}
    >
      <Text weight="semibold" style={{ marginBottom: 8 }}>
        {title}
      </Text>
      <Text size="sm" style={{ color: '#666666', lineHeight: 22 }}>
        {description}
      </Text>
    </Card>
  );
}
