# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17721279353 | 2026-02-26 | claude-sonnet-4-6 | 1 | 95 | 97 |
| 2 | eval-17721279264 | 2026-02-26 | claude-sonnet-4-6 | 1 | 92 (-3) | 95 |
| 3 | eval-17721280045 | 2026-02-26 | claude-opus-4-6 | 1 | 97 (+5) | 95 |
| 4 | eval-17721275655 | 2026-02-26 | claude-sonnet-4-6 | 1 | 97 (+0) | 94 |
| 5 | eval-17721275750 | 2026-02-26 | claude-sonnet-4-6 | 1 | 82 (-15) | 82 |
| 6 | eval-17721276433 | 2026-02-26 | claude-opus-4-6 | 1 | 97 (+15) | 95 |
| 7 | eval-17721271288 | 2026-02-26 | claude-sonnet-4-6 | 2 | 82 (-15) | 86 |
| 8 | eval-17721271927 | 2026-02-26 | claude-opus-4-6 | 1 | 97 (+15) | 96 |
| 9 | eval-17721253649 | 2026-02-26 | claude-sonnet-4-6 | 37 | 92 (-5) | 93 |
| 10 | eval-17721249695 | 2026-02-26 | claude-sonnet-4-6 | 3 | 92 (+0) | 91 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| wizard-multi-step | component | 95 | 97 | 17 | 16 | ✓ | 4m0s | completed |

## Delta vs Previous Run

Comparing **eval-17721279353** vs **eval-17721279264**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| wizard-multi-step | 95 (+3) | 97 (+2) | 17 (+9) | 4m0s (+2m12s) |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 11 | 2026-02-19 | 2026-02-26 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 10 | 2026-02-19 | 2026-02-25 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| The agent needed two separate icon search calls to find home | mcp_server | minor | 8 | 2026-02-20 | 2026-02-26 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 7 | 2026-02-19 | 2026-02-25 |
| The agent used both 'intent' and 'color' (hex string) props  | mcp_server | minor | 6 | 2026-02-19 | 2026-02-24 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 6 | 2026-02-19 | 2026-02-24 |
| The agent used <View scrollable background='screen'> as the  | mcp_server | minor | 6 | 2026-02-19 | 2026-02-26 |
| The CameraPreview component's primary prop for connecting to | mcp_server | minor | 6 | 2026-02-24 | 2026-02-26 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| The framework lacks a built-in circular progress / progress  | framework | minor | 5 | 2026-02-19 | 2026-02-26 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The agent searched for icons with queries 'flash', 'image ga | mcp_server | minor | 5 | 2026-02-19 | 2026-02-26 |
| The agent used `intent` on Card (e.g., <Card intent='primary | mcp_server | minor | 5 | 2026-02-19 | 2026-02-26 |
| The agent needed two separate icon searches (Turn 7 and Turn | mcp_server | minor | 5 | 2026-02-19 | 2026-02-24 |
| The agent passed camera.cameraRef.current to CameraPreview's | mcp_server | minor | 5 | 2026-02-20 | 2026-02-26 |
| The agent called ThemeSettings.setTheme(themeMode, themeMode | mcp_server | minor | 5 | 2026-02-24 | 2026-02-26 |
| The StackLayoutProps interface — specifically that it provid | mcp_server | minor | 5 | 2026-02-25 | 2026-02-26 |
| When creating platform-specific index files (.web.ts/.native | documentation | major | 4 | 2026-02-24 | 2026-02-24 |


*Generated at 2026-02-26T17:50:30.344Z*
