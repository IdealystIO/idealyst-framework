import React from 'react';
import { Screen, View, Text, Badge, Button } from '../index';

export const BadgeExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Badge Examples
      </Text>
      
      {/* Badge Variants */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Variants</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="filled" color="blue">
            Filled
          </Badge>
          <Badge variant="outlined" color="blue">
            Outlined
          </Badge>
          <Badge variant="dot" color="blue" />
        </View>
      </View>

      {/* Badge Sizes */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge size="small" color="blue">
            Small
          </Badge>
          <Badge size="medium" color="blue">
            Medium
          </Badge>
          <Badge size="large" color="blue">
            Large
          </Badge>
        </View>
      </View>

      {/* Badge Colors */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Colors</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="blue">
            Blue
          </Badge>
          <Badge color="green">
            Green
          </Badge>
          <Badge color="red">
            Red
          </Badge>
          <Badge color="orange">
            Orange
          </Badge>
          <Badge color="gray">
            Gray
          </Badge>
          <Badge color="purple">
            Purple
          </Badge>
        </View>
      </View>

      {/* Badge Color Shades */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Color Shades</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="blue.200">
            Blue 200
          </Badge>
          <Badge color="blue.500">
            Blue 500
          </Badge>
          <Badge color="blue.800">
            Blue 800
          </Badge>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="green.100">
            Green 100
          </Badge>
          <Badge color="green.600">
            Green 600
          </Badge>
          <Badge color="green.900">
            Green 900
          </Badge>
        </View>
      </View>

      {/* Dot Badges */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Dot Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="dot" color="blue" size="small" />
          <Badge variant="dot" color="green" size="medium" />
          <Badge variant="dot" color="red" size="large" />
          <Badge variant="dot" color="orange" size="medium" />
          <Badge variant="dot" color="gray" size="medium" />
        </View>
      </View>

      {/* Number Badges */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Number Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="red" size="small">
            1
          </Badge>
          <Badge color="red" size="medium">
            5
          </Badge>
          <Badge color="red" size="large">
            99+
          </Badge>
          <Badge color="blue" size="medium">
            42
          </Badge>
        </View>
      </View>

      {/* Status Badges */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Status Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="green" variant="filled">
            ACTIVE
          </Badge>
          <Badge color="orange" variant="filled">
            PENDING
          </Badge>
          <Badge color="red" variant="filled">
            INACTIVE
          </Badge>
          <Badge color="gray" variant="outlined">
            DRAFT
          </Badge>
          <Badge color="blue" variant="outlined">
            REVIEW
          </Badge>
        </View>
      </View>

      {/* Combined with Other Components */}
      <View spacing="md">
        <Text size="medium" weight="semibold">With Other Components</Text>
        <View spacing="sm">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Notifications</Text>
            <Badge color="red" size="small">3</Badge>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Messages</Text>
            <Badge color="blue" size="small">12</Badge>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Status</Text>
            <Badge color="green" variant="dot" />
            <Text size="small" color="secondary">Online</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Button size="small" variant="outlined">
              Inbox
            </Button>
            <Badge color="red" size="small">99+</Badge>
          </View>
        </View>
      </View>

      {/* Category Badges */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Category Badges</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Badge color="blue" variant="outlined">
            React
          </Badge>
          <Badge color="green" variant="outlined">
            TypeScript
          </Badge>
          <Badge color="yellow" variant="outlined">
            JavaScript
          </Badge>
          <Badge color="orange" variant="outlined">
            CSS
          </Badge>
          <Badge color="gray" variant="outlined">
            HTML
          </Badge>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 