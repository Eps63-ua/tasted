# Android testing and distribution

## Automated checks

Run these commands from the repository root:

```bash
npm install
npm run lint
npx tsc --noEmit
npm test
npm run test:coverage
npx expo-doctor
```

Use `npm run test:watch` while developing. Jest reruns affected tests whenever a file changes.

## Share a temporary Expo QR over the internet

```bash
npx expo start --tunnel
```

The other person installs Expo Go, opens the shared QR or link, and signs in with a test account. The development computer must remain running and connected. A tunnel is for testing, not a release.

## Build an installable APK with EAS

Before the first build, choose a permanent reverse-domain Android application id and add it to `expo.android.package` in `app.json`, for example `com.example.tasted`. Do not change it after distributing builds unless you intend to create a different Android application.

Then run:

```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```

The `preview` profile in `eas.json` produces an APK for direct installation. EAS prints a private build page and download link that can be sent to a tester. Android may ask the tester to allow installation from the browser or file manager.

The production profile normally produces an AAB for Google Play:

```bash
npx eas-cli build --platform android --profile production
```

## Release checklist

- Use Supabase mode and the intended project URL/publishable key.
- Never include a service-role key.
- Verify RLS with two accounts.
- Test sign-up, login, password recovery and logout.
- Test image upload and deletion.
- Run the complete Android smoke test in `docs/TESTING.md`.
- Review the final icon, splash screen, application id and version.
