# Tasted — Roadmap

This roadmap is ordered. Do not start a later phase when an earlier required foundation is incomplete unless the user explicitly chooses to prototype out of order.

## Phase 0 — Repository and specifications

- [x] Create the GitHub repository.
- [x] Clone it locally.
- [x] Create the Expo project in the repository root.
- [x] Select SDK 54 for the Expo Go learning phase.
- [x] Run the initial app successfully on a physical Android phone.
- [x] Create the first Git commit and push it.
- [x] Generate and review a Figma prototype.
- [x] Define product direction and shared/personal data boundary.
- [x] Add the complete project documentation pack.
- [x] Review the documentation diff.
- [ ] Commit the documentation pack.

Suggested commit:

```text
docs: add product and engineering specifications
```

## Phase 1 — Codex learning setup

- [ ] Install the official Codex extension in VS Code.
- [ ] Sign in with the ChatGPT account.
- [ ] Open the repository root in VS Code.
- [x] Ask Codex to read `AGENTS.md` and all `docs/` files without editing.
- [x] Ask Codex to summarize the architecture and identify unresolved decisions.
- [ ] Learn to review the working-tree diff in VS Code.
- [ ] Learn to request plan-only, implementation, review, and explanation modes.
- [ ] Confirm Codex does not commit or push without explicit permission.

## Phase 2 — Clean Expo shell and design tokens

- [ ] Audit the default Expo template.
- [ ] Decide which sample files to remove.
- [ ] Create centralized colors, spacing, radii, and typography tokens.
- [ ] Configure dark-only status bar and base screen background.
- [ ] Create reusable text and button primitives.
- [ ] Rebuild the bottom-tab shell with the approved design.
- [ ] Create placeholder Home, Search, Create, and Profile screens.
- [ ] Run lint, TypeScript, Expo Doctor, and Android smoke test.

Suggested commits:

```text
chore: simplify Expo starter template
feat: add Tasted theme system
feat: add main tab navigation shell
```

## Phase 3 — Supabase project and local schema workflow

- [ ] Create the Supabase project.
- [ ] Record the project URL and publishable key in local `.env` only.
- [ ] Confirm `.env` is ignored by Git.
- [ ] Install Supabase client dependencies compatible with Expo.
- [ ] Create the typed Supabase client.
- [ ] Initialize the local `supabase/` folder and CLI workflow.
- [ ] Write the first reviewed migration from `DATABASE_DESIGN.md`.
- [ ] Enable RLS and create policies.
- [ ] Create storage buckets and policies in reviewed migrations.
- [ ] Apply the migration safely.
- [ ] Generate TypeScript database types.
- [ ] Add development seed data if useful.

Suggested commits:

```text
chore: configure Supabase client
feat: add initial database schema and RLS
chore: add generated database types
```

## Phase 4 — Authentication and profile

- [ ] Auth session provider.
- [ ] Protected route behavior.
- [ ] Login screen.
- [ ] Registration screen.
- [ ] Password recovery screen.
- [ ] Profile creation trigger verification.
- [ ] Profile screen.
- [ ] Edit profile screen.
- [ ] Avatar upload.
- [ ] Logout.
- [ ] Loading, validation, and error states.
- [ ] Android smoke test for session persistence.

## Phase 5 — Establishments

- [ ] Establishment service and query keys.
- [ ] Establishment list/search.
- [ ] Create form.
- [ ] Detail screen.
- [ ] Edit form.
- [ ] Image upload and cover selection.
- [ ] Safe delete behavior.
- [ ] Empty/loading/error states.
- [ ] RLS verification using two test users.

## Phase 6 — Personal categories

- [ ] Category service.
- [ ] Category tree query.
- [ ] Create root category.
- [ ] Create child category.
- [ ] Detail screen.
- [ ] Edit screen.
- [ ] Cycle and ownership protection.
- [ ] Optional category image.
- [ ] Safe delete behavior.
- [ ] Recursive descendant filtering tests.

## Phase 7 — Products and diary entries

- [ ] Shared product service.
- [ ] Duplicate candidate search.
- [ ] Product creation form.
- [ ] Existing-product personal entry flow.
- [ ] Transactional product-and-entry function.
- [ ] Product detail screen.
- [ ] Personal entry edit.
- [ ] Half-star input.
- [ ] Review text.
- [ ] Favorite.
- [ ] Price and tried date.
- [ ] Multi-category assignment.
- [ ] Product image upload.
- [ ] Remove from diary.
- [ ] Creator-safe shared edit/delete behavior.

## Phase 8 — Search and filters

- [ ] Search filter model.
- [ ] Text search.
- [ ] Result type selector.
- [ ] Establishment multi-filter.
- [ ] Category multi-filter with AND semantics.
- [ ] Parent category includes descendants.
- [ ] Minimum rating.
- [ ] Favorites only.
- [ ] Sort options.
- [ ] Active filter chips.
- [ ] Clear all.
- [ ] Empty/loading/error states.
- [ ] Query performance review.

## Phase 9 — Home

- [ ] Recent establishments query.
- [ ] Recent products query.
- [ ] Favorites/top-rated query.
- [ ] Approved square product cards.
- [ ] Approved image-led establishment cards.
- [ ] Horizontal lists.
- [ ] Home loading skeletons.
- [ ] Home empty states.

No recommendation algorithm in this phase.

## Phase 10 — Quality and portfolio finish

- [ ] Configure unit/component test stack.
- [ ] Add tests for validation and critical filters.
- [ ] Add tests for ownership-sensitive service behavior where practical.
- [ ] Verify RLS with two test accounts.
- [ ] Accessibility pass.
- [ ] Android keyboard and small-screen pass.
- [ ] Image failure/retry pass.
- [ ] Dependency and security review without forced upgrades.
- [ ] App icon and splash screen.
- [ ] Production-quality screenshots.
- [ ] Demo video or GIF.
- [ ] Update README with final features and architecture diagram.
- [ ] Generate an installable Android build.
- [ ] Create a tagged MVP release.

## Later backlog

- [ ] Repeated tasting history.
- [ ] Personal statistics.
- [ ] Public reviews and social profiles.
- [ ] Recommendations.
- [ ] Barcode scanning.
- [ ] Receipt import.
- [ ] Branch/location modeling.
- [ ] Offline queue.
- [ ] Shareable review images.
