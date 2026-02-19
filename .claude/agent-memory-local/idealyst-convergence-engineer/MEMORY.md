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
- Latest (eval-17715387626): H=85, S=88 (dragged by oauth timeout H=40, api-backend H=62)
- Excluding outliers (21/23): effective H=88.3, S=92.4
- Big wins: full-app +32, animate +26, charts +26, navigation +15, theme +10

## Common Naive Agent Failure Patterns (discovered)
See [failure-patterns.md](failure-patterns.md) for details.

1. **View shorthand props** - `direction="row"` etc don't exist. Use `style={{ flexDirection: 'row' }}`.
2. **Button icon prop** - Must use `leftIcon`/`rightIcon`, not `icon`.
3. **Animate hallucination** - Only 5 exports. No useSequence/useKeyframes/useSpring.
4. **Easing format** - Use `'easeOut'` not `'ease-out'`.
5. **ChartDataSeries label** - Series uses `name`; DataPoint has `label`.
6. **IconName typing** - Must use `IconName` type, not `string`.
7. **Text variant** - Uses `typography` and `weight`, not `variant`.
8. **useRef() no args** - React 19 requires initial arg: `useRef<T>(null)` not `useRef<T>()`.
9. **View onPress** - View has no onPress. Use `Pressable` from @idealyst/components.
10. **Card.Content** - No compound sub-components. Just use children directly.
11. **Navigation types empty** - Dynamic generation returned empty. Fixed with static hardcoded types.
12. **Size type bug** - `Object.keys(array)` returned indices instead of values. Fixed in get-types.ts.
13. **Example files not found** - `findExampleFile` path broken after bundling. Fixed with `findPackageRoot()`.
14. **useAnimatedValue.value misuse** - Agents use `pulse.value` in inline styles. It's a snapshot, not live.

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
- `component-metadata.ts`: Card.Content hallucination, component aliases, search improvements
- `recipes/index.ts`: Search synonyms for profile/api/backend/etc, multi-word support
- `handlers.ts`: Icon search aliases (back->arrow-left, search->magnify, etc)
- `recipes/settings.ts`: Added profile-screen recipe
- `recipes/data.ts`: Enhanced trpc-feature recipe description

## Rubric Notes
- TS compilation is the most impactful criterion
- "Valid Props" directly tied to example quality
- oauth-config-login prone to timeouts (300s limit) -- infrastructure, not docs
- overlay-components gets ~81 because example files not found (fix deployed)
- api-backend is turn-heavy (53/60) -- agents struggle with file location correctness
