---
name: orchestrator
description: Use when the user dumps multiple tasks, improvements, or ideas at once. Parses the brain dump into discrete work items, triages them by type, deploys the right subagents in parallel, and tracks everything via TodoWrite. Keeps the main conversation context clean.
---

# Orchestrator

Use this skill when the user gives you a batch of tasks, a brain dump, or multiple improvements at once. Your job is to **parse, triage, delegate, and track** — not to do the work yourself in the main context.

## Why This Exists

When multiple tasks are crammed into one conversation, context gets polluted fast. The orchestrator keeps the main thread clean by:
1. Breaking the dump into discrete, actionable items
2. Deploying specialized subagents for each (in parallel where possible)
3. Tracking progress via TodoWrite so the user sees live status
4. Reporting results concisely as agents complete

## Step 1: Parse the Brain Dump

Read the user's message carefully. Extract every distinct task, improvement, fix, or idea. Each item should be:
- **Self-contained** — understandable without the rest of the dump
- **Actionable** — clear enough to hand to an agent
- **Categorized** by type (see Step 2)

If anything is ambiguous, ask the user to clarify BEFORE deploying agents. Use AskUserQuestion for this — don't guess.

## Step 2: Triage Each Item

Categorize each task and determine the right execution strategy:

| Category | Agent / Approach | When to Use |
|----------|-----------------|-------------|
| **Component work** | Skill: `component-engineer` | Creating, modifying, or fixing UI components |
| **New package** | Skill: `new-package` | Scaffolding a new @idealyst/* package |
| **Framework bug/fix** | Task: `idealyst-framework-engineer` | Fixing code in packages/cli, packages/theme, etc. |
| **Eval & docs convergence** | Task: `idealyst-convergence-engineer` | Running evals, fixing MCP docs for LLM success |
| **Research / exploration** | Task: `Explore` agent | Understanding code, finding files, investigating |
| **Simple code change** | Do it directly | Single-file, < 10 line changes |
| **Planning needed** | EnterPlanMode | Ambiguous architecture decisions, multi-file features |

### Parallel vs Sequential

- **Independent tasks** → Launch all agents in parallel (single message, multiple Task calls)
- **Dependent tasks** → Chain them. Note the dependency in the todo list
- **Skills** (component-engineer, new-package) → These run inline, so do them sequentially after agents complete, OR ask the user which to tackle first

## Step 3: Set Up Tracking

Before deploying any agents, create the full todo list via TodoWrite:

```
For each item:
- content: Clear imperative description (e.g., "Fix Button border radius on native")
- activeForm: Present continuous (e.g., "Fixing Button border radius on native")
- status: "pending" (or "in_progress" if launching immediately)
```

Rules:
- One todo per discrete task
- Add a prefix tag in the content to show category: `[component]`, `[framework]`, `[eval]`, `[research]`, `[package]`, `[simple]`
- If a task has subtasks, keep them as separate todos with clear ordering

## Step 4: Deploy Agents

Launch agents with detailed, self-contained prompts. Each agent starts fresh — it does NOT see the user's original brain dump. Your prompt must include:

1. **What** — the specific task to accomplish
2. **Where** — relevant file paths, package names
3. **Why** — enough context to make good decisions
4. **Constraints** — any user preferences or conventions to follow
5. **Done criteria** — what "complete" looks like

### Prompt Template

```
Task: [one-line summary]

Context: [2-3 sentences of relevant background]

Specific requirements:
- [requirement 1]
- [requirement 2]

Relevant files:
- [file path 1]
- [file path 2]

When done, report: [what to include in the summary]
```

### Deployment Rules

- Launch as many independent agents in parallel as possible
- Use `run_in_background: true` for agents whose results you don't need before launching others
- Mark the corresponding todo as `in_progress` when launching
- Do NOT duplicate work — if an agent is handling something, don't also do it yourself
- For framework-engineer and convergence-engineer agents, use `model: "opus"` for complex work, `model: "sonnet"` for straightforward fixes

## Step 5: Monitor and Report

As agents complete:

1. **Read the result** — understand what happened
2. **Update the todo** — mark as `completed`
3. **Report concisely** — tell the user what was done in 1-2 sentences per item
4. **Handle failures** — if an agent failed or got stuck, note why and either retry with a better prompt or flag it to the user

### Reporting Format

After all agents complete, give a single summary:

```
Done. Here's what happened:

- [task 1]: [result summary]
- [task 2]: [result summary]
- [task 3]: Needs your input — [what's unclear]
```

## Step 6: Handle Inline Skills

Skills (component-engineer, new-package) can't be delegated to background agents — they run inline. After background agents are deployed:

1. Ask the user which skill-requiring task to tackle first (if multiple)
2. Invoke the skill with `/component-engineer` or `/new-package`
3. Work through it while background agents run

## Edge Cases

### "Just do everything"
If the user says something vague like "fix all the things" or "make it better", push back. Ask what specifically needs attention. Don't guess.

### Single task disguised as a dump
If parsing reveals only 1 real task, skip the orchestration overhead. Just do it directly or deploy one agent.

### Tasks that need planning first
If a task is too ambiguous to delegate, add it to the todo list as `[needs-planning]` and either:
- Launch an Explore agent to gather context first
- Use EnterPlanMode to design the approach with the user

### Mid-flight additions
If the user adds more tasks while agents are running, append to the existing todo list and deploy additional agents. Don't restart everything.

## What NOT To Do

- **Don't do agent work yourself** — your job is to orchestrate, not implement
- **Don't hold context** — push details into agent prompts, not your own memory
- **Don't batch status updates** — mark todos complete as they finish, one at a time
- **Don't over-decompose** — "fix the typo in README" is one task, not three
- **Don't launch agents for trivial work** — < 10 line changes, just do them inline
