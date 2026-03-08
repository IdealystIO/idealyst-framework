# Convergence Engineer Memory

## Key File Locations
- MCP server data: `packages/mcp-server/src/data/` (guides, intro, recipes, icon-guide)
- MCP tools: `packages/mcp-server/src/tools/` (handlers.ts, definitions.ts, types.ts, get-types.ts)
- Eval scenarios: `packages/mcp-server/eval/src/scenarios/`
- Eval output: `packages/mcp-server/eval/output/`
- Component types: `packages/components/src/*/types.ts`
- Recipes: `packages/mcp-server/src/data/recipes/`
- Navigation types: `packages/navigation/src/routing/types.ts`, `packages/navigation/src/context/types.ts`
- Component examples: `packages/mcp-server/examples/components/` (*.examples.tsx)

## Eval Server (http://localhost:4242)
- User starts server in separate terminal: `cd packages/mcp-server && yarn eval:server`
- POST /runs returns immediately with runId (async). Poll until status is "completed".
- Per-scenario logs: `eval/output/logs/<evalId>/<scenarioId>.log`

## Score Progress
- Baseline (eval-17715163222): H=83, S=81
- After first fixes (eval-17715311746): H=86, S=91
- eval-1771538762661: H=85, S=88 (oauth timeout H=40/S=8 dragged average)
- eval-1771539933214: H=85, S=88 (animate timeout H=39/S=5 dragged average)
- 37-scenario run 1 (eval-1772993696977): H=90.6, S=90.5, 32/37>=85
- 37-scenario run 2 (eval-1772995172157, LATEST): H=91.4, S=90.6, 34/37>=85
  - Fixes: flex shorthand, Icon color/textColor union, recipe weight='regular'->'normal', theme colors in sidebar recipe
  - lottie-animation: 76->94 (+18), web-layout-sidebar: 78->92 (+14), no-context-audio: 80->93 (+13)
  - Remaining <85: guide-tool-discovery (72, variance), animate-transitions (83, variance), full-app-no-context (82, variance)

## Common Naive Agent Failure Patterns (discovered)
See [failure-patterns.md](failure-patterns.md) for details.

1. **View shorthand props** - `direction="row"` etc don't exist. Use `style={{ flexDirection: 'row' }}`.
2. **Button icon prop** - Must use `leftIcon`/`rightIcon`, not `icon`.
3. **Animate hallucination** - Only 5 exports. No useSequence/useKeyframes/useSpring.
4. **Easing format** - Use `'easeOut'` not `'ease-out'`.
5. **ChartDataSeries label** - Series uses `name`; DataPoint has `label`.
6. **IconName typing** - Must use `IconName` type, not `string`. Agents still use `string` in data structures.
7. **Text variant** - Uses `typography` and `weight`, not `variant`.
8. **useRef() no args** - React 19 requires initial arg: `useRef<T>(null)` not `useRef<T>()`.
9. **View onPress** - View has no onPress. Use `Pressable` from @idealyst/components.
10. **Card.Content** - No compound sub-components. Just use children directly.
11. **Image source** - Image uses `source` (not `src`) and `objectFit` (not `contentFit`). Avatar uses `src`.
12. **Skeleton shape** - Uses `shape` prop ('rectangle'|'circle'|'rounded'), NOT `variant`.
13. **TextInputMode** - Only 'text'|'email'|'password'|'number'. NOT 'decimal' or 'tel'.
14. **useAnimatedValue.value misuse** - Agents use `pulse.value` in inline styles. It's a snapshot, not live.
15. **overflow in useAnimatedStyle** - `overflow` is NOT animatable. Set it as static style on parent.
16. **View flex={1}** - NOT a shorthand prop. Must use `style={{ flex: 1 }}`.
17. **Icon color/textColor union** - Discriminated union, NEVER pass both. Use one or the other.
18. **Text weight='regular'** - Invalid. Use 'normal'. Valid: 'light'|'normal'|'medium'|'semibold'|'bold'.

## Effective Fix Patterns
- Add "COMPLETE LIST" sections with export counts to prevent hallucination
- Add comparison tables (valid vs invalid) for string literal values
- Add "Common mistakes" callout boxes at top of guide overviews
- Fix examples in guides (agents copy examples verbatim)
- Add usage notes in tool response objects
- Hardcode types when dynamic generation fails (navigation)
- Use `findPackageRoot()` instead of relative `__dirname` paths for bundled code
- Add search synonyms/aliases for recipe and component discovery

## Key Bugs Fixed
- `get-types.ts`: Size type used `Object.keys(array)` returning indices
- `get-types.ts`: Navigation types always empty -- added static fallback
- `get-types.ts`: findExampleFile path broken after bundling -- added findPackageRoot()
- `animate-guides.ts`: useRef without initial arg, missing expand/collapse example
- `animate-guides.ts`: Added animatable properties table and useAnimatedValue warning
- `animate-guides.ts`: Fixed pulse example (use useAnimatedStyle+state, not pulse.value)
- `animate-guides.ts`: Fixed expand/collapse example (overflow not in animated style)
- `component-metadata.ts`: Card.Content hallucination, component aliases, search improvements
- `component-metadata.ts`: TextInputMode values made explicit (not "etc.")
- `recipes/index.ts`: Search synonyms for profile/api/backend/etc, multi-word support
- `recipes/settings.ts`: Fixed Skeleton shape prop (was variant)
- `recipes/media.ts`: Complete rewrite -- removed non-existent useImagePicker
- `recipes/layout.ts`: Fixed Icon numeric sizes to Size strings
- `recipes/data.ts`: Fixed Icon numeric size, enhanced trpc-feature recipe
- `navigation-guides.ts`: Fixed Icon numeric sizes and color props
- `camera-guides.ts`, `files-guides.ts`: Image source/objectFit fixes
- `handlers.ts`: Icon search aliases (back->arrow-left, search->magnify, etc)
- `intro.ts`: IconName in data structures emphasis
- `intro.ts`: Added flex not a shorthand, Icon color/textColor union docs
- `icon-guide.ts`: Added color/textColor mutual exclusion note
- `handlers.ts`: Updated Icon usageNote with discriminated union warning
- `recipes/navigation.ts`: Fixed weight='regular'->'normal' (3 instances), used theme colors instead of hex

## Rubric Notes
- TS compilation is the most impactful criterion (valid_props)
- oauth-config-login and animate-transitions both prone to 300s timeouts -- infrastructure issue
- Navigation S=80 is mostly about IconName string typing (agent uses `string` instead of `IconName`)
- overlay-components S=83 due to `inputMode="decimal"` (not valid TextInputMode)
- api-backend consistently low H (60-62) due to wrong file locations, but S=86-88 (code quality is good)
- guide-tool-discovery: high variance (72-93), supervisor often wrong about Card.intent validity
- full-app-no-context: high variance (82-87), supervisor incorrectly penalizes textColor on Icon
- Supervisor frequently flags valid APIs as hallucinated (audio subscribeToData, Card intent, Icon textColor)
