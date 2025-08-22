import React from 'react';
import { AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DialogExamples, DividerExamples, IconExamples, InputExamples, PopoverExamples, TextExamples, ViewExamples, ThemeExtensionExamples } from "../../../components/src/examples";
import { DataGridShowcase } from "../../../datagrid/src/examples";
import { Screen, Text, View, Button } from "../../../components/src";
import { UnistylesRuntime } from 'react-native-unistyles';
import { RouteParam } from '../routing';
import { getNextTheme, getThemeDisplayName, isHighContrastTheme } from './unistyles';

const HomeDrawerScreen = () => {
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
            <View style={{ gap: 16 }}>
                <Text size="large" weight="bold">
                    Welcome to the Component Library
                </Text>
                <Text size="medium">
                    Use the drawer menu to explore different components
                </Text>
                
                <View style={{ gap: 12, padding: 16, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderRadius: 8, marginTop: 8 }}>
                    <Text size="medium" weight="semibold">
                        Theme Controls
                    </Text>
                    <Text size="small">
                        Current Theme: {getThemeDisplayName(currentTheme)}
                    </Text>
                    
                    <View style={{ gap: 8 }}>
                        <Button variant="outlined" onPress={cycleTheme}>
                            🔄 Cycle Theme (Light → Dark → Light HC → Dark HC)
                        </Button>
                        
                        <Button variant="outlined" onPress={toggleHighContrast}>
                            ♿ Toggle High Contrast
                        </Button>
                    </View>
                    
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

const AvatarDrawerScreen = () => (
    <Screen>
        <AvatarExamples />
    </Screen>
);

const BadgeDrawerScreen = () => (
    <Screen>
        <BadgeExamples />
    </Screen>
);

const ButtonDrawerScreen = () => (
    <Screen>
        <ButtonExamples />
    </Screen>
);

const CardDrawerScreen = () => (
    <Screen>
        <CardExamples />
    </Screen>
);

const CheckboxDrawerScreen = () => (
    <Screen>
        <CheckboxExamples />
    </Screen>
);

const DividerDrawerScreen = () => (
    <Screen>
        <DividerExamples />
    </Screen>
);

const InputDrawerScreen = () => (
    <Screen>
        <InputExamples />
    </Screen>
);

const TextDrawerScreen = () => (
    <Screen>
        <TextExamples />
    </Screen>
);

const ViewDrawerScreen = () => (
    <Screen>   
        <ViewExamples />
    </Screen>
);

const IconDrawerScreen = () => (
    <Screen>
        <IconExamples />
    </Screen>
);

const DialogDrawerScreen = () => (
    <Screen>
        <DialogExamples />
    </Screen>
);

const PopoverDrawerScreen = () => (
    <Screen>
        <PopoverExamples />
    </Screen>
);

const DataGridDrawerScreen = () => (
    <Screen>
        <DataGridShowcase />
    </Screen>
);

const ThemeExtensionDrawerScreen = () => (
    <Screen>
        <ThemeExtensionExamples />
    </Screen>
);

const DrawerRouter: RouteParam = {
    path: "/",
    component: HomeDrawerScreen,
    layout: {
        type: "drawer",
    },
    routes: [
        { path: "avatar", component: AvatarDrawerScreen },
        { path: "badge", component: BadgeDrawerScreen },
        { path: "button", component: ButtonDrawerScreen },
        { path: "card", component: CardDrawerScreen },
        { path: "checkbox", component: CheckboxDrawerScreen },
        { path: "divider", component: DividerDrawerScreen },
        { path: "input", component: InputDrawerScreen },
        { path: "text", component: TextDrawerScreen },
        { path: "view", component: ViewDrawerScreen },
        { path: "icon", component: IconDrawerScreen },
        { path: "dialog", component: DialogDrawerScreen },
        { path: "popover", component: PopoverDrawerScreen },
        { path: "datagrid", component: DataGridDrawerScreen },
        { path: "theme-extension", component: ThemeExtensionDrawerScreen },
    ],
};

export default DrawerRouter; 