/**
 * Avatar Component Examples
 *
 * These examples are type-checked against the actual AvatarProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Avatar, View, Text } from '@idealyst/components';

// Example 1: Basic Avatar with Image
export function BasicAvatar() {
  return (
    <Avatar
      src="https://i.pravatar.cc/150?img=1"
      alt="User avatar"
    />
  );
}

// Example 2: Avatar Sizes
export function AvatarSizes() {
  return (
    <View spacing="md">
      <Avatar size="sm" src="https://i.pravatar.cc/150?img=2" alt="Small avatar" />
      <Avatar size="md" src="https://i.pravatar.cc/150?img=3" alt="Medium avatar" />
      <Avatar size="lg" src="https://i.pravatar.cc/150?img=4" alt="Large avatar" />
      <Avatar size="xl" src="https://i.pravatar.cc/150?img=5" alt="Extra large avatar" />
    </View>
  );
}

// Example 3: Avatar Shapes
export function AvatarShapes() {
  return (
    <View spacing="md">
      <Avatar
        shape="circle"
        src="https://i.pravatar.cc/150?img=6"
        alt="Circle avatar"
      />
      <Avatar
        shape="square"
        src="https://i.pravatar.cc/150?img=7"
        alt="Square avatar"
      />
    </View>
  );
}

// Example 4: Avatar with Fallback Text
export function AvatarWithFallback() {
  return (
    <View spacing="md">
      <Avatar fallback="JD" size="md" />
      <Avatar fallback="AB" size="md" color="blue.500" />
      <Avatar fallback="CD" size="md" color="green.500" />
      <Avatar fallback="EF" size="md" color="purple.500" />
    </View>
  );
}

// Example 5: Avatar with Different Colors
export function AvatarColors() {
  return (
    <View spacing="md">
      <Avatar fallback="AA" color="red.500" size="lg" />
      <Avatar fallback="BB" color="blue.500" size="lg" />
      <Avatar fallback="CC" color="green.500" size="lg" />
      <Avatar fallback="DD" color="yellow.500" size="lg" />
      <Avatar fallback="EE" color="purple.500" size="lg" />
    </View>
  );
}

// Example 6: User Profile List
export function UserProfileList() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Avatar src="https://i.pravatar.cc/150?img=8" size="md" />
        <View spacing="xs">
          <Text weight="semibold">John Doe</Text>
          <Text size="sm" color="gray.600">
            john.doe@example.com
          </Text>
        </View>
      </View>
      <View spacing="sm">
        <Avatar src="https://i.pravatar.cc/150?img=9" size="md" />
        <View spacing="xs">
          <Text weight="semibold">Jane Smith</Text>
          <Text size="sm" color="gray.600">
            jane.smith@example.com
          </Text>
        </View>
      </View>
      <View spacing="sm">
        <Avatar fallback="AB" color="blue.500" size="md" />
        <View spacing="xs">
          <Text weight="semibold">Alex Brown</Text>
          <Text size="sm" color="gray.600">
            alex.brown@example.com
          </Text>
        </View>
      </View>
    </View>
  );
}

// Example 7: Avatar Group
export function AvatarGroup() {
  return (
    <View spacing="md">
      <Text weight="semibold" size="sm" color="gray.700">
        Team Members
      </Text>
      <View spacing="sm">
        <Avatar src="https://i.pravatar.cc/150?img=10" size="sm" />
        <Avatar src="https://i.pravatar.cc/150?img=11" size="sm" />
        <Avatar src="https://i.pravatar.cc/150?img=12" size="sm" />
        <Avatar fallback="+3" size="sm" color="gray.500" />
      </View>
    </View>
  );
}

// Example 8: Large Profile Avatar
export function LargeProfileAvatar() {
  return (
    <View spacing="md">
      <Avatar
        src="https://i.pravatar.cc/300?img=13"
        size="xl"
        alt="Profile picture"
      />
      <View spacing="xs">
        <Text size="xl" weight="bold">
          Sarah Johnson
        </Text>
        <Text size="md" color="gray.600">
          Product Designer
        </Text>
      </View>
    </View>
  );
}

// Example 9: Avatar with Fallback on Error
export function AvatarWithFallbackOnError() {
  return (
    <View spacing="md">
      <Avatar
        src="https://invalid-url.com/image.jpg"
        fallback="???"
        alt="Broken image"
        size="lg"
      />
      <Text size="sm" color="gray.600">
        Fallback shown when image fails to load
      </Text>
    </View>
  );
}

// Example 10: Mixed Avatars
export function MixedAvatars() {
  return (
    <View spacing="lg">
      <View spacing="sm">
        <Avatar src="https://i.pravatar.cc/150?img=14" size="md" shape="circle" />
        <Text weight="medium">Circle with Image</Text>
      </View>
      <View spacing="sm">
        <Avatar src="https://i.pravatar.cc/150?img=15" size="md" shape="square" />
        <Text weight="medium">Square with Image</Text>
      </View>
      <View spacing="sm">
        <Avatar fallback="JD" size="md" shape="circle" color="purple.500" />
        <Text weight="medium">Circle with Initials</Text>
      </View>
      <View spacing="sm">
        <Avatar fallback="JD" size="md" shape="square" color="blue.500" />
        <Text weight="medium">Square with Initials</Text>
      </View>
    </View>
  );
}
