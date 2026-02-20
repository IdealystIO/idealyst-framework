# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17715689814 | 2026-02-20 | claude-sonnet-4-6 | 23 | 49 | 27 |
| 2 | eval-17715691297 | 2026-02-20 | claude-sonnet-4-6 | 1 | 90 (+41) | 94 |
| 3 | eval-17715691255 | 2026-02-20 | claude-sonnet-4-6 | 1 | 90 (+0) | 95 |
| 4 | eval-17715673219 | 2026-02-20 | claude-sonnet-4-6 | 23 | 87 (-3) | 90 |
| 5 | eval-17715670130 | 2026-02-20 | claude-sonnet-4-6 | 23 | 85 (-2) | 89 |
| 6 | eval-17715671409 | 2026-02-20 | claude-opus-4-6 | 1 | 94 (+9) | 90 |
| 7 | eval-17715654847 | 2026-02-20 | claude-sonnet-4-6 | 23 | 83 (-11) | 86 |
| 8 | eval-17715654954 | 2026-02-20 | claude-sonnet-4-6 | 23 | 82 (-1) | 84 |
| 9 | eval-17715656197 | 2026-02-20 | claude-opus-4-6 | 1 | 84 (+2) | 76 |
| 10 | eval-17715651791 | 2026-02-20 | claude-opus-4-6 | 1 | 75 (-9) | 73 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 90 | 90 | 8 | 7 | ✓ | 1m5s | completed |
| settings-page | component | 93 | 92 | 10 | 9 | ✓ | 1m49s | completed |
| navigation | component | 93 | 95 | 13 | 12 | ✓ | 2m33s | completed |
| multi-package | component | 80 | 89 | 11 | 10 | ✓ | 2m48s | completed |
| error-recovery | component | 94 | 88 | 8 | 7 | ✓ | 1m10s | completed |
| form-explorer | component | 90 | 93 | 11 | 10 | ✓ | 3m19s | completed |
| media-camera | component | 28 | 0 | 2 | 1 | ✗(0) | 9s | error |
| theme-styling | component | 35 | 0 | 5 | 4 | ✗(0) | 23s | error |
| data-display | component | 86 | 0 | 7 | 6 | ✓ | 1m15s | error |
| file-upload | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| recipe-discovery | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| animate-transitions | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| datagrid-analytics | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| datepicker-booking | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| oauth-config-login | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| charts-dashboard | component | 20 | 0 | 1 | 0 | ✗(0) | 6s | error |
| markdown-content | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| guide-tool-discovery | component | 20 | 0 | 1 | 0 | ✗(0) | 5s | error |
| full-app-no-context | component | 20 | 0 | 1 | 0 | ✗(0) | 8s | error |
| project-scaffold | component | 40 | 0 | 1 | 0 | ✓ | 5s | error |
| overlay-components | component | 81 | 0 | 7 | 6 | ✓ | 1m18s | error |
| api-backend | component | 40 | 0 | 1 | 0 | ✓ | 5s | error |
| no-context-audio | component | 78 | 84 | 7 | 6 | ✓ | 4m21s | error |

## Delta vs Previous Run

Comparing **eval-17715689814** vs **eval-17715691297**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 90 (+0) | 90 (-4) | 8 (+1) | 1m5s (0s) |
| settings-page | 93 (new) | - | 10 | 1m49s |
| navigation | 93 (new) | - | 13 | 2m33s |
| multi-package | 80 (new) | - | 11 | 2m48s |
| error-recovery | 94 (new) | - | 8 | 1m10s |
| form-explorer | 90 (new) | - | 11 | 3m19s |
| media-camera | 28 (new) | - | 2 | 9s |
| theme-styling | 35 (new) | - | 5 | 23s |
| data-display | 86 (new) | - | 7 | 1m15s |
| file-upload | 20 (new) | - | 1 | 5s |
| recipe-discovery | 20 (new) | - | 1 | 5s |
| animate-transitions | 20 (new) | - | 1 | 5s |
| datagrid-analytics | 20 (new) | - | 1 | 5s |
| datepicker-booking | 20 (new) | - | 1 | 5s |
| oauth-config-login | 20 (new) | - | 1 | 5s |
| charts-dashboard | 20 (new) | - | 1 | 6s |
| markdown-content | 20 (new) | - | 1 | 5s |
| guide-tool-discovery | 20 (new) | - | 1 | 5s |
| full-app-no-context | 20 (new) | - | 1 | 8s |
| project-scaffold | 40 (new) | - | 1 | 5s |
| overlay-components | 81 (new) | - | 7 | 1m18s |
| api-backend | 40 (new) | - | 1 | 5s |
| no-context-audio | 78 (new) | - | 7 | 4m21s |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 10 | 2026-02-19 | 2026-02-20 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 8 | 2026-02-19 | 2026-02-20 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 6 | 2026-02-19 | 2026-02-20 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
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


*Generated at 2026-02-20T06:38:34.685Z*
