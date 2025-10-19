import React, { useState } from 'react';
import { View, Text, Button, Divider, ListItem, Icon, Badge } from '@idealyst/components';
import { useNavigator } from '../context';
import { Outlet } from '../router';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';
import { getNextTheme, getThemeDisplayName, isHighContrastTheme } from './unistyles';
import { T } from 'react-router/dist/development/index-react-server-client-BYr9g50r';

interface ComponentGroup {
    title: string;
    items: Array<{
        label: string;
        path: string;
        icon?: string;
    }>;
}

const componentGroups: ComponentGroup[] = [
    {
        title: 'Form',
        items: [
            { label: 'Button', path: '/button', icon: 'gesture-tap' },
            { label: 'Checkbox', path: '/checkbox', icon: 'checkbox-marked' },
            { label: 'Input', path: '/input', icon: 'form-textbox' },
            { label: 'RadioButton', path: '/radio-button', icon: 'radiobox-marked' },
            { label: 'Select', path: '/select', icon: 'form-dropdown' },
            { label: 'Slider', path: '/slider', icon: 'tune' },
            { label: 'Switch', path: '/switch', icon: 'toggle-switch' },
            { label: 'TextArea', path: '/textarea', icon: 'note-text' },
        ],
    },
    {
        title: 'Display',
        items: [
            { label: 'Accordion', path: '/accordion', icon: 'chevron-down' },
            { label: 'Alert', path: '/alert', icon: 'information' },
            { label: 'Avatar', path: '/avatar', icon: 'account-circle' },
            { label: 'Badge', path: '/badge', icon: 'label' },
            { label: 'Card', path: '/card', icon: 'credit-card' },
            { label: 'Chip', path: '/chip', icon: 'label' },
            { label: 'Icon', path: '/icon', icon: 'emoticon' },
            { label: 'List', path: '/list', icon: 'format-list-bulleted' },
            { label: 'Skeleton', path: '/skeleton', icon: 'timer-sand-empty' },
            { label: 'Text', path: '/text', icon: 'format-text' },
        ],
    },
    {
        title: 'Layout',
        items: [
            { label: 'Divider', path: '/divider', icon: 'minus' },
            { label: 'Screen', path: '/screen', icon: 'cellphone' },
            { label: 'View', path: '/view', icon: 'view-compact' },
        ],
    },
    {
        title: 'Navigation',
        items: [
            { label: 'Breadcrumb', path: '/breadcrumb', icon: 'chevron-right' },
            { label: 'TabBar', path: '/tabbar', icon: 'tab' },
            { label: 'Tabs', path: '/tabs', icon: 'tab' },
        ],
    },
    {
        title: 'Overlay',
        items: [
            { label: 'Dialog', path: '/dialog', icon: 'picture-in-picture-bottom-right' },
            { label: 'Menu', path: '/menu', icon: 'menu' },
            { label: 'Popover', path: '/popover', icon: 'message' },
            { label: 'Tooltip', path: '/tooltip', icon: 'help' },
        ],
    },
    {
        title: 'Feedback',
        items: [
            { label: 'Progress', path: '/progress', icon: 'timer-sand-empty' },
        ],
    },
    {
        title: 'Media',
        items: [
            { label: 'Image', path: '/image', icon: 'image' },
            { label: 'SVG Image', path: '/svg-image', icon: 'image' },
            { label: 'Video', path: '/video', icon: 'video' },
        ],
    },
    {
        title: 'Data',
        items: [
            { label: 'DataGrid', path: '/datagrid', icon: 'grid' },
            { label: 'DatePicker', path: '/datepicker', icon: 'calendar-today' },
            { label: 'Table', path: '/table', icon: 'table' },
        ],
    },
    {
        title: 'Theme',
        items: [
            { label: 'Theme Extension', path: '/theme-extension', icon: 'palette' },
        ],
    },
];

export const ExampleWebLayout: React.FC = () => {
    const navigator = useNavigator();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const currentTheme = UnistylesRuntime.themeName || 'light';
    const { theme } = useUnistyles();

    const cycleTheme = () => {
        const nextTheme = getNextTheme(currentTheme);
        UnistylesRuntime.setTheme(nextTheme as any);
    };

    const toggleHighContrast = () => {
        const currentTheme = UnistylesRuntime.themeName || 'light';
        let newTheme: string;

        if (isHighContrastTheme(currentTheme)) {
            newTheme = currentTheme.includes('dark') ? 'dark' : 'light';
        } else {
            newTheme = currentTheme.includes('dark') ? 'darkHighContrast' : 'lightHighContrast';
        }

        UnistylesRuntime.setTheme(newTheme as any);
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
                        variant="outlined"
                        intent="primary"
                        size="sm"
                        onPress={cycleTheme}
                    >
                        Cycle Theme
                    </Button>
                </View>
            </View>

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
                        <View style={{
                            height: '100%',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}>
                        <View style={{ padding: 16 }}>
                            {componentGroups.map((group, groupIndex) => (
                                <View key={group.title} style={{ marginBottom: 16 }}>
                                    <Text
                                        size="sm"
                                        weight="bold"
                                        color="secondary"
                                        style={{ marginBottom: 8, marginLeft: 8 }}
                                    >
                                        {group.title}
                                    </Text>
                                    {group.items.map((item) => (
                                        <ListItem
                                            key={item.path}
                                            label={item.label}
                                            leading={item.icon}
                                            size="sm"
                                            onPress={() => navigator.navigate({ path: item.path, vars: {} })}
                                        />
                                    ))}
                                    {groupIndex < componentGroups.length - 1 && (
                                        <Divider spacing="sm" style={{ marginTop: 8 }} />
                                    )}
                                </View>
                            ))}
                        </View>
                        </View>
                    )}
                </View>

                {/* Content Area */}
                <View style={{
                    flex: 1,
                    overflowY: 'auto',
                }}>
                    <View style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                        <Outlet />
                    </View>
                </View>
            </View>
        </View>
    );
};
