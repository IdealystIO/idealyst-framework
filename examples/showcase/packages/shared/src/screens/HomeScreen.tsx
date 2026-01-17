import React from 'react';
import {
  Screen,
  View,
  Text,
  Card,
  Button,
  Icon,
  Badge,
  Chip,
} from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';

export const HomeScreen: React.FC = () => {
  const { navigate } = useNavigator();

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        {/* Header */}
        <View gap="sm">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text typography="h3">Welcome back</Text>
            <Badge intent="success" size="sm">
              Pro
            </Badge>
          </View>
          <Text color="secondary">Explore the Idealyst component library</Text>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card type="elevated" padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Icon name="widgets-outline" size={28} intent="primary" />
            <Text typography="h4">37+</Text>
            <Text typography="caption" color="secondary">
              Components
            </Text>
          </Card>
          <Card type="elevated" padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Icon name="palette-outline" size={28} intent="success" />
            <Text typography="h4">2</Text>
            <Text typography="caption" color="secondary">
              Themes
            </Text>
          </Card>
          <Card type="elevated" padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Icon name="cellphone-link" size={28} intent="warning" />
            <Text typography="h4">3</Text>
            <Text typography="caption" color="secondary">
              Platforms
            </Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View gap="md">
          <Text typography="subtitle1">Quick Actions</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              style={{ flex: 1 }}
              intent="primary"
              // Use direct icon name (retains theme colors)
              leftIcon={'compass-outline'}
              onPress={() => navigate({ path: '/explore' })}
            >
              Explore
            </Button>
            <Button
              style={{ flex: 1 }}
              type="outlined"
              intent="neutral"
              // or specify your own Icon component
              leftIcon={<Icon name="cog-outline" size={18} color='orange' />}
              onPress={() => navigate({ path: '/settings' })}
            >
              Settings
            </Button>
          </View>
        </View>

        {/* Feature Highlights */}
        <View gap="md">
          <Text typography="subtitle1">Highlights</Text>

          <Card type="outlined" padding="md" clickable>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                background="secondary"
                radius="md"
                style={{
                  width: 48,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="theme-light-dark" size={24} intent="primary" />
              </View>
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Dark Mode Support</Text>
                <Text typography="caption" color="secondary">
                  Seamlessly switch between light and dark themes
                </Text>
              </View>
              <Icon name="chevron-right" size={24} textColor="secondary" />
            </View>
          </Card>

          <Card type="outlined" padding="md" clickable>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                background="secondary"
                radius="md"
                style={{
                  width: 48,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="navigation-outline" size={24} intent="primary" />
              </View>
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Nested Navigation</Text>
                <Text typography="caption" color="secondary">
                  Stack and Tab navigators working together
                </Text>
              </View>
              <Icon name="chevron-right" size={24} textColor="secondary" />
            </View>
          </Card>
        </View>

        {/* Tags */}
        <View gap="sm">
          <Text typography="subtitle1">Technologies</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Chip intent="primary" label='React 19' />
            <Chip intent="success" label='React Native' />
            <Chip intent="warning" label='Unistyles' />
            <Chip intent="info" label='TypeScript' />
            <Chip intent="neutral" label='Cross-Platform' />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default HomeScreen;
