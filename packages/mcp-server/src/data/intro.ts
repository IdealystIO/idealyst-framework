/**
 * Idealyst Framework Introduction
 *
 * A comprehensive overview designed to orient LLM agents before they start building.
 * Covers the framework paradigm, component conventions, correct prop names,
 * available packages, and common pitfalls to avoid.
 */

export const idealystIntro = `# Idealyst Framework — Quick Reference

## What is Idealyst?

Idealyst is a **cross-platform React component framework** for building apps that run on iOS, Android, and Web from a single codebase. All UI comes from \`@idealyst/components\` — never use raw React Native primitives (\`<RNView>\`, \`<RNText>\`, etc.) directly.

## Core Import

\`\`\`tsx
import { View, Text, Button, TextInput, Card, Icon, ... } from '@idealyst/components';
\`\`\`

All UI components come from this single package. Do NOT import from \`react-native\` for UI.

---

## Available Components (37)

### Layout
\`View\`, \`Card\`, \`Screen\`, \`Divider\`, \`Grid\`

### Form
\`TextInput\`, \`TextArea\`, \`Select\`, \`Checkbox\`, \`RadioButton\`, \`Slider\`, \`Switch\`, \`Button\`, \`IconButton\`

### Display
\`Text\`, \`Avatar\`, \`Badge\`, \`Chip\`, \`Icon\`, \`Image\`, \`SVGImage\`, \`Video\`

### Navigation
\`Link\`, \`Breadcrumb\`, \`Tabs\`, \`TabBar\`

### Data
\`List\`, \`Table\`, \`Accordion\`

### Overlay
\`Dialog\`, \`Menu\`, \`Popover\`, \`Tooltip\`

### Feedback
\`Alert\`, \`ActivityIndicator\`, \`Progress\`, \`Skeleton\`, \`Pressable\`

---

## Critical Prop Conventions

### Text Component
\`\`\`tsx
// CORRECT — use 'typography' for text sizing, 'color' for semantic colors
<Text typography="h5" weight="bold" color="primary">Title</Text>
<Text typography="body1" color="secondary">Body text</Text>
<Text typography="body2" color="danger">Error message</Text>
<Text typography="caption" color="tertiary">Small print</Text>

// WRONG — these props DO NOT exist on Text:
// ❌ variant, intent, size, fontSize
\`\`\`

**Typography values:** \`h1\`, \`h2\`, \`h3\`, \`h4\`, \`h5\`, \`h6\`, \`subtitle1\`, \`subtitle2\`, \`body1\`, \`body2\`, \`caption\`. **NOT** \`button\` or \`overline\` (these don't exist)

**Weight values:** \`light\`, \`normal\`, \`medium\`, \`semibold\`, \`bold\`

**Color values:** \`primary\`, \`secondary\`, \`tertiary\`, \`inverse\`, \`inverse-secondary\`, \`inverse-tertiary\`, \`danger\`

### TextInput Component
\`\`\`tsx
// CORRECT
<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Enter text"
  intent="danger"           // for error state visual
  secureTextEntry            // for passwords
  inputMode="email"          // NOT keyboardType
  textContentType="emailAddress"  // NOT autoComplete
/>

// WRONG — these props DO NOT exist on TextInput:
// ❌ label, error, editable, autoComplete, keyboardType, onChange (use onChangeText)
// Use 'editable' on React Native's TextInput, but NOT on Idealyst's TextInput
\`\`\`

To show a labeled input with error, compose it manually:
\`\`\`tsx
<View>
  <Text typography="body2" weight="semibold">Email</Text>
  <TextInput value={email} onChangeText={setEmail} intent={error ? 'danger' : undefined} />
  {error && <Text typography="body2" color="danger">{error}</Text>}
</View>
\`\`\`

### Button Component
\`\`\`tsx
<Button onPress={handlePress} intent="primary" size="md" loading={isLoading} disabled={isDisabled}>
  Submit
</Button>
// type prop: 'contained' | 'outlined' | 'text'
\`\`\`

### Intent & Size (Theme Values)
Most interactive components support:
- **intent:** \`primary\`, \`secondary\`, \`success\`, \`warning\`, \`danger\`, \`info\`, \`neutral\`
- **size:** \`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`

