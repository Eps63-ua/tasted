# Tasted — Prompt library for Codex

Copy and adapt these prompts. Keep one objective per prompt.

## Read-only repository audit

```text
Read AGENTS.md and the relevant docs. Inspect the repository for this task. Do not edit files or run commands that modify the project. Explain the current implementation, the gap with the specification, and a small plan.
```

## Plan a feature

```text
Plan the implementation of [feature]. Do not edit files yet. Include:
- behavior and acceptance criteria;
- files to create/change;
- data flow;
- package changes and why;
- security/RLS implications;
- loading, empty, error, and success states;
- automated checks;
- manual Android test steps.
Stay within the current roadmap phase.
```

## Implement an approved plan

```text
Implement only the approved plan for [feature]. Follow AGENTS.md and the relevant docs. Keep the diff small. Do not commit or push. Run available checks and explain the final changes in Spanish.
```

## Reproduce one Figma component

```text
Implement [component] in React Native based on docs/UI_DESIGN.md and docs/FIGMA_REFERENCE.md. Do not copy web code or Tailwind. Use shared theme tokens, accessibility labels, loading/empty behavior where relevant, and explain visual differences from the prototype. Do not modify unrelated screens.
```

## Explain a diff

```text
Explain the current uncommitted diff in Spanish. For each file, describe:
- why it changed;
- the important code path;
- TypeScript concepts used;
- how it connects to the rest of the app;
- what I should test on Android.
Do not modify files.
```

## Independent code review

```text
Review the current uncommitted diff without assuming it is correct. Do not edit files. Check:
- specification compliance;
- React Native versus web mistakes;
- TypeScript safety;
- error/loading/empty states;
- accessibility;
- Supabase/RLS security;
- duplicated logic;
- unnecessary dependencies;
- Android-specific issues.
Rank findings as critical, important, or optional.
```

## Fix selected review findings

```text
Fix only these findings: [list]. Do not perform unrelated refactors. Run the same checks again and explain each correction. Do not commit or push.
```

## Add a dependency safely

```text
We may need [package] for [reason]. Before installing it, verify that the current Expo SDK supports it, explain whether to use npm or npx expo install, list alternatives, and tell me what files the installation will modify. Do not install until I approve.
```

## Database migration planning

```text
Using docs/DATABASE_DESIGN.md, plan migration [name]. Do not execute SQL. List types, tables, constraints, indexes, functions, grants, and RLS policies in creation order. Identify circular dependencies and security risks. Explain how we will test with two users.
```

## Generate migration after approval

```text
Create one versioned Supabase migration for the approved plan. Do not apply it remotely. Include comments for non-obvious RLS and functions. Then review the SQL for privilege escalation, missing RLS, unsafe security-definer behavior, and destructive cascades. Do not commit or push.
```

## Debug an error

```text
Investigate this error: [paste exact error]. First inspect relevant files and explain the most likely causes. Do not make speculative broad changes. Propose the smallest diagnostic step, then the smallest fix. Preserve the current architecture and run focused checks.
```

## Prepare a commit

```text
Do not commit yet. Show git status, summarize the final diff, confirm checks run, identify any files that should not be committed, and suggest one conventional commit message.
```

## Create the commit

```text
Create the approved commit using this message: [message]. Do not push. After committing, show the new commit hash and clean/remaining git status.
```

## Update documentation after an approved decision

```text
Update only the documentation affected by this approved decision: [decision]. Add or update an entry in docs/DECISIONS.md, adjust the specialized specification, and list every changed statement. Do not modify application code.
```
