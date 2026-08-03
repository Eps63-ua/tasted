# Tasted — Application architecture

## 1. Principles

- Android-first React Native application.
- Expo-managed development during the MVP.
- File-based navigation with Expo Router.
- Supabase as remote backend.
- Clear separation between routes, presentation, domain features, and data access.
- Server state is not duplicated in arbitrary global stores.
- Small files and reusable components.
- Changes introduced incrementally; no unnecessary full-project rewrite.

## 2. Current baseline

The repository was created using the default Expo SDK 54 learning template so it can run in Expo Go on a physical Android phone.

Existing top-level folders such as `app`, `components`, `constants`, `hooks`, `assets`, and `scripts` should be reused where sensible. Do not create a second nested application or move the entire project without a clear reason.

## 3. Planned project structure

```text
app/
├── _layout.tsx
├── index.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── search.tsx
│   ├── create.tsx
│   └── profile.tsx
├── products/
│   ├── [id].tsx
│   ├── create.tsx
│   └── [id]/edit.tsx
├── establishments/
│   ├── [id].tsx
│   ├── create.tsx
│   └── [id]/edit.tsx
└── categories/
    ├── [id].tsx
    ├── create.tsx
    └── [id]/edit.tsx

components/
├── ui/
├── cards/
├── forms/
├── filters/
├── feedback/
└── layout/

features/
├── auth/
├── profile/
├── products/
├── establishments/
├── categories/
└── search/

lib/
├── supabase.ts
├── query-client.ts
└── env.ts

services/
├── products.service.ts
├── establishments.service.ts
├── categories.service.ts
├── entries.service.ts
├── profiles.service.ts
└── storage.service.ts

constants/
└── theme/
    ├── colors.ts
    ├── spacing.ts
    ├── radii.ts
    ├── typography.ts
    └── index.ts

types/
├── database.generated.ts
├── domain.ts
└── navigation.ts

validation/
├── auth.schemas.ts
├── product.schemas.ts
├── establishment.schemas.ts
├── category.schemas.ts
└── entry.schemas.ts

supabase/
├── config.toml
├── migrations/
└── seed.sql
```

Folders should be created only when their first real file is needed.

## 4. Route responsibilities

Files under `app/` are thin route adapters.

A route should:

- read route parameters;
- choose the correct screen/feature component;
- configure navigation options when needed;
- avoid containing large database queries or complex form logic.

Feature components live outside the route tree so create/edit/view logic can be reused and tested.

## 5. Navigation model

### Root layout

Responsibilities:

- safe-area and status-bar configuration;
- query provider;
- authentication/session provider;
- theme provider if needed;
- route protection decision;
- splash/loading state while session initializes.

### Auth group

Shown when no valid session exists.

### Tabs group

Shown when authenticated:

- Home;
- Search;
- Create;
- Profile.

### Detail and form routes

Presented through the root stack so they can hide the tabs and use a normal back action.

## 6. State management

### Remote/server state

Use TanStack Query when introduced for:

- products;
- establishments;
- categories;
- diary entries;
- profile data;
- search results.

Benefits required from the implementation:

- caching;
- loading and error states;
- invalidation after mutation;
- no duplicate fetch logic;
- predictable query keys.

### Authentication state

A small provider/hook manages:

- current session;
- current user id;
- initialization state;
- sign-out response.

Supabase remains the source of truth.

### Local UI state

Use local component state for:

- open/closed sheets;
- current form step;
- unsaved field interaction;
- active local filters before applying.

Do not add a global store unless a real cross-screen requirement appears.

## 7. Query key convention

Planned examples:

```text
['profile', userId]
['home', userId]
['products', 'detail', productId]
['entries', 'detail', userId, productId]
['establishments', filters]
['categories', userId]
['search', userId, normalizedFilters]
```

Query keys must include every parameter that changes the result.

## 8. Service layer

Supabase queries belong in typed service functions.

Example responsibilities:

### `products.service.ts`

- fetch product detail;
- search shared product candidates;
- call product creation RPC;
- update creator-owned product fields.

### `entries.service.ts`

- fetch current user's diary entry;
- create/update entry;
- toggle favorite;
- remove from diary;
- assign categories.

### `storage.service.ts`

- validate selected image metadata;
- create safe storage paths;
- upload;
- remove authorized files;
- obtain public or signed URL according to bucket rules.

