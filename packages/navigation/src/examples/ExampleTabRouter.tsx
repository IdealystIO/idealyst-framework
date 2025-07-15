import React from 'react';
import { AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DividerExamples, IconExamples, InputExamples, TextExamples, ViewExamples, ThemeExtensionExamples } from "../../../components/src/examples";
import { Screen, Text, View, Button } from "../../../components/src";
import { UnistylesRuntime } from 'react-native-unistyles';
import { RouteParam } from '../routing';
import { getNextTheme, getThemeDisplayName, isHighContrastTheme } from './unistyles';

const HomeTabScreen = () => {
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
            <View>
                <Text size="large" weight="bold">
                    Welcome to the Component Library
                </Text>
                <Text size="medium">
                    Use the tabs above to explore different components
                </Text>
                
                <View style={{ marginTop: 24, gap: 12 }}>
                    <Text size="medium" weight="semibold">
                        Theme Controls
                    </Text>
                    <Text size="small">
                        Current Theme: {getThemeDisplayName(currentTheme)}
                    </Text>
                    
                    <Button variant="outlined" onPress={cycleTheme}>
                        Cycle Theme (Light → Dark → Light HC → Dark HC)
                    </Button>
                    
                    <Button variant="outlined" onPress={toggleHighContrast}>
                        Toggle High Contrast
                    </Button>
                    
                    {isHighContrastTheme(currentTheme) && (
                        <Text size="small" style={{ fontStyle: 'italic' }}>
                            ♿ High contrast mode is active for better accessibility
                        </Text>
                    )}
                </View>
            </View>
        </Screen>
    );
};

const AvatarTabScreen = () => (
    <Screen>
        <AvatarExamples />
    </Screen>
);

const BadgeTabScreen = () => (
    <Screen>
        <BadgeExamples />
    </Screen>
);

const ButtonTabScreen = () => (
    <Screen>
        <ButtonExamples />
    </Screen>
);

const CardTabScreen = () => (
    <Screen>
        <CardExamples />
    </Screen>
);

const CheckboxTabScreen = () => (
    <Screen>
        <CheckboxExamples />
    </Screen>
);

const DividerTabScreen = () => (
    <Screen>
        <DividerExamples />
    </Screen>
);

const InputTabScreen = () => (
    <Screen>
        <InputExamples />
    </Screen>
);

const TextTabScreen = () => (
    <Screen>
        <TextExamples />
    </Screen>
);

const ViewTabScreen = () => (
    <Screen>
        <ViewExamples />
    </Screen>
);

const IconTabScreen = () => (
    <Screen>
        <IconExamples />
    </Screen>
);

const ThemeExtensionTabScreen = () => (
    <Screen>
        <ThemeExtensionExamples />
    </Screen>
);

const TabRouter: RouteParam = {
    path: "/",
    component: HomeTabScreen,
    layout: {
        type: "tab",
    },
    routes: [
        { path: "avatar", component: AvatarTabScreen },
        { path: "badge", component: BadgeTabScreen },
        { path: "button", component: ButtonTabScreen },
        { path: "card", component: CardTabScreen },
        { path: "checkbox", component: CheckboxTabScreen },
        { path: "divider", component: DividerTabScreen },
        { path: "input", component: InputTabScreen },
        { path: "text", component: TextTabScreen },
        { path: "view", component: ViewTabScreen },
        { path: "icon", component: IconTabScreen },
        { path: "theme-extension", component: ThemeExtensionTabScreen },
    ],
}

export default TabRouter; 