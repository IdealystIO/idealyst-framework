# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17715636938 | 2026-02-20 | claude-opus-4-6 | 1 | 84 | 85 |
| 2 | eval-17715615464 | 2026-02-20 | claude-sonnet-4-6 | 23 | 83 (-1) | 85 |
| 3 | eval-17715617024 | 2026-02-20 | claude-opus-4-6 | 1 | 90 (+7) | 91 |
| 4 | eval-17715571984 | 2026-02-20 | claude-sonnet-4-6 | 23 | 84 (-6) | 87 |
| 5 | eval-17715573255 | 2026-02-20 | claude-opus-4-6 | 1 | 90 (+6) | 88 |
| 6 | eval-17715557073 | 2026-02-20 | claude-sonnet-4-6 | 23 | 87 (-3) | 90 |
| 7 | eval-17715558301 | 2026-02-20 | claude-opus-4-6 | 1 | 90 (+3) | 93 |
| 8 | eval-17715541202 | 2026-02-20 | claude-sonnet-4-6 | 23 | 84 (-6) | 86 |
| 9 | eval-17715453690 | 2026-02-19 | claude-opus-4-6 | 1 | 90 (+6) | 88 |
| 10 | eval-17715438640 | 2026-02-19 | claude-sonnet-4-6 | 23 | 82 (-8) | 83 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 84 | 85 | 9 | 8 | ✗(1) | 1m7s | completed |

## Delta vs Previous Run

Comparing **eval-17715636938** vs **eval-17715615464**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 84 (-6) | 85 (-8) | 9 (-3) | 1m7s (1m11s) |

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


*Generated at 2026-02-20T05:01:33.904Z*
