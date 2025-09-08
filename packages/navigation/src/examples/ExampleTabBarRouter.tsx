import React from 'react';
import { AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DialogExamples, DividerExamples, IconExamples, InputExamples, PopoverExamples, TextExamples, ViewExamples, ThemeExtensionExamples } from "../../../components/src/examples";
import { DataGridShowcase } from "../../../datagrid/src/examples";
import { DatePickerExamples } from "../../../datepicker/src/examples";
import { Screen, Text, View, Button, Icon } from "../../../components/src";
import { UnistylesRuntime } from 'react-native-unistyles';
import { RouteParam } from '../routing';
import { useNavigator } from '../context';
import { getNextTheme, getThemeDisplayName, isHighContrastTheme } from './unistyles';


const HomeTabBarScreen = () => {
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
            // Switch to standard variant
            newTheme = currentTheme.includes('dark') ? 'dark' : 'light';
        } else {
            // Switch to high contrast variant
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
                    This demonstrates the TabBarLayout integrated with the routing system
                </Text>
                
                <View spacing="md" style={{ marginTop: 24 }}>
                    <Text size="medium" weight="semibold">Quick Navigation</Text>
                    
                    <View spacing="sm">
                        <Text size="small" weight="semibold" color="secondary">Components</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/avatar', vars: {} })}>
                                Avatar
                            </Button>
                            <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/button', vars: {} })}>
                                Button
                            </Button>
                            <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/card', vars: {} })}>
                                Card
                            </Button>
                        </View>
                    </View>

                    <View spacing="sm">
                        <Text size="small" weight="semibold" color="secondary">Data Components</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/datagrid', vars: {} })}>
                                DataGrid
                            </Button>
                            <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/datepicker', vars: {} })}>
                                DatePicker
                            </Button>
                        </View>
                    </View>

                    <View spacing="sm">
                        <Text size="small" weight="semibold" color="secondary">Form Components</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/input', vars: {} })}>
                                Input
                            </Button>
                            <Button size="small" variant="outlined" onPress={() => navigator.navigate({ path: '/checkbox', vars: {} })}>
                                Checkbox
                            </Button>
                        </View>
                    </View>
                </View>
                
                <View spacing="md" style={{ marginTop: 24 }}>
                    <Text size="medium" weight="semibold">Theme Controls</Text>
                    <Text size="small">Current Theme: {getThemeDisplayName(currentTheme)}</Text>
                    
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                        <Button variant="outlined" onPress={cycleTheme}>
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

const AvatarTabBarScreen = () => (
    <Screen>
        <AvatarExamples />
    </Screen>
);

const BadgeTabBarScreen = () => (
    <Screen>
        <BadgeExamples />
    </Screen>
);

const ButtonTabBarScreen = () => (
    <Screen>
        <ButtonExamples />
    </Screen>
);

const CardTabBarScreen = () => (
    <Screen>
        <CardExamples />
    </Screen>
);

const CheckboxTabBarScreen = () => (
    <Screen>
        <CheckboxExamples />
    </Screen>
);

const DividerTabBarScreen = () => (
    <Screen>
        <DividerExamples />
    </Screen>
);

const InputTabBarScreen = () => (
    <Screen>
        <InputExamples />
    </Screen>
);

const TextTabBarScreen = () => (
    <Screen>
        <TextExamples />
    </Screen>
);

const ViewTabBarScreen = () => (
    <Screen>
        <ViewExamples />
    </Screen>
);

const IconTabBarScreen = () => (
    <Screen>
        <IconExamples />
    </Screen>
);

const DialogTabBarScreen = () => (
    <Screen>
        <DialogExamples />
    </Screen>
);

const PopoverTabBarScreen = () => (
    <Screen>
        <PopoverExamples />
    </Screen>
);

const DataGridTabBarScreen = () => (
    <Screen>
        <DataGridShowcase />
    </Screen>
);

const DatePickerTabBarScreen = () => (
    <Screen>
        <DatePickerExamples />
    </Screen>
);

const ThemeExtensionTabBarScreen = () => (
    <Screen>
        <ThemeExtensionExamples />
    </Screen>
);

const TabBarRouter: RouteParam = {
    path: "/",
    component: HomeTabBarScreen,
    layout: {
        type: "tab",
    },
    screenOptions: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: 'home',
    },
    routes: [
        // Components Tab
        { 
            path: "components", 
            component: AvatarTabBarScreen, 
            screenOptions: {
                title: 'Components',
                tabBarLabel: 'Components',
                tabBarIcon: 'view-dashboard',
            },
            routes: [
                { path: "avatar", component: AvatarTabBarScreen, screenOptions: { title: 'Avatar' } },
                { path: "badge", component: BadgeTabBarScreen, screenOptions: { title: 'Badge' } },
                { path: "button", component: ButtonTabBarScreen, screenOptions: { title: 'Button' } },
                { path: "card", component: CardTabBarScreen, screenOptions: { title: 'Card' } },
                { path: "checkbox", component: CheckboxTabBarScreen, screenOptions: { title: 'Checkbox' } },
                { path: "divider", component: DividerTabBarScreen, screenOptions: { title: 'Divider' } },
                { path: "text", component: TextTabBarScreen, screenOptions: { title: 'Text' } },
                { path: "view", component: ViewTabBarScreen, screenOptions: { title: 'View' } },
                { path: "icon", component: IconTabBarScreen, screenOptions: { title: 'Icon' } },
                { path: "dialog", component: DialogTabBarScreen, screenOptions: { title: 'Dialog' } },
                { path: "popover", component: PopoverTabBarScreen, screenOptions: { title: 'Popover' } },
            ],
        },
        // Data Tab
        { 
            path: "data", 
            component: DataGridTabBarScreen,
            screenOptions: {
                title: 'Data',
                tabBarLabel: 'Data',
                tabBarIcon: 'database',
            },
            routes: [
                { path: "datagrid", component: DataGridTabBarScreen, screenOptions: { title: 'DataGrid' } },
                { path: "datepicker", component: DatePickerTabBarScreen, screenOptions: { title: 'DatePicker' } },
            ],
        },
        // Forms Tab
        { 
            path: "forms", 
            component: InputTabBarScreen,
            screenOptions: {
                title: 'Forms',
                tabBarLabel: 'Forms', 
                tabBarIcon: 'form-select',
            },
            routes: [
                { path: "input", component: InputTabBarScreen, screenOptions: { title: 'Input' } },
            ],
        },
        // Theme Tab
        { 
            path: "theme", 
            component: ThemeExtensionTabBarScreen,
            screenOptions: {
                title: 'Theme',
                tabBarLabel: 'Theme',
                tabBarIcon: 'palette',
            },
            routes: [
                { path: "theme-extension", component: ThemeExtensionTabBarScreen, screenOptions: { title: 'Theme Extension' } },
            ],
        },
    ],
};

export default TabBarRouter;