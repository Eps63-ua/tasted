# Tasted — Figma reference analysis

## 1. Source reviewed

The supplied Figma Make ZIP is a generated React web prototype.

Detected technology:

- React 19;
- React DOM;
- Vite;
- Tailwind CSS;
- HTML elements;
- in-memory mock store;
- navigation simulated with React state.

It is not React Native and must not be extracted over the Expo repository.

## 2. Useful generated screens

The ZIP contains visual implementations for:

- Home;
- Search and filters;
- Create hub;
- Profile;
- Edit profile;
- Login;
- Registration;
- Password recovery;
- Product detail;
- Product form;
- Establishment detail;
- Establishment form;
- Category detail;
- Category form;
- confirmation dialog;
- empty state;
- bottom navigation;
- star rating;
- product and establishment cards.

These are useful as visual composition references.

## 3. Exact visual tokens found

The most frequently used colors in the generated source are:

```text
#A7A7A7  secondary text
#F5F5F5  primary text
#2A2A2A  borders
#1ED760  green accent
#202020  input/elevated surface
#181818  cards
#0B0B0B  background
#EF5350  destructive/favorite red
#121212  navigation
```

The generated CSS imports Inter weights 400, 500, 600, and 700.

Common spacing patterns correspond approximately to:

- 20 px horizontal screen padding;
- 12–16 px internal card padding;
- 8–12 px small gaps;
- 16–24 px section/form gaps;
- rounded cards and controls.

## 4. Elements to reproduce

- dark visual hierarchy;
- green active navigation state;
- rounded inputs and cards;
- compact headers;
- image-forward content;
- bottom sheets/dialog appearance;
- clear destructive confirmation;
- authentication layout;
- form field order where compatible with the approved product model;
- secondary gray metadata;
- subtle pressed-state scaling.

## 5. Approved deviations from Figma

### App name

Replace provisional `sabor.io` branding with `Tasted`.

### Product model

The prototype places rating, favorite, and category ids directly on a product object. The real application stores them in the current user's diary entry.

### Home product card

The generated card is 200 px wide and includes a text panel under the photo. The approved Tasted Home card is square and image-only except for overlaid rating/favorite elements.

### Home establishment card

Use image-first cards with optional overlaid name and no information-heavy footer.

### Navigation

Replace simulated `useState` navigation with Expo Router.

### Mobile frame

Do not recreate the fake status bar, battery icons, fixed 390×844 frame, or browser-centered phone shell.

### Color system

Ignore isolated blue and purple details. Maintain black, gray, white, green, and destructive red.

### Images

The prototype uses remote placeholder images. No real image assets need to be copied from the ZIP.

## 6. Code that must not be copied

- `index.html`;
- Vite configuration;
- web `package.json`;
- Tailwind imports/classes;
- components using `div`, `button`, `img`, `input`, `textarea`, or `select`;
- React DOM entry point;
- in-memory store and mock persistence;
- fake status bar SVGs;
- web-only CSS.

## 7. Recommended visual workflow

When implementing a screen with Codex:

1. Read `UI_DESIGN.md`.
2. Use this document to identify the corresponding Figma screen.
3. Ask Codex for a plan without code changes.
4. Implement the screen with shared React Native tokens and components.
5. Run it in Expo Go.
6. Compare visually with Figma.
7. Request one focused visual adjustment at a time.
8. Keep screenshots outside Git until deciding which final references belong in `docs/`.

## 8. Keeping the ZIP

Keep the original ZIP outside the Expo repository as an archival reference. Do not commit it unless there is a deliberate reason; it contains an unrelated generated web project and would make the repository confusing.
