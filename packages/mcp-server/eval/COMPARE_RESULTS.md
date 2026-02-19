# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17715399332 | 2026-02-19 | claude-opus-4-6 | 23 | 85 | 88 |
| 2 | eval-17715390447 | 2026-02-19 | claude-sonnet-4-6 | 23 | 79 (-6) | 78 |
| 3 | eval-17715387626 | 2026-02-19 | claude-opus-4-6 | 23 | 85 (+6) | 88 |
| 4 | eval-17715387181 | 2026-02-19 | claude-sonnet-4-6 | 2 | 71 (-14) | 80 |
| 5 | eval-17715388209 | 2026-02-19 | claude-opus-4-6 | 1 | 90 (+19) | 95 |
| 6 | eval-17715382647 | 2026-02-19 | claude-opus-4-6 | 1 | 90 (+0) | 0 |
| 7 | eval-17715366654 | 2026-02-19 | claude-opus-4-6 | 1 | 90 (+0) | 93 |
| 8 | eval-17715329900 | 2026-02-19 | claude-opus-4-6 | 23 | 86 (-4) | 91 |
| 9 | eval-17715311746 | 2026-02-19 | claude-opus-4-6 | 23 | 86 (+0) | 91 |
| 10 | eval-17715293470 | 2026-02-19 | claude-opus-4-6 | 23 | 86 (+0) | 90 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 90 | 93 | 14 | 13 | ✓ | 1m19s | completed |
| multi-package | component | 87 | 93 | 25 | 24 | ✓ | 1m52s | completed |
| settings-page | component | 96 | 93 | 26 | 25 | ✓ | 1m46s | completed |
| form-explorer | component | 90 | 93 | 25 | 24 | ✓ | 2m31s | completed |
| navigation | component | 86 | 80 | 26 | 25 | ✗(2) | 2m30s | completed |
| error-recovery | component | 94 | 94 | 14 | 13 | ✓ | 1m14s | completed |
| data-display | component | 84 | 94 | 22 | 21 | ✓ | 1m48s | completed |
| overlay-components | component | 84 | 83 | 19 | 18 | ✗(1) | 1m28s | completed |
| theme-styling | component | 90 | 95 | 19 | 18 | ✓ | 1m42s | completed |
| media-camera | component | 82 | 93 | 17 | 16 | ✓ | 1m12s | completed |
| no-context-audio | component | 84 | 92 | 21 | 20 | ✓ | 3m43s | completed |
| file-upload | component | 83 | 96 | 24 | 23 | ✓ | 1m58s | completed |
| datagrid-analytics | component | 86 | 95 | 12 | 11 | ✓ | 1m9s | completed |
| recipe-discovery | component | 93 | 91 | 20 | 19 | ✓ | 1m57s | completed |
| datepicker-booking | component | 88 | 97 | 9 | 8 | ✓ | 56s | completed |
| charts-dashboard | component | 88 | 95 | 16 | 15 | ✓ | 1m13s | completed |
| oauth-config-login | component | 92 | 94 | 24 | 23 | ✓ | 1m22s | completed |
| markdown-content | component | 90 | 92 | 15 | 14 | ✓ | 1m21s | completed |
| animate-transitions | component | 39 | 5 | 18 | 15 | ✗(0) | 5m0s | timeout |
| full-app-no-context | component | 85 | 92 | 36 | 35 | ✓ | 2m35s | completed |
| project-scaffold | component | 89 | 93 | 13 | 12 | ✓ | 1m0s | completed |
| guide-tool-discovery | component | 90 | 93 | 19 | 18 | ✓ | 2m40s | completed |
| api-backend | component | 60 | 88 | 53 | 52 | ✓ | 3m0s | completed |

## Delta vs Previous Run

Comparing **eval-17715399332** vs **eval-17715390447**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 90 (+0) | 93 (+2) | 14 (-4) | 1m19s (1m9s) |
| multi-package | 87 (+3) | 93 (+0) | 25 (+8) | 1m52s (45s) |
| settings-page | 96 (-1) | 93 (+2) | 26 (+8) | 1m46s (15s) |
| form-explorer | 90 (+0) | 93 (-1) | 25 (+10) | 2m31s (12s) |
| navigation | 86 (-6) | 80 (-12) | 26 (+5) | 2m30s (1m3s) |
| error-recovery | 94 (+0) | 94 (+6) | 14 (+5) | 1m14s (5s) |
| data-display | 84 (+8) | 94 (+10) | 22 (+9) | 1m48s (1m0s) |
| overlay-components | 84 (-7) | 83 (-10) | 19 (-8) | 1m28s (1m39s) |
| theme-styling | 90 (+9) | 95 (+0) | 19 (+5) | 1m42s (31s) |
| media-camera | 82 (-3) | 93 (+5) | 17 (+4) | 1m12s (1m44s) |
| no-context-audio | 84 (+6) | 92 (+2) | 21 (+6) | 3m43s (+1s) |
| file-upload | 83 (+14) | 96 (+34) | 24 (+11) | 1m58s (1m36s) |
| datagrid-analytics | 86 (+0) | 95 (+3) | 12 (+3) | 1m9s (28s) |
| recipe-discovery | 93 (+9) | 91 (+11) | 20 (+6) | 1m57s (38s) |
| datepicker-booking | 88 (+0) | 97 (+6) | 9 (+1) | 56s (33s) |
| charts-dashboard | 88 (+0) | 95 (+2) | 16 (+7) | 1m13s (49s) |
| oauth-config-login | 92 (-1) | 94 (+3) | 24 (+8) | 1m22s (38s) |
| markdown-content | 90 (+0) | 92 (-2) | 15 (+4) | 1m21s (44s) |
| animate-transitions | 39 (+0) | 5 (-3) | 18 (-2) | 5m0s (+0s) |
| full-app-no-context | 85 (+49) | 92 (+84) | 36 (+11) | 2m35s (2m24s) |
| project-scaffold | 89 (+10) | 93 (-1) | 13 (+2) | 1m0s (25s) |
| guide-tool-discovery | 90 (+50) | 93 (+81) | 19 (+6) | 2m40s (2m19s) |
| api-backend | 60 (-1) | 88 (+21) | 53 (+10) | 3m0s (20s) |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 7 | 2026-02-19 | 2026-02-19 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 5 | 2026-02-19 | 2026-02-19 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 4 | 2026-02-18 | 2026-02-19 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 4 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile' recipes and got no results, | mcp_server | minor | 4 | 2026-02-19 | 2026-02-19 |
| TextInput lacks built-in label and error props, requiring de | framework | minor | 4 | 2026-02-19 | 2026-02-19 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 4 | 2026-02-19 | 2026-02-19 |
| The agent had to fall back to reading source files directly  | mcp_server | major | 3 | 2026-02-19 | 2026-02-19 |
| The TextInput component doesn't accept an 'error' prop for i | framework | minor | 3 | 2026-02-18 | 2026-02-19 |
| The agent had to make 5 separate icon search attempts to fin | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile settings form' recipes (Turn | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent needed multiple icon search attempts (e.g., 'penci | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The framework lacks a Wizard/Stepper component for multi-ste | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| TextInput component lacks a 'label' prop while TextArea has  | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent had to make 5 separate get_component_types calls ( | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The @idealyst/files package documentation was retrieved succ | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'lock' and 'lock-outline' icons multi | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |


*Generated at 2026-02-19T22:42:27.510Z*
