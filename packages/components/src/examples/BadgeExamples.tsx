import React from 'react';
import { Screen, View, Text, Badge, Button } from '../index';

export const BadgeExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="lg" weight="bold" align="center">
        Badge Examples
      </Text>
      
      {/* Badge Variants */}
      <View spacing="md">
        <Text size="md" weight="semibold">Variants</Text>
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
        <Text size="md" weight="semibold">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge size="sm" color="blue">
            Small
          </Badge>
          <Badge size="md" color="blue">
            Medium
          </Badge>
          <Badge size="lg" color="blue">
            Large
          </Badge>
        </View>
      </View>

      {/* Badge Colors */}
      <View spacing="md">
        <Text size="md" weight="semibold">Colors</Text>
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
        <Text size="md" weight="semibold">Color Shades</Text>
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
        <Text size="md" weight="semibold">Dot Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="dot" color="blue" size="sm" />
          <Badge variant="dot" color="green" size="md" />
          <Badge variant="dot" color="red" size="lg" />
          <Badge variant="dot" color="orange" size="md" />
          <Badge variant="dot" color="gray" size="md" />
        </View>
      </View>

      {/* Number Badges */}
      <View spacing="md">
        <Text size="md" weight="semibold">Number Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="red" size="sm">
            1
          </Badge>
          <Badge color="red" size="md">
            5
          </Badge>
          <Badge color="red" size="lg">
            99+
          </Badge>
          <Badge color="blue" size="md">
            42
          </Badge>
        </View>
      </View>

      {/* Status Badges */}
      <View spacing="md">
        <Text size="md" weight="semibold">Status Badges</Text>
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
        <Text size="md" weight="semibold">With Other Components</Text>
        <View spacing="sm">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Notifications</Text>
            <Badge color="red" size="sm">3</Badge>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Messages</Text>
            <Badge color="blue" size="sm">12</Badge>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Status</Text>
            <Badge color="green" variant="dot" />
            <Text size="sm" color="secondary">Online</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Button size="sm" variant="outlined">
              Inbox
            </Button>
            <Badge color="red" size="sm">99+</Badge>
          </View>
        </View>
      </View>

      {/* Category Badges */}
      <View spacing="md">
        <Text size="md" weight="semibold">Category Badges</Text>
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

      {/* Badges with Icons */}
      <View spacing="md">
        <Text size="md" weight="semibold">Badges with Icons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="blue" icon="information">
            Info
          </Badge>
          <Badge color="green" icon="check-circle">
            Success
          </Badge>
          <Badge color="red" icon="alert-circle">
            Error
          </Badge>
          <Badge color="orange" icon="alert">
            Warning
          </Badge>
        </View>
      </View>

      {/* Icon-only Badges */}
      <View spacing="md">
        <Text size="md" weight="semibold">Icon-only Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="blue" icon="star" size="sm" />
          <Badge color="green" icon="heart" size="md" />
          <Badge color="red" icon="fire" size="lg" />
          <Badge color="purple" icon="lightning-bolt" variant="outlined" />
        </View>
      </View>

      {/* Status Badges with Icons */}
      <View spacing="md">
        <Text size="md" weight="semibold">Status with Icons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="green" icon="check">
            VERIFIED
          </Badge>
          <Badge color="blue" icon="clock">
            PENDING
          </Badge>
          <Badge color="red" icon="close">
            REJECTED
          </Badge>
          <Badge color="gray" icon="email">
            SENT
          </Badge>
        </View>
      </View>

      {/* Outlined Badges with Icons */}
      <View spacing="md">
        <Text size="md" weight="semibold">Outlined with Icons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="blue" variant="outlined" icon="download">
            Download
          </Badge>
          <Badge color="green" variant="outlined" icon="upload">
            Upload
          </Badge>
          <Badge color="red" variant="outlined" icon="delete">
            Delete
          </Badge>
          <Badge color="purple" variant="outlined" icon="share">
            Share
          </Badge>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 