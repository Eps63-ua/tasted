# Tasted — Git workflow

## 1. Objective

Keep every Codex change understandable and reversible.

## 2. Before starting a task

```bash
git status
```

The working tree should ideally be clean. If not, understand and preserve the existing changes before asking Codex to edit.

## 3. While Codex works

Use VS Code Source Control to inspect every changed file.

Useful commands:

```bash
git status
git diff
git diff --stat
```

Do not mix several unrelated roadmap tasks in one diff.

## 4. Staging

Prefer explicit staging when learning:

```bash
git add path/to/file1 path/to/file2
```

Use `git add .` only after checking that every untracked/modified file belongs to the task.

Inspect staged changes:

```bash
git diff --staged
```

## 5. Commit style

Use conventional commit prefixes:

```text
feat: user-visible functionality
fix: bug correction
docs: documentation only
chore: setup, tooling, dependency maintenance
refactor: structure change without behavior change
test: tests only
style: formatting or visual-only adjustment when appropriate
```

Examples:

```text
docs: add product and engineering specifications
feat: add dark theme tokens
feat: add main tab navigation
chore: configure Supabase client
feat: add initial database schema and RLS
fix: preserve filters after closing search sheet
```

## 6. Commit and push are separate

Commit locally:

```bash
git commit -m "message"
```

Push only after verifying the commit:

```bash
git push
```

Codex must not perform either action without explicit permission.

## 7. Branches

For early small setup commits, working on `main` is acceptable for this personal project.

For larger features, use a branch:

```bash
git switch -c feat/theme-system
```

After completion and review, merge through GitHub or locally using a non-destructive workflow.

Do not create branches for every one-line documentation correction unless that helps the learning goal.

## 8. Safe recovery

Inspect history:

```bash
git log --oneline --decorate -10
```

Discard one uncommitted file only when certain:

```bash
git restore path/to/file
```

Unstage without deleting edits:

```bash
git restore --staged path/to/file
```

Do not use force push, hard reset, or clean as routine commands.

## 9. Files that must not be committed

- `.env`;
- Supabase secret/service-role keys;
- `node_modules/`;
- local build artifacts;
- personal exports;
- the complete Figma-generated web project;
- temporary screenshots unless intentionally added as documentation.

## 10. Recommended task completion sequence

1. `git status`.
2. Review diff.
3. Run checks.
4. Test in Expo Go.
5. Stage intended files.
6. Review staged diff.
7. Commit.
8. Inspect log/status.
9. Push.
