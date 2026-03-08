# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17729951721 | 2026-03-08 | claude-sonnet-4-6 | 37 | 91 | 91 |
| 2 | eval-17729936359 | 2026-03-08 | claude-sonnet-4-6 | 37 | 91 (+0) | 90 |
| 3 | eval-17729936969 | 2026-03-08 | claude-opus-4-6 | 1 | 91 (+0) | 93 |
| 4 | eval-17721279353 | 2026-02-26 | claude-sonnet-4-6 | 1 | 95 (+4) | 97 |
| 5 | eval-17721279264 | 2026-02-26 | claude-sonnet-4-6 | 1 | 92 (-3) | 95 |
| 6 | eval-17721280045 | 2026-02-26 | claude-opus-4-6 | 1 | 97 (+5) | 95 |
| 7 | eval-17721275655 | 2026-02-26 | claude-sonnet-4-6 | 1 | 97 (+0) | 94 |
| 8 | eval-17721275750 | 2026-02-26 | claude-sonnet-4-6 | 1 | 82 (-15) | 82 |
| 9 | eval-17721276433 | 2026-02-26 | claude-opus-4-6 | 1 | 97 (+15) | 95 |
| 10 | eval-17721271288 | 2026-02-26 | claude-sonnet-4-6 | 2 | 82 (-15) | 86 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 91 | 95 | 6 | 5 | ✓ | 50s | completed |
| form-explorer | component | 94 | 93 | 10 | 9 | ✓ | 47s | completed |
| settings-page | component | 87 | 95 | 7 | 6 | ✓ | 49s | completed |
| navigation | component | 94 | 93 | 11 | 10 | ✓ | 1m17s | completed |
| multi-package | component | 93 | 93 | 17 | 16 | ✓ | 1m40s | completed |
| error-recovery | component | 100 | 91 | 10 | 9 | ✓ | 1m3s | completed |
| data-display | component | 93 | 93 | 9 | 8 | ✓ | 1m37s | completed |
| no-context-audio | component | 97 | 93 | 11 | 10 | ✓ | 2m15s | completed |
| overlay-components | component | 97 | 88 | 15 | 14 | ✓ | 1m57s | completed |
| file-upload | component | 97 | 87 | 9 | 8 | ✓ | 1m12s | completed |
| theme-styling | component | 97 | 90 | 9 | 8 | ✓ | 2m29s | completed |
| recipe-discovery | component | 93 | 86 | 10 | 9 | ✓ | 1m23s | completed |
| datepicker-booking | component | 97 | 93 | 8 | 7 | ✓ | 48s | completed |
| media-camera | component | 93 | 87 | 15 | 14 | ✓ | 3m16s | completed |
| datagrid-analytics | component | 93 | 92 | 7 | 6 | ✓ | 1m6s | completed |
| charts-dashboard | component | 97 | 94 | 8 | 7 | ✓ | 1m7s | completed |
| oauth-config-login | component | 95 | 87 | 17 | 16 | ✓ | 1m46s | completed |
| markdown-content | component | 97 | 88 | 8 | 7 | ✓ | 52s | completed |
| animate-transitions | component | 97 | 83 | 11 | 10 | ✓ | 5m28s | completed |
| web-layout-sidebar | component | 91 | 92 | 15 | 14 | ✓ | 1m49s | completed |
| web-layout-tabs | component | 92 | 92 | 16 | 15 | ✓ | 2m16s | completed |
| project-scaffold | component | 88 | 95 | 6 | 5 | ✓ | 52s | completed |
| guide-tool-discovery | component | 88 | 72 | 12 | 11 | ✗(1) | 3m38s | completed |
| lottie-animation | component | 83 | 94 | 5 | 4 | ✓ | 26s | completed |
| full-app-no-context | component | 96 | 82 | 18 | 17 | ✓ | 6m24s | completed |
| api-backend | component | 85 | 91 | 27 | 26 | ✓ | 2m21s | completed |
| notifications-local | component | 79 | 91 | 16 | 15 | ✓ | 1m15s | completed |
| web-layout-responsive | component | 85 | 91 | 17 | 16 | ✓ | 4m23s | completed |
| translate-i18n | component | 83 | 97 | 7 | 6 | ✓ | 47s | completed |
| storage-todo-crud | component | 83 | 97 | 5 | 4 | ✓ | 33s | completed |
| table-data | component | 90 | 93 | 6 | 5 | ✓ | 45s | completed |
| grid-responsive | component | 97 | 95 | 7 | 6 | ✓ | 42s | completed |
| theme-config | component | 90 | 95 | 8 | 7 | ✓ | 59s | completed |
| playwright-sidebar | component | 72 | 86 | 21 | 20 | ✗(71) | 2m59s | completed |
| wizard-multi-step | component | 95 | 88 | 12 | 11 | ✓ | 1m57s | completed |
| install-guide-camera | component | 86 | 88 | 8 | 7 | ✓ | 2m52s | completed |
| multi-screen-app | component | 97 | 92 | 12 | 11 | ✓ | 2m16s | completed |

