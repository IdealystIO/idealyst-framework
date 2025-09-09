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
                    This demonstrates native tab navigation with custom headers
                </Text>
                
                <View spacing="sm" style={{ padding: 12, backgroundColor: 'rgba(0,150,255,0.1)', borderRadius: 8 }}>
                    <Text size="small" weight="semibold">📋 Header Features Demonstrated:</Text>
                    <Text size="small">• headerTitle: Custom title component with icon</Text>
                    <Text size="small">• headerLeft: Menu button (appears before title)</Text>
                    <Text size="small">• headerRight: Multiple action buttons</Text>
                    <Text size="small">• Cross-platform: Works on both mobile and web</Text>
                </View>
                
                <View spacing="md" style={{ marginTop: 24 }}>
                    <Text size="medium" weight="semibold">Navigation Tabs</Text>
                    <Text size="small">
                        Each tab demonstrates different header configurations:
                    </Text>
                    <Text size="small">• Home: Custom headerTitle, headerLeft menu, headerRight actions</Text>
                    <Text size="small">• Components: Simple headerLeft back button, headerRight refresh</Text>
                    <Text size="small">• Settings: String headerTitle override, help + menu buttons</Text>
                    <Text size="small">• Theme: Component headerTitle with icon, save button</Text>
                    
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
            <Text>Explore UI components with custom header navigation</Text>
            
            <View spacing="sm" style={{ padding: 12, backgroundColor: 'rgba(100,200,100,0.1)', borderRadius: 8 }}>
                <Text size="small" weight="semibold">🔧 This tab demonstrates:</Text>
                <Text size="small">• headerLeft: Back arrow button</Text>
                <Text size="small">• headerRight: Refresh action button</Text>
                <Text size="small">• Default title: Uses 'Components' from screenOptions</Text>
            </View>
            
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
                
                <View spacing="sm" style={{ padding: 12, backgroundColor: 'rgba(255,150,0,0.1)', borderRadius: 8 }}>
                    <Text size="small" weight="semibold">⚙️ This tab demonstrates:</Text>
                    <Text size="small">• headerTitle: String override ('App Settings')</Text>
                    <Text size="small">• headerLeft: Chevron back button</Text>
                    <Text size="small">• headerRight: Help + menu buttons</Text>
                    <Text size="small">• Notice: Title in header != tab title</Text>
                </View>
                
                <View spacing="md">
                    <Text size="medium" weight="semibold">Screen Options Used</Text>
                    <Text size="small" style={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.05)', padding: 8 }}>
                        screenOptions: {{
  title: 'Settings',{"\n"}
  headerTitle: 'App Settings',{"\n"}
  headerLeft: () => &lt;BackButton /&gt;,{"\n"}
  headerRight: () => &lt;ActionButtons /&gt;
}}
                    </Text>
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
            <Text>Explore the theme extension system with custom header</Text>
            
            <View spacing="sm" style={{ padding: 12, backgroundColor: 'rgba(150,0,255,0.1)', borderRadius: 8 }}>
                <Text size="small" weight="semibold">🎨 This tab demonstrates:</Text>
                <Text size="small">• headerTitle: React component with icon + text</Text>
                <Text size="small">• headerRight: Styled save button</Text>
                <Text size="small">• Custom styling: Intent colors and typography</Text>
            </View>
            
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
        headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="home" size="md" style={{ marginRight: 8 }} />
                <Text size="large" weight="bold">Tab Demo</Text>
            </View>
        ),
        headerLeft: () => (
            <Button variant="text" size="small">
                <Icon name="menu" size="md" />
            </Button>
        ),
        headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button variant="text" size="small" style={{ marginRight: 8 }}>
                    <Icon name="bell" size="md" />
                </Button>
                <Button variant="text" size="small">
                    <Icon name="account" size="md" />
                </Button>
            </View>
        ),
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
                headerLeft: () => (
                    <Button variant="text" size="small">
                        <Icon name="arrow-left" size="md" />
                    </Button>
                ),
                headerRight: () => (
                    <Button variant="text" size="small">
                        <Icon name="refresh" size="md" />
                    </Button>
                ),
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
                headerTitle: 'App Settings',
                headerLeft: () => (
                    <Button variant="text" size="small">
                        <Icon name="chevron-left" size="md" />
                    </Button>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>
                        <Button variant="text" size="small" style={{ marginRight: 4 }}>
                            <Icon name="help-circle" size="md" />
                        </Button>
                        <Button variant="text" size="small">
                            <Icon name="dots-vertical" size="md" />
                        </Button>
                    </View>
                ),
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
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="palette" size="sm" style={{ marginRight: 6 }} />
                        <Text size="medium" weight="semibold">Theme System</Text>
                    </View>
                ),
                headerRight: () => (
                    <Button variant="contained" size="small" intent="primary">
                        <Text size="small" color="white">Save</Text>
                    </Button>
                ),
                tabBarLabel: 'Theme',
                tabBarIcon: ({ focused, size }) => (
                    <Icon name="palette" color={focused ? 'blue' : 'black'} size={size} />
                ),
            },
        },
    ],
};

export default TabRouter; 