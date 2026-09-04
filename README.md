# Tasted

Tasted is an Android-first personal food diary for manually registering, rating, reviewing, and organizing food and drink products tried in supermarkets, restaurants, cafés, bakeries, ice-cream shops, and other establishments.

The project is inspired by the idea of a personal media diary: products and establishments form a shared catalog, while each user's rating, review, favorite state, and categories remain personal.

## Current status

The MVP implementation is advanced and can run in two modes: a local Android demo backed by AsyncStorage, or Supabase mode when the project credentials and migration are configured.

Implemented in code:

- Dark Android-first navigation shell and reusable design system.
- Authentication, password recovery, profile and protected routing for Supabase mode.
- Product, establishment and hierarchical-category create/edit/detail flows.
- Personal ratings, reviews, favorites, price, date, images and categories.
- Cumulative personal search with descendant-aware AND category filters.
- Versioned PostgreSQL schema, RLS policies, storage policies and transactional functions.
- Automated validation, search, local-repository and critical-component tests.

Still required before calling the MVP finished:

- Apply and verify the migration in the intended Supabase project.
- Run the two-user RLS acceptance matrix.
- Complete the Android device smoke, accessibility, keyboard and small-screen passes.
- Review the remaining dependency advisories as part of a controlled Expo upgrade.
- Choose the final Android application id, icon and release assets.

## MVP features

- Email and password authentication.
- User profile and avatar.
- Create, view, edit, and safely delete establishments.
- Create, view, edit, and safely delete products.
- One personal diary entry per user and product.
- Half-star ratings from 0.5 to 5.
- Personal review, favorite state, price, and tried date.
- Personal hierarchical categories.
- Product and establishment photos.
- Cumulative search filters.
- Dark-only Android interface based on the approved Figma style.

## Main technologies

- React Native
- Expo SDK 54 during the Expo Go learning phase
- TypeScript
- Expo Router
- Supabase Database, Auth, and Storage
- PostgreSQL and Row Level Security
- React Hook Form and Zod
- TanStack Query

Dependencies are added only when the milestone that needs them begins.

## Documentation

Start with [`docs/README.md`](docs/README.md).

Important documents:

- [`AGENTS.md`](AGENTS.md): permanent instructions for coding agents.
- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md): product behavior and MVP scope.
- [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md): entities, relations, security, and database rules.
- [`docs/UI_DESIGN.md`](docs/UI_DESIGN.md): approved visual system derived from Figma.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): code organization and technical boundaries.
- [`docs/CODEX_WORKFLOW.md`](docs/CODEX_WORKFLOW.md): step-by-step development process with Codex.
- [`docs/ROADMAP.md`](docs/ROADMAP.md): implementation milestones.
- [`docs/ANDROID_DISTRIBUTION.md`](docs/ANDROID_DISTRIBUTION.md): tests, remote QR, APK and Play Store builds.

## Run locally

Requirements:

- Node.js compatible with the selected Expo SDK.
- npm.
- Expo Go on an Android phone for the current learning phase.

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Run the automated checks:

```bash
npm run lint
npx tsc --noEmit
npm test
npx expo-doctor
```

Scan the QR code with Expo Go while the computer and phone are on the same network.

## Environment variables

Copy `.env.example` to `.env` after creating the Supabase project:

```bash
cp .env.example .env
```

Never commit `.env`.

## Repository policy

- Small, reviewable changes.
- Conventional commit messages.
- No secrets in Git.
- No force fixes or destructive Git commands.
- Database changes through versioned migrations.
- Android manual testing for every visible milestone.

## License

No license has been selected yet. Until one is added, the source code should be treated as all rights reserved.
