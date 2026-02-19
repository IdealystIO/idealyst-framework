# Evaluation Comparison

Last 10 evaluation runs, most recent first.

| # | Run ID | Date | Model | Scenarios | Heuristic Mean | Supervisor Mean |
|---|--------|------|-------|-----------|----------------|-----------------|
| 1 | eval-17715253959 | 2026-02-19 | claude-opus-4-6 | 1 | 84 | - |
| 2 | eval-17715255281 | 2026-02-19 | claude-opus-4-6 | 1 | 84 (+0) | 78 |
| 3 | eval-17715228238 | 2026-02-19 | claude-opus-4-6 | 1 | 80 (-4) | 78 |
| 4 | eval-17715163222 | 2026-02-19 | claude-opus-4-6 | 23 | 83 (+3) | 81 |
| 5 | eval-17714845070 | 2026-02-19 | claude-opus-4-6 | 23 | 81 (-2) | 78 |
| 6 | eval-17714828401 | 2026-02-19 | claude-opus-4-6 | 15 | 82 (+1) | 81 |
| 7 | eval-17714809132 | 2026-02-19 | claude-opus-4-6 | 15 | 83 (+1) | 81 |
| 8 | eval-17714798600 | 2026-02-19 | claude-opus-4-6 | 15 | 84 (+1) | 78 |
| 9 | eval-17714784239 | 2026-02-19 | claude-opus-4-6 | 15 | 84 (+0) | 80 |
| 10 | eval-17714763985 | 2026-02-19 | claude-opus-4-6 | 15 | 79 (-5) | 79 |

## Latest Run Scenario Breakdown

| Scenario | Type | Heuristic | Supervisor | Turns | Tools | TSC | Duration | Stop |
|----------|------|-----------|------------|-------|-------|-----|----------|------|
| login-screen | component | 84 | - | 15 | 14 | ✗(2) | 2m12s | completed |

## Delta vs Previous Run

Comparing **eval-17715253959** vs **eval-17715255281**

| Scenario | Heuristic | Supervisor | Turns | Duration |
|----------|-----------|------------|-------|----------|
| login-screen | 84 (+0) | - | 15 (+1) | 2m12s (+1m9s) |

## Open Framework Issues

| Issue | Source | Severity | Occurrences | First Seen | Last Seen |
|-------|--------|----------|-------------|------------|-----------|
| The agent spent 8+ tool calls (Turns 50-57) trying to find a | mcp_server | minor | 5 | 2026-02-18 | 2026-02-19 |
| There is no dedicated forms package or form management utili | framework | minor | 4 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile' recipes and got no results, | mcp_server | minor | 4 | 2026-02-19 | 2026-02-19 |
| The agent had to fall back to reading source files directly  | mcp_server | major | 3 | 2026-02-19 | 2026-02-19 |
| The agent needed 42 tool calls across many turns to gather e | mcp_server | minor | 3 | 2026-02-18 | 2026-02-19 |
| The agent had to make 5 separate icon search attempts to fin | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The login-form recipe was found and used, but the agent stil | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'profile settings form' recipes (Turn | mcp_server | minor | 3 | 2026-02-19 | 2026-02-19 |
| TextInput lacks built-in label and error props, requiring ma | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| The framework lacks a Wizard/Stepper component for multi-ste | framework | minor | 3 | 2026-02-19 | 2026-02-19 |
| The @idealyst/files package documentation was retrieved succ | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The agent searched for 'lock' and 'lock-outline' icons multi | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The theme types return Size as '0'|'1'|'2'|'3'|'4' but compo | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The camera package exports 'ICamera' as the component name r | framework | major | 2 | 2026-02-19 | 2026-02-19 |
| The @idealyst/storage API appears to only support string val | mcp_server | major | 2 | 2026-02-19 | 2026-02-19 |
| The MCP server doesn't provide a tool for verifying that gen | mcp_server | minor | 2 | 2026-02-18 | 2026-02-19 |
| The Card component's shadow/elevation API is not clearly exp | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent retrieved Badge types (Turn 17) but still used an  | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent frequently fell back to using inline `style` props | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |
| The agent's type summary shows Checkbox has an 'error' prop, | mcp_server | minor | 2 | 2026-02-19 | 2026-02-19 |


*Generated at 2026-02-19T18:25:29.716Z*
