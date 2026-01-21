import React from 'react';
import { ActivityIndicatorExamples, AvatarExamples, BadgeExamples, ButtonExamples, CardExamples, CheckboxExamples, DialogExamples, DividerExamples, IconExamples, InputExamples, LinkExamples, PopoverExamples, ScreenExamples, SelectExamples, SliderExamples, SVGImageExamples, TextExamples, ViewExamples, ThemeExtensionExamples, SwitchExamples, RadioButtonExamples, ProgressExamples, TextAreaExamples, TabBarExamples, TooltipExamples, AccordionExamples, ListExamples, TableExamples, MenuExamples, ImageExamples, VideoExamples, AlertExamples, SkeletonExamples, ChipExamples, BreadcrumbExamples } from '@idealyst/components/examples';
import { DataGridShowcase } from '@idealyst/datagrid/examples';
import { DatePickerExamples } from '@idealyst/datepicker/examples';
import { CameraExamples } from '@idealyst/camera/examples';
import { MicrophoneExamples } from '@idealyst/microphone/examples';
import { AudioPlaybackPage } from '@test-select-demo/shared/pages/packages/AudioPlayback';
import { AnimateExamples } from '@idealyst/animate/examples';
import { LottieExamples } from '@idealyst/lottie/examples';
import { BlurViewExamples } from '@idealyst/blur/examples';
import { MarkdownEditorExamples } from '@idealyst/markdown/examples';
import { Text, View, Card, Screen, Icon, Button } from '@idealyst/components';
import { NavigatorParam, RouteParam, NotFoundComponentProps } from '../routing';
import { ExampleWebLayout } from './ExampleWebLayout';
import ExampleSidebar from './ExampleSidebar';
import HeaderRight from './HeaderRight';
import { useNavigator } from '../context';

/**
 * Global 404 Not Found screen - shown for invalid routes at the root level
 */
const NotFoundScreen = ({ path, params }: NotFoundComponentProps) => {
    const { navigate } = useNavigator();

    return (
        <Screen>
            <View spacing='lg' padding={12} style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Icon name="alert-circle-outline" size={64} color="red" />
                <Text size="xl" weight="bold">
                    Page Not Found
                </Text>
                <Text size="md" color="secondary">
                    The page you're looking for doesn't exist.
                </Text>
                <Card style={{ marginTop: 16, padding: 16 }}>
                    <View spacing="sm">
                        <Text size="sm" weight="semibold">Attempted path:</Text>
                        <Text size="sm" color="secondary">{path}</Text>
                        {params && Object.keys(params).length > 0 && (
                            <>
                                <Text size="sm" weight="semibold" style={{ marginTop: 8 }}>Params:</Text>
                                <Text size="sm" color="secondary">{JSON.stringify(params, null, 2)}</Text>
                            </>
                        )}
                    </View>
                </Card>
                <Button
                    style={{ marginTop: 24 }}
                    onPress={() => navigate({ path: '/', replace: true })}
                >
                    Go Home
                </Button>
            </View>
        </Screen>
    );
};

/**
 * Settings-specific 404 screen - a simpler, more minimal style
 */
const SettingsNotFoundScreen = ({ path, params }: NotFoundComponentProps) => {
    const { navigate } = useNavigator();

    return (
        <Screen>
            <View spacing='md' padding={12} style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#f5f5f5' }}>
                <Icon name="cog-off-outline" size={48} color="orange" />
                <Text size="lg" weight="semibold">
                    Settings Page Not Found
                </Text>
                <Text size="sm" color="secondary" style={{ textAlign: 'center', maxWidth: 300 }}>
                    The settings page "{path}" doesn't exist. You've been redirected here.
                </Text>
                <View direction="row" spacing="md" style={{ marginTop: 16 }}>
                    <Button
                        type="outlined"
                        size="sm"
                        onPress={() => navigate({ path: '/settings', replace: true })}
                    >
                        Settings Home
                    </Button>
                    <Button
                        size="sm"
                        onPress={() => navigate({ path: '/', replace: true })}
                    >
                        Go Home
                    </Button>
                </View>
            </View>
        </Screen>
    );
};

