# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17715673219 | 2026-02-20 | claude-sonnet-4-6 | 23 | 87 | 90 |
| 2 | eval-17715670130 | 2026-02-20 | claude-sonnet-4-6 | 23 | 85 (-2) | 89 |
| 3 | eval-17715671409 | 2026-02-20 | claude-opus-4-6 | 1 | 94 (+9) | 90 |
| 4 | eval-17715654847 | 2026-02-20 | claude-sonnet-4-6 | 23 | 83 (-11) | 86 |
| 5 | eval-17715654954 | 2026-02-20 | claude-sonnet-4-6 | 23 | 82 (-1) | 84 |
| 6 | eval-17715656197 | 2026-02-20 | claude-opus-4-6 | 1 | 84 (+2) | 76 |
| 7 | eval-17715651791 | 2026-02-20 | claude-opus-4-6 | 1 | 75 (-9) | 73 |
| 8 | eval-17715635338 | 2026-02-20 | claude-sonnet-4-6 | 23 | 79 (+4) | 82 |
| 9 | eval-17715636938 | 2026-02-20 | claude-opus-4-6 | 1 | 84 (+5) | 85 |
| 10 | eval-17715615464 | 2026-02-20 | claude-sonnet-4-6 | 23 | 83 (-1) | 85 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 90 | 88 | 10 | 9 | ✓ | 1m55s | completed |
| settings-page | component | 93 | 93 | 16 | 15 | ✓ | 2m8s | completed |
| navigation | component | 93 | 93 | 13 | 12 | ✓ | 1m51s | completed |
| multi-package | component | 84 | 95 | 20 | 19 | ✓ | 3m1s | completed |
| form-explorer | component | 90 | 93 | 14 | 13 | ✓ | 3m56s | completed |
| error-recovery | component | 94 | 87 | 9 | 8 | ✓ | 1m11s | completed |
| no-context-audio | component | 78 | 91 | 10 | 9 | ✓ | 2m49s | completed |
| data-display | component | 86 | 89 | 14 | 13 | ✓ | 3m16s | completed |
| overlay-components | component | 90 | 94 | 15 | 14 | ✓ | 3m50s | completed |
| media-camera | component | 82 | 81 | 11 | 10 | ✓ | 3m8s | completed |
| theme-styling | component | 77 | 95 | 15 | 14 | ✓ | 3m47s | completed |
| file-upload | component | 84 | 93 | 12 | 11 | ✓ | 2m4s | completed |
| recipe-discovery | component | 93 | 92 | 15 | 14 | ✓ | 2m18s | completed |
| datagrid-analytics | component | 86 | 93 | 7 | 6 | ✓ | 1m7s | completed |
| datepicker-booking | component | 88 | 95 | 9 | 8 | ✓ | 1m0s | completed |
| oauth-config-login | component | 93 | 96 | 13 | 12 | ✓ | 2m1s | completed |
| charts-dashboard | component | 88 | 88 | 9 | 8 | ✓ | 1m29s | completed |
| markdown-content | component | 90 | 90 | 8 | 7 | ✓ | 1m27s | completed |
| project-scaffold | component | 89 | 92 | 12 | 11 | ✓ | 1m8s | completed |
| animate-transitions | component | 85 | 94 | 13 | 12 | ✓ | 7m22s | completed |
| api-backend | component | 64 | 84 | 37 | 36 | ✓ | 3m5s | completed |
| guide-tool-discovery | component | 90 | 87 | 13 | 12 | ✓ | 4m46s | completed |
| full-app-no-context | component | 88 | 72 | 15 | 14 | ✓ | 11m52s | completed |

## Delta vs Previous Run

Comparing **eval-17715673219** vs **eval-17715670130**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 90 (+0) | 88 (-2) | 10 (+0) | 1m55s (+28s) |
| settings-page | 93 (-4) | 93 (+0) | 16 (+1) | 2m8s (+37s) |
| navigation | 93 (+0) | 93 (+0) | 13 (+1) | 1m51s (1m30s) |
| multi-package | 84 (+6) | 95 (+11) | 20 (+2) | 3m1s (+9s) |
| form-explorer | 90 (+0) | 93 (+0) | 14 (-2) | 3m56s (+53s) |
| error-recovery | 94 (+9) | 87 (+11) | 9 (-2) | 1m11s (7s) |
| no-context-audio | 78 (+0) | 91 (-3) | 10 (-1) | 2m49s (15s) |
| data-display | 86 (+8) | 89 (-5) | 14 (-3) | 3m16s (1m19s) |
| overlay-components | 90 (+0) | 94 (+1) | 15 (-1) | 3m50s (+1m22s) |
| media-camera | 82 (+0) | 81 (-10) | 11 (-2) | 3m8s (+37s) |
| theme-styling | 77 (+2) | 95 (+12) | 15 (+2) | 3m47s (+1m28s) |
| file-upload | 84 (+0) | 93 (+1) | 12 (-1) | 2m4s (1m57s) |
| recipe-discovery | 93 (+6) | 92 (-2) | 15 (+2) | 2m18s (+44s) |
| datagrid-analytics | 86 (+0) | 93 (+0) | 7 (+1) | 1m7s (3s) |
| datepicker-booking | 88 (+0) | 95 (+4) | 9 (+1) | 1m0s (23s) |
| oauth-config-login | 93 (+3) | 96 (+3) | 13 (-1) | 2m1s (+31s) |
| charts-dashboard | 88 (+0) | 88 (-3) | 9 (+3) | 1m29s (10s) |
| markdown-content | 90 (+0) | 90 (+0) | 8 (-3) | 1m27s (36s) |
| project-scaffold | 89 (+6) | 92 (-4) | 12 (+1) | 1m8s (+4s) |
| animate-transitions | 85 (-5) | 94 (+4) | 13 (-2) | 7m22s (+2m8s) |
| api-backend | 64 (+1) | 84 (+0) | 37 (-2) | 3m5s (+29s) |
| guide-tool-discovery | 90 (+0) | 87 (-3) | 13 (+1) | 4m46s (4m43s) |
| full-app-no-context | 88 (+10) | 72 (+12) | 15 (+1) | 11m52s (+5m38s) |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 10 | 2026-02-19 | 2026-02-20 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 8 | 2026-02-19 | 2026-02-20 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 4 | 2026-02-18 | 2026-02-19 |
| The agent used both 'intent' and 'color' (hex string) props  | mcp_server | minor | 4 | 2026-02-19 | 2026-02-20 |
| The agent searched for 'profile' recipes and got no results, | mcp_server | minor | 4 | 2026-02-19 | 2026-02-19 |
| TextInput lacks built-in label and error props, requiring de | framework | minor | 4 | 2026-02-19 | 2026-02-19 |
| TextInput component lacks a 'label' prop while TextArea has  | framework | minor | 4 | 2026-02-19 | 2026-02-20 |
| The agent had to make 5 separate get_component_types calls ( | mcp_server | minor | 4 | 2026-02-19 | 2026-02-20 |
| The agent had to fall back to reading source files directly  | mcp_server | major | 3 | 2026-02-19 | 2026-02-19 |
| The TextInput component doesn't accept an 'error' prop for i | framework | minor | 3 | 2026-02-18 | 2026-02-19 |
| The agent had to make 5 separate icon search attempts to fin | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile settings form' recipes (Turn | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent needed multiple icon search attempts (e.g., 'penci | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The framework lacks a Wizard/Stepper component for multi-ste | framework | minor | 3 | 2026-02-19 | 2026-02-19 |


*Generated at 2026-02-20T06:27:42.148Z*
