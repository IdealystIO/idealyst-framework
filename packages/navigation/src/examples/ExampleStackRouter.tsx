import React from 'react';
import { AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DialogExamples, DividerExamples, IconExamples, InputExamples, PopoverExamples, ScreenExamples, SelectExamples, SliderExamples, SVGImageExamples, TextExamples, ViewExamples, ThemeExtensionExamples, SwitchExamples, RadioButtonExamples, ProgressExamples, TextAreaExamples, TabsExamples, TabBarExamples, TooltipExamples, AccordionExamples, ListExamples, TableExamples, MenuExamples, ImageExamples, VideoExamples, AlertExamples, SkeletonExamples, ChipExamples, BreadcrumbExamples } from '@idealyst/components/examples';
import { DataGridShowcase } from '../../../datagrid/src/examples';
import { DatePickerExamples } from '../../../datepicker/src/examples';
import { Text, View, Card } from '@idealyst/components';
import { NavigatorParam, RouteParam } from '../routing';
import { ExampleWebLayout } from './ExampleWebLayout';

const HomeScreen = () => {
    return (
        <View spacing="lg">
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
    )
};

const StackRouter: NavigatorParam = {
    path: "/",
    type: 'navigator',
    layout: 'stack',
    layoutComponent: ExampleWebLayout,
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
        { path: "list", type: 'screen', component: ListExamples},
        { path: "table", type: 'screen', component: TableExamples},
        { path: "tabbar", type: 'screen', component: TabBarExamples},
        { path: "alert", type: 'screen', component: AlertExamples},
        { path: "skeleton", type: 'screen', component: SkeletonExamples},
        { path: "chip", type: 'screen', component: ChipExamples},
        { path: "breadcrumb", type: 'screen', component: BreadcrumbExamples},
        { path: "image", type: 'screen', component: ImageExamples},
        { path: "video", type: 'screen', component: VideoExamples},
        { path: "datagrid", type: 'screen', component: DataGridShowcase},
        { path: "datepicker", type: 'screen', component: DatePickerExamples},
        { path: "theme-extension", type: 'screen', component: ThemeExtensionExamples},
    ],
};

export default StackRouter;