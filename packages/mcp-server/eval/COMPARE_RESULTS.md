# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17719593207 | 2026-02-24 | claude-sonnet-4-6 | 1 | 97 | 92 |
| 2 | eval-17719589286 | 2026-02-24 | claude-sonnet-4-6 | 3 | 96 (-1) | 86 |
| 3 | eval-17719568114 | 2026-02-24 | claude-sonnet-4-6 | 27 | 93 (-3) | 87 |
| 4 | eval-17719537047 | 2026-02-24 | claude-sonnet-4-6 | 27 | 93 (+0) | 88 |
| 5 | eval-17719532654 | 2026-02-24 | claude-sonnet-4-6 | 3 | 95 (+2) | 89 |
| 6 | eval-17719512472 | 2026-02-24 | claude-sonnet-4-6 | 27 | 92 (-3) | 87 |
| 7 | eval-17719505255 | 2026-02-24 | claude-sonnet-4-6 | 2 | 95 (+3) | 91 |
| 8 | eval-17719099207 | 2026-02-24 | claude-sonnet-4-6 | 27 | 95 (+0) | 90 |
| 9 | eval-17719100032 | 2026-02-24 | claude-opus-4-6 | 1 | 100 (+5) | 93 |
| 10 | eval-17719048577 | 2026-02-24 | claude-sonnet-4-6 | 27 | 85 (-15) | 88 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| navigation | component | 97 | 92 | 11 | 10 | ✓ | 1m19s | completed |

## Delta vs Previous Run

Comparing **eval-17719593207** vs **eval-17719589286**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| navigation | 97 (+7) | 92 (+16) | 11 (-13) | 1m19s (53s) |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 10 | 2026-02-19 | 2026-02-20 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 8 | 2026-02-19 | 2026-02-20 |
| The agent used both 'intent' and 'color' (hex string) props  | mcp_server | minor | 6 | 2026-02-19 | 2026-02-24 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 6 | 2026-02-19 | 2026-02-20 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The framework lacks a Wizard or Stepper component for multi- | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
| The agent needed two separate icon searches (Turn 7 and Turn | mcp_server | minor | 5 | 2026-02-19 | 2026-02-24 |
| When creating platform-specific index files (.web.ts/.native | documentation | major | 4 | 2026-02-24 | 2026-02-24 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 4 | 2026-02-18 | 2026-02-19 |
| The agent searched for 'profile' recipes and got no results, | mcp_server | minor | 4 | 2026-02-19 | 2026-02-19 |
| TextInput lacks built-in label and error props, requiring de | framework | minor | 4 | 2026-02-19 | 2026-02-19 |
| TextInput component lacks a 'label' prop while TextArea has  | framework | minor | 4 | 2026-02-19 | 2026-02-20 |
| The agent had to make 5 separate get_component_types calls ( | mcp_server | minor | 4 | 2026-02-19 | 2026-02-20 |
| The agent needed two separate icon search calls to find home | mcp_server | minor | 4 | 2026-02-20 | 2026-02-24 |
| The agent had to fall back to reading source files directly  | mcp_server | major | 3 | 2026-02-19 | 2026-02-19 |
| The task required an animated progress ring, a standard fitn | framework | major | 3 | 2026-02-19 | 2026-02-24 |
| The TextInput component doesn't accept an 'error' prop for i | framework | minor | 3 | 2026-02-18 | 2026-02-19 |


*Generated at 2026-02-24T18:58:08.202Z*
