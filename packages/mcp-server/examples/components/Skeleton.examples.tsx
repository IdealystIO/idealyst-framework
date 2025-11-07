/**
 * Skeleton Component Examples
 *
 * These examples are type-checked against the actual SkeletonProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Skeleton, View, Text, Button } from '@idealyst/components';

// Example 1: Basic Skeleton
export function BasicSkeleton() {
  return (
    <View spacing="md">
      <Skeleton width="100%" height={20} />
      <Skeleton width="80%" height={20} />
      <Skeleton width="60%" height={20} />
    </View>
  );
}

// Example 2: Skeleton Shapes
export function SkeletonShapes() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Rectangle</Text>
        <Skeleton width={200} height={40} shape="rectangle" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Rounded</Text>
        <Skeleton width={200} height={40} shape="rounded" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Circle</Text>
        <Skeleton width={60} height={60} shape="circle" />
      </View>
    </View>
  );
}

// Example 3: Skeleton with Custom Border Radius
export function SkeletonWithBorderRadius() {
  return (
    <View spacing="md">
      <Skeleton width={200} height={40} shape="rounded" borderRadius={4} />
      <Skeleton width={200} height={40} shape="rounded" borderRadius={8} />
      <Skeleton width={200} height={40} shape="rounded" borderRadius={16} />
      <Skeleton width={200} height={40} shape="rounded" borderRadius={24} />
    </View>
  );
}

// Example 4: Skeleton Animation Types
export function SkeletonAnimationTypes() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Pulse Animation</Text>
        <Skeleton width="100%" height={40} animation="pulse" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Wave Animation</Text>
        <Skeleton width="100%" height={40} animation="wave" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">No Animation</Text>
        <Skeleton width="100%" height={40} animation="none" />
      </View>
    </View>
  );
}

// Example 5: Text Skeleton
export function TextSkeleton() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Skeleton width="100%" height={24} shape="rounded" />
        <Skeleton width="95%" height={16} shape="rounded" />
        <Skeleton width="90%" height={16} shape="rounded" />
        <Skeleton width="85%" height={16} shape="rounded" />
      </View>
    </View>
  );
}

// Example 6: Avatar Skeleton
export function AvatarSkeleton() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Skeleton width={40} height={40} shape="circle" />
        <View spacing="xs">
          <Skeleton width={120} height={16} shape="rounded" />
          <Skeleton width={80} height={12} shape="rounded" />
        </View>
      </View>
    </View>
  );
}

// Example 7: Card Skeleton
export function CardSkeleton() {
  return (
    <View background="surface.primary" spacing="md" radius="lg">
      <Skeleton width="100%" height={200} shape="rounded" />
      <View spacing="sm">
        <Skeleton width="80%" height={24} shape="rounded" />
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="60%" height={16} shape="rounded" />
      </View>
      <Skeleton width={120} height={40} shape="rounded" />
    </View>
  );
}

// Example 8: List Skeleton
export function ListSkeleton() {
  return (
    <View spacing="md">
      {Array.from({ length: 5 }, (_, index) => (
        <View key={index} spacing="sm" background="surface.primary" radius="md">
          <View spacing="sm">
            <Skeleton width={50} height={50} shape="circle" />
            <View spacing="xs">
              <Skeleton width={150} height={16} shape="rounded" />
              <Skeleton width={100} height={12} shape="rounded" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// Example 9: Profile Skeleton
export function ProfileSkeleton() {
  return (
    <View spacing="lg">
      <View spacing="md">
        <Skeleton width={100} height={100} shape="circle" />
        <View spacing="sm">
          <Skeleton width={200} height={24} shape="rounded" />
          <Skeleton width={150} height={16} shape="rounded" />
        </View>
      </View>
      <View spacing="sm">
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="80%" height={16} shape="rounded" />
      </View>
      <View spacing="sm">
        <Skeleton width={120} height={40} shape="rounded" />
        <Skeleton width={100} height={40} shape="rounded" />
      </View>
    </View>
  );
}

// Example 10: Table Skeleton
export function TableSkeleton() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Skeleton width="100%" height={40} shape="rectangle" />
      </View>
      {Array.from({ length: 5 }, (_, index) => (
        <View key={index} spacing="sm">
          <Skeleton width="100%" height={60} shape="rectangle" />
        </View>
      ))}
    </View>
  );
}

// Example 11: Loading State Toggle
export function LoadingStateToggle() {
  const [loading, setLoading] = React.useState(true);

  return (
    <View spacing="lg">
      <Button onPress={() => setLoading(!loading)}>
        {loading ? 'Show Content' : 'Show Loading'}
      </Button>
      <View background="surface.primary" spacing="md" radius="lg">
        {loading ? (
          <View spacing="md">
            <Skeleton width={60} height={60} shape="circle" />
            <View spacing="sm">
              <Skeleton width="100%" height={20} shape="rounded" />
              <Skeleton width="80%" height={16} shape="rounded" />
              <Skeleton width="60%" height={16} shape="rounded" />
            </View>
          </View>
        ) : (
          <View spacing="md">
            <Text size="lg" weight="bold">
              Content Loaded
            </Text>
            <Text>
              This is the actual content that appears after loading is complete.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Example 12: Article Skeleton
export function ArticleSkeleton() {
  return (
    <View spacing="lg">
      <View spacing="md">
        <Skeleton width="100%" height={200} shape="rounded" />
      </View>
      <View spacing="sm">
        <Skeleton width="90%" height={32} shape="rounded" />
        <Skeleton width="60%" height={16} shape="rounded" />
      </View>
      <View spacing="sm">
        <View spacing="xs">
          <Skeleton width={40} height={40} shape="circle" />
          <View spacing="xs">
            <Skeleton width={120} height={14} shape="rounded" />
            <Skeleton width={80} height={12} shape="rounded" />
          </View>
        </View>
      </View>
      <View spacing="xs">
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="100%" height={16} shape="rounded" />
        <Skeleton width="70%" height={16} shape="rounded" />
      </View>
    </View>
  );
}

// Example 13: Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <View spacing="lg">
      <View spacing="md">
        <Skeleton width={200} height={32} shape="rounded" />
      </View>
      <View spacing="md">
        <View spacing="md">
          <View background="surface.primary" spacing="md" radius="lg">
            <Skeleton width={100} height={20} shape="rounded" />
            <Skeleton width={150} height={48} shape="rounded" />
          </View>
          <View background="surface.primary" spacing="md" radius="lg">
            <Skeleton width={100} height={20} shape="rounded" />
            <Skeleton width={150} height={48} shape="rounded" />
          </View>
        </View>
        <View spacing="md">
          <View background="surface.primary" spacing="md" radius="lg">
            <Skeleton width={100} height={20} shape="rounded" />
            <Skeleton width={150} height={48} shape="rounded" />
          </View>
          <View background="surface.primary" spacing="md" radius="lg">
            <Skeleton width={100} height={20} shape="rounded" />
            <Skeleton width={150} height={48} shape="rounded" />
          </View>
        </View>
      </View>
      <View background="surface.primary" spacing="md" radius="lg">
        <Skeleton width={150} height={24} shape="rounded" />
        <Skeleton width="100%" height={200} shape="rounded" />
      </View>
    </View>
  );
}
