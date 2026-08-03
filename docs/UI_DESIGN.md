# Tasted — UI design specification

## 1. Visual objective

Tasted is a minimal, image-led Android application with dark mode only.

The Figma-generated prototype is the approved visual reference for hierarchy, spacing, forms, navigation, cards, and dialogs. Its React web code must not be copied. The design is reimplemented with React Native and Expo.

The interface should feel:

- modern;
- calm;
- personal;
- photographic;
- simple to scan;
- quick to use with one hand.

## 2. Design source

The generated Figma prototype consistently uses these primary tokens:

```text
Background:        #0B0B0B
Navigation:        #121212
Card:              #181818
Input / elevation: #202020
Border:            #2A2A2A
Primary text:      #F5F5F5
Secondary text:    #A7A7A7
Accent green:      #1ED760
Destructive red:   #EF5350
```

These values are the source of truth unless the user explicitly approves a change.

## 3. Colors

### Core palette

| Token | Value | Use |
|---|---|---|
| `background` | `#0B0B0B` | Main screen background |
| `backgroundDeep` | `#050505` | Optional outer/debug background only |
| `surfaceNavigation` | `#121212` | Bottom navigation and fixed surfaces |
| `surfaceCard` | `#181818` | Cards, dialogs, bottom sheets |
| `surfaceInput` | `#202020` | Inputs, selected containers, empty image states |
| `border` | `#2A2A2A` | Subtle borders and dividers |
| `textPrimary` | `#F5F5F5` | Titles and important text |
| `textSecondary` | `#A7A7A7` | Metadata and placeholders |
| `accent` | `#1ED760` | Primary actions and active state |
| `accentPressed` | `#18B850` | Pressed green action |
| `onAccent` | `#000000` | Text/icons on green |
| `danger` | `#EF5350` | Delete and error states |
| `overlay` | `rgba(0,0,0,0.70)` | Behind modals |
| `imageBadge` | `rgba(0,0,0,0.65)` | Text and rating over images |

### Excluded accents

The Figma output contains isolated blue and purple values such as `#38BDF8` and `#A78BFA`. They are not part of Tasted's main identity and must not be introduced without approval.

## 4. Typography

Preferred family: Inter.

Temporary fallback: Android/system sans-serif until the font is configured.

| Role | Size | Weight |
|---|---:|---:|
| Screen title | 24 | 700 |
| Large item title | 20 | 700 |
| Section title | 16 | 700 |
| Body | 15–16 | 400 |
| Card title | 14 | 600 |
| Secondary text | 12–14 | 400–500 |
| Form label | 11–12 | 600 |
| Bottom-tab label | 10–11 | 500 |

Form labels may use uppercase and light letter spacing. Avoid uppercase for normal paragraphs.

## 5. Spacing system

Use a shared scale:

```text
2, 4, 8, 12, 16, 20, 24, 32, 40
```

Recommended:

- horizontal screen padding: 20;
- compact screen padding: 16;
- section gap: 24;
- related element gap: 8 or 12;
- form field gap: 16 or 20;
- bottom content padding: navigation height plus safe area.

Do not invent unrelated spacing values repeatedly.

## 6. Radius system

| Token | Value |
|---|---:|
| `radiusSmall` | 8 |
| `radiusImage` | 12 |
| `radiusMedium` | 16 |
| `radiusLarge` | 20 |
| `radiusSheet` | 24 |
| `radiusPill` | 999 |

Primary cards, fields, and buttons generally use 16.

## 7. Touch and motion

- interactive height: at least 44–48;
- clear `accessibilityLabel` on icon-only buttons;
- subtle opacity or scale feedback;
- pressed scale approximately 0.96–0.98;
- no decorative animation that delays input;
- respect reduced-motion preferences when animations are introduced.

## 8. Bottom navigation

Tabs:

1. Inicio.
2. Buscar.
3. Crear.
4. Perfil.

Style:

- `#121212` background;
- `#2A2A2A` top border;
- active icon and label `#1ED760`;
- inactive icon and label `#A7A7A7`;
- line icons;
- safe-area-aware bottom padding;
- no fake Android system navigation bar.

Details and forms use stack navigation and may hide the bottom tabs.

## 9. Headers

Headers are compact and may include:

- back button;
- title;
- edit action;
- small trash icon;
- optional save action only when suitable.

Do not reproduce the web prototype's fake status bar. Use the device status bar and Expo safe-area handling.

## 10. Buttons

### Primary

- green background;
- black text;
- semibold/bold;
- radius 16;
- height 52–56;
- full width for primary form submission.

### Secondary

- `#181818` or `#202020` background;
- `#2A2A2A` border;
- primary or secondary text;
- same shape as primary.

### Destructive

- red background or red text depending on hierarchy;
- reserved for delete confirmation;
- never styled like a normal primary action.

### Text action

- green text;
- no background;
- examples: Ver todos, Crear categoría, Añadir establecimiento.

## 11. Inputs

- background `#202020`;
- border `#2A2A2A`;
- radius 16;
- minimum height 48;
- horizontal padding 16;
- primary entered text;
- secondary placeholder;
- green focus border;
- red error border and explanatory message;
- no browser-style controls.

Keyboard behavior, scrolling, and safe areas must be tested on Android.

## 12. Chips

Used for:

- categories;
- filters;
- selected establishments;
- sort choices.

Default:

- `#202020` background;
- `#2A2A2A` border;
- secondary text;
- pill radius.

Selected:

- green background;
- black text.

