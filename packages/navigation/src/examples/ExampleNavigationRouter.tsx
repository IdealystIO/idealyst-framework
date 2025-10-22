import React from 'react';
import { AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DialogExamples, DividerExamples, IconExamples, InputExamples, PopoverExamples, ScreenExamples, SelectExamples, SliderExamples, SVGImageExamples, TextExamples, ViewExamples, ThemeExtensionExamples, SwitchExamples, RadioButtonExamples, ProgressExamples, TextAreaExamples, TabBarExamples, TooltipExamples, AccordionExamples, ListExamples, TableExamples, MenuExamples, ImageExamples, VideoExamples, AlertExamples, SkeletonExamples, ChipExamples, BreadcrumbExamples } from '@idealyst/components/examples';
import { DataGridShowcase } from '@idealyst/datagrid/examples';
import { DatePickerExamples } from '@idealyst/datepicker/examples';
import { Text, View, Card, Screen } from '@idealyst/components';
import { NavigatorParam, RouteParam } from '../routing';
import { ExampleWebLayout } from './ExampleWebLayout';
import ExampleSidebar from './ExampleSidebar';
import HeaderRight from './HeaderRight';

const HomeScreen = () => {
    return (
        <Screen>
            <View spacing='lg' padding={12}>
                <Text size="xlarge" weight="bold">
                    Welcome to Idealyst Components
                </Text>

                <Card>
                    <View spacing="md" style={{ padding: 16 }}>
                        <Text size="large" weight="semibold">
                            Getting Started
                        </Text>
                        <Text>
                            Explore the component library using the sidebar navigation. Each component includes examples
                            and demonstrations of various props and configurations.
                        </Text>
                    </View>
                </Card>

                <Card>
                    <View spacing="md" style={{ padding: 16 }}>
                        <Text size="large" weight="semibold">
                            Features
                        </Text>
                        <View spacing="sm">
                            <Text>• Cross-platform components for React and React Native</Text>
                            <Text>• Comprehensive theming system with light/dark modes</Text>
                            <Text>• High contrast accessibility support</Text>
                            <Text>• Responsive design with Unistyles</Text>
                            <Text>• Type-safe component APIs</Text>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View spacing="md" style={{ padding: 16 }}>
                        <Text size="large" weight="semibold">
                            Theme Controls
                        </Text>
                        <Text>
                            Use the theme controls in the header to switch between light/dark themes and
                            toggle high contrast mode for better accessibility.
                        </Text>
                    </View>
                </Card>
            </View>
        </Screen>
    )
};

const ExampleNavigationRouter: NavigatorParam = {
    path: "/",
    type: 'navigator',
    layout: 'drawer',
    sidebarComponent: ExampleSidebar,
    layoutComponent: ExampleWebLayout,
    options: {
        headerRight: HeaderRight,
    },
    routes: [
        { path: "/", type: 'screen', component: HomeScreen, options: { title: "Home" } },
        { path: "avatar", type: 'screen', component: AvatarExamples, options: { title: "Avatar" } },
        { path: "badge", type: 'screen', component: BadgeExamples, options: { title: "Badge" } },
        { path: "button", type: 'screen', component: ButtonExamples, options: { title: "Button" } },
        { path: "card", type: 'screen', component: CardExamples, options: { title: "Card" } },
        { path: "checkbox", type: 'screen', component: CheckboxExamples, options: { title: "Checkbox" } },
        { path: "divider", type: 'screen', component: DividerExamples, options: { title: "Divider" } },
        { path: "input", type: 'screen', component: InputExamples, options: { title: "Input" } },
        { path: "text", type: 'screen', component: TextExamples, options: { title: "Text" } },
        { path: "view", type: 'screen', component: ViewExamples, options: { title: "View" } },
        { path: "screen", type: 'screen', component: ScreenExamples, options: { title: "Screen" } },
        { path: "icon", type: 'screen', component: IconExamples, options: { title: "Icon" } },
        { path: "svg-image", type: 'screen', component: SVGImageExamples, options: { title: "SVG Image" } },
        { path: "dialog", type: 'screen', component: DialogExamples, options: { title: "Dialog" } },
        { path: "popover", type: 'screen', component: PopoverExamples, options: { title: "Popover" } },
        { path: "select", type: 'screen', component: SelectExamples, options: { title: "Select" } },
        { path: "slider", type: 'screen', component: SliderExamples, options: { title: "Slider" } },
        { path: "switch", type: 'screen', component: SwitchExamples, options: { title: "Switch" } },
        { path: "radio-button", type: 'screen', component: RadioButtonExamples, options: { title: "Radio Button" } },
        { path: "progress", type: 'screen', component: ProgressExamples, options: { title: "Progress" } },
        { path: "textarea", type: 'screen', component: TextAreaExamples, options: { title: "Text Area" } },
        { path: "tooltip", type: 'screen', component: TooltipExamples, options: { title: "Tooltip" } },
        { path: "accordion", type: 'screen', component: AccordionExamples, options: { title: "Accordion" } },
        { path: "menu", type: 'screen', component: MenuExamples, options: { title: "Menu" } },
        { path: "list", type: 'screen', component: ListExamples, options: { title: "List" } },
        { path: "table", type: 'screen', component: TableExamples, options: { title: "Table" } },
        { path: "tabbar", type: 'screen', component: TabBarExamples, options: { title: "Tab Bar" } },
        { path: "alert", type: 'screen', component: AlertExamples, options: { title: "Alert" } },
        { path: "skeleton", type: 'screen', component: SkeletonExamples, options: { title: "Skeleton" } },
        { path: "chip", type: 'screen', component: ChipExamples, options: { title: "Chip" } },
        { path: "breadcrumb", type: 'screen', component: BreadcrumbExamples, options: { title: "Breadcrumb" } },
        { path: "image", type: 'screen', component: ImageExamples, options: { title: "Image" } },
        { path: "video", type: 'screen', component: VideoExamples, options: { title: "Video" } },
        { path: "datagrid", type: 'screen', component: DataGridShowcase, options: { title: "Data Grid" } },
        { path: "datepicker", type: 'screen', component: DatePickerExamples, options: { title: "Date Picker" } },
        { path: "theme-extension", type: 'screen', component: ThemeExtensionExamples, options: { title: "Theme Extension" } },
    ],
};

export default ExampleNavigationRouter;