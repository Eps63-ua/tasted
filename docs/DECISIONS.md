# Tasted — Decision log

Approved decisions are not changed by a coding agent without explicit user approval.

## D-001 — Expo React Native instead of Ionic

**Status:** Approved

Tasted uses React Native with Expo and TypeScript.

Reason:

- Android-first application;
- native mobile interaction;
- quick testing with Expo Go;
- suitable camera/gallery ecosystem;
- valuable portfolio experience.

## D-002 — Expo Router

**Status:** Approved

File-based routing is used for tabs, authentication, details, and forms.

## D-003 — Supabase backend

**Status:** Approved

Supabase provides:

- PostgreSQL;
- Auth;
- Storage;
- Data API;
- Row Level Security.

No custom backend server is required for the MVP.

## D-004 — Shared products, personal diary entries

**Status:** Approved

A product is created once in the shared catalog. Each user has an independent `user_product_entries` row with rating, review, favorite, price, date, visibility, and category assignments.

This follows the conceptual pattern of media diary applications while preserving personal data.

## D-005 — Shared establishments

**Status:** Approved

Establishments are shared catalog records created by users. Creator ownership controls edits in the MVP.

## D-006 — Personal categories

**Status:** Approved

Categories belong to one user and may be hierarchical. They are not global product taxonomy and do not belong to establishments.

## D-007 — One product belongs to one establishment in the MVP

**Status:** Approved

This keeps restaurant dishes and retailer-specific products simple. Cross-store product identity is postponed.

## D-008 — One personal entry per user and product

**Status:** Approved

The MVP stores the user's current evaluation. Repeated tasting history is postponed.

## D-009 — `user_product_entries` naming

**Status:** Approved

The table is not called only `reviews` because it stores more than review text.

## D-010 — Search is personal-first

**Status:** Approved

The Search tab searches the current user's diary. Shared-catalog search appears during product creation to prevent duplicates.

## D-011 — Cumulative filter semantics

**Status:** Approved

- different filter groups combine with AND;
- multiple selected categories use AND;
- a selected parent category includes descendants by default.

## D-012 — No algorithmic recommendations in MVP

**Status:** Approved

Home initially shows recent establishments, recent products, favorites, and top-rated items.

## D-013 — Dark-only interface

**Status:** Approved

No light theme in MVP. The visual system uses the approved dark Figma palette and Spotify-like green accent.

## D-014 — Figma is visual reference only

**Status:** Approved

The generated project is React web with Vite and Tailwind. Its code is not merged into Expo. Visual patterns are reimplemented natively.

## D-015 — Home cards are image-first

**Status:** Approved

- product card: square photo with rating overlay;
- establishment card: photo with optional name overlay;
- no large text panel below these Home cards.

## D-016 — Android-first

**Status:** Approved

Android behavior is tested first. iOS and web release work are outside the MVP.

## D-017 — Versioned SQL migrations

**Status:** Approved

Database and RLS changes are committed as SQL migrations. Applied migrations are not rewritten.

## D-018 — Direct shared deletion is restricted

**Status:** Approved

Removing a product from a user's diary does not delete the shared product. Shared records are deleted only through safe dependency-aware operations.

## D-019 — Small Codex tasks and user review

**Status:** Approved

Codex plans, implements, explains, and runs checks in small milestones. It does not commit or push without explicit permission.

## Open decisions

These remain intentionally unresolved and must be presented to the user when their implementation becomes necessary:

1. Final app icon and wordmark.
2. Whether Inter is bundled immediately or after the first UI shell.
3. Exact product/establishment image upload limits and compression values.
4. Whether creator-owned shared images can later accept community contributions.
5. Exact storage bucket visibility after reviewing signed URL complexity.
6. Whether category depth receives a UI limit beyond three comfortable levels.
7. Final Android application id before the first EAS build.