**Important:** \`Text\` does NOT have \`intent\` or \`size\` — use \`typography\` and \`color\` instead.

### Icon Component
\`\`\`tsx
<Icon name="email-outline" size={24} intent="primary" />
\`\`\`
Icons use Material Design Icon names (7,447 available). Use \`search_icons\` tool to find names. Icons are hyphenated: \`arrow-down\`, \`account-circle\`, \`lock-outline\`.

**Important:** The \`name\` prop is typed as \`IconName\` (a union of all icon literals), NOT \`string\`. If you create helper components that accept an icon name, import and use \`IconName\`:
\`\`\`tsx
import type { IconName } from '@idealyst/components';

function SettingRow({ icon, label }: { icon: IconName; label: string }) {
  return <Icon name={icon} size="sm" />;
}
\`\`\`

### Link Component
\`\`\`tsx
// Link is a navigation link — 'to' prop is REQUIRED
<Link to="/terms" onPress={onTermsPress}>Terms and Conditions</Link>
<Link to="/settings">Go to Settings</Link>

// WRONG — 'to' is required, Link is not just pressable text:
// ❌ <Link onPress={handler}>Click me</Link>
\`\`\`

---

## Available Packages

| Package | Purpose |
|---------|---------|
| \`@idealyst/components\` | All UI components (required) |
| \`@idealyst/theme\` | Theming, theme switching, color scheme |
| \`@idealyst/navigation\` | Cross-platform routing |
| \`@idealyst/storage\` | Key-value storage |
| \`@idealyst/translate\` | Internationalization (i18n) |
| \`@idealyst/camera\` | Photo/video capture |
| \`@idealyst/audio\` | PCM audio streaming & playback (NOT file recording) |
| \`@idealyst/files\` | File picking & upload |
| \`@idealyst/oauth-client\` | OAuth2 authentication |
| \`@idealyst/config\` | Environment variables |
| \`@idealyst/charts\` | Data visualization |
| \`@idealyst/datagrid\` | Virtualized data tables |
| \`@idealyst/datepicker\` | Date/time selection |
| \`@idealyst/markdown\` | Markdown rendering |
| \`@idealyst/animate\` | Cross-platform animations |
| \`@idealyst/lottie\` | Lottie animations |

### Storage API
\`\`\`tsx
import { storage } from '@idealyst/storage';

// Methods (all async, string values only):
await storage.getItem('key');                        // Returns string | null
await storage.setItem('key', JSON.stringify(value)); // Stores string
await storage.removeItem('key');
await storage.clear();
await storage.getAllKeys();
\`\`\`

### Theme API
\`\`\`tsx
import {
  configureThemes,
  ThemeSettings,
  getColorScheme,
  useTheme,
  lightTheme,
  darkTheme,
  fromTheme,
} from '@idealyst/theme';
\`\`\`

**Initial setup** (call once at app startup, before any component renders):
\`\`\`tsx
const light = fromTheme(lightTheme).build();
const dark  = fromTheme(darkTheme).build();

configureThemes({ themes: { light, dark } });
\`\`\`

**Switching themes at runtime:**
\`\`\`tsx
ThemeSettings.setTheme('dark', 'dark');   // (themeName, contentColor)
ThemeSettings.setTheme('light', 'light');
\`\`\`

**Other ThemeSettings methods:**
\`\`\`tsx
ThemeSettings.getThemeName();             // returns 'light' | 'dark' | ...
ThemeSettings.setAdaptiveThemes(true);    // follow system dark mode
ThemeSettings.setAdaptiveThemes(false);   // manual control
\`\`\`

**Reading theme in components:**
\`\`\`tsx
const theme = useTheme();
const bg = theme.colors.surface.primary;
\`\`\`

**System color scheme:**
\`\`\`tsx
const scheme = getColorScheme(); // 'light' | 'dark' | null
\`\`\`

> **IMPORTANT:** Never import from \`react-native-unistyles\` directly. Use the \`@idealyst/theme\` utilities above (\`configureThemes\`, \`ThemeSettings\`, \`useTheme\`). Direct Unistyles usage causes type errors and breaks cross-platform compatibility.

### Navigation API

**Setup** — use \`NavigatorProvider\` (NOT \`Router\`):
\`\`\`tsx
import { NavigatorProvider } from '@idealyst/navigation';
import type { TabNavigatorParam } from '@idealyst/navigation';

const route: TabNavigatorParam = {
  type: 'navigator',
  path: '/',
  layout: 'tab',        // 'tab' | 'stack' | 'drawer'
  routes: [
    {
      type: 'screen',
      path: '/',
      component: HomeScreen,
      options: { title: 'Home', tabBarIcon: ({ focused }) => <Icon name="home" size="sm" /> },
    },
    {
      type: 'screen',
      path: '/settings',
      component: SettingsScreen,
      options: { title: 'Settings' },
    },
  ],
};

export function App() {
  return <NavigatorProvider route={route} />;
}
\`\`\`

**Navigator types:** \`TabNavigatorParam\`, \`StackNavigatorParam\`, \`DrawerNavigatorParam\`
- Drawer uses \`sidebarComponent\` prop (NOT \`drawerContent\`)
- Each screen has \`type: 'screen'\`, \`path\`, \`component\`, and optional \`options\`
- A tab/drawer route can be a nested navigator (e.g. a stack inside a tab)

**Nesting a stack navigator inside a tab:**
\`\`\`tsx
import type { TabNavigatorParam, StackNavigatorParam } from '@idealyst/navigation';

// Define the stack navigator for the Home tab
const homeStack: StackNavigatorParam = {
  type: 'navigator',
  path: '/',
  layout: 'stack',
  routes: [
    { type: 'screen', path: '/', component: HomeScreen, options: { title: 'Home' } },
    { type: 'screen', path: '/detail/:id', component: DetailScreen, options: { title: 'Detail' } },
  ],
};

// Place it directly in the tab routes — do NOT spread it
const route: TabNavigatorParam = {
  type: 'navigator',
  path: '/',
  layout: 'tab',
  routes: [
    {
      ...homeStack,                    // spread the WHOLE stack navigator object
      options: {                       // tab-level options (overrides homeStack.options)
        title: 'Home',
        tabBarIcon: ({ focused }) => <Icon name={focused ? 'home' : 'home-outline'} size="sm" />,
      },
    },
    { type: 'screen', path: '/search', component: SearchScreen, options: { title: 'Search' } },
  ],
};
\`\`\`
> **IMPORTANT:** When nesting, spread the entire stack object first, then override \`options\`. Do NOT add \`type: 'navigator'\` before the spread — it would be overwritten. The spread already includes \`type: 'navigator'\`.

**Navigating between screens:**
\`\`\`tsx
import { useNavigator } from '@idealyst/navigation';

const { navigate, goBack, replace, canGoBack } = useNavigator();
navigate({ path: '/settings' });
navigate({ path: '/user/123', state: { fromDashboard: true } });
goBack();
\`\`\`

**Route parameters and state:**
\`\`\`tsx
import { useParams, useNavigationState, useCurrentPath } from '@idealyst/navigation';

const params = useParams();          // { id: '123' }
const path = useCurrentPath();       // '/user/123'

// useNavigationState returns Record<string, unknown> by default.
// ALWAYS provide a type parameter for type safety:
const state = useNavigationState<{ fromDashboard?: string; title?: string }>();
// state.fromDashboard is string | undefined, state.title is string | undefined
\`\`\`

> **IMPORTANT:** There is NO \`Router\` export. Use \`NavigatorProvider\`. The \`navigate()\` function always takes an object: \`{ path, replace?, state?, vars? }\` — never \`navigate('/path')\` or \`navigate('routeName', params)\`.

---

## Common Mistakes to Avoid

1. **Text:** Using \`variant\`, \`intent\`, or \`size\` — use \`typography\`, \`color\`, and \`weight\` instead. Valid typography: \`h1\`–\`h6\`, \`subtitle1\`, \`subtitle2\`, \`body1\`, \`body2\`, \`caption\`. **NOT** \`title\`, \`headline\`, \`subtitle\` (must use \`h5\`, \`h6\`, \`subtitle1\`).
2. **TextInput:** Using \`label\`, \`error\`, \`editable\`, \`autoComplete\`, \`keyboardType\`, or \`onChange\` — compose labels/errors manually, use \`inputMode\` and \`textContentType\`. Valid inputMode: \`text\`, \`email\`, \`password\`, \`number\`. **NOT** \`search\`, \`decimal\`, \`tel\`, \`url\`. The \`editable\` prop does NOT exist — to disable, use \`disabled\` or wrap conditionally.
3. **TextArea:** Different from TextInput — TextArea DOES support \`label\`, \`error\`, \`rows\`, and \`onChange\` props.
4. **Storage:** Using \`storage.get()\` / \`storage.set()\` — use \`storage.getItem()\` / \`storage.setItem()\` (string-only). \`getItem()\` returns \`Promise<string | null>\` — always handle the \`null\` case
5. **Navigation:** Using \`Router\`, \`useNavigate()\`, or \`navigate('/path')\` — use \`NavigatorProvider\`, \`useNavigator()\`, and \`navigate({ path })\`
6. **Input vs TextInput:** The component is called \`TextInput\`, not \`Input\`
7. **React Native primitives:** Never use \`<TouchableOpacity>\`, \`<FlatList>\`, \`<ScrollView>\`, \`Animated\`, \`Dimensions\` from react-native — use Idealyst's \`Pressable\`, \`List\`, \`Screen\`, \`@idealyst/animate\`, etc. **Important:** Idealyst's \`List\` is a layout container that takes \`children\` — NOT a data-driven component like FlatList. Do NOT pass \`data\`, \`renderItem\`, or \`keyExtractor\` props. Instead, map your data and render children: \`<List>{items.map(item => <View key={item.id}>...</View>)}</List>\`
8. **Unistyles direct usage:** Never import \`UnistylesRuntime\` or \`StyleSheet.configure\` from \`react-native-unistyles\` — use \`ThemeSettings\`, \`configureThemes\`, and \`useTheme\` from \`@idealyst/theme\`
9. **Icon name typing:** When passing icon names through props, type them as \`IconName\` (from \`@idealyst/components\`), NOT \`string\` — otherwise TypeScript will error on \`<Icon name={prop} />\`
10. **Skeleton:** Use \`<Skeleton>\` from \`@idealyst/components\` with \`animation="pulse"\` — do NOT build custom skeletons with \`Animated\` from react-native
11. **Link:** The \`Link\` component requires a \`to\` prop (path string) — it's a navigation link, not just pressable text. Use \`<Link to="/terms" onPress={onPress}>Text</Link>\`, NOT \`<Link onPress={onPress}>Text</Link>\`
12. **View border:** \`View\`'s \`border\` prop only accepts \`'none' | 'thin' | 'thick'\` — NOT \`'outline'\`, \`'default'\`, or \`'solid'\`
13. **Button/IconButton type:** Both use \`type\` prop with values \`'contained' | 'outlined' | 'text'\` — NOT \`'ghost'\`, \`'solid'\`, \`'default'\`, or \`'flat'\`
14. **Avatar:** Uses \`src\` for image URL, \`fallback\` for initials text — NOT \`name\`, \`initials\`, or \`label\`. Shape: \`'circle' | 'square'\`
15. **Audio:** \`@idealyst/audio\` is a **PCM streaming** library — NOT file-based recording. \`recorder.stop()\` returns \`void\`, not a file URI. \`subscribeToData()\` delivers \`PCMData\` (with \`buffer: ArrayBufferLike\`) — NOT strings. \`feedPCMData()\` accepts \`ArrayBufferLike | Int16Array\` — NOT strings or base64. Call \`get_audio_guide\` with topic \`api\` for the full type reference
16. **useNavigationState:** Returns \`Record<string, unknown>\` by default. Always provide a type parameter: \`useNavigationState<{ title?: string }>()\` — otherwise accessing properties gives \`unknown\` which is not assignable to \`ReactNode\`
17. **Text:** Does NOT have \`numberOfLines\`, \`ellipsizeMode\`, or \`selectable\` props — these are React Native primitives, not available on Idealyst's \`Text\`. Props: \`typography\`, \`weight\`, \`color\`, \`align\`, \`style\`, \`children\`
18. **Badge type:** Only accepts \`'filled' | 'outlined' | 'dot'\` — NOT \`'soft'\`, \`'subtle'\`, \`'solid'\`, or \`'default'\`
19. **Files:** \`useFilePicker()\` returns \`{ pick, files, isPicking, ... }\`. The method is \`pick()\` — NOT \`pickFiles()\`, \`openPicker()\`, or \`selectFiles()\`. \`FileType\` is \`'image' | 'video' | 'audio' | 'document' | 'archive' | 'any'\` — NOT \`'pdf'\`, \`'doc'\`, \`'xlsx'\`. Use \`customMimeTypes\` for specific formats. \`PickedFile\` has \`dimensions?: { width, height }\` — NOT top-level \`width\`/\`height\`. Call \`get_files_guide\` with topic \`api\` for the full type reference
20. **Camera:** The component is \`CameraPreview\`, NOT \`Camera\`. Permission is \`requestPermission()\` — NOT \`requestCameraPermission\` or a hook. \`CameraStatus\` is an **interface** (with \`.state\`, \`.permission\`), NOT a string — do NOT compare it to strings directly. \`takePhoto()\` returns \`PhotoResult\` with \`uri\`, \`width\`, \`height\` — but \`PickedFile\` from \`@idealyst/files\` does NOT have top-level \`width\`/\`height\`. Call \`get_camera_guide\` with topic \`api\` for the full type reference

---

## MCP Tools Available

Use these tools to look up specific details:

### Component Tools
- \`get_component_docs\` / \`get_component_types\` — **Always call before using a component.** Returns props, types, and documentation.
- \`get_component_examples_ts\` — Type-checked code examples
- \`list_components\` / \`search_components\` — Find components by name or category
- \`search_icons\` — Find Material Design icon names (use single words: \`lock\` not \`lock key\`)

### Package Guide Tools (IMPORTANT)
**For any \`@idealyst/*\` package, call the dedicated guide tool with topic \`api\` BEFORE writing code.** These contain complete TypeScript interfaces, return types, and correct usage patterns. The generic \`get_package_docs\` tool only has summaries.

| Package | Guide Tool | Key types it documents |
|---------|-----------|----------------------|
| \`@idealyst/audio\` | \`get_audio_guide\` | PCMData, RecorderDataCallback, feedPCMData signatures |
| \`@idealyst/camera\` | \`get_camera_guide\` | PhotoResult, VideoResult, CameraPreviewProps |
| \`@idealyst/files\` | \`get_files_guide\` | FileType enum, PickedFile, FilePickerConfig |
| \`@idealyst/animate\` | \`get_animate_guide\` | useAnimatedStyle, usePresence, useSequence |
| \`@idealyst/charts\` | \`get_charts_guide\` | DataPoint, ChartDataSeries, LineChart/BarChart props |
| \`@idealyst/datagrid\` | \`get_datagrid_guide\` | DataGrid<T>, Column<T>, sorting/selection |
| \`@idealyst/datepicker\` | \`get_datepicker_guide\` | DateInput, TimePicker, DateTimePicker |
| \`@idealyst/markdown\` | \`get_markdown_guide\` | Markdown component, linkHandler, imageHandler |
| \`@idealyst/oauth-client\` | \`get_oauth_client_guide\` | createOAuthClient, OAuthConfig |
| \`@idealyst/config\` | \`get_config_guide\` | config singleton, environment variables |
| \`@idealyst/lottie\` | \`get_lottie_guide\` | Lottie component props |
| \`@idealyst/storage\` | \`get_storage_guide\` | storage API (getItem, setItem) |
| \`@idealyst/translate\` | \`get_translate_guide\` | i18n API |

### Other Tools
- \`get_theme_types\` — Theme values (Size, Intent, Color enums)
- \`get_navigation_types\` — Navigation API types
- \`list_packages\` / \`get_package_docs\` — Package summaries (use guide tools above for full API)
- \`list_recipes\` / \`get_recipe\` / \`search_recipes\` — Ready-to-use code patterns
- \`get_install_guide\` — Native setup instructions (iOS/Android)

**Workflow:** Start with this intro → call \`get_component_types\` for each component you use → call \`get_*_guide\` with topic \`api\` for each package you use → then write code.
`;
