/**
 * Badge Component Examples
 *
 * These examples are type-checked against the actual BadgeProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Badge, View, Text, Icon } from '@idealyst/components';

// Example 1: Basic Badge
export function BasicBadge() {
  return <Badge>New</Badge>;
}

// Example 2: Badge Sizes
export function BadgeSizes() {
  return (
    <View spacing="md">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
      <Badge size="xl">Extra Large</Badge>
    </View>
  );
}

// Example 3: Badge Types
export function BadgeTypes() {
  return (
    <View spacing="md">
      <Badge type="filled">Filled</Badge>
      <Badge type="outlined">Outlined</Badge>
      <Badge type="dot">Dot</Badge>
    </View>
  );
}

// Example 4: Badge Colors
export function BadgeColors() {
  return (
    <View spacing="md">
      <Badge >Blue</Badge>
      <Badge >Green</Badge>
      <Badge >Red</Badge>
      <Badge >Yellow</Badge>
      <Badge >Purple</Badge>
      <Badge >Gray</Badge>
    </View>
  );
}

// Example 5: Badge with Icons (Icon Name)
export function BadgeWithIconName() {
  return (
    <View spacing="md">
      <Badge icon="check">Verified</Badge>
      <Badge icon="star">Premium</Badge>
      <Badge icon="fire">Hot</Badge>
      <Badge icon="new-box">New</Badge>
      <Badge icon="alert">Alert</Badge>
    </View>
  );
}

// Example 6: Badge with Icons (ReactNode)
export function BadgeWithIconComponent() {
  return (
    <View spacing="md">
      <Badge icon={<Icon name="check" size="xs" />}>Verified</Badge>
      <Badge icon={<Icon name="star" size="xs" />} >
        Premium
      </Badge>
      <Badge icon={<Icon name="fire" size="xs" />} >
        Hot
      </Badge>
    </View>
  );
}

// Example 7: Status Badges
export function StatusBadges() {
  return (
    <View spacing="md">
      <Badge type="filled"  icon="check-circle">
        Active
      </Badge>
      <Badge type="filled"  icon="pause-circle">
        Paused
      </Badge>
      <Badge type="filled"  icon="close-circle">
        Inactive
      </Badge>
      <Badge type="filled"  icon="clock">
        Pending
      </Badge>
    </View>
  );
}

// Example 8: Outlined Badges
export function OutlinedBadges() {
  return (
    <View spacing="md">
      <Badge type="outlined" >
        Info
      </Badge>
      <Badge type="outlined" >
        Success
      </Badge>
      <Badge type="outlined" >
        Error
      </Badge>
      <Badge type="outlined" >
        Warning
      </Badge>
    </View>
  );
}

// Example 9: Dot Badges
export function DotBadges() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Badge type="dot"  />
        <Text>Online</Text>
      </View>
      <View spacing="sm">
        <Badge type="dot"  />
        <Text>Offline</Text>
      </View>
      <View spacing="sm">
        <Badge type="dot"  />
        <Text>Away</Text>
      </View>
      <View spacing="sm">
        <Badge type="dot"  />
        <Text>Busy</Text>
      </View>
    </View>
  );
}

// Example 10: Notification Badges
export function NotificationBadges() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Icon name="bell" size="lg" />
        <Badge type="filled"  size="xs">
          5
        </Badge>
      </View>
      <View spacing="sm">
        <Icon name="email" size="lg" />
        <Badge type="filled"  size="xs">
          12
        </Badge>
      </View>
      <View spacing="sm">
        <Icon name="message" size="lg" />
        <Badge type="filled"  size="xs">
          3
        </Badge>
      </View>
    </View>
  );
}

// Example 11: Product Badges
export function ProductBadges() {
  return (
    <View spacing="md">
      <Badge type="filled"  icon="fire">
        Sale
      </Badge>
      <Badge type="filled"  icon="new-box">
        New Arrival
      </Badge>
      <Badge type="filled"  icon="star">
        Best Seller
      </Badge>
      <Badge type="filled"  icon="crown">
        Premium
      </Badge>
      <Badge type="outlined"  icon="percent">
        20% Off
      </Badge>
    </View>
  );
}

// Example 12: Category Badges
export function CategoryBadges() {
  return (
    <View spacing="md">
      <Badge type="outlined" size="sm" >
        Technology
      </Badge>
      <Badge type="outlined" size="sm" >
        Design
      </Badge>
      <Badge type="outlined" size="sm" >
        Business
      </Badge>
      <Badge type="outlined" size="sm" >
        Marketing
      </Badge>
      <Badge type="outlined" size="sm" >
        Finance
      </Badge>
    </View>
  );
}

// Example 13: User Role Badges
export function UserRoleBadges() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">John Doe</Text>
        <Badge type="filled"  size="sm" icon="crown">
          Admin
        </Badge>
      </View>
      <View spacing="sm">
        <Text weight="semibold">Jane Smith</Text>
        <Badge type="filled"  size="sm" icon="shield">
          Moderator
        </Badge>
      </View>
      <View spacing="sm">
        <Text weight="semibold">Bob Johnson</Text>
        <Badge type="outlined"  size="sm" icon="account">
          Member
        </Badge>
      </View>
    </View>
  );
}
