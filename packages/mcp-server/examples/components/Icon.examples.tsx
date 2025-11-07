/**
 * Icon Component Examples
 *
 * These examples are type-checked against the actual IconProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Icon, View, Text } from '@idealyst/components';

// Example 1: Basic Icon
export function BasicIcon() {
  return <Icon name="home" />;
}

// Example 2: Icon Sizes
export function IconSizes() {
  return (
    <View spacing="md">
      <Icon name="heart" size="xs" />
      <Icon name="heart" size="sm" />
      <Icon name="heart" size="md" />
      <Icon name="heart" size="lg" />
      <Icon name="heart" size="xl" />
    </View>
  );
}

// Example 3: Icon with Custom Size (Number)
export function IconCustomSize() {
  return (
    <View spacing="md">
      <Icon name="star" size={16} />
      <Icon name="star" size={24} />
      <Icon name="star" size={32} />
      <Icon name="star" size={48} />
      <Icon name="star" size={64} />
    </View>
  );
}

// Example 4: Icon with Colors
export function IconWithColors() {
  return (
    <View spacing="md">
      <Icon name="circle"  />
      <Icon name="circle"  />
      <Icon name="circle"  />
      <Icon name="circle"  />
      <Icon name="circle"  />
    </View>
  );
}

// Example 5: Icon with Intent
export function IconWithIntent() {
  return (
    <View spacing="md">
      <Icon name="information" intent="primary" size="lg" />
      <Icon name="check-circle" intent="success" size="lg" />
      <Icon name="alert-circle" intent="error" size="lg" />
      <Icon name="alert" intent="warning" size="lg" />
      <Icon name="help-circle" intent="info" size="lg" />
    </View>
  );
}

// Example 6: Common UI Icons
export function CommonUIIcons() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Icon name="home" />
        <Text size="sm">Home</Text>
      </View>
      <View spacing="sm">
        <Icon name="magnify" />
        <Text size="sm">Search</Text>
      </View>
      <View spacing="sm">
        <Icon name="account" />
        <Text size="sm">Profile</Text>
      </View>
      <View spacing="sm">
        <Icon name="cog" />
        <Text size="sm">Settings</Text>
      </View>
      <View spacing="sm">
        <Icon name="bell" />
        <Text size="sm">Notifications</Text>
      </View>
    </View>
  );
}

// Example 7: Action Icons
export function ActionIcons() {
  return (
    <View spacing="md">
      <Icon name="plus" size="lg"  />
      <Icon name="pencil" size="lg"  />
      <Icon name="delete" size="lg"  />
      <Icon name="check" size="lg"  />
      <Icon name="close" size="lg"  />
      <Icon name="refresh" size="lg"  />
    </View>
  );
}

// Example 8: Navigation Icons
export function NavigationIcons() {
  return (
    <View spacing="md">
      <Icon name="chevron-up" size="lg" />
      <Icon name="chevron-down" size="lg" />
      <Icon name="chevron-left" size="lg" />
      <Icon name="chevron-right" size="lg" />
      <Icon name="arrow-left" size="lg" />
      <Icon name="arrow-right" size="lg" />
    </View>
  );
}

// Example 9: Status Icons with Text
export function StatusIconsWithText() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Icon name="check-circle" intent="success" size="md" />
        <Text  size="sm">
          Success
        </Text>
      </View>
      <View spacing="sm">
        <Icon name="alert-circle" intent="error" size="md" />
        <Text  size="sm">
          Error
        </Text>
      </View>
      <View spacing="sm">
        <Icon name="alert" intent="warning" size="md" />
        <Text  size="sm">
          Warning
        </Text>
      </View>
      <View spacing="sm">
        <Icon name="information" intent="info" size="md" />
        <Text  size="sm">
          Info
        </Text>
      </View>
    </View>
  );
}

// Example 10: Social Media Icons
export function SocialMediaIcons() {
  return (
    <View spacing="md">
      <Icon name="facebook" size="lg"  />
      <Icon name="twitter" size="lg"  />
      <Icon name="instagram" size="lg"  />
      <Icon name="linkedin" size="lg"  />
      <Icon name="youtube" size="lg"  />
      <Icon name="github" size="lg"  />
    </View>
  );
}

// Example 11: Using MDI Prefix
export function IconWithMDIPrefix() {
  return (
    <View spacing="md">
      <Icon name="mdi:home" size="lg" />
      <Icon name="mdi:account" size="lg"  />
      <Icon name="mdi:heart" size="lg" intent="error" />
    </View>
  );
}

// Example 12: Icon with Accessibility
export function IconWithAccessibility() {
  return (
    <View spacing="md">
      <Icon
        name="magnify"
        size="lg"
        accessibilityLabel="Search"
      />
      <Icon
        name="account"
        size="lg"
        accessibilityLabel="User profile"
      />
      <Icon
        name="cog"
        size="lg"
        accessibilityLabel="Settings"
      />
    </View>
  );
}
