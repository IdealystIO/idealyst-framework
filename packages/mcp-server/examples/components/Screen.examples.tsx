/**
 * Screen Component Examples
 *
 * These examples are type-checked against the actual ScreenProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';

// Example 1: Basic Screen
export function BasicScreen() {
  return (
    <Screen>
      <Text>This is a basic screen</Text>
    </Screen>
  );
}

// Example 2: Screen with Backgrounds
export function ScreenWithBackgrounds() {
  return (
    <Screen background="surface.primary">
      <View spacing="md">
        <Text size="lg" weight="bold">
          Primary Surface Screen
        </Text>
        <Text>This screen has a primary surface background</Text>
      </View>
    </Screen>
  );
}

// Example 3: Screen with Padding Variants
export function ScreenWithPadding() {
  return (
    <Screen padding="md">
      <View spacing="md">
        <Text size="lg" weight="bold">
          Padded Screen
        </Text>
        <Text>This screen has medium padding around all edges</Text>
      </View>
    </Screen>
  );
}

// Example 4: Screen with Safe Area
export function ScreenWithSafeArea() {
  return (
    <Screen safeArea padding="md">
      <View spacing="md">
        <Text size="lg" weight="bold">
          Safe Area Screen
        </Text>
        <Text>
          This screen respects device safe areas (notches, status bars, etc.)
        </Text>
      </View>
    </Screen>
  );
}

// Example 5: Scrollable Screen
export function ScrollableScreen() {
  return (
    <Screen scrollable padding="md">
      <View spacing="md">
        <Text size="xl" weight="bold">
          Scrollable Content
        </Text>
        {Array.from({ length: 20 }, (_, i) => (
          <View
            key={i}
            background="surface.primary"
            spacing="md"
            radius="md"
          >
            <Text weight="semibold">Item {i + 1}</Text>
            <Text size="sm" color="gray.600">
              This is a scrollable item. Add enough items to see scrolling behavior.
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

// Example 6: Screen with Content Inset
export function ScreenWithContentInset() {
  return (
    <Screen
      scrollable
      contentInset={{ top: 20, bottom: 20, left: 16, right: 16 }}
    >
      <View spacing="md">
        <Text size="lg" weight="bold">
          Screen with Content Inset
        </Text>
        <Text>
          This screen has custom content insets for top, bottom, left, and right.
        </Text>
        {Array.from({ length: 10 }, (_, i) => (
          <View
            key={i}
            background="surface.primary"
            spacing="md"
            radius="md"
          >
            <Text>Content Item {i + 1}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

// Example 7: Profile Screen
export function ProfileScreen() {
  return (
    <Screen background="surface.secondary" padding="md" safeArea>
      <View spacing="lg">
        <View spacing="md">
          <Text size="xl" weight="bold">
            John Doe
          </Text>
          <Text size="md" color="gray.600">
            john.doe@example.com
          </Text>
        </View>

        <View
          background="surface.primary"
          spacing="md"
          radius="lg"
        >
          <Text weight="semibold">Account Information</Text>
          <View spacing="sm">
            <Text size="sm" color="gray.600">
              Member since: January 2024
            </Text>
            <Text size="sm" color="gray.600">
              Status: Active
            </Text>
          </View>
        </View>

        <View
          background="surface.primary"
          spacing="md"
          radius="lg"
        >
          <Text weight="semibold">Settings</Text>
          <View spacing="sm">
            <Text size="sm">Notifications</Text>
            <Text size="sm">Privacy</Text>
            <Text size="sm">Security</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

// Example 8: Dashboard Screen
export function DashboardScreen() {
  return (
    <Screen background="surface.secondary" padding="lg" safeArea scrollable>
      <View spacing="lg">
        <Text size="xl" weight="bold">
          Dashboard
        </Text>

        <View spacing="md">
          <View
            background="surface.primary"
            spacing="lg"
            radius="lg"
          >
            <Text weight="semibold" size="lg">
              Stats Overview
            </Text>
            <View spacing="md">
              <View spacing="xs">
                <Text size="sm" color="gray.600">
                  Total Users
                </Text>
                <Text size="xl" weight="bold">
                  1,234
                </Text>
              </View>
              <View spacing="xs">
                <Text size="sm" color="gray.600">
                  Revenue
                </Text>
                <Text size="xl" weight="bold">
                  $45,678
                </Text>
              </View>
            </View>
          </View>

          <View
            background="surface.primary"
            spacing="lg"
            radius="lg"
          >
            <Text weight="semibold" size="lg">
              Recent Activity
            </Text>
            <View spacing="sm">
              <Text size="sm">New user registered</Text>
              <Text size="sm">Payment received</Text>
              <Text size="sm">Order completed</Text>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

// Example 9: Form Screen
export function FormScreen() {
  return (
    <Screen background="surface.secondary" padding="md" safeArea scrollable>
      <View spacing="lg">
        <View spacing="sm">
          <Text size="xl" weight="bold">
            Create Account
          </Text>
          <Text size="md" color="gray.600">
            Fill in your information below
          </Text>
        </View>

        <View spacing="md">
          <View spacing="xs">
            <Text size="sm" weight="semibold">
              Full Name
            </Text>
            <View
              background="surface.primary"
              spacing="md"
              radius="md"
              border="thin"
            >
              <Text size="sm" color="gray.500">
                Enter your full name
              </Text>
            </View>
          </View>

          <View spacing="xs">
            <Text size="sm" weight="semibold">
              Email
            </Text>
            <View
              background="surface.primary"
              spacing="md"
              radius="md"
              border="thin"
            >
              <Text size="sm" color="gray.500">
                Enter your email
              </Text>
            </View>
          </View>

          <View spacing="xs">
            <Text size="sm" weight="semibold">
              Password
            </Text>
            <View
              background="surface.primary"
              spacing="md"
              radius="md"
              border="thin"
            >
              <Text size="sm" color="gray.500">
                Enter your password
              </Text>
            </View>
          </View>
        </View>

        <Button>Create Account</Button>
      </View>
    </Screen>
  );
}

// Example 10: Settings Screen
export function SettingsScreen() {
  return (
    <Screen background="surface.secondary" padding="none" safeArea scrollable>
      <View spacing="lg" marginVariant="md">
        <Text size="xl" weight="bold">
          Settings
        </Text>

        <View spacing="xs">
          <Text size="sm" weight="semibold" color="gray.600">
            ACCOUNT
          </Text>
          <View
            background="surface.primary"
            spacing="none"
            radius="md"
          >
            <View spacing="md" border="thin" borderColor="gray.200">
              <Text>Profile</Text>
            </View>
            <View spacing="md" border="thin" borderColor="gray.200">
              <Text>Email & Password</Text>
            </View>
            <View spacing="md">
              <Text>Subscription</Text>
            </View>
          </View>
        </View>

        <View spacing="xs">
          <Text size="sm" weight="semibold" color="gray.600">
            PREFERENCES
          </Text>
          <View
            background="surface.primary"
            spacing="none"
            radius="md"
          >
            <View spacing="md" border="thin" borderColor="gray.200">
              <Text>Notifications</Text>
            </View>
            <View spacing="md" border="thin" borderColor="gray.200">
              <Text>Privacy</Text>
            </View>
            <View spacing="md">
              <Text>Appearance</Text>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
