# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17732625487 | 2026-03-11 | claude-opus-4-6 | 1 | 90 | 93 |
| 2 | eval-17732626146 | 2026-03-11 | claude-opus-4-6 | 1 | 91 (+1) | 92 |
| 3 | eval-17729951721 | 2026-03-08 | claude-sonnet-4-6 | 37 | 91 (+0) | 91 |
| 4 | eval-17729936359 | 2026-03-08 | claude-sonnet-4-6 | 37 | 91 (+0) | 90 |
| 5 | eval-17729936969 | 2026-03-08 | claude-opus-4-6 | 1 | 91 (+0) | 93 |
| 6 | eval-17721279353 | 2026-02-26 | claude-sonnet-4-6 | 1 | 95 (+4) | 97 |
| 7 | eval-17721279264 | 2026-02-26 | claude-sonnet-4-6 | 1 | 92 (-3) | 95 |
| 8 | eval-17721280045 | 2026-02-26 | claude-opus-4-6 | 1 | 97 (+5) | 95 |
| 9 | eval-17721275655 | 2026-02-26 | claude-sonnet-4-6 | 1 | 97 (+0) | 94 |
| 10 | eval-17721275750 | 2026-02-26 | claude-sonnet-4-6 | 1 | 82 (-15) | 82 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| scrollview-content | component | 90 | 93 | 6 | 5 | ✓ | 55s | completed |

## Delta vs Previous Run

Comparing **eval-17732625487** vs **eval-17732626146**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| scrollview-content | 90 (new) | - | 6 | 55s |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 12 | 2026-02-19 | 2026-03-08 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 10 | 2026-02-19 | 2026-02-25 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| The agent needed two separate icon search calls to find home | mcp_server | minor | 9 | 2026-02-20 | 2026-03-08 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 7 | 2026-02-19 | 2026-02-25 |
| The agent used both 'intent' and 'color' (hex string) props  | mcp_server | minor | 6 | 2026-02-19 | 2026-02-24 |
| The framework lacks a multi-step form/wizard component, whic | framework | minor | 6 | 2026-02-19 | 2026-03-08 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 6 | 2026-02-19 | 2026-03-08 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 6 | 2026-02-19 | 2026-02-24 |
| The agent used `intent` on Card (e.g., <Card intent='primary | mcp_server | minor | 6 | 2026-02-19 | 2026-03-08 |
| The agent used <View scrollable background='screen'> as the  | mcp_server | minor | 6 | 2026-02-19 | 2026-02-26 |
| The CameraPreview component's primary prop for connecting to | mcp_server | minor | 6 | 2026-02-24 | 2026-02-26 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| The framework lacks a built-in circular progress / progress  | framework | minor | 5 | 2026-02-19 | 2026-02-26 |
| The agent searched for icons with queries 'flash', 'image ga | mcp_server | minor | 5 | 2026-02-19 | 2026-02-26 |
| The agent needed two separate icon searches (Turn 7 and Turn | mcp_server | minor | 5 | 2026-02-19 | 2026-02-24 |
| The agent passed camera.cameraRef.current to CameraPreview's | mcp_server | minor | 5 | 2026-02-20 | 2026-02-26 |
| TextArea uses an onChange callback while TextInput uses onCh | framework | minor | 5 | 2026-02-20 | 2026-03-08 |
| The agent used CameraPreview props enableTapToFocus and enab | mcp_server | minor | 5 | 2026-02-20 | 2026-03-08 |


*Generated at 2026-03-11T20:57:12.394Z*
