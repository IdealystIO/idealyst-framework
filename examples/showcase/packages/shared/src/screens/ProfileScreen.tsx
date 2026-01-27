import React from 'react';
import {
  Screen,
  View,
  Text,
  Card,
  Button,
  Icon,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
} from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';

export const ProfileScreen: React.FC = () => {
  const { navigate } = useNavigator();

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        {/* Profile Header */}
        <Card type="elevated" padding="lg">
          <View style={{ alignItems: 'center', gap: 16 }}>
            <View style={{ position: 'relative' }}>
              <Avatar
                size="xl"
                src={{ uri: 'https://i.pravatar.cc/150?img=68' }}
                fallback="JD"
              />
            </View>

            <View style={{ alignItems: 'center', gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text typography="h4">Jane Doe</Text>
                <Badge intent="primary" size="sm">
                  Verified
                </Badge>
              </View>
              <Text color="secondary">@janedoe</Text>
              <Text typography="caption" color="secondary" style={{ textAlign: 'center' }}>
                Senior Developer at Idealyst. Building cross-platform apps with
                React Native.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                style={{ flex: 1 }}
                intent="primary"
                leftIcon={'pencil-outline'}
              >
                Edit Profile
              </Button>
              <Button
                style={{ flex: 1 }}
                type="outlined"
                intent="neutral"
                leftIcon={'share-outline'}
              >
                Share
              </Button>
            </View>
          </View>

          <Divider />

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 16,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text typography="h4">1.2k</Text>
              <Text typography="caption" color="secondary">
                Followers
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text typography="h4">856</Text>
              <Text typography="caption" color="secondary">
                Following
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text typography="h4">42</Text>
              <Text typography="caption" color="secondary">
                Projects
              </Text>
            </View>
          </View>
        </Card>

        {/* Achievements */}
        <View gap="md">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text typography="subtitle1">Achievements</Text>
            <Text typography="caption" color="primary">
              View All
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Card
              type="outlined"
              padding="md"
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#fef3c7',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="trophy" size={24} color="orange" />
              </View>
              <Text typography="caption" weight="medium">
                Top Contributor
              </Text>
            </Card>
            <Card
              type="outlined"
              padding="md"
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#dbeafe',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="star" size={24} color="primary" />
              </View>
              <Text typography="caption" weight="medium">
                Rising Star
              </Text>
            </Card>
            <Card
              type="outlined"
              padding="md"
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#dcfce7',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="rocket-launch" size={24} color="success" />
              </View>
              <Text typography="caption" weight="medium">
                Early Adopter
              </Text>
            </Card>
          </View>
        </View>

        {/* Menu */}
        <View gap="md">
          <Text typography="subtitle1">Account</Text>
          <Card type="outlined">
            <List>
              <ListItem
                label="Settings"
                leading={<Icon name="cog-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
                onPress={() => navigate({ path: '/settings' })}
              />
              <ListItem
                label="Notifications"
                leading={<Icon name="bell-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
              <ListItem
                label="Privacy & Security"
                leading={<Icon name="shield-check-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
              <ListItem
                label="Help & Support"
                leading={<Icon name="help-circle-outline" size={24} />}
                trailing={<Icon name="chevron-right" size={20} />}
              />
            </List>
          </Card>
        </View>

        {/* Logout */}
        <Button
          type="outlined"
          intent="danger"
          leftIcon={'logout'}
        >
          Log Out
        </Button>
      </View>
    </Screen>
  );
};

export default ProfileScreen;
