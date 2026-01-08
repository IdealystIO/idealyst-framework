import React, { useState } from 'react';
import { View, Text, Button, Badge } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';
import { Outlet } from 'react-router-dom';
import { useUnistyles, UnistylesRuntime } from 'react-native-unistyles';
import { DocsSidebar } from './DocsSidebar';

export const DocsLayout: React.FC = () => {
  const { navigate } = useNavigator();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useUnistyles();
  const currentTheme = UnistylesRuntime.themeName || 'light';

  const cycleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    UnistylesRuntime.setTheme(nextTheme as any);
  };

  const sidebarWidth = sidebarCollapsed ? 0 : 280;

  return (
    <View background="primary" style={{ height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <View
        style={{
          paddingRight: 32,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.colors.border.primary,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            type="text"
            leftIcon="menu"
            size="lg"
            onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ padding: 8 }}
          />
          <Button type="text" size="lg" onPress={() => navigate({ path: '/' })}>
            <Text weight="bold" size="lg">
              Idealyst Docs
            </Text>
          </Button>
          <Badge color="blue">{currentTheme}</Badge>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Button
            type="outlined"
            intent="primary"
            size="sm"
            onPress={cycleTheme}
          >
            Toggle Theme
          </Button>
        </View>
      </View>

      {/* Main Content Area with Sidebar */}
      <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
        {/* Sidebar */}
        <View
          style={{
            width: sidebarWidth,
            height: '100%',
            borderRightWidth: sidebarCollapsed ? 0 : 1,
            borderRightStyle: 'solid',
            borderRightColor: theme.colors.border.primary,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {!sidebarCollapsed && <DocsSidebar />}
        </View>

        {/* Content Area */}
        <View style={{ flex: 1, overflowY: 'auto' }}>
          <View style={{ padding: 24, width: '100%' }}>
            <Outlet />
          </View>
        </View>
      </View>
    </View>
  );
};
