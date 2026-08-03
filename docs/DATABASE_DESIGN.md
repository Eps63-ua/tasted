# Tasted — Database design

## 1. Goals

The database must:

- support a shared product and establishment catalog;
- keep ratings, favorites, reviews, and categories personal;
- support hierarchical user-owned categories;
- prevent one user from changing another user's personal data;
- prevent unsafe deletion of shared records;
- support cumulative search efficiently;
- work safely from a mobile client using Supabase Row Level Security;
- evolve through versioned migrations.

## 2. Naming decision

The central personal table is named `user_product_entries`, not `product_reviews`.

Reason: it stores the entire personal relationship with a product, including rating, review, favorite, price, tried date, visibility, and category assignments. A written review is optional, but the diary entry still exists.

## 3. Entity overview

```text
auth.users
    │
    └── profiles

establishments
    ├── establishment_images
    └── products
            ├── product_images
            └── user_product_entries
                    └── entry_categories
                            └── categories
```

## 4. Enumerations

Proposed PostgreSQL enum types:

### `establishment_type`

```text
supermarket
restaurant
cafe
ice_cream_shop
bakery
bar
food_shop
other
```

The UI may use localized Spanish labels without changing stored enum values.

### `entry_visibility`

```text
private
public
```

The MVP defaults to `private`. Public social display is not implemented yet, but the field prevents a later migration of every row.

## 5. Table: `profiles`

Purpose: public-schema profile data linked one-to-one with Supabase Auth.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key; references `auth.users(id)` on delete cascade |
| `username` | `text` | Unique after normalization; required after onboarding |
| `display_name` | `text` | Required |
| `avatar_path` | `text` | Nullable Storage path |
| `bio` | `text` | Nullable; length limited |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` and maintained by trigger |

Notes:

- Email remains in `auth.users` and is not duplicated.
- A trigger may create a minimal profile after registration.
- Username comparison should be case-insensitive through normalization or a suitable PostgreSQL type/index.

## 6. Table: `establishments`

Purpose: shared places associated with products.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `created_by` | `uuid` | References `auth.users(id)`; required |
| `name` | `text` | Required |
| `normalized_name` | `text` | Required; maintained consistently |
| `type` | `establishment_type` | Required |
| `description` | `text` | Nullable |
| `location_text` | `text` | Nullable |
| `city` | `text` | Nullable |
| `country_code` | `text` | Nullable; ISO-style value when used |
| `website` | `text` | Nullable and validated by the app |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Maintained automatically |

MVP identity rule:

- Mercadona may be one establishment without individual branches.
- A specific independent restaurant may store a location.
- Exact duplicates are discouraged through normalized search and suggestions rather than an overly strict global unique constraint.

## 7. Table: `establishment_images`

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `establishment_id` | `uuid` | References `establishments(id)` on delete cascade |
| `uploaded_by` | `uuid` | References `auth.users(id)` |
| `storage_path` | `text` | Required |
| `is_cover` | `boolean` | Default false |
| `position` | `integer` | Default 0; non-negative |
| `created_at` | `timestamptz` | Default `now()` |

Indexes and constraints:

- index by `establishment_id, position`;
- partial unique index allowing at most one cover image per establishment;
- unique storage path.

MVP edit rule: only the establishment creator manages shared establishment images.

## 8. Table: `products`

Purpose: shared product identity within one establishment.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `created_by` | `uuid` | References `auth.users(id)`; required |
| `establishment_id` | `uuid` | References `establishments(id)`; required |
| `name` | `text` | Required |
| `normalized_name` | `text` | Required |
| `brand` | `text` | Nullable |
| `normalized_brand` | `text` | Nullable |
| `description` | `text` | Nullable |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Maintained automatically |

Identity and duplicate handling:

- candidate duplicates are found using establishment, normalized name, and brand;
- no hard global unique constraint is initially placed on display name because legitimate similar products exist;
- the app shows candidate matches before creation;
- suitable indexes support normalized search.

## 9. Table: `product_images`

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `product_id` | `uuid` | References `products(id)` on delete cascade |
| `uploaded_by` | `uuid` | References `auth.users(id)` |
| `storage_path` | `text` | Required |
| `is_cover` | `boolean` | Default false |
| `position` | `integer` | Default 0; non-negative |
| `created_at` | `timestamptz` | Default `now()` |

Indexes and constraints mirror `establishment_images`.

MVP edit rule: only the product creator manages shared product images. Personal review images are a future extension and should use a separate `entry_images` table rather than weakening catalog ownership.

## 10. Table: `user_product_entries`

Purpose: one user's personal diary information for one product.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users(id)` on delete cascade |
| `product_id` | `uuid` | References `products(id)` |
| `rating` | `numeric(2,1)` | Required; 0.5–5 in half-step increments |
| `review_text` | `text` | Nullable |
| `is_favorite` | `boolean` | Default false |
| `price_paid` | `numeric(10,2)` | Nullable; must be non-negative |
| `currency_code` | `text` | Default `EUR`; three characters |
| `tried_at` | `date` | Nullable |
| `visibility` | `entry_visibility` | Default `private` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Maintained automatically |