/**
 * FullScreen Example - demonstrates a screen that renders without parent layout
 * This screen will NOT have the sidebar, header, or any parent navigator chrome
 */
const FullScreenExample = () => {
    const { navigate } = useNavigator();

    return (
        <Screen>
            <View
                spacing="lg"
                padding={12}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1a1a2e',
                }}
            >
                <Icon name="fullscreen" size={80} color="white" />
                <Text size="xxl" weight="bold" style={{ color: 'white', marginTop: 24 }}>
                    Full Screen Mode
                </Text>
                <Text size="md" style={{ color: '#aaa', textAlign: 'center', maxWidth: 400, marginTop: 8 }}>
                    This screen renders outside of the parent layout. Notice there's no sidebar,
                    header, or any navigation chrome from the parent navigator.
                </Text>
                <Card style={{ marginTop: 32, padding: 24, maxWidth: 500 }}>
                    <View spacing="md">
                        <Text size="lg" weight="semibold">How it works</Text>
                        <Text size="sm" color="secondary">
                            Add <Text weight="semibold">fullScreen: true</Text> to the screen's options:
                        </Text>
                        <View style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginTop: 8 }}>
                            <Text size="sm" style={{ fontFamily: 'monospace' }}>
                                {`{
  path: "fullscreen-demo",
  type: 'screen',
  component: FullScreenExample,
  options: { fullScreen: true }
}`}
                            </Text>
                        </View>
                        <Text size="sm" color="secondary" style={{ marginTop: 8 }}>
                            Use cases: Onboarding flows, media viewers, immersive experiences, modal-like screens.
                        </Text>
                    </View>
                </Card>
                <Button
                    style={{ marginTop: 32 }}
                    intent="primary"
                    onPress={() => navigate({ path: '/', replace: false })}
                >
                    Back to Home
                </Button>
            </View>
        </Screen>
    );
};

// Settings section screens
const SettingsHomeScreen = () => (
    <Screen>
        <View spacing='lg' padding={12}>
            <Text size="xl" weight="bold">Settings</Text>
            <Text size="md" color="secondary">Manage your application settings</Text>
            <Card style={{ marginTop: 16, padding: 16 }}>
                <View spacing="sm">
                    <Text size="sm">Navigate to:</Text>
                    <Text size="sm" color="secondary">• /settings/general - General settings</Text>
                    <Text size="sm" color="secondary">• /settings/account - Account settings</Text>
                    <Text size="sm" color="secondary">• /settings/invalid - Test 404 (will show SettingsNotFoundScreen)</Text>
                    <Text size="sm" color="secondary">• /settings/redirect-me - Test redirect handler</Text>
                </View>
            </Card>
        </View>
    </Screen>
);

const GeneralSettingsScreen = () => (
    <Screen>
        <View spacing='lg' padding={12}>
            <Text size="xl" weight="bold">General Settings</Text>
            <Text size="md" color="secondary">Configure general app preferences</Text>
        </View>
    </Screen>
);

const AccountSettingsScreen = () => (
    <Screen>
        <View spacing='lg' padding={12}>
            <Text size="xl" weight="bold">Account Settings</Text>
            <Text size="md" color="secondary">Manage your account</Text>
        </View>
    </Screen>
);

/**
 * Nested Settings Navigator with its own error handling:
 * - onInvalidRoute: Redirects /settings/redirect-* to /settings/general
 * - notFoundComponent: Shows SettingsNotFoundScreen for other invalid routes
 */
const SettingsNavigator: NavigatorParam = {
    path: "settings",
    type: 'navigator',
    layout: 'stack',
    notFoundComponent: SettingsNotFoundScreen,
    onInvalidRoute: (invalidPath) => {
        // Example: Redirect old/deprecated paths to the general settings
        if (invalidPath.includes('redirect')) {
            console.log(`[Settings] Redirecting "${invalidPath}" to /settings/general`);
            return { path: '/settings/general', replace: true };
        }
        // Return undefined to show the notFoundComponent instead
        console.log(`[Settings] Showing 404 for "${invalidPath}"`);
        return undefined;
    },
    routes: [
        { path: "", type: 'screen', component: SettingsHomeScreen, options: { title: "Settings" } },
        { path: "general", type: 'screen', component: GeneralSettingsScreen, options: { title: "General" } },
        { path: "account", type: 'screen', component: AccountSettingsScreen, options: { title: "Account" } },
    ],
};

