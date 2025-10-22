import React from 'react';
import { Screen, View, Text, Avatar } from '../index';

export const AvatarExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="lg" weight="bold" align="center">
        Avatar Examples
      </Text>
      
      {/* Avatar Sizes */}
      <View spacing="md">
        <Text size="md" weight="semibold">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar size="sm" fallback="S" />
          <Avatar size="md" fallback="M" />
          <Avatar size="lg" fallback="L" />
          <Avatar size="xl" fallback="XL" />
        </View>
      </View>

      {/* Avatar Shapes */}
      <View spacing="md">
        <Text size="md" weight="semibold">Shapes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar shape="circle" fallback="C" size="lg" />
          <Avatar shape="square" fallback="S" size="lg" />
        </View>
      </View>

      {/* Avatar with Fallbacks */}
      <View spacing="md">
        <Text size="md" weight="semibold">Fallback Text</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar fallback="JD" alt="John Doe" />
          <Avatar fallback="AB" alt="Alice Brown" />
          <Avatar fallback="MJ" alt="Michael Johnson" />
          <Avatar fallback="LW" alt="Lisa Wilson" />
        </View>
      </View>

      {/* Avatar with Images */}
      <View spacing="md">
        <Text size="md" weight="semibold">With Images</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Profile 1"
            fallback="P1"
          />
          <Avatar 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="Profile 2"
            fallback="P2"
          />
          <Avatar 
            src="https://images.unsplash.com/photo-1494790108755-2616b9b5a24f?w=150&h=150&fit=crop&crop=face"
            alt="Profile 3"
            fallback="P3"
          />
        </View>
      </View>

      {/* Avatar Group */}
      <View spacing="md">
        <Text size="md" weight="semibold">Avatar Group</Text>
        <View style={{ flexDirection: 'row', gap: -8, alignItems: 'center' }}>
          <Avatar fallback="JD" size="md" />
          <Avatar fallback="AB" size="md" />
          <Avatar fallback="MJ" size="md" />
          <Avatar fallback="+3" size="md" />
        </View>
      </View>

      {/* Different Size Combinations */}
      <View spacing="md">
        <Text size="md" weight="semibold">Size Combinations</Text>
        <View spacing="sm">
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Avatar size="sm" fallback="S" />
            <Text size="sm">Small avatar with text</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Avatar size="md" fallback="M" />
            <Text size="md">Medium avatar with text</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Avatar size="lg" fallback="L" />
            <Text size="lg">Large avatar with text</Text>
          </View>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 