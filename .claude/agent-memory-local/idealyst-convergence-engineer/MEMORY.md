# Convergence Engineer Memory

## Key File Locations
- MCP server data: `packages/mcp-server/src/data/` (guides, intro, recipes, icon-guide)
- MCP tools: `packages/mcp-server/src/tools/` (handlers.ts, definitions.ts, types.ts)
- Eval scenarios: `packages/mcp-server/eval/src/scenarios/`
- Eval output: `packages/mcp-server/eval/output/`
- Eval runner: `packages/mcp-server/eval/src/run-eval.ts`
- Component types: `packages/components/src/*/types.ts`
- Recipes: `packages/mcp-server/src/data/recipes/`

## Eval Commands
- Full run: `cd packages/mcp-server && yarn build && yarn eval:all -v -j 5`
- Single: `yarn eval -s <scenario-name> -v`
- List: `yarn eval --list`
- Build exits 1 on "No matches found: src/generated/*" but build IS successful
- CANNOT run eval from within Claude Code (nested session restriction). Must be run from external terminal.
- If a failed eval run pollutes COMPARE_RESULTS.md/sqlite, restore with `git checkout`

## Baseline Scores (eval-17715163222)
- Heuristic Mean: 83, Supervisor Mean: 81
- Worst: animate-transitions (58), full-app-no-context (60), charts-dashboard (62)
- See `eval/COMPARE_RESULTS.md` for full history

## Common Naive Agent Failure Patterns (discovered)
See [failure-patterns.md](failure-patterns.md) for details.

1. **View shorthand props** - Agents use `direction="row"`, `align="center"`, `justify="space-between"` on View. These don't exist. Must use `style={{ flexDirection: 'row' }}`.
2. **Button icon prop** - Agents use `icon="..."` on Button. Must use `leftIcon`/`rightIcon`.
3. **Animate hallucination** - Agents fabricate `useSequence`, `useKeyframes`, `useSpring`. Only 5 exports exist.
4. **Easing format** - Agents use CSS `'ease-out'` instead of camelCase `'easeOut'`.
5. **ChartDataSeries label** - Agents add `label` to series objects. Series uses `name`; only DataPoint has `label`.
6. **IconName typing** - Agents return `string` from icon helpers. Must use `IconName` type or TS2322.
7. **Text variant** - Agents use `variant="title"`. Text uses `typography` and `weight` props.
8. **Markdown .web resolution** - Eval workspace may have issues resolving `.web.ts` exports. Framework-level issue.

## Effective Fix Patterns
- Add "COMPLETE LIST" sections with export counts to prevent hallucination
- Add comparison tables (valid vs invalid) for string literal values
- Add "Common mistakes" callout boxes at top of guide overviews
- Fix examples in guides (agents copy examples verbatim)
- Add usage notes in tool response objects (e.g., search_icons handler)

## Rubric Notes
- TS compilation is the most impactful criterion - guides with bad examples directly cause failures
- "Valid Props" score (mean 73) is the weakest area - directly tied to example quality
- Self-Correction (mean 76) improves when docs are clear enough that agents don't need to backtrack
