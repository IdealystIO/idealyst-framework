import React, { useState } from 'react';
import { TabBarLayout, TabBarItem } from '../layouts/TabBarLayout/index.web';
import { Screen, Text, View, Button, Icon, Badge } from '../../../components/src';
import { UnistylesRuntime } from 'react-native-unistyles';
import { getNextTheme, getThemeDisplayName } from './unistyles';

const ExampleTabBarLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [tabPosition, setTabPosition] = useState<'bottom' | 'header' | 'auto'>('auto');
  const [showHeader, setShowHeader] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showBackButton, setShowBackButton] = useState(false);
  const [headerMode, setHeaderMode] = useState<'native' | 'custom'>('native');
  
  const currentTheme = UnistylesRuntime.themeName || 'light';
  
  const cycleTheme = () => {
    const nextTheme = getNextTheme(currentTheme);
    UnistylesRuntime.setTheme(nextTheme as any);
  };
  
  const tabItems: TabBarItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Icon name="home" size="md" />,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <Icon name="magnify" size="md" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Icon name="bell" size="md" />,
      badge: notificationCount,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <Icon name="account" size="md" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Icon name="cog" size="md" />,
      disabled: false,
    },
  ];
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View spacing="lg">
            <Text size="large" weight="bold">Home Screen</Text>
            <Text>Welcome to the TabBarLayout example!</Text>
            <Text size="small">This layout demonstrates:</Text>
            <View spacing="sm">
              <Text size="small">• Mobile-first tab bar at bottom</Text>
              <Text size="small">• Responsive web support (tabs move to header on wide screens)</Text>
              <Text size="small">• Customizable tab buttons with icons and badges</Text>
              <Text size="small">• Platform-specific adaptations</Text>
            </View>
          </View>
        );
        
      case 'search':
        return (
          <View spacing="lg">
            <Text size="large" weight="bold">Search</Text>
            <Text>Search functionality would go here</Text>
          </View>
        );
        
      case 'notifications':
        return (
          <View spacing="lg">
            <Text size="large" weight="bold">Notifications</Text>
            <Text>You have {notificationCount} new notifications</Text>
            <Button 
              variant="outlined" 
              onPress={() => setNotificationCount(0)}
              style={{ marginTop: 16 }}
            >
              Clear All
            </Button>
          </View>
        );
        
      case 'profile':
        return (
          <View spacing="lg">
            <Text size="large" weight="bold">Profile</Text>
            <Text>User profile information would be displayed here</Text>
          </View>
        );
        
      case 'settings':
        return (
          <View spacing="lg">
            <Text size="large" weight="bold">Settings</Text>
            
            <View spacing="md" style={{ marginTop: 16 }}>
              <Text size="medium" weight="semibold">Layout Options</Text>
              
              <View spacing="sm">
                <Text size="small">Tab Position:</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button 
                    variant={tabPosition === 'auto' ? 'contained' : 'outlined'}
                    size="small"
                    onPress={() => setTabPosition('auto')}
                  >
                    Auto
                  </Button>
                  <Button 
                    variant={tabPosition === 'bottom' ? 'contained' : 'outlined'}
                    size="small"
                    onPress={() => setTabPosition('bottom')}
                  >
                    Bottom
                  </Button>
                  <Button 
                    variant={tabPosition === 'header' ? 'contained' : 'outlined'}
                    size="small"
                    onPress={() => setTabPosition('header')}
                  >
                    Header
                  </Button>
                </View>
              </View>
              
              <Button 
                variant="outlined"
                onPress={() => setShowHeader(!showHeader)}
              >
                {showHeader ? 'Hide' : 'Show'} Header
              </Button>
              
              <Button 
                variant="outlined"
                onPress={() => setShowBackButton(!showBackButton)}
              >
                {showBackButton ? 'Hide' : 'Show'} Back Button
              </Button>

              <View spacing="sm">
                <Text size="small">Header Mode:</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button 
                    variant={headerMode === 'native' ? 'contained' : 'outlined'}
                    size="small"
                    onPress={() => setHeaderMode('native')}
                  >
                    Native
                  </Button>
                  <Button 
                    variant={headerMode === 'custom' ? 'contained' : 'outlined'}
                    size="small"
                    onPress={() => setHeaderMode('custom')}
                  >
                    Custom
                  </Button>
                </View>
              </View>
              
              <Button 
                variant="outlined"
                onPress={() => setNotificationCount(n => n + 1)}
              >
                Add Notification Badge
              </Button>
            </View>
            
            <View spacing="md" style={{ marginTop: 24 }}>
              <Text size="medium" weight="semibold">Theme</Text>
              <Text size="small">Current: {getThemeDisplayName(currentTheme)}</Text>
              <Button variant="outlined" onPress={cycleTheme}>
                Change Theme
              </Button>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <TabBarLayout
      header={{
        enabled: showHeader,
        height: 64,
        title: headerMode === 'native' ? 'TabBar Example' : undefined,
        showBackButton: showBackButton,
        onBackPress: showBackButton ? () => console.log('Back pressed!') : undefined,
        native: headerMode === 'native',
        content: headerMode === 'custom' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Text size="large" weight="bold">TabBar Example</Text>
            <Badge variant="filled" size="small">
              Position: {tabPosition}
            </Badge>
          </View>
        ) : undefined,
        rightContent: (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text size="small">{getThemeDisplayName(currentTheme)}</Text>
          </View>
        ),
      }}
      tabBar={{
        items: tabItems,
        activeTab,
        onTabSelect: setActiveTab,
        position: tabPosition,
        autoBreakpoint: 768,
      }}
    >
      <Screen>
        {renderContent()}
      </Screen>
    </TabBarLayout>
  );
};

export default ExampleTabBarLayout;