# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17714574380 | 2026-02-18 | claude-opus-4-6 | 9 | 79 | 56 |
| 2 | eval-17714555155 | 2026-02-18 | claude-opus-4-6 | 1 | 89 (+10) | 88 |
| 3 | eval-17714553179 | 2026-02-18 | claude-opus-4-6 | 1 | 83 (-6) | 0 |
| 4 | eval-17714546549 | 2026-02-18 | claude-opus-4-6 | 1 | 79 (-4) | 0 |
| 5 | eval-17714543134 | 2026-02-18 | claude-opus-4-6 | 1 | 83 (+4) | 0 |
| 6 | eval-17714537576 | 2026-02-18 | claude-opus-4-6 | 1 | 88 (+5) | 70 |
| 7 | eval-17714534842 | 2026-02-18 | claude-opus-4-6 | 1 | 83 (-5) | 0 |
| 8 | eval-17714532733 | 2026-02-18 | claude-opus-4-6 | 1 | 84 (+1) | 0 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 88 | 70 | 39 | 38 | ✗(1) | 1m31s | completed |
| settings-page | component | 80 | 68 | 60 | 59 | ✗(3) | 1m42s | completed |
| navigation | component | 75 | 38 | 25 | 24 | ✗(13) | 1m14s | completed |
| form-explorer | component | 69 | 58 | 63 | 62 | ✗(13) | 2m43s | completed |
| multi-package | component | 77 | 68 | 57 | 56 | ✗(2) | 2m8s | completed |
| error-recovery | component | 81 | 58 | 28 | 27 | ✗(7) | 1m16s | completed |
| no-context-audio | component | 84 | 58 | 66 | 65 | ✗(3) | 2m35s | completed |
| project-scaffold | component | 85 | 0 | 57 | 56 | ✓ | 1m36s | completed |
| api-backend | component | 71 | 82 | 70 | 104 | ✓ | 3m31s | completed |

## Delta vs Previous Run

Comparing **eval-17714574380** vs **eval-17714555155**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 88 (-1) | 70 (-18) | 39 (+0) | 1m31s (+7s) |
| settings-page | 80 (new) | - | 60 | 1m42s |
| navigation | 75 (new) | - | 25 | 1m14s |
| form-explorer | 69 (new) | - | 63 | 2m43s |
| multi-package | 77 (new) | - | 57 | 2m8s |
| error-recovery | 81 (new) | - | 28 | 1m16s |
| no-context-audio | 84 (new) | - | 66 | 2m35s |
| project-scaffold | 85 (new) | - | 57 | 1m36s |
| api-backend | 71 (new) | - | 70 | 3m31s |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 2 | 2026-02-18 | 2026-02-18 |
| The agent used 'intent' as a prop on Text, likely because ot | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent fetched theme types and component types multiple t | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The @idealyst/storage package exports 'IStorage' but the age | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent used UnistylesRuntime.setTheme() with a string the | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The get_navigation_types tool may have returned information  | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent called get_component_docs for Icon and still used  | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent's route configuration uses patterns (tabBarIcon, t | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent noted in Turn 10 that 'TypeScript type definitions | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The signup-form recipe (Turn 37) used props like `label`, `e | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The login-form and form-with-validation recipes reference an | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent fetched TypeScript types for TextInput and Button  | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent read the @idealyst/audio source code (index.ts, ty | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent used `import { storage } from '@idealyst/storage'` | mcp_server | major | 1 | 2026-02-18 | 2026-02-18 |
| The agent searched for 'Input' component (Turns 25-26) after | mcp_server | minor | 1 | 2026-02-18 | 2026-02-18 |
| The agent used both inputMode='password' and secureTextEntry | mcp_server | minor | 1 | 2026-02-18 | 2026-02-18 |
| The agent searched for 'lock' icons across 4 separate querie | mcp_server | minor | 1 | 2026-02-18 | 2026-02-18 |
| The login-form recipe apparently referenced an 'Input' compo | mcp_server | minor | 1 | 2026-02-18 | 2026-02-18 |
| The agent tried multiple MCP tools for getting examples: get | mcp_server | minor | 1 | 2026-02-18 | 2026-02-18 |
| The documentation doesn't clearly distinguish between inputM | mcp_server | minor | 1 | 2026-02-18 | 2026-02-18 |


*Generated at 2026-02-18T23:30:38.077Z*