const HomeScreen = () => {
    const { navigate } = useNavigator();

    return (
        <Screen>
            <View spacing='lg' padding={12}>
                <Text size="xl" weight="bold">
                    Welcome to Idealyst Components
                </Text>

                <Card>
                    <View spacing="md" style={{ padding: 16 }}>
                        <Text size="lg" weight="semibold">
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
                        <Text size="lg" weight="semibold">
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
                        <Text size="lg" weight="semibold">
                            Theme Controls
                        </Text>
                        <Text>
                            Use the theme controls in the header to switch between light/dark themes and
                            toggle high contrast mode for better accessibility.
                        </Text>
                    </View>
                </Card>

                <Card>
                    <View spacing="md" style={{ padding: 16 }}>
                        <Text size="lg" weight="semibold">
                            Full Screen Mode
                        </Text>
                        <Text>
                            Screens can opt-out of parent layout inheritance using the fullScreen option.
                            This is useful for onboarding flows, media viewers, or immersive experiences.
                        </Text>
                        <Button
                            style={{ marginTop: 12 }}
                            type="outlined"
                            onPress={() => navigate({ path: '/fullscreen-demo' })}
                        >
                            Try Full Screen Demo
                        </Button>
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
    notFoundComponent: NotFoundScreen,
    options: {
        headerRight: HeaderRight,
    },
    routes: [
        { path: "/", type: 'screen', component: HomeScreen, options: { title: "Home" } },
        // FullScreen demo - renders without parent layout (no sidebar/header)
        { path: "fullscreen-demo", type: 'screen', component: FullScreenExample, options: { title: "Full Screen Demo", fullScreen: true } },
        // Nested settings navigator with its own 404 handling
        SettingsNavigator,
        { path: "activity-indicator", type: 'screen', component: ActivityIndicatorExamples, options: { title: "Activity Indicator" } },
        { path: "avatar", type: 'screen', component: AvatarExamples, options: { title: "Avatar" } },
        { path: "badge", type: 'screen', component: BadgeExamples, options: { title: "Badge" } },
        { path: "button", type: 'screen', component: ButtonExamples, options: { title: "Button" } },
        { path: "card", type: 'screen', component: CardExamples, options: { title: "Card" } },
        { path: "checkbox", type: 'screen', component: CheckboxExamples, options: { title: "Checkbox" } },
        { path: "divider", type: 'screen', component: DividerExamples, options: { title: "Divider" } },
        { path: "input", type: 'screen', component: InputExamples, options: { title: "Input" } },
        { path: "link", type: 'screen', component: LinkExamples, options: { title: "Link" } },
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
        { path: "camera", type: 'screen', component: CameraExamples, options: { title: "Camera" } },
        { path: "microphone", type: 'screen', component: MicrophoneExamples, options: { title: "Microphone" } },
        { path: "audio-playback", type: 'screen', component: AudioPlaybackPage, options: { title: "Audio Playback" } },
        { path: "datagrid", type: 'screen', component: DataGridShowcase, options: { title: "Data Grid" } },
        { path: "datepicker", type: 'screen', component: DatePickerExamples, options: { title: "Date Picker" } },
        { path: "animate", type: 'screen', component: AnimateExamples, options: { title: "Animate" } },
        { path: "lottie", type: 'screen', component: LottieExamples, options: { title: "Lottie" } },
        { path: "blur", type: 'screen', component: BlurViewExamples, options: { title: "Blur" } },
        { path: "markdown-editor", type: 'screen', component: MarkdownEditorExamples, options: { title: "Markdown Editor" } },
        { path: "theme-extension", type: 'screen', component: ThemeExtensionExamples, options: { title: "Theme Extension" } },
    ],
};

export default ExampleNavigationRouter;