## Delta vs Previous Run

Comparing **eval-17729951721** vs **eval-17729936359**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 91 (+0) | 95 (+2) | 6 (+1) | 50s (+10s) |
| form-explorer | 94 (+0) | 93 (+0) | 10 (+3) | 47s (5s) |
| settings-page | 87 (-4) | 95 (+0) | 7 (+1) | 49s (3s) |
| navigation | 94 (+6) | 93 (-3) | 11 (+2) | 1m17s (+22s) |
| multi-package | 93 (-4) | 93 (+0) | 17 (+4) | 1m40s (+24s) |
| error-recovery | 100 (+0) | 91 (+1) | 10 (+1) | 1m3s (+9s) |
| data-display | 93 (+3) | 93 (-3) | 9 (+1) | 1m37s (21s) |
| no-context-audio | 97 (+0) | 93 (+13) | 11 (-1) | 2m15s (+35s) |
| overlay-components | 97 (+0) | 88 (-1) | 15 (+6) | 1m57s (+22s) |
| file-upload | 97 (+0) | 87 (-2) | 9 (+0) | 1m12s (5s) |
| theme-styling | 97 (+0) | 90 (-6) | 9 (+2) | 2m29s (+1m7s) |
| recipe-discovery | 93 (+0) | 86 (-5) | 10 (+0) | 1m23s (+11s) |
| datepicker-booking | 97 (+9) | 93 (+2) | 8 (+2) | 48s (0s) |
| media-camera | 93 (+0) | 87 (-3) | 15 (+7) | 3m16s (+1m12s) |
| datagrid-analytics | 93 (+3) | 92 (+2) | 7 (+0) | 1m6s (3s) |
| charts-dashboard | 97 (+0) | 94 (+1) | 8 (-2) | 1m7s (9s) |
| oauth-config-login | 95 (+1) | 87 (-5) | 17 (+7) | 1m46s (+53s) |
| markdown-content | 97 (+0) | 88 (-2) | 8 (+0) | 52s (4s) |
| animate-transitions | 97 (+0) | 83 (-10) | 11 (+2) | 5m28s (+47s) |
| web-layout-sidebar | 91 (+9) | 92 (+14) | 15 (-2) | 1m49s (19s) |
| web-layout-tabs | 92 (+5) | 92 (-1) | 16 (+2) | 2m16s (17s) |
| project-scaffold | 88 (+0) | 95 (+3) | 6 (+0) | 52s (+4s) |
| guide-tool-discovery | 88 (-6) | 72 (-12) | 12 (+2) | 3m38s (2m2s) |
| lottie-animation | 83 (+6) | 94 (+18) | 5 (+0) | 26s (+0s) |
| full-app-no-context | 96 (+0) | 82 (-5) | 18 (+4) | 6m24s (+3m6s) |
| api-backend | 85 (+3) | 91 (+0) | 27 (+1) | 2m21s (+32s) |
| notifications-local | 79 (-5) | 91 (+3) | 16 (-1) | 1m15s (8s) |
| web-layout-responsive | 85 (+0) | 91 (-1) | 17 (+0) | 4m23s (+1m24s) |
| translate-i18n | 83 (+0) | 97 (+2) | 7 (-2) | 47s (1s) |
| storage-todo-crud | 83 (-9) | 97 (+1) | 5 (-2) | 33s (6s) |
| table-data | 90 (+0) | 93 (-1) | 6 (+0) | 45s (+3s) |
| grid-responsive | 97 (+0) | 95 (-1) | 7 (+1) | 42s (+2s) |
| theme-config | 90 (+0) | 95 (-1) | 8 (+2) | 59s (+11s) |
| playwright-sidebar | 72 (+4) | 86 (+7) | 21 (-3) | 2m59s (+55s) |
| wizard-multi-step | 95 (+3) | 88 (-2) | 12 (+2) | 1m57s (+0s) |
| install-guide-camera | 86 (+4) | 88 (-1) | 8 (+1) | 2m52s (+35s) |
| multi-screen-app | 97 (+0) | 92 (+1) | 12 (+1) | 2m16s (+48s) |

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


*Generated at 2026-03-08T19:00:58.350Z*
