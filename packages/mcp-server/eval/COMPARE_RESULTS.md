# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17715163222 | 2026-02-19 | claude-opus-4-6 | 23 | 83 | 81 |
| 2 | eval-17714845070 | 2026-02-19 | claude-opus-4-6 | 23 | 81 (-2) | 78 |
| 3 | eval-17714828401 | 2026-02-19 | claude-opus-4-6 | 15 | 82 (+1) | 81 |
| 4 | eval-17714809132 | 2026-02-19 | claude-opus-4-6 | 15 | 83 (+1) | 81 |
| 5 | eval-17714798600 | 2026-02-19 | claude-opus-4-6 | 15 | 84 (+1) | 78 |
| 6 | eval-17714784239 | 2026-02-19 | claude-opus-4-6 | 15 | 84 (+0) | 80 |
| 7 | eval-17714763985 | 2026-02-19 | claude-opus-4-6 | 15 | 79 (-5) | 79 |
| 8 | eval-17714574380 | 2026-02-18 | claude-opus-4-6 | 9 | 79 (+0) | 56 |
| 9 | eval-17714555155 | 2026-02-18 | claude-opus-4-6 | 1 | 89 (+10) | 88 |
| 10 | eval-17714553179 | 2026-02-18 | claude-opus-4-6 | 1 | 83 (-6) | 0 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 90 | 89 | 13 | 12 | ✓ | 1m13s | completed |
| form-explorer | component | 94 | 91 | 24 | 23 | ✓ | 1m53s | completed |
| multi-package | component | 78 | 88 | 23 | 22 | ✓ | 2m37s | completed |
| settings-page | component | 96 | 88 | 26 | 25 | ✓ | 3m20s | completed |
| error-recovery | component | 87 | 80 | 16 | 13 | ✓ | 2m6s | completed |
| navigation | component | 95 | 87 | 30 | 49 | ✓ | 4m42s | completed |
| overlay-components | component | 81 | 84 | 7 | 6 | ✓ | 1m31s | completed |
| data-display | component | 81 | 80 | 26 | 25 | ✗(1) | 2m56s | completed |
| no-context-audio | component | 84 | 84 | 23 | 22 | ✓ | 4m28s | completed |
| file-upload | component | 78 | 78 | 16 | 14 | ✗(1) | 1m37s | completed |
| media-camera | component | 81 | 86 | 15 | 13 | ✓ | 3m11s | completed |
| theme-styling | component | 90 | 91 | 19 | 18 | ✓ | 4m47s | completed |
| datagrid-analytics | component | 86 | 88 | 10 | 9 | ✓ | 1m27s | completed |
| animate-transitions | component | 79 | 58 | 16 | 14 | ✗(4) | 2m56s | completed |
| recipe-discovery | component | 84 | 77 | 16 | 15 | ✗(1) | 4m32s | completed |
| charts-dashboard | component | 78 | 62 | 9 | 8 | ✗(5) | 1m34s | completed |
| oauth-config-login | component | 90 | 82 | 13 | 11 | ✓ | 3m1s | completed |
| datepicker-booking | component | 88 | 93 | 9 | 8 | ✓ | 4m22s | completed |
| markdown-content | component | 84 | 72 | 16 | 15 | ✗(1) | 2m46s | completed |
| project-scaffold | component | 79 | 90 | 19 | 18 | ✓ | 1m18s | completed |
| guide-tool-discovery | component | 80 | 68 | 19 | 18 | ✗(3) | 2m34s | completed |
| full-app-no-context | component | 76 | 60 | 35 | 31 | ✗(8) | 4m3s | completed |
| api-backend | component | 58 | 88 | 34 | 72 | ✓ | 3m11s | completed |

## Delta vs Previous Run

Comparing **eval-17715163222** vs **eval-17714845070**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 90 (+4) | 89 (+7) | 13 (-6) | 1m13s (+1s) |
| form-explorer | 94 (+4) | 91 (+2) | 24 (-10) | 1m53s (2m59s) |
| multi-package | 78 (+0) | 88 (-2) | 23 (-1) | 2m37s (+44s) |
| settings-page | 96 (+0) | 88 (+0) | 26 (+4) | 3m20s (+41s) |
| error-recovery | 87 (+0) | 80 (+0) | 16 (-1) | 2m6s (10s) |
| navigation | 95 (+0) | 87 (-4) | 30 (+6) | 4m42s (+1m15s) |
| overlay-components | 81 (-2) | 84 (+0) | 7 (-39) | 1m31s (3m17s) |
| data-display | 81 (-2) | 80 (-10) | 26 (-18) | 2m56s (+34s) |
| no-context-audio | 84 (+7) | 84 (-5) | 23 (-1) | 4m28s (+36s) |
| file-upload | 78 (+9) | 78 (+13) | 16 (-4) | 1m37s (2m30s) |
| media-camera | 81 (+10) | 86 (+18) | 15 (-2) | 3m11s (+1m31s) |
| theme-styling | 90 (+6) | 91 (+1) | 19 (-5) | 4m47s (+1m26s) |
| datagrid-analytics | 86 (+10) | 88 (+23) | 10 (-2) | 1m27s (1m36s) |
| animate-transitions | 79 (+9) | 58 (-17) | 16 (-20) | 2m56s (1m42s) |
| recipe-discovery | 84 (-3) | 77 (-4) | 16 (+0) | 4m32s (+2m15s) |
| charts-dashboard | 78 (+0) | 62 (-3) | 9 (-3) | 1m34s (1m47s) |
| oauth-config-login | 90 (+6) | 82 (+2) | 13 (-2) | 3m1s (1m48s) |
| datepicker-booking | 88 (+6) | 93 (+21) | 9 (+0) | 4m22s (+2m45s) |
| markdown-content | 84 (+1) | 72 (+4) | 16 (+3) | 2m46s (+58s) |
| project-scaffold | 79 (+0) | 90 (+8) | 19 (+6) | 1m18s (9s) |
| guide-tool-discovery | 80 (+0) | 68 (+10) | 19 (+3) | 2m34s (28s) |
| full-app-no-context | 76 (+5) | 60 (+12) | 35 (+0) | 4m3s (54s) |
| api-backend | 58 (-8) | 88 (+0) | 34 (-13) | 3m11s (51s) |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| There is no dedicated forms package or form management utili | framework | minor | 4 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile' recipes and got no results, | mcp_server | minor | 4 | 2026-02-19 | 2026-02-19 |
| The agent had to fall back to reading source files directly  | mcp_server | major | 3 | 2026-02-19 | 2026-02-19 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 3 | 2026-02-18 | 2026-02-19 |
| The agent had to make 5 separate icon search attempts to fin | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile settings form' recipes (Turn | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| The framework lacks a Wizard/Stepper component for multi-ste | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| The @idealyst/files package documentation was retrieved succ | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'lock' and 'lock-outline' icons multi | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The theme types return Size as '0'|'1'|'2'|'3'|'4' but compo | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The camera package exports 'ICamera' as the component name r | framework | major | 2 | 2026-02-19 | 2026-02-19 |
| The @idealyst/storage API appears to only support string val | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The MCP server doesn't provide a tool for verifying that gen | mcp_server | minor | 2 | 2026-02-18 | 2026-02-19 |
| The Card component's shadow/elevation API is not clearly exp | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent retrieved Badge types (Turn 17) but still used an  | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent frequently fell back to using inline `style` props | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent's type summary shows Checkbox has an 'error' prop, | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |


*Generated at 2026-02-19T15:52:02.295Z*