Filter chips include a removable close action.

## 13. Rating component

- values from 0.5 to 5;
- active star color green;
- readonly and interactive variants;
- numeric value announced/accessibly visible;
- compact display may use `★ 4.5`;
- rating over a photo uses a dark translucent badge.

## 14. Image system

Images are central to the app.

Rules:

- use cover cropping;
- never distort aspect ratio;
- use a dark loading placeholder;
- show a coherent no-image state;
- support a selected cover image;
- validate before upload;
- show upload/loading feedback;
- use consistent radii.

No image assets from the Figma ZIP need to be copied because the prototype uses remote placeholder URLs.

## 15. Home product card

The approved Home card differs from the first Figma-generated card.

Required:

- square;
- photo fills the complete card;
- no large content block under the image;
- rating badge overlaid in one corner;
- optional favorite icon;
- entire card is pressable;
- subtle dark gradient only when needed for contrast.

Concept:

```text
┌──────────────────┐
│                  │
│       PHOTO      │
│                  │
│          ★ 4.5   │
└──────────────────┘
```

## 16. Home establishment card

Required:

- image-first square or slightly portrait card;
- optional name overlaid at bottom;
- no description block;
- entire card pressable;
- accessible name even if visible text is omitted.

Showing the name is recommended because arbitrary photos may not identify the place clearly.

## 17. Search cards

Search may show more information than Home.

### Product search card

- image;
- name;
- establishment;
- rating;
- optional favorite;
- grid of two columns or a compact list based on screen width.

### Establishment search row/card

- image;
- name;
- type;
- current user's product count when available.

### Category row/card

- image or icon;
- name;
- parent breadcrumb;
- current user's product count.

## 18. Home screen

Order:

1. time-appropriate greeting and avatar;
2. small Tasted brand treatment;
3. recent establishments;
4. recently added products;
5. favorites or top-rated products.

Each section includes:

- title;
- optional Ver todos action;
- horizontal scroll;
- loading skeleton;
- empty state;
- error/retry state when necessary.

No recommendation section in the MVP.

## 19. Search screen

- large search input;
- filter button;
- segmented result type selector;
- active filter chips;
- results;
- clear-all action;
- filters in a bottom sheet;
- filter button becomes green when active.

## 20. Create screen

Three large actions:

- Crear producto;
- Crear establecimiento;
- Crear categoría.

Each uses icon, title, description, and navigation indicator. Product creation has the strongest visual emphasis.

## 21. Product detail

Visual separation between:

### Product

- gallery;
- name;
- brand;
- establishment;
- general description.

### Mi diario

- rating;
- favorite;
- categories;
- review;
- price;
- date;
- edit action;
- remove-from-diary action.

The personal rating must not appear as if it were a universal product property.

## 22. Forms

Create and edit modes reuse the same form component.

### Product form

- image selection and preview;
- name;
- brand;
- establishment selector;
- quick establishment creation;
- category multi-select;
- quick category creation;
- rating;
- review;
- price;
- date;
- favorite;
- primary save;
- secondary cancel.

When reviewing an existing product, shared product fields that the user cannot edit are displayed as readonly context.

### Establishment form

- images and cover;
- name;
- type;
- location;
- website;
- description.

### Category form

- optional image;
- name;
- description;
- parent selector;
- hierarchy preview.

## 23. Profile and authentication

Profile follows the Figma reference:

- large avatar;
- name and username;
- email;
- optional bio;
- compact statistics;
- favorites shortcut;
- edit profile;
- sign out.

Authentication screens:

- minimal dark layout;
- clear title;
- large fields;
- one green primary action;
- secondary text links;
- loading and validation states.

## 24. Bottom sheets and dialogs

- overlay `rgba(0,0,0,0.70)`;
- card background `#181818`;
- top radii 24;
- optional drag handle;
- 20–24 padding;
- safe-area-aware;
- clear action hierarchy.

Use for:

- filters;
- category selection;
- establishment selection;
- image actions;
- deletion confirmation.

## 25. Empty states

Every list has a purposeful empty state:

- simple icon;
- short title;
- one-sentence explanation;
- optional primary action.

Example:

```text
Todavía no hay productos
Registra el primer producto que hayas probado.
[Crear producto]
```

## 26. Loading and errors

Use:

- dark skeletons matching final layout;
- small activity indicators for local actions;
- disabled submit button while saving;
- clear retry option;
- field-level form errors;
- non-technical user messages;
- technical error logging only in development.

## 27. Accessibility

- sufficient contrast;
- 44–48 minimum touch target;
- labels for icons;
- rating not communicated only through color;
- readable scaling;
- meaningful image descriptions where applicable;
- no crucial information hidden only in overlays.

## 28. Implementation tokens

Create centralized theme files rather than repeating literals.

Planned structure:

```text
constants/theme/colors.ts
constants/theme/spacing.ts
constants/theme/radii.ts
constants/theme/typography.ts
constants/theme/index.ts
```

The final exact path may adapt to the existing project structure, but there must be one source of truth.

## 29. Figma boundary

Reproduce:

- palette;
- hierarchy;
- spacing feel;
- rounded components;
- dark form controls;
- bottom navigation;
- modals;
- authentication layout;
- detail/form composition.

Do not copy:

- React DOM components;
- HTML tags;
- Tailwind classes;
- Vite configuration;
- fake mobile frame/status bar;
- in-memory store;
- remote placeholder image behavior;
- web navigation implemented with component state;
- provisional name `sabor.io`.
