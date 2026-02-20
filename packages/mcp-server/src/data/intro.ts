/**
 * Idealyst Framework Introduction
 *
 * A wayfinding document that orients LLM agents before they start building.
 * Covers the framework paradigm, directs agents to the right tools for details,
 * and lists only the critical gotchas that agents consistently get wrong.
 *
 * Design principle: guide agents to use MCP tools for API details rather than
 * duplicating documentation here. Only include information that:
 * 1. Establishes the framework paradigm (what Idealyst IS)
 * 2. Cannot be discovered via other tools (cross-cutting conventions)
 * 3. Addresses mistakes that agents make repeatedly despite tool access
 */

export const idealystIntro = `# Idealyst Framework — Quick Reference

## What is Idealyst?

Idealyst is a **cross-platform React component framework** for building apps that run on iOS, Android, and Web from a single codebase. All UI comes from \`@idealyst/components\` — never use React Native primitives (\`View\`, \`Text\`, \`TouchableOpacity\`, \`FlatList\`, etc.) from \`react-native\` directly.

\`\`\`tsx
import { View, Text, Button, TextInput, Card, Icon, ... } from '@idealyst/components';
\`\`\`

---

## How to Use This MCP Server

This server has tools for every aspect of the framework. **Always look up the API before writing code.**

### Workflow (be efficient — minimize tool calls)

1. **Start here** — this intro covers conventions and gotchas
2. **Look up components** — call \`get_component_types\` for EVERY component you plan to use. **Batch them in one call**: \`get_component_types({ component: "Button,Card,Text,View" })\` returns all types at once. (Card has NO compound components — no Card.Content/Card.Header)
3. **Look up packages** — call the dedicated \`get_*_guide\` tool with topic \`api\` for each \`@idealyst/*\` package
4. **Check recipes** — call \`search_recipes\` to find ready-made patterns for common screens
5. **Search icons ONCE** — combine all needed icon terms into ONE \`search_icons\` call (e.g., \`"home settings check timer calendar"\`)
6. **Then write code** — only after reading the types and guides. Do NOT make additional icon searches — pick from what you found

### Component Tools
- \`list_components\` / \`search_components\` — Discover available components
- \`get_component_docs\` — Component features and best practices
- \`get_component_types\` — **TypeScript prop interfaces** (supports batch: \`"Button,Card,Text"\`)
- \`get_component_examples_ts\` — Type-checked code examples
- \`search_icons\` — Find Material Design icon names (7,447 available). **Batch your needs**: search once with multiple terms like \`"home settings user check"\` rather than making separate calls per icon

### Package Guide Tools
**For any \`@idealyst/*\` package, call its dedicated guide tool with topic \`api\` BEFORE writing code.** These return complete TypeScript interfaces, return types, and correct usage. The generic \`get_package_docs\` tool only has summaries.

| Package | Guide Tool |
|---------|-----------|
| \`@idealyst/audio\` | \`get_audio_guide\` |
| \`@idealyst/camera\` | \`get_camera_guide\` |
| \`@idealyst/files\` | \`get_files_guide\` |
| \`@idealyst/animate\` | \`get_animate_guide\` |
| \`@idealyst/charts\` | \`get_charts_guide\` |
| \`@idealyst/datagrid\` | \`get_datagrid_guide\` |
| \`@idealyst/datepicker\` | \`get_datepicker_guide\` |
| \`@idealyst/markdown\` | \`get_markdown_guide\` |
| \`@idealyst/oauth-client\` | \`get_oauth_client_guide\` |
| \`@idealyst/config\` | \`get_config_guide\` |
| \`@idealyst/lottie\` | \`get_lottie_guide\` |
| \`@idealyst/storage\` | \`get_storage_guide\` |
| \`@idealyst/translate\` | \`get_translate_guide\` |

### Other Tools
- \`get_theme_types\` — Theme type definitions (Size, Intent, Color)
- \`get_navigation_types\` — Navigation API type definitions
- \`list_packages\` / \`get_package_docs\` — Package summaries (use guide tools for full API)
- \`list_recipes\` / \`get_recipe\` / \`search_recipes\` — Ready-to-use code patterns
- \`get_install_guide\` — Native setup instructions (iOS/Android permissions, config)

---

## Cross-Cutting Conventions

These conventions apply across all components. Call \`get_component_types\` for specific props.

### Intent & Size
Most interactive components accept:
- **intent:** \`primary\`, \`secondary\`, \`success\`, \`warning\`, \`danger\`, \`info\`, \`neutral\`
- **size:** \`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`

