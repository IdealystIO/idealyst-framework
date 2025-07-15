import React from 'react';
import { Screen, View, Text, Avatar } from '../index';

export const AvatarExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Avatar Examples
      </Text>
      
      {/* Avatar Sizes */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar size="small" fallback="S" />
          <Avatar size="medium" fallback="M" />
          <Avatar size="large" fallback="L" />
          <Avatar size="xlarge" fallback="XL" />
        </View>
      </View>

      {/* Avatar Shapes */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Shapes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar shape="circle" fallback="C" size="large" />
          <Avatar shape="square" fallback="S" size="large" />
        </View>
      </View>

      {/* Avatar with Fallbacks */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Fallback Text</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Avatar fallback="JD" alt="John Doe" />
          <Avatar fallback="AB" alt="Alice Brown" />
          <Avatar fallback="MJ" alt="Michael Johnson" />
          <Avatar fallback="LW" alt="Lisa Wilson" />
        </View>
      </View>

      {/* Avatar with Images */}
      <View spacing="md">
        <Text size="medium" weight="semibold">With Images</Text>
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
        <Text size="medium" weight="semibold">Avatar Group</Text>
        <View style={{ flexDirection: 'row', gap: -8, alignItems: 'center' }}>
          <Avatar fallback="JD" size="medium" />
          <Avatar fallback="AB" size="medium" />
          <Avatar fallback="MJ" size="medium" />
          <Avatar fallback="+3" size="medium" />
        </View>
      </View>

      {/* Different Size Combinations */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Size Combinations</Text>
        <View spacing="sm">
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Avatar size="small" fallback="S" />
            <Text size="small">Small avatar with text</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Avatar size="medium" fallback="M" />
            <Text size="medium">Medium avatar with text</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Avatar size="large" fallback="L" />
            <Text size="large">Large avatar with text</Text>
          </View>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 