Service functions return typed results or throw normalized application errors. Screens should not parse raw Supabase error shapes repeatedly.

## 9. Forms

Planned stack:

- React Hook Form;
- Zod;
- `@hookform/resolvers`.

Rules:

- one schema is the source of truth for each form;
- create and edit reuse the same form component;
- form default values are explicit;
- remote submit errors are distinct from field errors;
- submit is disabled while saving;
- duplicate submissions are prevented;
- unsaved-change behavior is considered for long forms.

## 10. Domain types

Three type layers may exist:

1. Generated database row types.
2. Service-level joined/query types.
3. UI/domain view models.

Do not use the raw database row everywhere when the screen needs a richer joined object.

Never manually maintain a duplicate copy of generated database types.

## 11. Supabase client

Environment variables:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The client lives in one file, validates missing variables in development, persists the session using an Expo-compatible storage method, refreshes tokens, and disables URL-session detection for native behavior when appropriate.

Never initialize multiple unrelated clients.

## 12. Data mutation flow

Example product creation:

1. form validates locally;
2. image metadata is prepared but files are not blindly uploaded first;
3. service calls a transactional database function for product and entry data;
4. successful ids are returned;
5. images upload to deterministic paths;
6. image metadata is inserted;
7. query caches are invalidated;
8. user navigates to the created detail;
9. partial image failure offers retry without duplicating the product.

The exact ordering may be refined when Storage is implemented, but duplicate database rows must be avoided.

## 13. Error model

Define a small application error model with fields such as:

```text
code
message
cause
fieldErrors
retryable
```

User-facing messages are concise and non-technical. Development logs may include the original Supabase error without leaking secrets.

## 14. Theme implementation

All screens use centralized design tokens from `docs/UI_DESIGN.md`.

Do not distribute raw color literals throughout route files.

Reusable primitives should eventually include:

- `AppScreen`;
- `AppText` or typography helpers;
- `PrimaryButton`;
- `SecondaryButton`;
- `IconButton`;
- `TextField`;
- `TextArea`;
- `Chip`;
- `RatingInput`;
- `LoadingState`;
- `EmptyState`;
- `ErrorState`;
- `ConfirmDialog`.

Avoid creating a custom abstraction that merely wraps every React Native component without adding project value.

## 15. Image handling

Use Expo-compatible image selection and display packages when the relevant milestone begins.

Rules:

- request Android permission only when necessary;
- validate MIME type and size;
- generate unique deterministic paths;
- preserve extension or encode consistently;
- compress/resize if needed before upload;
- show progress/loading;
- clean up failed temporary state;
- do not store base64 image data in PostgreSQL.

## 16. Search architecture

Search state is represented as a serializable filter object:

```text
query
resultType
establishmentIds
categoryIds
minimumRating
favoritesOnly
sort
```

The normalized filter object is used in the query key.

The database/service layer, not the card component, applies cumulative matching.

## 17. Dependency plan

Add only when required:

### Supabase milestone

- `@supabase/supabase-js`;
- `react-native-url-polyfill`;
- Expo-compatible persistence package recommended by the selected official setup.

### Data and forms milestone

- `@tanstack/react-query`;
- `react-hook-form`;
- `zod`;
- `@hookform/resolvers`.

### UI and images milestone

- `lucide-react-native` if selected after comparison with existing Expo icons;
- `expo-image-picker`;
- `expo-image` if useful;
- font packages required for Inter.

Every installation uses `npx expo install` for Expo-managed native dependencies where appropriate.

## 18. Performance boundaries

MVP priorities:

- use `FlatList` for potentially long result lists;
- stable keys;
- image size appropriate to card size;
- avoid fetching full galleries in list queries;
- paginate or limit search results when needed;
- avoid expensive calculations during render;
- memoize only when measurements or real behavior justify it.

## 19. Logging

- no secrets or tokens;
- no full user records;
- development logging may include operation and safe identifiers;
- production logging strategy is postponed;
- remove noisy temporary logs before task completion.

## 20. Architecture change policy

A change to any of the following requires an update to `docs/DECISIONS.md` and user approval:

- framework;
- navigation;
- backend;
- central entity model;
- shared versus personal ownership;
- state management strategy;
- migration strategy;
- design identity.
