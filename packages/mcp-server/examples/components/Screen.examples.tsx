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
    <Screen background="primary">
      <View spacing="md">
        <Text typography="subtitle1" weight="bold">
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
        <Text typography="subtitle1" weight="bold">
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
        <Text typography="subtitle1" weight="bold">
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
        <Text typography="h5" weight="bold">
          Scrollable Content
        </Text>
        {Array.from({ length: 20 }, (_, i) => (
          <View
            key={i}
            background="primary"
            spacing="md"
            radius="md"
          >
            <Text weight="semibold">Item {i + 1}</Text>
            <Text typography="body2">
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
        <Text typography="subtitle1" weight="bold">
          Screen with Content Inset
        </Text>
        <Text>
          This screen has custom content insets for top, bottom, left, and right.
        </Text>
        {Array.from({ length: 10 }, (_, i) => (
          <View
            key={i}
            background="primary"
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
    <Screen background="secondary" padding="md" safeArea>
      <View spacing="lg">
        <View spacing="md">
          <Text typography="h5" weight="bold">
            John Doe
          </Text>
          <Text typography="body1">
            john.doe@example.com
          </Text>
        </View>

        <View
          background="primary"
          spacing="md"
          radius="lg"
        >
          <Text weight="semibold">Account Information</Text>
          <View spacing="sm">
            <Text typography="body2">
              Member since: January 2024
            </Text>
            <Text typography="body2">
              Status: Active
            </Text>
          </View>
        </View>

        <View
          background="primary"
          spacing="md"
          radius="lg"
        >
          <Text weight="semibold">Settings</Text>
          <View spacing="sm">
            <Text typography="body2">Notifications</Text>
            <Text typography="body2">Privacy</Text>
            <Text typography="body2">Security</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

// Example 8: Dashboard Screen
export function DashboardScreen() {
  return (
    <Screen background="secondary" padding="lg" safeArea scrollable>
      <View spacing="lg">
        <Text typography="h5" weight="bold">
          Dashboard
        </Text>

        <View spacing="md">
          <View
            background="primary"
            spacing="lg"
            radius="lg"
          >
            <Text weight="semibold" typography="subtitle1">
              Stats Overview
            </Text>
            <View spacing="md">
              <View spacing="xs">
                <Text typography="body2">
                  Total Users
                </Text>
                <Text typography="h5" weight="bold">
                  1,234
                </Text>
              </View>
              <View spacing="xs">
                <Text typography="body2">
                  Revenue
                </Text>
                <Text typography="h5" weight="bold">
                  $45,678
                </Text>
              </View>
            </View>
          </View>

          <View
            background="primary"
            spacing="lg"
            radius="lg"
          >
            <Text weight="semibold" typography="subtitle1">
              Recent Activity
            </Text>
            <View spacing="sm">
              <Text typography="body2">New user registered</Text>
              <Text typography="body2">Payment received</Text>
              <Text typography="body2">Order completed</Text>
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
    <Screen background="secondary" padding="md" safeArea scrollable>
      <View spacing="lg">
        <View spacing="sm">
          <Text typography="h5" weight="bold">
            Create Account
          </Text>
          <Text typography="body1">
            Fill in your information below
          </Text>
        </View>

        <View spacing="md">
          <View spacing="xs">
            <Text typography="body2" weight="semibold">
              Full Name
            </Text>
            <View
              background="primary"
              spacing="md"
              radius="md"
              border="thin"
            >
              <Text typography="body2">
                Enter your full name
              </Text>
            </View>
          </View>

          <View spacing="xs">
            <Text typography="body2" weight="semibold">
              Email
            </Text>
            <View
              background="primary"
              spacing="md"
              radius="md"
              border="thin"
            >
              <Text typography="body2">
                Enter your email
              </Text>
            </View>
          </View>

          <View spacing="xs">
            <Text typography="body2" weight="semibold">
              Password
            </Text>
            <View
              background="primary"
              spacing="md"
              radius="md"
              border="thin"
            >
              <Text typography="body2">
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
    <Screen background="secondary" padding="none" safeArea scrollable>
      <View spacing="lg" margin="md">
        <Text typography="h5" weight="bold">
          Settings
        </Text>

        <View spacing="xs">
          <Text typography="body2" weight="semibold">
            ACCOUNT
          </Text>
          <View
            background="primary"
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
          <Text typography="body2" weight="semibold">
            PREFERENCES
          </Text>
          <View
            background="primary"
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
