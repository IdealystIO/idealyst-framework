import { Screen, View, Text, Badge, Button } from '../index';

export const BadgeExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View gap="md">
      <Text typography="h4" align="center">
        Badge Examples
      </Text>
      
      {/* Badge Variants */}
      <View gap="xs">
        <Text typography="subtitle1">Variants</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge type="filled" color="blue">
            Filled
          </Badge>
          <Badge type="outlined" color="blue">
            Outlined
          </Badge>
          <Badge type="dot" color="blue" />
        </View>
      </View>

      {/* Badge Sizes */}
      <View gap="sm">
        <Text typography="subtitle1">Sizes</Text>
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
      <View gap="sm">
        <Text typography="subtitle1">Colors</Text>
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
      <View gap="sm">
        <Text typography="subtitle1">Color Shades</Text>
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
      <View gap="sm">
        <Text typography="subtitle1">Dot Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge type="dot" color="blue" size="sm" />
          <Badge type="dot" color="green" size="md" />
          <Badge type="dot" color="red" size="lg" />
          <Badge type="dot" color="orange" size="md" />
          <Badge type="dot" color="gray" size="md" />
        </View>
      </View>

      {/* Number Badges */}
      <View gap="sm">
        <Text typography="subtitle1">Number Badges</Text>
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
      <View gap="sm">
        <Text typography="subtitle1">Status Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="green" type="filled">
            ACTIVE
          </Badge>
          <Badge color="orange" type="filled">
            PENDING
          </Badge>
          <Badge color="red" type="filled">
            INACTIVE
          </Badge>
          <Badge color="gray" type="outlined">
            DRAFT
          </Badge>
          <Badge color="blue" type="outlined">
            REVIEW
          </Badge>
        </View>
      </View>

      {/* Combined with Other Components */}
      <View gap="sm">
        <Text typography="subtitle1">With Other Components</Text>
        <View gap="sm">
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
            <Badge color="green" type="dot" />
            <Text typography="caption" color="secondary">Online</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Button size="sm" type="outlined">
              Inbox
            </Button>
            <Badge color="red" size="sm">99+</Badge>
          </View>
        </View>
      </View>

      {/* Category Badges */}
      <View gap="sm">
        <Text typography="subtitle1">Category Badges</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Badge color="blue" type="outlined">
            React
          </Badge>
          <Badge color="green" type="outlined">
            TypeScript
          </Badge>
          <Badge color="yellow" type="outlined">
            JavaScript
          </Badge>
          <Badge color="orange" type="outlined">
            CSS
          </Badge>
          <Badge color="gray" type="outlined">
            HTML
          </Badge>
        </View>
      </View>

      {/* Badges with Icons */}
      <View gap="sm">
        <Text typography="subtitle1">Badges with Icons</Text>
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
      <View gap="sm">
        <Text typography="subtitle1">Icon-only Badges</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="blue" icon="star" size="sm" />
          <Badge color="green" icon="heart" size="md" />
          <Badge color="red" icon="fire" size="lg" />
          <Badge color="purple" icon="lightning-bolt" type="outlined" />
        </View>
      </View>

      {/* Status Badges with Icons */}
      <View gap="sm">
        <Text typography="subtitle1">Status with Icons</Text>
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
      <View gap="sm">
        <Text typography="subtitle1">Outlined with Icons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color="blue" type="outlined" icon="download">
            Download
          </Badge>
          <Badge color="green" type="outlined" icon="upload">
            Upload
          </Badge>
          <Badge color="red" type="outlined" icon="delete">
            Delete
          </Badge>
          <Badge color="purple" type="outlined" icon="share">
            Share
          </Badge>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 