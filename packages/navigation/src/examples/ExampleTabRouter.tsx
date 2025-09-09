import React from 'react';
import { ButtonExamples, CardExamples, IconExamples, SVGImageExamples, ThemeExtensionExamples } from "../../../components/src/examples";
import { Screen, Text, View, Button, Icon } from "../../../components/src";
import { UnistylesRuntime } from 'react-native-unistyles';
import { RouteParam } from '../routing';
import { useNavigator } from '../context';
import { getNextTheme, getThemeDisplayName, isHighContrastTheme } from './unistyles';

const HomeTabScreen = () => {
    const navigator = useNavigator();
    const currentTheme = UnistylesRuntime.themeName || 'light';
    
    const cycleTheme = () => {
        const nextTheme = getNextTheme(currentTheme);
        UnistylesRuntime.setTheme(nextTheme as any);
        console.log('Theme changed to:', nextTheme);
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
        console.log('Theme toggled to:', newTheme);
    };

    return (
        <Screen>
            <View spacing="lg">
                <Text size="large" weight="bold">
                    TabBar Navigation Demo
                </Text>
                <Text size="medium">
                    This demonstrates native tab navigation with screen options
                </Text>
                
                <View spacing="md" style={{ marginTop: 24 }}>
                    <Text size="medium" weight="semibold">Navigation Tabs</Text>
                    <Text size="small">
                        The tabs below use native React Navigation with screen options for icons and labels.
                        On mobile, tabs appear at the bottom. On web, they may adapt based on the platform.
                    </Text>
                    
                    <View spacing="sm">
                        <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/components', vars: {} })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="view-dashboard" size="sm" style={{ marginRight: 8 }} />
                                <Text>Components Tab</Text>
                            </View>
                        </Button>
                        <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/settings', vars: {} })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="cog" size="sm" style={{ marginRight: 8 }} />
                                <Text>Settings Tab</Text>
                            </View>
                        </Button>
                        <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/theme', vars: {} })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="palette" size="sm" style={{ marginRight: 8 }} />
                                <Text>Theme Tab</Text>
                            </View>
                        </Button>
                    </View>
                </View>
                
                <View spacing="md" style={{ marginTop: 24 }}>
                    <Text size="medium" weight="semibold">Theme Controls</Text>
                    <Text size="small">Current Theme: {getThemeDisplayName(currentTheme)}</Text>
                    
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                        <Button variant="outlined" onPress={cycleTheme} style={{ marginRight: 12 }}>
                            Cycle Theme
                        </Button>
                        <Button variant="outlined" onPress={toggleHighContrast}>
                            Toggle High Contrast
                        </Button>
                    </View>
                    
                    {isHighContrastTheme(currentTheme) && (
                        <Text size="small" style={{ fontStyle: 'italic', marginTop: 8 }}>
                            ♿ High contrast mode is active for better accessibility
                        </Text>
                    )}
                </View>
            </View>
        </Screen>
    );
};

const ComponentsTabScreen = () => (
    <Screen>
        <View spacing="lg">
            <Text size="large" weight="bold">Components</Text>
            <Text>Explore UI components with native tab navigation</Text>
            
            <View spacing="md">
                <Text size="medium" weight="semibold">Button Examples</Text>
                <ButtonExamples />
            </View>
            
            <View spacing="md">
                <Text size="medium" weight="semibold">Card Examples</Text>
                <CardExamples />
            </View>
            
            <View spacing="md">
                <Text size="medium" weight="semibold">Icon Examples</Text>
                <IconExamples />
            </View>
            
            <View spacing="md">
                <Text size="medium" weight="semibold">SVG Image Examples</Text>
                <SVGImageExamples />
            </View>
        </View>
    </Screen>
);

const SettingsTabScreen = () => {
    const currentTheme = UnistylesRuntime.themeName || 'light';
    
    return (
        <Screen>
            <View spacing="lg">
                <Text size="large" weight="bold">Settings</Text>
                <Text>Configure the TabBar demo settings</Text>
                
                <View spacing="md">
                    <Text size="medium" weight="semibold">Navigation Info</Text>
                    <Text size="small">
                        This tab uses native navigation with screen options:
                    </Text>
                    <Text size="small">• tabBarIcon: "cog" (Material Design Icons)</Text>
                    <Text size="small">• tabBarLabel: "Settings"</Text>
                    <Text size="small">• title: "Settings"</Text>
                </View>
                
                <View spacing="md">
                    <Text size="medium" weight="semibold">Current State</Text>
                    <Text size="small">Theme: {getThemeDisplayName(currentTheme)}</Text>
                    <Text size="small">Platform: React Navigation (Native) / React Router (Web)</Text>
                </View>
            </View>
        </Screen>
    );
};

const ThemeTabScreen = () => (
    <Screen>
        <View spacing="lg">
            <Text size="large" weight="bold">Theme System</Text>
            <Text>Explore the theme extension system</Text>
            
            <ThemeExtensionExamples />
        </View>
    </Screen>
);

const TabRouter: RouteParam = {
    path: "/",
    component: HomeTabScreen,
    layout: {
        type: "tab",
    },
    screenOptions: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, size }) => {
            return <Icon name="home" color={focused ? 'blue' : 'black'} size={size} />
        },
    },
    routes: [
        { 
            path: "components", 
            component: ComponentsTabScreen,
            screenOptions: {
                title: 'Components',
                tabBarLabel: 'Components',
                tabBarIcon: (props) => {
                    if (props.focused) {
                        return <Icon name="view-dashboard" color={props.focused ? 'blue' : 'black'} size={props.size} />;
                    }
                    return <Icon name="view-dashboard-outline" color={props.color} size={props.size} />;
                },
            },
        },
        { 
            path: "settings", 
            component: SettingsTabScreen,
            screenOptions: {
                title: 'Settings',
                tabBarLabel: 'Settings', 
                tabBarIcon: ({ focused, size }) => (
                    <Icon 
                        name="cog" 
                        color={focused ? 'blue' : 'black'}
                        size={size}
                        style={{ opacity: focused ? 1 : 0.8 }}
                    />
                ),
            },
        },
        { 
            path: "theme", 
            component: ThemeTabScreen,
            screenOptions: {
                title: 'Theme',
                tabBarLabel: 'Theme',
                tabBarIcon: ({ focused, size }) => (
                    <Icon name="palette" color={focused ? 'blue' : 'black'} size={size} />
                ),
            },
        },
    ],
};

export default TabRouter; 