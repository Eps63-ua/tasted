# Tasted — Codex workflow

## 1. Goal

Use Codex as a coding partner while keeping every change understandable, reviewable, and recoverable.

Codex may inspect the repository, edit files, run commands, and run checks. The user remains responsible for approving architecture, testing visible behavior on Android, and deciding when to commit or push.

## 2. Initial setup in VS Code

1. Open VS Code.
2. Open the repository root: `~/Escritorio/APPS/tasted`.
3. Install the official Codex extension from the VS Code extensions view.
4. Sign in with the same ChatGPT account when requested.
5. Keep the Explorer, Source Control, Terminal, and Codex panels visible while learning.

The repository root must be the folder containing:

```text
package.json
app.json
AGENTS.md
docs/
```

Do not open only the `app/` folder.

## 3. First conversation with Codex

Use this exact prompt before asking it to code:

```text
Read AGENTS.md and every Markdown file under docs/. Do not modify files and do not run installation or destructive commands. Summarize:
1. what Tasted does;
2. the shared versus personal data model;
3. the approved technology stack;
4. the visual rules;
5. the roadmap phase we are currently in;
6. any contradiction or unresolved decision you detect.
Explain it in Spanish for a developer who is learning Codex.
```

Check that the answer correctly understands:

- products are shared;
- diary entries are personal;
- categories are personal;
- the app is Expo React Native, not the Figma web project;
- Android and dark mode are first;
- no recommendations in MVP.

If it misunderstands one of these, correct the documentation or prompt before coding.

## 4. Standard task cycle

### Step A — Plan only

```text
We are working on [small outcome]. Read the relevant specifications and inspect the current files. Do not edit anything yet. Give me:
- the implementation plan;
- files you would change or create;
- packages, if any, and why;
- risks;
- exact checks and Android test steps.
```

Review the plan. Ask questions until it makes sense.

### Step B — Implement

```text
Implement only the approved plan for [small outcome]. Follow AGENTS.md. Do not work on later roadmap items. Do not commit or push. After editing, run the available checks and explain the changes in Spanish.
```

### Step C — Review the diff

In VS Code Source Control:

1. click each changed file;
2. read green additions and red removals;
3. ask Codex about anything unclear;
4. confirm no unrelated file changed;
5. confirm no secret appeared.

Useful prompt:

```text
Review the current uncommitted diff as if you had not written it. Look for bugs, unnecessary complexity, violations of AGENTS.md, React Native/web mistakes, accessibility issues, and missing loading/error states. Do not change files yet. Rank findings by severity.
```

### Step D — Test

Ask Codex to run applicable checks:

```text
Run the required checks for this phase. Do not change dependencies or use force fixes. Report each command, exit result, and any failure in plain Spanish.
```

Then test visible behavior manually in Expo Go.

### Step E — Fix only confirmed issues

```text
Fix only findings [list]. Keep the change focused. Run the same checks again. Do not commit or push.
```

### Step F — Commit

When satisfied:

```text
Show me git status, summarize the final diff, and suggest one conventional commit message. Do not commit yet.
```

After reviewing, either run the Git commands yourself or explicitly ask Codex to commit. Keep pushing as a separate explicit action.

## 5. Recommended task size

Good tasks:

- create color and spacing tokens;
- simplify one starter screen;
- build one reusable button;
- create Supabase client configuration;
- implement one migration;
- implement one form validation schema;
- create one read-only list screen;
- add one mutation and cache invalidation;
- fix one Android keyboard issue.

Tasks that are too large:

- build the entire app;
- implement all CRUDs at once;
- copy the entire Figma design;
- create schema, RLS, Auth, Storage, and UI in one prompt;
- refactor all folders while adding a feature.

## 6. How to learn from Codex

After a change, ask:

```text
Teach me this change. Start with the user-visible behavior, then explain the data flow from route to component to service to Supabase. Mention the exact files and functions. Explain any TypeScript types and why they are useful.
```

For unfamiliar code:

```text
Explain this file from top to bottom in Spanish. For every import and function, tell me what problem it solves. Then give me three questions to check that I understood it.
```

For commands:

```text
Before running the command, explain each part, what files or services it can affect, and how to undo it.
```

## 7. Permission strategy

During learning:

- allow reading files freely;
- allow safe local checks;
- review package installation;
- review file deletion;
- reject destructive Git commands;
- never allow remote database deletion without a precise plan;
- never provide secret/service-role credentials;
- keep commit and push explicit.

## 8. Git recovery

Before a commit, Git preserves the last committed state.

Useful safe inspection commands:

```bash
git status
git diff
git diff --staged
git log --oneline --decorate -10
```

To discard one uncommitted file only after reviewing the loss:

```bash
git restore path/to/file
```

Do not use `git reset --hard` or `git clean -fd` as a routine recovery method.

## 9. First development sequence with Codex

After committing this documentation pack:

### Task 1 — Audit only

```text
Read the specifications and inspect the current Expo SDK 54 starter. Do not modify anything. Tell me which starter/demo files are currently present, which should remain, which can be removed, and propose the smallest first implementation task.
```

### Task 2 — Theme only

```text
Implement only the centralized design tokens from docs/UI_DESIGN.md using the existing project structure. Do not redesign screens yet. Explain every created file, run lint and TypeScript checks, and give me Android verification steps. Do not commit or push.
```

### Task 3 — App shell

```text
Using the approved tokens, implement the dark application shell and four bottom tabs with placeholder content. Do not connect Supabase yet. Follow the Figma visual rules, use React Native only, run checks, and explain the Expo Router structure.
```

This order gives an immediate visible result without mixing UI, database, and authentication.

## 10. When Codex should stop and ask

Codex must ask before:

- changing an approved decision;
- choosing a substantially different library;
- changing Expo SDK;
- introducing a global state library;
- changing the database entity model;
- creating public access to personal data;
- deleting shared records;
- applying migrations to a remote project;
- adding public/social features;
- committing, pushing, deploying, or publishing.
