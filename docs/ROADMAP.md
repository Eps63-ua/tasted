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
- [x] Create centralized colors, spacing, radii, and typography tokens.
- [x] Configure dark-only status bar and base screen background.
- [x] Create reusable text and button primitives.
- [x] Rebuild the bottom-tab shell with the approved design.
- [x] Create Home, Search, Create, and Profile screens.
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
- [x] Install Supabase client dependencies compatible with Expo.
- [x] Create the typed Supabase client.
- [x] Initialize the local `supabase/` folder and CLI workflow.
- [x] Write the first reviewed migration from `DATABASE_DESIGN.md`.
- [x] Enable RLS and create policies.
- [x] Create storage buckets and policies in reviewed migrations.
- [ ] Apply the migration safely.
- [x] Generate TypeScript database types.
- [ ] Add development seed data if useful.

Suggested commits:

```text
chore: configure Supabase client
feat: add initial database schema and RLS
chore: add generated database types
```

## Phase 4 — Authentication and profile

- [x] Auth session provider.
- [x] Protected route behavior.
- [x] Login screen.
- [x] Registration screen.
- [x] Password recovery screen.
- [ ] Profile creation trigger verification.
- [x] Profile screen.
- [x] Edit profile screen.
- [x] Avatar upload.
- [x] Logout.
- [x] Loading, validation, and error states.
- [ ] Android smoke test for session persistence.

## Phase 5 — Establishments

- [x] Establishment service and query keys.
- [x] Establishment list/search.
- [x] Create form.
- [x] Detail screen.
- [x] Edit form.
- [x] Image upload and cover selection.
- [x] Safe delete behavior.
- [x] Empty/loading/error states.
- [ ] RLS verification using two test users.

## Phase 6 — Personal categories

- [x] Category service.
- [x] Category tree query.
- [x] Create root category.
- [x] Create child category.
- [x] Detail screen.
- [x] Edit screen.
- [x] Cycle and ownership protection.
- [x] Optional category image.
- [x] Safe delete behavior.
- [x] Recursive descendant filtering tests.

## Phase 7 — Products and diary entries

- [x] Shared product service.
- [ ] Duplicate candidate search.
- [ ] Product creation form.
- [ ] Existing-product personal entry flow.
- [x] Transactional product-and-entry function.
- [x] Product detail screen.
- [x] Personal entry edit.
- [x] Half-star input.
- [x] Review text.
- [x] Favorite.
- [x] Price and tried date.
- [x] Multi-category assignment.
- [x] Product image upload.
- [x] Remove from diary.
- [x] Creator-safe shared edit/delete behavior.

## Phase 8 — Search and filters

- [x] Search filter model.
- [x] Text search.
- [x] Result type selector.
- [x] Establishment multi-filter.
- [x] Category multi-filter with AND semantics.
- [x] Parent category includes descendants.
- [x] Minimum rating.
- [x] Favorites only.
- [x] Sort options.
- [x] Active filter chips.
- [x] Clear all.
- [x] Empty/loading/error states.
- [ ] Query performance review.

## Phase 9 — Home

- [x] Recent establishments query.
- [x] Recent products query.
- [x] Favorites/top-rated query.
- [x] Approved square product cards.
- [x] Approved image-led establishment cards.
- [x] Horizontal lists.
- [ ] Home loading skeletons.
- [x] Home empty states.

No recommendation algorithm in this phase.

## Phase 10 — Quality and portfolio finish

- [x] Configure unit/component test stack.
- [x] Add tests for validation and critical filters.
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
