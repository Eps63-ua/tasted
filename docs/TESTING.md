# Tasted — Testing strategy

## 1. Goals

Testing should protect:

- personal data ownership;
- shared catalog behavior;
- cumulative filters;
- category hierarchy;
- rating validation;
- destructive actions;
- Android navigation and forms;
- loading, empty, error, and retry states.

## 2. Baseline checks from the first day

Run after relevant changes:

```bash
npm run lint
npx tsc --noEmit
npx expo-doctor
```

The configured automated suite is run with:

```bash
npm test
```

During development, use `npm run test:watch` to rerun affected tests after each save.
Use `npm run test:coverage` to generate the HTML coverage report in `coverage/lcov-report/index.html`.

Do not run `npm audit fix --force` as a routine solution. Expo dependency compatibility takes priority over an unreviewed forced upgrade.

## 3. Manual Android smoke test

For any visible change:

1. start Expo with `npx expo start`;
2. open the app in Expo Go;
3. confirm no red error screen;
4. navigate through affected routes;
5. test Android back behavior;
6. test scrolling;
7. open and close the keyboard;
8. test small/empty data states when possible;
9. test loading and retry behavior;
10. confirm touch targets and text remain usable.

## 4. Automated test stack

Introduce only when the first testable feature exists:

- Jest compatible with the current Expo SDK;
- React Native Testing Library;
- focused unit tests for pure utilities and validation;
- component tests for reusable interaction;
- service tests using mocked Supabase boundaries where useful.

Do not install a test framework before Codex verifies current Expo compatibility.

## 5. Priority unit tests

### Validation

- rating accepts only half steps from 0.5 to 5;
- price rejects negatives;
- required names trim whitespace;
- URL validation behaves consistently;
- category parent cannot be self.

### Filter normalization

- empty filters serialize consistently;
- category ids are deterministic;
- different filter values produce different query keys;
- AND category semantics produce correct query parameters.

### Utility behavior

- text normalization;
- storage path generation;
- date formatting;
- error normalization.

## 6. Priority component tests

- rating input selects full and half values;
- filter chip can be removed;
- destructive dialog requires explicit confirmation;
- submit button disables during save;
- empty state action navigates correctly;
- product Home card announces name and rating even when text is overlaid/minimal.

## 7. Database and RLS verification

Use at least two separate test users.

Verify:

- user A cannot read user B's categories;
- user A cannot read or update user B's private diary entries;
- user A cannot assign user B's category;
- both users can read a shared product;
- user B can add an independent entry to user A's product;
- user B cannot edit user A's shared product in the MVP;
- removing user A's entry leaves user B's entry and the product intact;
- unsafe product deletion is blocked;
- category cycle attempts fail;
- Storage policies match table ownership.

RLS testing is not replaced by hiding buttons in the UI.

## 8. Search acceptance cases

Seed examples and verify:

- Mercadona only;
- Quesos only;
- Mercadona + Quesos;
- Quesos + Favoritos;
- Quesos + rating >= 4;
- two categories using AND;
- parent category includes child-assigned products;
- clearing one chip updates results;
- clearing all restores unfiltered diary results.

## 9. Form acceptance cases

For each create/edit form:

- valid submission;
- missing required field;
- whitespace-only name;
- double tap on submit;
- network failure;
- server validation failure;
- leaving the screen with unsaved changes when implemented;
- image upload failure and retry;
- edit prefilled values;
- cancel without mutation.

## 10. Definition of a passing milestone

A milestone passes when:

- baseline checks pass;
- focused automated tests pass when configured;
- Android smoke test passes;
- no known critical RLS gap remains;
- no secret is present in Git;
- the relevant roadmap checklist and docs reflect reality.