Critical constraints:

```text
unique(user_id, product_id)
rating >= 0.5 and rating <= 5
rating * 2 must be an integer
price_paid is null or price_paid >= 0
```

Indexes:

- `user_id, created_at desc`;
- `user_id, rating desc`;
- partial index for favorites;
- `product_id` for shared-catalog relationships;
- `user_id, tried_at desc`.

## 11. Table: `categories`

Purpose: private hierarchical organization owned by one user.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users(id)` on delete cascade |
| `parent_id` | `uuid` | Nullable self-reference |
| `name` | `text` | Required |
| `normalized_name` | `text` | Required |
| `description` | `text` | Nullable |
| `image_path` | `text` | Nullable |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Maintained automatically |

Rules:

- parent category must belong to the same user;
- `parent_id` cannot equal `id`;
- cycles are forbidden;
- duplicate sibling names are forbidden for the same user;
- duplicate root names are also forbidden for the same user;
- deleting a parent with children is blocked by default.

Cycle prevention requires a reviewed SQL function or trigger, not only client validation.

## 12. Table: `entry_categories`

Purpose: many-to-many relation between personal diary entries and personal categories.

| Column | Type | Rules |
|---|---|---|
| `entry_id` | `uuid` | References `user_product_entries(id)` on delete cascade |
| `category_id` | `uuid` | References `categories(id)` on delete cascade |
| `created_at` | `timestamptz` | Default `now()` |

Primary key:

```text
(entry_id, category_id)
```

Security requirement:

- the diary entry and category must both belong to `auth.uid()`;
- ownership is enforced by RLS and, where useful, a database constraint/function;
- another user's category can never be assigned.

## 13. Relationship summary

```text
profiles 1 — 1 auth.users

auth.users 1 — N establishments created
auth.users 1 — N products created
auth.users 1 — N user_product_entries
auth.users 1 — N categories