### Icon Names
Icons use Material Design names, typed as \`IconName\` (NOT \`string\`). Use \`search_icons\` to find names.
\`\`\`tsx
import type { IconName } from '@idealyst/components';

// ALWAYS type icon variables as IconName — never as string
const deleteIcon: IconName = 'delete';

// WRONG: do NOT use 'mdi:' prefix in variables typed as IconName
// const icon: IconName = 'mdi:delete';  // ❌ TS error — IconName is 'delete', not 'mdi:delete'

// WRONG: do NOT use plain string type
// const icon: string = 'delete';  // ❌ won't match IconName prop type

// Use IconName in ALL interfaces, arrays, and data structures
interface MyProps { icon: IconName; }
interface NavItem { label: string; icon: IconName; path: string; } // NOT icon: string
const tabs: { icon: IconName }[] = [{ icon: 'home' }, { icon: 'search' }]; // NOT icon: string

// Icon-accepting props (leftIcon, rightIcon, icon) accept BOTH IconName and ReactNode:
<Button leftIcon="check">OK</Button>              // ✅ string — simplest
<Button leftIcon={myIcon}>OK</Button>              // ✅ IconName variable
// Do NOT wrap in <Icon>: <Button leftIcon={<Icon name="check" />}>  // ❌ unnecessary
// Do NOT cast: <Button leftIcon={'check' as IconName}>              // ❌ unnecessary — just use the string
\`\`\`

> **CRITICAL:** Icon names do NOT have an \`mdi:\` prefix. Use bare names like \`'delete'\`, \`'home'\`, \`'check-circle'\` — NOT \`'mdi:delete'\`, \`'mdi:home'\`, etc.
> **CRITICAL:** When defining arrays or objects with icon fields, type them as \`IconName\` — never \`string\`. Using \`string\` will cause TS2322 when passed to component props.

---

## Common Mistakes

These are mistakes agents make repeatedly. Each one causes TypeScript compilation failures.

### Component Props
1. **Text** does NOT have \`variant\`, \`intent\`, \`size\`, \`fontSize\`, \`numberOfLines\`, \`ellipsizeMode\`, \`selectable\`, \`textColor\`, or \`onPress\`. Use \`typography\` (\`h1\`–\`h6\`, \`subtitle1\`, \`subtitle2\`, \`body1\`, \`body2\`, \`caption\`), \`weight\` (\`light\`, \`normal\`, \`medium\`, \`semibold\`, \`bold\`), and \`color\` (\`primary\`, \`secondary\`, \`tertiary\`, \`inverse\`). **\`textColor\` is an Icon-only prop** — Text uses \`color\`. For pressable text, wrap in \`Pressable\` or use \`Button type="text"\`.
2. **TextInput** does NOT have \`label\`, \`error\`, \`editable\`, \`autoComplete\`, \`keyboardType\`, or \`onChange\`. Compose labels/errors with \`Text\` + \`View\`. Use \`onChangeText\`, \`inputMode\` (\`text\`, \`email\`, \`password\`, \`number\`), and \`textContentType\`. TextArea is different — it DOES support \`label\`, \`error\`, \`rows\`, \`onChange\`.
3. **Button/IconButton** \`type\` is \`'contained' | 'outlined' | 'text'\` — NOT \`'ghost'\`, \`'solid'\`, \`'default'\`. Button has \`leftIcon\` and \`rightIcon\` — NOT \`icon\`.
4. **View** does NOT have \`direction\`, \`align\`, or \`onPress\` props. For touch handling, wrap content in \`Pressable\` from \`@idealyst/components\` (NOT from \`react-native\`): \`<Pressable onPress={handlePress}><View>...</View></Pressable>\`. For horizontal layout use \`style={{ flexDirection: 'row' }}\`. View DOES have shorthand props: \`gap\`/\`spacing\`, \`padding\`, \`paddingVertical\`, \`paddingHorizontal\`, \`margin\`, \`marginVertical\`, \`marginHorizontal\` (all accept Size: \`xs\`|\`sm\`|\`md\`|\`lg\`|\`xl\`), plus \`background\`, \`radius\`, \`border\`, \`scrollable\`. \`border\` is \`'none' | 'thin' | 'thick'\` — NOT \`'outline'\`, \`'solid'\`.
5. **Badge** \`type\` is \`'filled' | 'outlined' | 'dot'\` — NOT \`'soft'\`, \`'subtle'\`, \`'solid'\`.
6. **Avatar** uses \`src\` for image URL, \`fallback\` for initials — NOT \`name\`, \`initials\`, \`label\`. Shape: \`'circle' | 'square'\`.
7. **Link** requires a \`to\` prop (path string) — it's a navigation link, NOT pressable text.
8. **List** takes \`children\` — NOT \`data\`, \`renderItem\`, or \`keyExtractor\`. Map your data: \`<List>{items.map(item => <View key={item.id}>...</View>)}</List>\`
9. **Skeleton** uses \`shape\` prop (\`'rectangle' | 'circle' | 'rounded'\`) — NOT \`variant\`. Props: \`width\`, \`height\`, \`shape\`, \`animation\` (\`'pulse' | 'wave' | 'none'\`). Do NOT build custom skeletons with react-native \`Animated\`.
10. The component is **TextInput**, NOT \`Input\`.
11. **Card** is a simple container — there are NO compound components like \`Card.Content\`, \`Card.Header\`, \`Card.Body\`, \`Card.Footer\`, \`Card.Title\`. Just put children directly inside \`<Card>...</Card>\`.

### Navigation
11. Use \`NavigatorProvider\` — there is NO \`Router\` export.
12. Use \`useNavigator()\` — NOT \`useNavigate()\`.
13. \`navigate()\` takes an **object**: \`navigate({ path: '/settings' })\` — NOT \`navigate('/settings')\` or \`navigate('routeName', params)\`.
14. \`useNavigationState\` returns \`Record<string, unknown>\` by default. Always provide a type parameter: \`useNavigationState<{ title?: string }>()\`.
15. \`useParams()\` does NOT accept generic type arguments. It returns \`Record<string, string>\`. Do NOT write \`useParams<{ id: string }>()\` — that causes TS2558.

### Imports & Styling
16. **Never** import from \`react-native\` for UI — no \`TouchableOpacity\`, \`FlatList\`, \`ScrollView\`, \`Animated\`, \`Dimensions\`.
17. **Never** import from \`react-native-unistyles\` — use \`@idealyst/theme\` (\`configureThemes\`, \`ThemeSettings\`, \`useTheme\`).
18. **Custom styles**: Use \`useTheme()\` for theme tokens — it returns the Theme object **directly** (NOT wrapped): \`const theme = useTheme();\` then apply inline: \`style={{ padding: theme.spacing.md, backgroundColor: theme.colors.surface.primary }}\`. Do NOT use \`const { theme } = useTheme()\` — that causes TS2339. Do NOT use \`StyleSheet.create\` from react-native — use inline styles with theme tokens instead.

### React 19 TypeScript
- **useRef** requires an initial argument: \`useRef<T>(null)\` — NOT \`useRef<T>()\`. Omitting the argument causes TS2554. For non-null refs use: \`useRef<number>(0)\`, \`useRef<string[]>([])\`.
- **Avoid web-only CSS** like \`cursor: 'pointer'\` in shared styles — not valid on native. Use \`Pressable\` or \`Button\` for interactive elements (they handle cursor automatically on web).

### Scaffolded Project Layout
When working in a CLI-scaffolded workspace (created with \`idealyst init\` + \`idealyst create\`), files go in specific locations:
- \`packages/api/src/trpc/routers/\` — **Feature router files** (e.g., \`todo.ts\`, \`user.ts\`) — ALWAYS put new routers here
- \`packages/api/src/trpc/routers/index.ts\` — Main appRouter definition (merge new routers here)
- \`packages/api/src/trpc/trpc.ts\` — \`router\` and \`publicProcedure\` exports
- \`packages/database/prisma/schema.prisma\` — Prisma models
- \`packages/database/src/schemas.ts\` — Zod validation schemas
- \`packages/shared/src/screens/\` — Screen components (shared across platforms)
- \`packages/shared/src/navigation/AppRouter.ts\` — Route configuration

**Critical:** New tRPC routers MUST go in \`packages/api/src/trpc/routers/\` — NEVER at the project root or \`src/\`. They must be merged into the main \`appRouter\` in \`packages/api/src/trpc/routers/index.ts\`.

> **TIP:** Before writing backend code, call \`search_recipes({ query: "trpc" })\` to get the \`trpc-feature\` recipe — it has the complete step-by-step pattern with correct file paths.

### Package-Specific (call guide tools for full API)
18. **Audio** (\`@idealyst/audio\`) is **PCM streaming**, NOT file-based. \`recorder.stop()\` returns \`void\`. Data is \`ArrayBufferLike\`, NOT strings. Call \`get_audio_guide\` topic \`api\`.
19. **Camera** (\`@idealyst/camera\`): Component is \`CameraPreview\`, NOT \`Camera\`. Permission is \`requestPermission()\`, NOT \`requestCameraPermission\`. \`CameraStatus\` is an interface (\`.state\`, \`.permission\`), NOT a string. Call \`get_camera_guide\` topic \`api\`.
20. **Files** (\`@idealyst/files\`): Method is \`pick()\`, NOT \`pickFiles()\`. \`FileType\` is \`'image' | 'video' | 'audio' | 'document' | 'archive' | 'any'\` — NOT \`'pdf'\` or \`'doc'\`. Call \`get_files_guide\` topic \`api\`.
21. **Storage** (\`@idealyst/storage\`): Methods are \`getItem()\`/\`setItem()\`, NOT \`get()\`/\`set()\`. Values are string-only. Call \`get_storage_guide\` topic \`api\`.
22. **Animate** (\`@idealyst/animate\`): There is NO \`useSequence\` or \`useKeyframes\` — only \`useAnimatedStyle\`, \`useAnimatedValue\`, \`usePresence\`, \`useGradientBorder\`. Easing values are **camelCase**: \`'easeOut'\` NOT \`'ease-out'\`. \`useAnimatedValue\` REQUIRES an initial number: \`useAnimatedValue(0)\` — NOT \`useAnimatedValue()\`. Call \`get_animate_guide\` topic \`api\`.
23. **Charts** (\`@idealyst/charts\`): \`ChartDataSeries\` requires \`id\` and \`name\` (NOT \`label\`). \`AxisConfig\` uses \`show\` (NOT \`visible\`). \`tickFormat\` type is \`(value: number | string | Date) => string\`. Call \`get_charts_guide\` topic \`api\`.
`;
