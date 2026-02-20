# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17715571984 | 2026-02-20 | claude-sonnet-4-6 | 23 | 84 | 87 |
| 2 | eval-17715573255 | 2026-02-20 | claude-opus-4-6 | 1 | 90 (+6) | 88 |
| 3 | eval-17715557073 | 2026-02-20 | claude-sonnet-4-6 | 23 | 87 (-3) | 90 |
| 4 | eval-17715558301 | 2026-02-20 | claude-opus-4-6 | 1 | 90 (+3) | 93 |
| 5 | eval-17715541202 | 2026-02-20 | claude-sonnet-4-6 | 23 | 84 (-6) | 86 |
| 6 | eval-17715453690 | 2026-02-19 | claude-opus-4-6 | 1 | 90 (+6) | 88 |
| 7 | eval-17715438640 | 2026-02-19 | claude-sonnet-4-6 | 23 | 82 (-8) | 83 |
| 8 | eval-17715424347 | 2026-02-19 | claude-sonnet-4-6 | 23 | 83 (+1) | 86 |
| 9 | eval-17715411731 | 2026-02-19 | claude-sonnet-4-6 | 23 | 49 (-34) | 23 |
| 10 | eval-17715410635 | 2026-02-19 | claude-opus-4-6 | 23 | 54 (+5) | 38 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| settings-page | component | 97 | 94 | 13 | 12 | ✓ | 1m32s | completed |
| login-screen | component | 90 | 90 | 12 | 11 | ✓ | 1m57s | completed |
| form-explorer | component | 94 | 92 | 11 | 10 | ✓ | 2m20s | completed |
| navigation | component | 93 | 94 | 13 | 12 | ✓ | 2m19s | completed |
| error-recovery | component | 94 | 91 | 9 | 8 | ✓ | 1m11s | completed |
| multi-package | component | 84 | 92 | 17 | 16 | ✓ | 3m47s | completed |
| overlay-components | component | 90 | 91 | 13 | 12 | ✓ | 3m13s | completed |
| data-display | component | 86 | 93 | 15 | 14 | ✓ | 3m40s | completed |
| theme-styling | component | 81 | 94 | 13 | 12 | ✓ | 2m21s | completed |
| no-context-audio | component | 78 | 88 | 10 | 9 | ✓ | 4m7s | completed |
| media-camera | component | 82 | 90 | 10 | 9 | ✓ | 2m29s | completed |
| datagrid-analytics | component | 86 | 93 | 8 | 7 | ✓ | 1m38s | completed |
| file-upload | component | 74 | 77 | 13 | 12 | ✗(4) | 2m36s | completed |
| datepicker-booking | component | 88 | 96 | 8 | 7 | ✓ | 1m41s | completed |
| recipe-discovery | component | 84 | 87 | 10 | 9 | ✗(1) | 2m15s | completed |
| oauth-config-login | component | 93 | 95 | 12 | 11 | ✓ | 1m52s | completed |
| animate-transitions | component | 90 | 82 | 10 | 9 | ✓ | 5m18s | completed |
| markdown-content | component | 90 | 93 | 12 | 11 | ✓ | 2m10s | completed |
| charts-dashboard | component | 88 | 95 | 7 | 6 | ✓ | 2m29s | completed |
| project-scaffold | component | 83 | 93 | 12 | 11 | ✓ | 1m48s | completed |
| api-backend | component | 65 | 84 | 37 | 36 | ✓ | 2m22s | completed |
| guide-tool-discovery | component | 90 | 84 | 18 | 17 | ✓ | 5m23s | completed |
| full-app-no-context | component | 26 | 12 | 21 | 13 | ✗(0) | 10m0s | timeout |

## Delta vs Previous Run

Comparing **eval-17715571984** vs **eval-17715573255**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| settings-page | 97 (new) | - | 13 | 1m32s |
| login-screen | 90 (+0) | 90 (+2) | 12 (+1) | 1m57s (+51s) |
| form-explorer | 94 (new) | - | 11 | 2m20s |
| navigation | 93 (new) | - | 13 | 2m19s |
| error-recovery | 94 (new) | - | 9 | 1m11s |
| multi-package | 84 (new) | - | 17 | 3m47s |
| overlay-components | 90 (new) | - | 13 | 3m13s |
| data-display | 86 (new) | - | 15 | 3m40s |
| theme-styling | 81 (new) | - | 13 | 2m21s |
| no-context-audio | 78 (new) | - | 10 | 4m7s |
| media-camera | 82 (new) | - | 10 | 2m29s |
| datagrid-analytics | 86 (new) | - | 8 | 1m38s |
| file-upload | 74 (new) | - | 13 | 2m36s |
| datepicker-booking | 88 (new) | - | 8 | 1m41s |
| recipe-discovery | 84 (new) | - | 10 | 2m15s |
| oauth-config-login | 93 (new) | - | 12 | 1m52s |
| animate-transitions | 90 (new) | - | 10 | 5m18s |
| markdown-content | 90 (new) | - | 12 | 2m10s |
| charts-dashboard | 88 (new) | - | 7 | 2m29s |
| project-scaffold | 83 (new) | - | 12 | 1m48s |
| api-backend | 65 (new) | - | 37 | 2m22s |
| guide-tool-discovery | 90 (new) | - | 18 | 5m23s |
| full-app-no-context | 26 (new) | - | 21 | 10m0s |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 9 | 2026-02-19 | 2026-02-20 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 7 | 2026-02-19 | 2026-02-20 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 4 | 2026-02-18 | 2026-02-19 |
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
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent needed 5 separate icon search queries to find all  | mcp_server | minor | 3 | 2026-02-19 | 2026-02-20 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 3 | 2026-02-19 | 2026-02-20 |


*Generated at 2026-02-20T03:37:20.039Z*
