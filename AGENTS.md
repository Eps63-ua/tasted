# AGENTS.md — Tasted

## 1. Purpose

This file contains permanent instructions for any coding agent working in this repository.
Read it before planning, editing files, installing packages, running commands, changing the database, or creating commits.

Tasted is an Android-first personal food diary built with React Native, Expo, TypeScript, Expo Router, and Supabase.
Users manually register food and drink products they have tried, rate them, review them, mark them as favorites, and organize them with personal categories.

## 2. Source of truth

Before modifying code, read the relevant documentation in this order:

1. `AGENTS.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/DECISIONS.md`
4. `docs/UI_DESIGN.md`
5. `docs/DATABASE_DESIGN.md`
6. `docs/ARCHITECTURE.md`
7. `docs/ROADMAP.md`
8. `docs/TESTING.md`
9. `docs/SECURITY.md`

Use `docs/FIGMA_REFERENCE.md` only as a visual reference. The Figma-generated code is React web code and must not be copied into the Expo application.

If documents conflict, use this priority:

1. The user's latest explicit instruction.
2. `docs/DECISIONS.md`.
3. The specialized specification for the area being changed.
4. Existing implementation.

Do not silently resolve a meaningful contradiction. Explain it and ask before changing an approved product or architecture decision.

## 3. Learning-first collaboration

The repository owner is learning agent-assisted development. Work in a way that teaches rather than hides the process.

For every implementation task:

1. Restate the requested outcome in one sentence.
2. Inspect the relevant files before editing.
3. Explain the plan and list the files expected to change.
4. Make the smallest coherent change that completes the task.
5. Explain important code decisions in plain Spanish.
6. Run the available checks.
7. Summarize the final diff, checks, and any remaining manual verification.

When asked to explain code, reference exact files and symbols. Do not use unexplained jargon. Do not generate a large feature in one step when it can be split into reviewable milestones.

## 4. Product rules that must not be changed without approval

- The visible app name is **Tasted**.
- The app is Android-first and mobile-only for the MVP.
- The app uses React Native, Expo, TypeScript, and Expo Router.
- Supabase is the backend, database, authentication provider, and image storage provider.
- Products and establishments form a shared catalog created by users.
- A user's rating, review, favorite state, price, date, and categories are personal data stored in a user-product diary entry.
- Categories are private to each user and may have parent-child relationships.
- A product belongs to one establishment in the MVP.
- Search filters are cumulative.
- Selecting multiple categories uses AND semantics.
- Selecting a parent category includes its descendants by default.
- The MVP is a personal diary, not a social network.
- Recommendations are not part of the MVP.
- The app has dark mode only.
- The primary accent is `#1ED760`.
- Figma is a visual reference, not a codebase to merge.

## 5. Technical constraints

- Use React Native components. Never introduce HTML elements such as `div`, `button`, `input`, or `img`.
- Do not add a web-specific implementation unless explicitly requested.
- Keep Expo Router as the navigation system.
- Keep TypeScript strict. Avoid `any`; when unavoidable, justify it locally.
- Prefer small, reusable components over oversized screens.
- Keep server state in TanStack Query when it is introduced. Do not duplicate server data in a global store.
- Keep form validation in Zod schemas when forms are introduced.
- Keep Supabase access behind typed service or repository functions rather than scattering queries through screens.
- Use generated Supabase database types once the schema exists.
- Use design tokens from `docs/UI_DESIGN.md`; do not hardcode duplicate color systems across screens.
- Reuse the same form component for create and edit modes where practical.
- Do not refactor unrelated files while implementing a focused task.
- Do not install a dependency without explaining why it is needed and checking Expo compatibility.

## 6. Database and security rules

- Enable Row Level Security on every exposed table.
- Never place a Supabase secret key or service-role key in the mobile app, repository, logs, screenshots, or documentation.
- The mobile app may use only the Expo public project URL and Supabase publishable key.
- Never rely on the client UI alone for authorization.
- Personal entries, favorites, reviews, and categories must be protected by ownership policies using `auth.uid()`.
- Shared catalog records must have explicit creator/edit/delete rules.
- Shared records must not be hard-deleted when doing so would remove another user's data.
- Destructive multi-table operations should use reviewed SQL functions or transactions.
- Database changes must be represented by versioned SQL migrations in `supabase/migrations/`.
- Do not edit an already-applied migration. Create a new migration.

## 7. Git and command safety

Do not run any of the following unless the user explicitly asks and understands the effect:

- `git reset --hard`
- `git clean -fd` or `git clean -fdx`
- history rewriting or force push
- deleting branches
- deleting migrations
- deleting user data
- `npm audit fix --force`
- bulk dependency upgrades
- destructive Supabase commands against a remote project

Do not commit, push, merge, publish, deploy, or create a release unless explicitly requested.
Never include `.env`, credentials, generated secrets, or private exports in a commit.

Before a commit is requested, show or summarize:

- `git status`
- the files changed
- checks run
- a suggested conventional commit message

## 8. Required checks

Run the checks that are available for the current phase.

Baseline checks:

```bash
npm run lint
npx tsc --noEmit
npx expo-doctor
```

Do not claim a check passed unless it was actually run and completed successfully.
If a check cannot run, report the exact reason.

Once tests are configured, also run the relevant test command described in `docs/TESTING.md`.

## 9. Definition of done

A task is complete only when:

- the requested behavior is implemented;
- the implementation follows the product and design specifications;
- loading, empty, error, and success states are considered where relevant;
- TypeScript and lint checks pass, or failures are clearly documented;
- no secret or unrelated change is included;
- the user receives a plain-language explanation of what changed;
- manual Android verification steps are listed when visual or device behavior changed.

## 10. Response format for coding tasks

Use this structure unless the user asks otherwise:

### Plan
A short explanation and the files to be changed.

### Changes
What was implemented and why.

### Checks
Commands run and their results.

### Try it on Android
Exact steps the user should perform in Expo Go or a development build.

### Git
Suggested commit message, but do not commit or push without permission.
