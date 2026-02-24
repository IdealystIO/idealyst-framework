# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17719001665 | 2026-02-24 | claude-sonnet-4-6 | 1 | 67 | 63 |
| 2 | eval-17719002924 | 2026-02-24 | claude-opus-4-6 | 1 | 90 (+23) | 92 |
| 3 | eval-17718979175 | 2026-02-24 | claude-sonnet-4-6 | 27 | 84 (-6) | 87 |
| 4 | eval-17718980306 | 2026-02-24 | claude-opus-4-6 | 1 | 90 (+6) | 93 |
| 5 | eval-17718971826 | 2026-02-24 | claude-sonnet-4-6 | 1 | 65 (-25) | 52 |
| 6 | eval-17718973285 | 2026-02-24 | claude-opus-4-6 | 1 | 80 (+15) | 74 |
| 7 | eval-17718965748 | 2026-02-24 | claude-sonnet-4-6 | 1 | 67 (-13) | 74 |
| 8 | eval-17718967003 | 2026-02-24 | claude-opus-4-6 | 1 | 80 (+13) | 76 |
| 9 | eval-17718958037 | 2026-02-24 | claude-sonnet-4-6 | 1 | 70 (-10) | 71 |
| 10 | eval-17718959132 | 2026-02-24 | claude-opus-4-6 | 1 | 90 (+20) | 93 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| playwright-sidebar | component | 67 | 63 | 27 | 26 | ✗(82) | 3m24s | completed |

## Delta vs Previous Run

Comparing **eval-17719001665** vs **eval-17719002924**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| playwright-sidebar | 67 (new) | - | 27 | 3m24s |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| There is no dedicated forms package or form management utili | framework | minor | 10 | 2026-02-19 | 2026-02-20 |
| The agent had to make 9 individual get_component_types calls | mcp_server | minor | 9 | 2026-02-19 | 2026-02-20 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 8 | 2026-02-19 | 2026-02-20 |
| The agent made 4 separate search_icons calls (bell notificat | mcp_server | minor | 6 | 2026-02-19 | 2026-02-20 |
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 5 | 2026-02-19 | 2026-02-20 |
| The agent used both 'intent' and 'color' (hex string) props  | mcp_server | minor | 5 | 2026-02-19 | 2026-02-24 |
| TextInput does not have a built-in 'label' prop like TextAre | framework | minor | 5 | 2026-02-19 | 2026-02-20 |
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


*Generated at 2026-02-24T02:36:20.934Z*
