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

This server has tools for every aspect of the framework. **Look up APIs as you need them — don't research everything upfront.**

### Workflow

Write code iteratively — **look up one API, write one file, repeat**:

1. Call \`get_intro\` (this response)
2. Look up the API for your FIRST file only (e.g., \`get_component_types("Button,Card,Text")\`)
3. **Write that file immediately** using the Write tool
4. Then look up the next API you need, write the next file, and so on

- **Before using a component** — call \`get_component_types\` for its props (supports batching: \`get_component_types("Button,Card,Text")\`)
- **Before using a package** — call its dedicated \`get_*_guide\` tool with topic \`api\`
- **Search icons once** — batch all terms into one call: \`search_icons("home settings check timer")\`
- **Check recipes** — \`search_recipes\` for ready-made patterns you can adapt

> **WARNING: Do NOT load multiple package guides, component types, AND icon searches all before writing your first file.** Each tool response is large. If you accumulate 4+ tool responses without writing any code, you WILL exhaust your output token budget and produce zero files. The correct pattern is: **research → write → research → write**, NOT **research → research → research → write**.

### Component Tools
- \`list_components\` / \`search_components\` — Discover available components
- \`get_component_docs\` — Component features and best practices
- \`get_component_types\` — **TypeScript prop interfaces** for a component
- \`get_component_examples_ts\` — Type-checked code examples
- \`search_icons\` — Find Material Design icon names (7,447 available). **Batch your needs**: search once with multiple terms like \`"home settings user check"\` rather than making separate calls per icon

### Package Guide Tools
Each \`@idealyst/*\` package has a dedicated guide tool that returns complete TypeScript interfaces and correct usage. The generic \`get_package_docs\` tool only has summaries.

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
| \`@idealyst/notifications\` | \`get_notifications_guide\` |

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
> **CRITICAL:** Helper functions that return icon names MUST have return type \`IconName\`, not \`string\`. Example: \`function getIcon(type: string): IconName { return type === 'pdf' ? 'file-pdf-box' : 'file-document-outline'; }\` — NOT \`function getIcon(type: string): string\`.
> **CRITICAL:** ONLY use icon names returned by \`search_icons\`. Do NOT guess or invent icon names — unverified names render as blank with runtime warnings. If you need an icon, search for it first.

**Common verified icon names** (use these without searching): \`home\`, \`cog\`, \`account\`, \`magnify\`, \`plus\`, \`close\`, \`check\`, \`chevron-left\`, \`chevron-right\`, \`chevron-down\`, \`chevron-up\`, \`arrow-left\`, \`arrow-right\`, \`menu\`, \`dots-vertical\`, \`pencil\`, \`delete\`, \`heart\`, \`star\`, \`bell\`, \`email\`, \`phone\`, \`camera\`, \`camera-flip\`, \`flash\`, \`flash-off\`, \`image\`, \`send\`, \`share\`, \`download\`, \`upload\`, \`eye\`, \`eye-off\`, \`lock\`, \`logout\`, \`refresh\`, \`calendar\`, \`clock\`, \`map-marker\`, \`chart-line\`, \`view-dashboard\`, \`account-group\`, \`message\`, \`information\`, \`alert\`, \`check-circle\`, \`close-circle\`, \`play\`, \`pause\`, \`stop\`, \`microphone\`, \`microphone-off\`, \`file-document-outline\`. For any icon NOT on this list, use \`search_icons\` to verify.

---

## Common Mistakes

These are mistakes agents make repeatedly. Each one causes TypeScript compilation failures.

### Component Props
1. **Text** does NOT have \`variant\`, \`intent\`, \`size\`, \`fontSize\`, \`numberOfLines\`, \`ellipsizeMode\`, \`selectable\`, \`textColor\`, or \`onPress\`. Use \`typography\` (\`h1\`–\`h6\`, \`subtitle1\`, \`subtitle2\`, \`body1\`, \`body2\`, \`caption\`), \`weight\` (\`light\`, \`normal\`, \`medium\`, \`semibold\`, \`bold\`), and \`color\` (\`primary\`, \`secondary\`, \`tertiary\`, \`inverse\`). **\`textColor\` is an Icon-only prop** — Text uses \`color\`. For pressable text, wrap in \`Pressable\` or use \`Button type="text"\`.
2. **TextInput** does NOT have \`label\`, \`error\`, \`editable\`, \`autoComplete\`, \`keyboardType\`, or \`onChange\`. Compose labels/errors with \`Text\` + \`View\`. Use \`onChangeText\`, \`inputMode\` (\`'text' | 'email' | 'password' | 'number'\` — NOT \`'decimal'\`, \`'numeric'\`, \`'tel'\`, \`'url'\`), and \`textContentType\`. **TextArea has a DIFFERENT API** — it DOES support \`label\`, \`error\`, \`rows\`, \`onChange\`, but does NOT have \`onBlur\` or \`onChangeText\`. Always look up TextArea types separately.
3. **Button/IconButton** \`type\` is \`'contained' | 'outlined' | 'text'\` — NOT \`'ghost'\`, \`'solid'\`, \`'default'\`. Button has \`leftIcon\` and \`rightIcon\` — NOT \`icon\`.
4. **View** does NOT have \`direction\`, \`align\`, or \`onPress\` props. For touch handling, wrap content in \`Pressable\` from \`@idealyst/components\` (NOT from \`react-native\`): \`<Pressable onPress={handlePress}><View>...</View></Pressable>\`. For horizontal layout use \`style={{ flexDirection: 'row' }}\`. View spacing shorthand props (all accept Size: \`xs\`|\`sm\`|\`md\`|\`lg\`|\`xl\`): \`padding\`, \`paddingVertical\`, \`paddingHorizontal\`, \`margin\`, \`marginVertical\`, \`marginHorizontal\`, \`gap\`/\`spacing\`. Do NOT use \`paddingTop\`, \`paddingBottom\`, \`paddingLeft\`, \`paddingRight\`, \`marginTop\`, \`marginBottom\`, \`marginLeft\`, \`marginRight\` as shorthand props — they do NOT exist and will cause TS2353. For single-side spacing, use \`style={{ paddingTop: 16 }}\`. Other View props: \`background\`, \`radius\`, \`border\`, \`scrollable\`. \`border\` is \`'none' | 'thin' | 'thick'\` — NOT \`'outline'\`, \`'solid'\`.
5. **Badge** \`type\` is \`'filled' | 'outlined' | 'dot'\` — NOT \`'soft'\`, \`'subtle'\`, \`'solid'\`. **Intent type narrowing (CRITICAL):** TS widens string literals in objects/arrays to \`string\`, which fails \`intent\` props. Rules: (a) Simple ternaries in JSX work fine: \`<Badge intent={cond ? 'success' : 'danger'}>\`. (b) **Do NOT use \`as const\` on ternary expressions** — \`(cond ? 'a' : 'b') as const\` causes TS1355. (c) **Arrays/objects with intent values MUST use \`as const\`**: \`const items = [{ intent: 'success' as const, label: 'OK' }]\` or \`const items = [{ intent: 'success', label: 'OK' }] as const\`. Without \`as const\`, \`item.intent\` becomes \`string\` which fails. (d) For computed values, use typed variable: \`const intent: Intent = ...;\` (import Intent from @idealyst/theme). This applies to ALL components with intent/type props.
6. **Avatar** uses \`src\` for image URL, \`fallback\` for initials — NOT \`name\`, \`initials\`, \`label\`. Shape: \`'circle' | 'square'\`.
7. **Link** requires a \`to\` prop (path string) — it's a navigation link, NOT pressable text.
8. **List** takes \`children\` — NOT \`data\`, \`renderItem\`, or \`keyExtractor\`. Map your data: \`<List>{items.map(item => <View key={item.id}>...</View>)}</List>\`
9. **Skeleton** uses \`shape\` prop (\`'rectangle' | 'circle' | 'rounded'\`) — NOT \`variant\`. Props: \`width\`, \`height\`, \`shape\`, \`animation\` (\`'pulse' | 'wave' | 'none'\`). Do NOT build custom skeletons with react-native \`Animated\`.
10. The component is **TextInput**, NOT \`Input\`.
11. **Card** is a simple container — there are NO compound components like \`Card.Content\`, \`Card.Header\`, \`Card.Body\`, \`Card.Footer\`, \`Card.Title\`. Just put children directly inside \`<Card>...</Card>\`. **Card does NOT have \`border\`, \`scrollable\`, or \`backgroundColor\` props** (those are View-only). Card styling props: \`type\` (\`'default'|'outlined'|'elevated'|'filled'\`), \`radius\`, \`intent\`, \`background\`, plus spacing (\`padding\`, \`margin\`, \`gap\`). For borders use \`type="outlined"\`.
12. **Switch** uses \`checked\` and \`onChange\` — NOT \`value\` and \`onValueChange\` (React Native convention). Also has \`label\`, \`labelPosition\`, \`disabled\`.

### Navigation
11. **NavigatorProvider** takes a \`route\` prop (SINGULAR) — NOT \`routes\`: \`<NavigatorProvider route={routeConfig} />\`. There is NO \`Router\` export.
12. Use \`useNavigator()\` — NOT \`useNavigate()\`.
13. \`navigate()\` takes an **object**: \`navigate({ path: '/settings' })\` — NOT \`navigate('/settings')\` or \`navigate('routeName', params)\`. To pass data use \`vars\`: \`navigate({ path: '/detail/:id', vars: { id: '123' } })\` — NOT \`params\`: \`navigate({ path: '/detail', params: { id: '123' } })\` (no \`params\` property exists).
14. \`useNavigationState\` returns \`Record<string, unknown>\` by default. Always provide a type parameter: \`useNavigationState<{ title?: string }>()\`.
15. \`useParams()\` does NOT accept generic type arguments. It returns \`Record<string, string>\`. Do NOT write \`useParams<{ id: string }>()\` — that causes TS2558.

### Imports & Styling
16. **Never** import from \`react-native\` — no \`TouchableOpacity\`, \`FlatList\`, \`ScrollView\`, \`Animated\`, \`Dimensions\`, \`Linking\`, \`Platform\`. Idealyst provides cross-platform alternatives for all of these (e.g., \`openExternalLinks\` on Markdown, \`Pressable\` from \`@idealyst/components\`). **\`ScrollView\` is NOT exported from \`@idealyst/components\`** — use \`<View scrollable>\` instead. Do NOT \`import { ScrollView } from '@idealyst/components'\` — it will cause a TS import error.
17. **Never** import from \`react-native-unistyles\` — use \`@idealyst/theme\` (\`configureThemes\`, \`ThemeSettings\`, \`useTheme\`).
18. **useTheme()** returns the Theme object **directly** (NOT wrapped): \`const theme = useTheme();\`. Do NOT destructure: \`const { theme } = useTheme()\` — causes TS2339.
19. **Spacing & Layout**: Use component shorthand props for spacing — NOT \`theme.spacing\` (which does NOT exist). The correct patterns:
   - \`<View padding="md" gap="md">\` — shorthand props on View/Card
   - \`<View paddingHorizontal="lg" marginVertical="sm">\` — directional shorthands
   - \`<View style={{ paddingTop: 16, marginBottom: 8 }}>\` — single-side spacing via style prop (NOT shorthand props)
   - \`style={{ backgroundColor: theme.colors.surface.primary }}\` — inline styles for colors only
   - \`theme.radii.md\` — border radius values (this DOES exist)
   - **WRONG**: \`<View paddingTop="md">\` — does NOT exist as a shorthand prop; use \`style={{ paddingTop: 16 }}\`
   - **WRONG**: \`theme.spacing.md\` — does NOT exist, causes TS2339
   - **WRONG**: \`theme.colors.background\` — does NOT exist. \`theme.colors\` has: \`pallet\`, \`surface\`, \`text\`, \`border\`. Use \`theme.colors.surface.primary\` for background colors.
   - **WRONG**: \`theme.colors.intent.danger\` — does NOT exist; intents are at \`theme.intents.danger\`
   - **WRONG**: \`theme.intents.primary.bg\` — IntentValue does NOT have \`bg\` or \`text\`. IntentValue has: \`primary\` (main color string), \`contrast\` (text-on-bg color), \`light\`, \`dark\`
   - **CORRECT**: \`theme.intents.primary.primary\` for the color, \`theme.intents.primary.contrast\` for text on that color
   - **Color key reference** (all keys available):
     - \`theme.colors.surface\`: \`screen\`, \`primary\`, \`secondary\`, \`tertiary\`, \`inverse\`, \`inverse-secondary\`, \`inverse-tertiary\`
     - \`theme.colors.text\`: \`primary\`, \`secondary\`, \`tertiary\`, \`inverse\`, \`inverse-secondary\`, \`inverse-tertiary\`
     - \`theme.colors.border\`: \`primary\`, \`secondary\`, \`tertiary\`, \`disabled\`
     - \`theme.intents\`: \`primary\`, \`secondary\`, \`success\`, \`warning\`, \`danger\`, \`info\`, \`neutral\` (each has \`.primary\`, \`.contrast\`, \`.light\`, \`.dark\`)

### Cross-Platform (CRITICAL)
20. **Never use raw HTML/SVG elements** (\`<svg>\`, \`<circle>\`, \`<canvas>\`, \`<div>\`, \`<span>\`, \`<input>\`) — they are web-only and will crash on React Native, just like react-native primitives crash on web. Also never use CSS \`transition\` or \`animation\` properties in styles — they don't exist on native. If you need custom drawing or circular progress, use \`@idealyst/animate\` hooks or \`@idealyst/charts\` — never raw SVG.
21. **Avoid web-only CSS** like \`cursor: 'pointer'\` in shared styles — not valid on native. Use \`Pressable\` or \`Button\` for interactive elements (they handle cursor automatically on web). Percentage widths (\`width: '50%'\`) do NOT work reliably on React Native — use \`flex\` instead.
23. **Use theme colors, never hardcoded hex** — import \`useTheme\` from \`@idealyst/theme\` and use \`theme.colors.surface.secondary\` (not \`'#f5f5f5'\`), \`theme.colors.border.primary\` (not \`'#e0e0e0'\`), \`theme.intents.primary.primary\` (not \`'#1976d2'\`). Hardcoded colors break dark mode and branding customization. **Exception:** Semi-transparent overlays for camera/media UIs may use \`rgba(0,0,0,0.5)\` since the theme has no overlay color. For other overlays, prefer \`theme.colors.surface.inverse\` with opacity.
22. **Platform file barrel exports**: When creating \`Component.web.tsx\` + \`Component.native.tsx\`, you need THREE index files:
   - \`index.web.ts\` — \`export { default as Component } from './Component.web';\`
   - \`index.native.ts\` — \`export { default as Component } from './Component.native';\`
   - \`index.ts\` — \`export { default as Component } from './Component.web';\` (base file for TypeScript resolution)
   - **WRONG**: \`export { default } from './Component';\` — no bare \`Component.ts\` exists, only \`.web.tsx\`/\`.native.tsx\`. This causes TS2307.
   - **Web-only styles in .web.tsx files**: Cast CSS-only properties with \`as any\`, NOT \`as React.CSSProperties\`. Example: \`style={{ position: 'fixed', transition: 'width 0.2s' } as any}\`. \`React.CSSProperties\` is incompatible with \`StyleProp<ViewStyle>\` — this causes TS2322.

### React 19 TypeScript
- **useRef** requires an initial argument: \`useRef<T>(null)\` — NOT \`useRef<T>()\`. Omitting the argument causes TS2554. For non-null refs use: \`useRef<number>(0)\`, \`useRef<string[]>([])\`.
- **onLayout** callback: The event shape is \`e.nativeEvent.layout.{x, y, width, height}\` — NOT \`e.layout.width\`. Always destructure: \`onLayout={(e) => { const { width, height } = e.nativeEvent.layout; }}\`. Writing \`e.layout\` causes TS2339.
- **Badge children** accepts \`ReactNode\` including numbers — \`<Badge>{count}</Badge>\` is valid. But if you pass a number to a **string** prop, wrap it: \`<Badge>{String(count)}</Badge>\` or use template literal.
- **String literals with apostrophes**: Use backticks or double quotes for strings containing apostrophes — \`\`I'll be back\`\` or \`"I'll be back"\` — NOT \`'I'll be back'\` (unescaped \`'\` breaks the string and causes cascading TS errors).

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
18. **Audio** (\`@idealyst/audio\`) is **PCM streaming**, NOT file-based. \`recorder.stop()\` returns \`void\`. Data is \`ArrayBufferLike\`, NOT strings. Do NOT use \`atob()\` for base64 decoding — it's browser-only. See the guide for cross-platform patterns. Call \`get_audio_guide\` topic \`api\`.
19. **Camera** (\`@idealyst/camera\`): Component is \`CameraPreview\`, NOT \`Camera\`. Permission is \`requestPermission()\`, NOT \`requestCameraPermission\`. \`CameraStatus\` is an interface (\`.state\`, \`.permission\`), NOT a string. Call \`get_camera_guide\` topic \`api\`.
20. **Files** (\`@idealyst/files\`): \`pick()\` returns \`FilePickerResult\` (an **object**, NOT an array). Access files via \`result.files\`: \`result.files.length\`, \`result.files[0].uri\`. Do NOT write \`result.length\` or \`result[0]\`. \`useFilePicker()\` takes \`{ config: { allowedTypes: ['image'], multiple: true } }\` — NOT \`{ type: 'image' }\`. \`FileType\` is \`'image' | 'video' | 'audio' | 'document' | 'archive' | 'any'\` — NOT \`'pdf'\` or \`'doc'\`. Call \`get_files_guide\` topic \`api\`.
21. **Storage** (\`@idealyst/storage\`): Methods are \`getItem()\`/\`setItem()\`, NOT \`get()\`/\`set()\`. Values are string-only. Call \`get_storage_guide\` topic \`api\`.
22. **Animate** (\`@idealyst/animate\`): There is NO \`useSequence\` or \`useKeyframes\` — only \`useAnimatedStyle\`, \`useAnimatedValue\`, \`usePresence\`, \`useGradientBorder\`. Easing values are **camelCase**: \`'easeOut'\` NOT \`'ease-out'\`. \`useAnimatedValue\` REQUIRES an initial number: \`useAnimatedValue(0)\` — NOT \`useAnimatedValue()\`. \`useAnimatedStyle\` supports a \`delay\` option (ms) for staggered entrances. Transform syntax: use **object** format \`{ x, y, scale, rotate }\` — NOT array format \`[{ translateX }]\` which doesn't animate. Call \`get_animate_guide\` topic \`api\`.
23. **Charts** (\`@idealyst/charts\`): \`ChartDataSeries\` requires \`id\` and \`name\` (NOT \`label\`). \`AxisConfig\` uses \`show\` (NOT \`visible\`). \`tickFormat\` type is \`(value: number | string | Date) => string\`. Call \`get_charts_guide\` topic \`api\`.
`;
