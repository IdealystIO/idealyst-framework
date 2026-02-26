# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17721241324 | 2026-02-26 | claude-sonnet-4-6 | 10 | 90 | 92 |
| 2 | eval-17721242099 | 2026-02-26 | claude-opus-4-6 | 1 | 87 (-3) | 95 |
| 3 | eval-17721198229 | 2026-02-26 | claude-sonnet-4-6 | 27 | 90 (+3) | 89 |
| 4 | eval-17720773136 | 2026-02-26 | claude-sonnet-4-6 | 27 | 90 (+0) | 88 |
| 5 | eval-17720768116 | 2026-02-26 | claude-sonnet-4-6 | 4 | 93 (+3) | 90 |
| 6 | eval-17720750103 | 2026-02-26 | claude-sonnet-4-6 | 27 | 90 (-3) | 91 |
| 7 | eval-17720744739 | 2026-02-26 | claude-sonnet-4-6 | 2 | 91 (+1) | 96 |
| 8 | eval-17720728678 | 2026-02-26 | claude-sonnet-4-6 | 27 | 91 (+0) | 91 |
| 9 | eval-17720674351 | 2026-02-26 | claude-sonnet-4-6 | 2 | 94 (+3) | 92 |
| 10 | eval-17720658580 | 2026-02-26 | claude-sonnet-4-6 | 27 | 92 (-2) | 91 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| lottie-animation | component | 83 | 94 | 5 | 4 | ✓ | 35s | completed |
| table-data | component | 90 | 97 | 5 | 4 | ✓ | 52s | completed |
| storage-todo-crud | component | 92 | 97 | 5 | 4 | ✓ | 54s | completed |
| translate-i18n | component | 92 | 96 | 8 | 7 | ✓ | 1m5s | completed |
| grid-responsive | component | 97 | 97 | 5 | 4 | ✓ | 1m8s | completed |
| notifications-local | component | 83 | 78 | 14 | 13 | ✗(2) | 2m17s | completed |
| theme-config | component | 90 | 94 | 5 | 4 | ✓ | 1m27s | completed |
| install-guide-camera | component | 86 | 84 | 8 | 7 | ✓ | 3m1s | completed |
| wizard-multi-step | component | 92 | 96 | 17 | 16 | ✓ | 3m5s | completed |
| multi-screen-app | component | 91 | 82 | 10 | 9 | ✗(1) | 2m15s | completed |

## Delta vs Previous Run

Comparing **eval-17721241324** vs **eval-17721242099**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| lottie-animation | 83 (new) | - | 5 | 35s |
| table-data | 90 (new) | - | 5 | 52s |
| storage-todo-crud | 92 (new) | - | 5 | 54s |
| translate-i18n | 92 (new) | - | 8 | 1m5s |
| grid-responsive | 97 (new) | - | 5 | 1m8s |
| notifications-local | 83 (new) | - | 14 | 2m17s |
| theme-config | 90 (new) | - | 5 | 1m27s |
| install-guide-camera | 86 (new) | - | 8 | 3m1s |
| wizard-multi-step | 92 (new) | - | 17 | 3m5s |
| multi-screen-app | 91 (new) | - | 10 | 2m15s |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 11 | 2026-02-19 | 2026-02-26 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 10 | 2026-02-19 | 2026-02-25 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 7 | 2026-02-19 | 2026-02-25 |
| The agent needed two separate icon search calls to find home | mcp_server | minor | 7 | 2026-02-20 | 2026-02-25 |
| The agent used both 'intent' and 'color' (hex string) props  | mcp_server | minor | 6 | 2026-02-19 | 2026-02-24 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 6 | 2026-02-19 | 2026-02-24 |
| The agent used <View scrollable background='screen'> as the  | mcp_server | minor | 6 | 2026-02-19 | 2026-02-26 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| The framework lacks a built-in circular progress / progress  | framework | minor | 5 | 2026-02-19 | 2026-02-26 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The agent searched for icons with queries 'flash', 'image ga | mcp_server | minor | 5 | 2026-02-19 | 2026-02-26 |
| The agent used `intent` on Card (e.g., <Card intent='primary | mcp_server | minor | 5 | 2026-02-19 | 2026-02-26 |
| The agent needed two separate icon searches (Turn 7 and Turn | mcp_server | minor | 5 | 2026-02-19 | 2026-02-24 |
| The agent passed camera.cameraRef.current to CameraPreview's | mcp_server | minor | 5 | 2026-02-20 | 2026-02-26 |
| The agent called ThemeSettings.setTheme(themeMode, themeMode | mcp_server | minor | 5 | 2026-02-24 | 2026-02-26 |
| The CameraPreview component's primary prop for connecting to | mcp_server | minor | 5 | 2026-02-24 | 2026-02-26 |
| When creating platform-specific index files (.web.ts/.native | documentation | major | 4 | 2026-02-24 | 2026-02-24 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 4 | 2026-02-18 | 2026-02-19 |


*Generated at 2026-02-26T16:49:23.279Z*
