import React from 'react';
import { AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DialogExamples, DividerExamples, IconExamples, InputExamples, PopoverExamples, ScreenExamples, SelectExamples, SliderExamples, SVGImageExamples, TextExamples, ViewExamples, ThemeExtensionExamples, SwitchExamples, RadioButtonExamples, ProgressExamples, TextAreaExamples, TabsExamples, TooltipExamples, AccordionExamples, MenuExamples } from "../../../components/src/examples";
import { DataGridShowcase } from "../../../datagrid/src/examples";
import { DatePickerExamples } from "../../../datepicker/src/examples";
import { Button, Divider, Screen, Text, View } from "../../../components/src";
import { useNavigator } from "../context";
import { UnistylesRuntime } from 'react-native-unistyles';
import { NavigatorParam, RouteParam } from '../routing';
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
                        ♿ Toggle High Contrast 123
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
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/dialog",
                            vars: {},
                        });
                    }}>
                    Dialog
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/popover",
                            vars: {},
                        });
                    }}>
                    Popover
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/select",
                            vars: {},
                        });
                    }}>
                    Select
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/slider",
                            vars: {},
                        });
                    }}>
                    Slider
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/switch",
                            vars: {},
                        });
                    }}>
                    Switch
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/radio-button",
                            vars: {},
                        });
                    }}>
                    RadioButton
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/progress",
                            vars: {},
                        });
                    }}>
                    Progress
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/textarea",
                            vars: {},
                        });
                    }}>
                    TextArea
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/tabs",
                            vars: {},
                        });
                    }}>
                    Tabs
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/tooltip",
                            vars: {},
                        });
                    }}>
                    Tooltip
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/accordion",
                            vars: {},
                        });
                    }}>
                    Accordion
                </Button>
                <Button
                    onPress={() => {
                        navigator.navigate({
                            path: "/menu",
                            vars: {},
                        });
                    }}>
                    Menu
                </Button>

                <Divider spacing="medium" />
                <Text size="small" weight="semibold" color="secondary">Data Components</Text>
                <Button
                    variant="outlined"
                    intent="neutral"
                    onPress={() => {
                        navigator.navigate({
                            path: "/datagrid",
                            vars: {},
                        });
                    }}>
                    📊 DataGrid Showcase
                </Button>
                <Button
                    variant="outlined"
                    intent="neutral"
                    onPress={() => {
                        navigator.navigate({
                            path: "/datepicker",
                            vars: {},
                        });
                    }}>
                    📅 DatePicker Examples
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

const StackRouter: NavigatorParam = {
    path: "/",
    type: 'navigator',
    layout: 'stack',
    routes: [
        { path: "/", type: 'screen', component: HomeScreen },
        { path: "avatar", type: 'screen', component: AvatarExamples},
        { path: "badge", type: 'screen', component: BadgeExamples},
        { path: "button", type: 'screen', component: ButtonExamples},
        { path: "card", type: 'screen', component: CardExamples},
        { path: "checkbox", type: 'screen', component: CheckboxExamples},
        { path: "divider", type: 'screen', component: DividerExamples},
        { path: "input", type: 'screen', component: InputExamples},
        { path: "text", type: 'screen', component: TextExamples},
        { path: "view", type: 'screen', component: ViewExamples},
        { path: "screen", type: 'screen', component: ScreenExamples},
        { path: "icon", type: 'screen', component: IconExamples},
        { path: "svg-image", type: 'screen', component: SVGImageExamples},
        { path: "dialog", type: 'screen', component: DialogExamples},
        { path: "popover", type: 'screen', component: PopoverExamples},
        { path: "select", type: 'screen', component: SelectExamples},
        { path: "slider", type: 'screen', component: SliderExamples},
        { path: "switch", type: 'screen', component: SwitchExamples},
        { path: "radio-button", type: 'screen', component: RadioButtonExamples},
        { path: "progress", type: 'screen', component: ProgressExamples},
        { path: "textarea", type: 'screen', component: TextAreaExamples},
        { path: "tabs", type: 'screen', component: TabsExamples},
        { path: "tooltip", type: 'screen', component: TooltipExamples},
        { path: "accordion", type: 'screen', component: AccordionExamples},
        { path: "menu", type: 'screen', component: MenuExamples},
        { path: "datagrid", type: 'screen', component: DataGridShowcase},
        { path: "datepicker", type: 'screen', component: DatePickerExamples},
        { path: "theme-extension", type: 'screen', component: ThemeExtensionExamples},
    ],
};

export default StackRouter;