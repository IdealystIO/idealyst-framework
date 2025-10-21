import React, { useState } from 'react';
import { View, Text, Button, Divider, ListItem, Icon, Badge } from '@idealyst/components';
import { useNavigator } from '../context';
import { Outlet } from '../router';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';
import { getNextTheme, getThemeDisplayName, isHighContrastTheme } from './unistyles';
import ExampleSidebar from './ExampleSidebar';
import ExampleSearchDialog from './ExampleSearchDialog';


export const ExampleWebLayout: React.FC = () => {
    const navigator = useNavigator();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const currentTheme = UnistylesRuntime.themeName || 'light';
    const { theme } = useUnistyles();

    const cycleTheme = () => {
        const nextTheme = getNextTheme(currentTheme);
        UnistylesRuntime.setTheme(nextTheme as any);
    };

    const sidebarWidth = sidebarCollapsed ? 0 : 280;

    return (
        <View background='primary' style={{ height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <View style={{
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: theme.colors.border.primary,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button
                        variant="text"
                        leftIcon="menu"
                        size="lg"
                        onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
                        style={{ padding: 8 }}
                    />
                    <Button variant='text' size="lg">
                        <Text weight="bold" size="lg">
                            Idealyst Components
                        </Text>
                    </Button>
                    <Badge color='green'>
                        {getThemeDisplayName(currentTheme)}
                    </Badge>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Button
                        leftIcon="magnify"
                        size='lg'
                        intent='neutral'
                        variant='text'
                        onPress={() => setShowSearch(true)}
                    />
                    <Button
                        variant="outlined"
                        intent="primary"
                        size="sm"
                        onPress={cycleTheme}
                    >
                        Cycle Theme
                    </Button>
                </View>
            </View>

            {/* Search Dialog */}
            <ExampleSearchDialog open={showSearch} onOpenChange={setShowSearch} />

            {/* Main Content Area with Sidebar */}
            <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
                {/* Sidebar */}
                <View style={{
                    width: sidebarWidth,
                    height: '100%',
                    borderRightWidth: sidebarCollapsed ? 0 : 1,
                    borderRightStyle: 'solid',
                    borderRightColor: theme.colors.border.primary,
                    transition: 'width 0.3s ease, border-right-width 0.3s ease',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}>
                    {!sidebarCollapsed && (
                        <ExampleSidebar />
                    )}
                </View>

                {/* Content Area */}
                <View style={{
                    flex: 1,
                    overflowY: 'auto',
                }}>
                    <View style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                        <Outlet key={currentTheme} />
                    </View>
                </View>
            </View>
        </View>
    );
};
