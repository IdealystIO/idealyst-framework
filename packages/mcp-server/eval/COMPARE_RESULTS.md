# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17714828401 | 2026-02-19 | claude-opus-4-6 | 15 | 82 | 81 |
| 2 | eval-17714809132 | 2026-02-19 | claude-opus-4-6 | 15 | 83 (+1) | 81 |
| 3 | eval-17714798600 | 2026-02-19 | claude-opus-4-6 | 15 | 84 (+1) | 78 |
| 4 | eval-17714784239 | 2026-02-19 | claude-opus-4-6 | 15 | 84 (+0) | 80 |
| 5 | eval-17714763985 | 2026-02-19 | claude-opus-4-6 | 15 | 79 (-5) | 79 |
| 6 | eval-17714574380 | 2026-02-18 | claude-opus-4-6 | 9 | 79 (+0) | 56 |
| 7 | eval-17714555155 | 2026-02-18 | claude-opus-4-6 | 1 | 89 (+10) | 88 |
| 8 | eval-17714553179 | 2026-02-18 | claude-opus-4-6 | 1 | 83 (-6) | 0 |
| 9 | eval-17714546549 | 2026-02-18 | claude-opus-4-6 | 1 | 79 (-4) | 0 |
| 10 | eval-17714543134 | 2026-02-18 | claude-opus-4-6 | 1 | 83 (+4) | 0 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 86 | 89 | 15 | 14 | ✓ | 1m19s | completed |
| settings-page | component | 96 | 87 | 30 | 29 | ✓ | 2m2s | completed |
| multi-package | component | 78 | 90 | 21 | 20 | ✓ | 2m47s | completed |
| navigation | component | 92 | 86 | 22 | 21 | ✓ | 3m35s | completed |
| form-explorer | component | 86 | 88 | 32 | 31 | ✓ | 4m22s | completed |
| error-recovery | component | 94 | 89 | 16 | 15 | ✓ | 5m10s | completed |
| no-context-audio | component | 70 | 58 | 36 | 35 | ✗(2) | 5m56s | completed |
| media-camera | component | 70 | 58 | 20 | 16 | ✗(3) | 2m25s | completed |
| theme-styling | component | 84 | 91 | 15 | 12 | ✓ | 4m8s | completed |
| overlay-components | component | 89 | 93 | 18 | 16 | ✓ | 5m43s | completed |
| data-display | component | 89 | 89 | 18 | 15 | ✓ | 7m11s | completed |
| project-scaffold | component | 79 | 89 | 19 | 15 | ✓ | 3m9s | completed |
| recipe-discovery | component | 90 | 85 | 19 | 18 | ✓ | 4m42s | completed |
| file-upload | component | 62 | 58 | 42 | 33 | ✗(6) | 6m14s | completed |
| api-backend | component | 62 | 68 | 58 | 56 | ✓ | 4m40s | completed |

## Delta vs Previous Run

Comparing **eval-17714828401** vs **eval-17714809132**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 86 (-8) | 89 (+6) | 15 (-5) | 1m19s (2m33s) |
| settings-page | 96 (+6) | 87 (-1) | 30 (-1) | 2m2s (+41s) |
| multi-package | 78 (-3) | 90 (+0) | 21 (-7) | 2m47s (1m46s) |
| navigation | 92 (+7) | 86 (+14) | 22 (-2) | 3m35s (+35s) |
| form-explorer | 86 (-3) | 88 (+2) | 32 (-1) | 4m22s (+2m13s) |
| error-recovery | 94 (+7) | 89 (+10) | 16 (-2) | 5m10s (+1m14s) |
| no-context-audio | 70 (-5) | 58 (-9) | 36 (+19) | 5m56s (+3m40s) |
| media-camera | 70 (-16) | 58 (-14) | 20 (-9) | 2m25s (1m24s) |
| theme-styling | 84 (+3) | 91 (+0) | 15 (-1) | 4m8s (+2m32s) |
| overlay-components | 89 (+6) | 93 (+8) | 18 (-24) | 5m43s (+2m46s) |
| data-display | 89 (+6) | 89 (+4) | 18 (-24) | 7m11s (+2m43s) |
| project-scaffold | 79 (+0) | 89 (-1) | 19 (-2) | 3m9s (+43s) |
| recipe-discovery | 90 (+6) | 85 (+13) | 19 (+1) | 4m42s (+47s) |
| file-upload | 62 (-19) | 58 (-16) | 42 (+25) | 6m14s (+3m56s) |
| api-backend | 62 (+2) | 68 (-15) | 58 (+19) | 4m40s (+16s) |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 4 | 2026-02-18 | 2026-02-19 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 3 | 2026-02-18 | 2026-02-19 |
| The agent searched for 'profile settings form' recipes (Turn | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| The @idealyst/files package documentation was retrieved succ | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The agent had to fall back to reading source files directly  | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The theme types return Size as '0'|'1'|'2'|'3'|'4' but compo | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The camera package exports 'ICamera' as the component name r | framework | major | 2 | 2026-02-19 | 2026-02-19 |
| The agent had to make 5 separate icon search attempts to fin | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent retrieved Badge types (Turn 17) but still used an  | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent's type summary shows Checkbox has an 'error' prop, | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent had to make 5 separate icon search calls (Turns 11 | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| There is no dedicated forms package or form management utili | framework | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent encountered permission errors when trying to Edit  | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The search_icons tool appears to work poorly with multi-word | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile' recipes and got no results, | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent called ThemeSettings.setTheme(mode, mode) with two | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The get_audio_guide tool repeatedly failed with permission e | mcp_server | critical | 1 | 2026-02-19 | 2026-02-19 |
| The get_camera_guide tool required permission approval that  | mcp_server | critical | 1 | 2026-02-19 | 2026-02-19 |


*Generated at 2026-02-19T06:34:00.154Z*
