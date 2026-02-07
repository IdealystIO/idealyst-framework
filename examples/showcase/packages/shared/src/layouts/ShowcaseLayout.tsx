import React from 'react';
import { View, Text, Button, IconButton, Icon, Badge } from '@idealyst/components';
import { useNavigator, Outlet } from '@idealyst/navigation';
import type { TabLayoutProps, StackLayoutProps } from '@idealyst/navigation';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useTheme, ThemeSettings } from '@idealyst/theme';

/**
 * Custom Tab Layout for the Idealyst Showcase app.
 * Features:
 * - Header with app title, theme toggle, and settings
 * - Bottom tab bar navigation
 * - Centered content area with max-width
 */
export const ShowcaseTabLayout: React.FC<TabLayoutProps> = ({
  routes,
  currentPath,
}) => {
  const navigator = useNavigator();
  const theme = useTheme();
  const currentTheme = UnistylesRuntime.themeName || 'light';

  const cycleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    ThemeSettings.setTheme(nextTheme, nextTheme);
  };

  // Check if a route is active
  const isRouteActive = (routePath: string) => {
    const fullPath = routePath || '/';
    
    // Trim leading slash for comparison
    const trimmedCurrentPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
    const trimmedRoutePath = fullPath.startsWith('/') ? fullPath.slice(1) : fullPath;
    return trimmedCurrentPath === trimmedRoutePath;
  };

  return (
    <View
      background="primary"
      style={{ height: '100vh', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.primary,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 800,
          width: '100%',
        }}
      >
        <View padding={'md'} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="cube-outline" size={24} intent="primary" />
          <Text typography='h4'>
            Idealyst Showcase
          </Text>
          <Badge color={currentTheme === 'dark' ? 'purple' : 'blue'}>
            {currentTheme === 'dark' ? 'Dark' : 'Light'}
          </Badge>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <IconButton
            type="outlined"
            size="sm"
            icon={currentTheme === 'dark' ? 'weather-sunny' : 'weather-night'}
            onPress={cycleTheme}
            accessibilityLabel="Toggle theme"
          />
          <IconButton
            type="text"
            icon="cog-outline"
            size="md"
            onPress={() => navigator.navigate({ path: '/settings' })}
            accessibilityLabel="Settings"
          />
        </View>
      </View>

      {/* Content Area */}
      <View
        style={{
          flex: 1,
          overflowY: 'auto',
          width: '100%',
        }}
      >
        <View
          style={{
            maxWidth: 800,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Outlet />
        </View>
      </View>

      {/* Bottom Tab Bar */}
      <View
        style={{
          alignSelf: 'stretch',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: theme.colors.border.primary,
          backgroundColor: theme.colors.surface.primary,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ alignItems: 'center', width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              maxWidth: 400,
              width: '100%',
            }}
          >
            {routes.map((route) => {
              const isActive = isRouteActive(route.fullPath);
              const tabOptions = route.options as any;

              return (
                <Button
                  key={route.path || 'home'}
                  type="text"
                  intent={isActive ? 'primary' : 'neutral'}
                  size="sm"
                  style={{
                    flexDirection: 'column',
                    gap: 4,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    minWidth: 64,
                  }}
                  onPress={() => {
                    navigator.navigate({ path: route.fullPath || '/' })
                  }}
                >
                  <View style={{ alignItems: 'center', gap: 4 }}>
                    {tabOptions?.tabBarIcon?.({
                      focused: isActive,
                      color: isActive
                        ? theme.intents.primary.primary
                        : theme.colors.text.secondary,
                      size: 24,
                    })}
                    <Text
                      typography="caption"
                      weight={isActive ? 'semibold' : 'normal'}
                      color={isActive ? 'primary' : 'secondary'}
                    >
                      {tabOptions?.tabBarLabel || route.options?.headerTitle || route.path || 'Home'}
                    </Text>
                  </View>
                </Button>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * Custom Stack Layout for the Idealyst Showcase app.
 * Features:
 * - Centered content with max-width of 800px
 * - Full height layout
 * - Left/right borders on content area
 */
export const ShowcaseStackLayout: React.FC<StackLayoutProps> = ({
  options,
  routes,
}) => {
  const theme = useTheme();

  return (
    <View
      background="secondary"
      style={{
        height: '100vh',
        flexDirection: 'column',
        overflow: 'hidden',
        alignItems: 'center',
      }}
    >
      {/* Content Area */}
      <View
        background="primary"
        style={{
          flex: 1,
          overflowY: 'auto',
          maxWidth: 800,
          width: '100%',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: theme.colors.border.primary,
          borderRightColor: theme.colors.border.primary,
          borderLeftStyle: 'solid',
          borderRightStyle: 'solid',
        }}
      >
        <Outlet />
      </View>
    </View>
  );
};

export default ShowcaseTabLayout;
