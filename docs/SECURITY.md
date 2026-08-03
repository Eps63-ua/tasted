# Tasted — Security and privacy

## 1. Core rule

The mobile client is untrusted. Authorization must be enforced in Supabase through Row Level Security, constraints, and reviewed database functions.

## 2. Credentials

Allowed in the Expo client:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Never include:

- Supabase secret key;
- service-role key;
- database password;
- personal access token;
- GitHub token;
- private signing key;
- production `.env` file.

Public Expo variables are embedded in the application bundle. They are safe only because RLS and privileges restrict access.

## 3. Git secret rules

- `.env` must be ignored;
- `.env.example` contains names only, never real values;
- inspect `git diff --staged` before every commit;
- rotate a secret immediately if accidentally committed;
- deleting the latest file is not enough if a secret exists in Git history.

## 4. RLS

Every exposed public table requires RLS.

Personal tables must compare ownership with `auth.uid()`.

Shared catalog tables require explicit policies for:

- authenticated read;
- authenticated creator insert;
- creator update;
- dependency-aware delete.

Do not use permissive policies such as unconditional `true` for personal writes.

## 5. Security-definer functions

Use only when necessary.

Rules:

- smallest possible purpose;
- fixed safe `search_path`;
- validate `auth.uid()` inside the function;
- no caller-supplied user id used as authority;
- explicit grants;
- reviewed for privilege escalation;
- transactional behavior;
- no arbitrary dynamic SQL.

## 6. Storage

- validate bucket and path;
- path begins with an authorized user/entity identifier;
- restrict MIME types;
- restrict size;
- create matching SELECT policies required for upload responses;
- do not trust file extension alone;
- do not expose private category paths publicly;
- remove orphaned files through controlled cleanup.

## 7. Input validation

Validate in both layers:

### Client

- immediate feedback;
- required fields;
- length and format;
- rating/price/date rules.

### Database

- not-null constraints;
- checks;
- foreign keys;
- unique constraints;
- ownership and cycle protections.

Client validation improves experience. Database validation protects integrity.

## 8. Privacy defaults

- diary entries default to private;
- categories are private;
- profile exposure is minimal in MVP;
- email is not copied to public profile tables;
- logs do not include review text or full user records unless necessary for local debugging;
- no analytics SDK is added without approval.

## 9. Destructive operations

- every delete in the UI requires confirmation;
- shared records use dependency-aware server operations;
- direct client cascade deletion of other users' data is forbidden;
- establishment deletion is blocked while products exist;
- product deletion is blocked while another user depends on it;
- migration SQL is reviewed before remote execution.

## 10. Error handling

User messages must not reveal:

- SQL details;
- policy definitions;
- tokens;
- internal paths that expose private structure;
- another user's data.

Development logs may retain a safe error code and operation context.

## 11. Dependency security

- prefer actively maintained packages;
- verify Expo SDK compatibility;
- avoid unnecessary packages;
- review advisories;
- do not force major upgrades automatically;
- commit lockfile changes with the dependency change;
- run project checks after installation.

## 12. Security checklist before release

- RLS enabled everywhere;
- two-user ownership tests passed;
- no secret in repository/history;
- storage policies tested;
- public bucket contents reviewed;
- password recovery redirect tested;
- no debug logs with tokens;
- Android build uses expected package id;
- dependency review completed;
- destructive functions reviewed.