establishments 1 — N products
establishments 1 — N establishment_images
products 1 — N product_images
products 1 — N user_product_entries
user_product_entries N — N categories through entry_categories
categories 1 — N child categories
```

## 14. Row Level Security strategy

RLS must be enabled on every public table created through SQL.

### `profiles`

MVP:

- select own profile;
- insert own profile through controlled registration flow;
- update own profile;
- no direct delete from the mobile client.

Public profile reading may be added only with a social feature.

### `establishments`

- authenticated users may read shared establishments;
- authenticated users may create with `created_by = auth.uid()`;
- only the creator may directly update;
- direct delete is blocked or heavily restricted;
- safe deletion uses a function that verifies dependencies.

### `establishment_images`

- authenticated users may read catalog image metadata;
- creator-managed insert, update, and delete;
- path ownership must match the uploader and associated creator rule.

### `products`

- authenticated users may read shared products;
- authenticated users may create with `created_by = auth.uid()`;
- only the creator may update;
- direct delete is blocked when another user's entry exists;
- safe deletion goes through a function.

### `product_images`

Same model as establishment images.

### `user_product_entries`

- users may read, insert, update, and delete only rows where `user_id = auth.uid()`;
- public entry reads are not enabled in the MVP even though visibility is stored;
- a later migration may expose `public` entries deliberately.

### `categories`

- users may access only categories where `user_id = auth.uid()`;
- parent ownership must also be validated.

### `entry_categories`

- users may access a relation only when both linked records belong to `auth.uid()`.

## 15. Storage design

Proposed buckets:

### `avatars`

- public read is acceptable for profile display;
- authenticated user writes only under a path beginning with their user id;
- accepted image MIME types only;
- file-size limit;
- replace/delete only own files.

### `catalog-media`

- contains product and establishment images;
- authenticated read;
- write policy tied to creator/uploader ownership;
- paths include entity type, entity id, and uploader id;
- no service-role key in the client.

### `category-media`

- private bucket;
- user reads and writes only their own path;
- signed URLs or authenticated downloads.

Final bucket visibility must be reviewed when the SQL migration is written.

## 16. Planned database functions

### `create_product_with_entry`

Transactional operation that:

1. validates the authenticated user;
2. creates the product;
3. creates the user's diary entry;
4. assigns valid user-owned categories;
5. returns product and entry ids.

Images may be uploaded after the database transaction so failed file uploads can be retried without duplicating the product.

### `add_entry_to_existing_product`

Creates the user's diary entry and category assignments after validating:

- product exists;
- the user does not already have an entry;
- categories belong to the user.

### `remove_product_from_diary`

Deletes only:

- the user's `entry_categories` relations;
- the user's `user_product_entries` row.

It never deletes another user's data.

### `delete_product_if_unused`

Creator-only operation that succeeds only when no other user's entry depends on the product.

### `delete_establishment_if_empty`

Creator-only operation that succeeds only when no products reference the establishment.

### `delete_category_safe`

Owner-only operation that blocks deletion while children exist and reports affected entry assignments.

## 17. Views and query helpers

Potential views/functions after the base schema:

- `my_product_library`: current user's entries joined with products and establishments;
- `my_favorite_products`;
- `my_recent_products`;
- category descendant function using a recursive CTE;
- duplicate product candidate search;
- establishment product counts for the current user;
- future public rating summary.

Views must not bypass RLS or accidentally expose personal information.

## 18. Search behavior at database level

Personal search begins from `user_product_entries` and joins:

- products;
- establishments;
- entry categories;
- category descendants.

Multiple selected category branches use grouping and `HAVING` logic so each returned entry matches every selected branch.

Text search starts with normalized `ILIKE`-style matching for the MVP. PostgreSQL trigram or full-text indexes may be added only after measuring need.

## 19. Timestamps

All mutable tables use:

```text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

A common trigger updates `updated_at` before updates.

Use UTC in the database and localize in the application.

## 20. Migration policy

- Schema lives under `supabase/migrations/`.
- The first migration creates types, tables, constraints, functions, indexes, grants, and RLS policies.
- Storage bucket creation and policies may be in the same reviewed migration or a clearly separated following migration.
- Never edit a migration already applied to a shared remote project.
- Generate TypeScript database types after applying migrations.
- Commit migrations and generated types together when appropriate.

## 21. Seed data

Development seed data may include:

- one test profile;
- Mercadona;
- one restaurant;
- two products;
- a small category hierarchy;
- personal entries with different ratings.

Seed data must never include real passwords, tokens, or private user information.

## 22. Decisions deliberately postponed

- multiple diary entries for repeated tastings;
- branch/location tables for chains;
- personal entry image galleries;
- moderation and edit proposals for shared catalog records;
- public review feeds;
- recommendation tables or vectors;
- soft deletion versus archival for a public production catalog.

Codex must not invent these features during MVP implementation.
