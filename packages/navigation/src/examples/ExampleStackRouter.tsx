import React, { useState } from 'react';
import { AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DividerExamples, IconExamples, InputExamples, ScreenExamples, TextExamples, ViewExamples, ThemeExtensionExamples } from "../../../components/src/examples";
import { Button, Divider, Screen, Text, View } from "../../../components/src";
import { useNavigator } from "../context";
import { UnistylesRuntime, StyleSheet } from 'react-native-unistyles';
import { GeneralLayout } from '../layouts/GeneralLayout';
import { RouteParam } from '../routing';
import { getNextTheme, getThemeDisplayName, isHighContrastTheme } from './unistyles';

const HomeScreen = () => {
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
            <View style={{ maxWidth: 800, width: '100%', gap: 10, marginHorizontal: 'auto' }}>
            {/* Theme Controls Section */}
            <View style={{ gap: 12, padding: 16, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderRadius: 8 }}>
                <Text size="medium" weight="bold">
                    Theme Controls
                </Text>
                <Text size="small">
                    Current Theme: {getThemeDisplayName(currentTheme)}
                </Text>
                
                <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        intent="primary"
                        size="medium"
                        onPress={cycleTheme}
                    >
                        🔄 Cycle Theme
                    </Button>
                    
                    <Button
                        variant="outlined"
                        intent="neutral"
                        size="medium"
                        onPress={toggleHighContrast}
                    >
                        ♿ Toggle High Contrast
                    </Button>
                </View>
                
                {isHighContrastTheme(currentTheme) && (
                    <Text size="small" style={{ fontStyle: 'italic', color: '#666' }}>
                        ♿ High contrast mode is active for better accessibility
                    </Text>
                )}
            </View>

            {/* Component Navigation Buttons */}
            <View style={{ gap: 10 }}>
                <Button
                    onPress={() => {
                    navigator.navigate({
                        path: "/avatar",
                        vars: {},
                    });
                }}>
                    Avatar
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/badge",
                            vars: {},
                        });
                    }}>
                    Badge
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/button",
                            vars: {},
                        });
                    }}>
                    Button
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/card",
                            vars: {},
                        });
                    }}>
                    Card
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/checkbox",
                            vars: {},
                        });
                    }}>
                    Checkbox
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/divider",
                            vars: {},
                        });
                    }}>
                    Divider
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/input",
                            vars: {},
                        });
                    }}>
                    Input
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/text",
                            vars: {},
                        });
                    }}>
                    Text
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/view",
                            vars: {},
                        });
                    }}>
                    View
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/screen",
                            vars: {},
                        });
                    }}>
                    Screen
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/icon",
                            vars: {},
                        });
                    }}>
                    Icon
                </Button>
                
                <Divider spacing="medium" />
                <Text size="small" weight="semibold" color="secondary">Theme System</Text>
                <Button
                    variant="outlined"
                    intent="success"
                    onPress={() => {
                        navigator.navigate({
                            path: "/theme-extension",
                            vars: {},
                        });
                    }}>
                    🎨 Theme Extension Demo
                </Button>
            </View>
            </View>
        </Screen>
    )
};

const WrappedGeneralLayout = (props: any) => {

    const navigator = useNavigator();

    return (
        <GeneralLayout
            header={{
                content: <Text style={{ marginHorizontal: 'auto' }} color="inverse">Stack Router Demo App</Text>,
            }}
            sidebar={{
                enabled: true,
                collapsible: true,
                position: 'left',
                initiallyExpanded: false,
                content: <Button onPress={() => {
                    navigator.navigate({
                        path: "/",
                        vars: {},
                    });
                }}>Home</Button>,
            }}
            {...props}>
        </GeneralLayout>
    )
}

const StackRouter: RouteParam = {
    path: "/",
    component: HomeScreen,
    layout: {
        type: "stack",
        component: WrappedGeneralLayout,
    },
    routes: [
        { path: "avatar", component: AvatarExamples},
        { path: "badge", component: BadgeExamples},
        { path: "button", component: ButtonExamples},
        { path: "card", component: CardExamples},
        { path: "checkbox", component: CheckboxExamples},
        { path: "divider", component: DividerExamples},
        { path: "input", component: InputExamples},
        { path: "text", component: TextExamples},
        { path: "view", component: ViewExamples},
        { path: "screen", component: ScreenExamples},
        { path: "icon", component: IconExamples},
        { path: "theme-extension", component: ThemeExtensionExamples},
    ],
};

export default StackRouter;