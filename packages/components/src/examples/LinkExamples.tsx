import React from 'react';
import { Screen, View, Link, Text, Button, Card, Icon } from '@idealyst/components';

export const LinkExamples = () => {
  const handlePress = (linkType: string) => {
    console.log(`Link pressed: ${linkType}`);
  };

  return (
    <Screen background="primary">
      <View spacing="none">
        <Text size="lg" weight="bold" align="center">
          Link Examples
        </Text>

        {/* Basic Text Links */}
        <View spacing="md">
          <Text size="md" weight="semibold">Basic Text Links</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/home" onPress={() => handlePress('home')}>
              <Text color="primary">Go to Home</Text>
            </Link>
            <Link to="/settings" onPress={() => handlePress('settings')}>
              <Text color="primary">Settings</Text>
            </Link>
            <Link to="/profile" onPress={() => handlePress('profile')}>
              <Text color="primary">Profile</Text>
            </Link>
          </View>
        </View>

        {/* Links with Path Variables */}
        <View spacing="md">
          <Text size="md" weight="semibold">Links with Path Variables</Text>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            <Link
              to="/user/:id"
              vars={{ id: '123' }}
              onPress={() => handlePress('user-123')}
            >
              <Text color="primary">View User #123</Text>
            </Link>
            <Link
              to="/product/:category/:id"
              vars={{ category: 'electronics', id: '456' }}
              onPress={() => handlePress('product')}
            >
              <Text color="primary">Electronics Product #456</Text>
            </Link>
            <Link
              to="/post/:slug"
              vars={{ slug: 'hello-world' }}
              onPress={() => handlePress('post')}
            >
              <Text color="primary">Read "Hello World" Post</Text>
            </Link>
          </View>
        </View>

        {/* Links Wrapping Buttons */}
        <View spacing="md">
          <Text size="md" weight="semibold">Links Wrapping Buttons</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/dashboard" onPress={() => handlePress('dashboard-btn')}>
              <Button type="contained" intent="primary">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/create" onPress={() => handlePress('create-btn')}>
              <Button type="contained" intent="success" leftIcon="plus">
                Create New
              </Button>
            </Link>
            <Link to="/help" onPress={() => handlePress('help-btn')}>
              <Button type="outlined" intent="neutral">
                Get Help
              </Button>
            </Link>
          </View>
        </View>

        {/* Links with Icons and Text */}
        <View spacing="md">
          <Text size="md" weight="semibold">Links with Icons</Text>
          <View style={{ flexDirection: 'column', gap: 12 }}>
            <Link to="/notifications" onPress={() => handlePress('notifications')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="bell" size={20} intent="primary" />
                <Text color="primary">Notifications</Text>
              </View>
            </Link>
            <Link to="/messages" onPress={() => handlePress('messages')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="email" size={20} intent="primary" />
                <Text color="primary">Messages</Text>
              </View>
            </Link>
            <Link to="/favorites" onPress={() => handlePress('favorites')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="heart" size={20} intent="error" />
                <Text color="primary">Favorites</Text>
              </View>
            </Link>
          </View>
        </View>

        {/* Disabled Links */}
        <View spacing="md">
          <Text size="md" weight="semibold">Disabled Links</Text>
          <View style={{ flexDirection: 'column', gap: 12 }}>
            <Link to="/restricted" disabled onPress={() => handlePress('disabled-text')}>
              <Text color="secondary">Restricted Area (Disabled)</Text>
            </Link>
            <Link to="/premium" disabled onPress={() => handlePress('disabled-btn')}>
              <Button type="contained" intent="primary" disabled>
                Premium Feature
              </Button>
            </Link>
          </View>
        </View>

        {/* Links Wrapping Cards */}
        <View spacing="md">
          <Text size="md" weight="semibold">Clickable Cards (Links)</Text>
          <View style={{ flexDirection: 'column', gap: 12 }}>
            <Link to="/article/1" onPress={() => handlePress('card-1')}>
              <Card type="outlined" padding="md">
                <Text size="md" weight="semibold">Article Title</Text>
                <Text size="sm" color="secondary">
                  Click this card to read the full article...
                </Text>
              </Card>
            </Link>
            <Link to="/article/2" onPress={() => handlePress('card-2')}>
              <Card type="elevated" padding="md">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Icon name="file-document" size={24} intent="primary" />
                  <View style={{ flex: 1 }}>
                    <Text size="md" weight="semibold">Documentation</Text>
                    <Text size="sm" color="secondary">
                      View the complete documentation
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="gray.500" />
                </View>
              </Card>
            </Link>
          </View>
        </View>

        {/* Navigation Menu Style */}
        <View spacing="md">
          <Text size="md" weight="semibold">Navigation Menu Style</Text>
          <Card type="filled" padding="none">
            <Link to="/menu/home" onPress={() => handlePress('menu-home')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
                <Icon name="home" size={20} intent="primary" />
                <Text style={{ flex: 1 }}>Home</Text>
                <Icon name="chevron-right" size={16} color="gray.500" />
              </View>
            </Link>
            <Link to="/menu/search" onPress={() => handlePress('menu-search')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
                <Icon name="magnify" size={20} intent="primary" />
                <Text style={{ flex: 1 }}>Search</Text>
                <Icon name="chevron-right" size={16} color="gray.500" />
              </View>
            </Link>
            <Link to="/menu/account" onPress={() => handlePress('menu-account')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
                <Icon name="account" size={20} intent="primary" />
                <Text style={{ flex: 1 }}>Account</Text>
                <Icon name="chevron-right" size={16} color="gray.500" />
              </View>
            </Link>
          </Card>
        </View>

        {/* Styled Links */}
        <View spacing="md">
          <Text size="md" weight="semibold">Custom Styled Links</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Link
              to="/styled/1"
              style={{
                backgroundColor: '#e3f2fd',
                padding: 12,
                borderRadius: 8
              }}
              onPress={() => handlePress('styled-1')}
            >
              <Text color="primary">Styled Container</Text>
            </Link>
            <Link
              to="/styled/2"
              style={{
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: '#2196f3',
                padding: 12,
                borderRadius: 8
              }}
              onPress={() => handlePress('styled-2')}
            >
              <Text color="primary">Bordered Link</Text>
            </Link>
          </View>
        </View>
      </View>
    </Screen>
  );
};
