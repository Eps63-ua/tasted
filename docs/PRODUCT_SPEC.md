# Tasted — Product specification

## 1. Product summary

Tasted is a personal Android diary for food and drink products.

Users manually register only the products they have bought or tried. Tasted is not intended to import or maintain the complete catalog of a supermarket or restaurant.

Examples:

- a specific cheese bought at Mercadona;
- chicken gyozas from a supermarket;
- pistachio ice cream from an ice-cream shop;
- a hamburger from a restaurant;
- a seasonal drink from a café.

The experience combines:

- a personal diary;
- star ratings and written reviews;
- a manually created catalog;
- flexible personal organization through categories;
- fast cumulative search.

## 2. Target user

The MVP is designed for one main personal user, but the data model must safely support multiple accounts later.

The user wants to:

- remember what they tried;
- know where it came from;
- record whether they liked it;
- find previous products quickly;
- compare products inside personal categories;
- keep favorite products;
- use the app directly on Android.

## 3. Core concepts

### 3.1 Shared establishment

An establishment is the place associated with products.

Examples:

- Mercadona;
- Lidl;
- a named restaurant;
- a named bakery;
- a named ice-cream shop.

Establishments belong to the shared catalog. The user who creates one is recorded as its creator.

For the MVP, a supermarket chain such as Mercadona may be represented as one establishment without modeling every branch. A specific independent restaurant may include an address.

### 3.2 Shared product

A product is the general item that can be evaluated by different users.

Example:

```text
Product: Queso A
Establishment: Mercadona
```

A shared product does not contain a single global favorite or a single user's rating.

For the MVP, a product belongs to exactly one establishment. The same commercial item at a different establishment may be registered as a different product until a future cross-store catalog model is justified.

### 3.3 Personal diary entry

A diary entry is the relationship between one user and one shared product.

It stores the user's:

- rating;
- written review;
- favorite state;
- price paid;
- currency;
- date tried;
- visibility setting;
- personal categories.

There may be at most one active diary entry per user and product in the MVP.

Internally the database entity is named `user_product_entries`, because it represents more than a written review.

### 3.4 Personal category

Categories are created and owned by each user.

Examples:

- Quesos;
- Pan;
- Bebidas;
- Comida asiática;
- Gyozas;
- Gyozas de pollo.

A category may have a parent category. Users may organize the same product differently without affecting each other.

Categories do not belong to establishments.

## 4. Shared catalog versus personal data

### Shared

- establishment identity;
- establishment type and general details;
- establishment photos;
- product identity;
- product brand and general description;
- product photos;
- the creator of each catalog record.

### Personal

- diary membership;
- rating;
- review text;
- favorite state;
- price paid;
- date tried;
- categories;
- profile details that are not intentionally public.

## 5. Product creation flow

The user perceives one form, but the app performs several logical steps.

### 5.1 Choose the establishment

The user may:

- select an existing establishment;
- search establishments;
- create a new establishment without losing the product form.

### 5.2 Search for possible duplicate products

As the user enters a product name and brand, the app searches products in the selected establishment.

Possible result:

```text
We found a similar product
Queso A — Mercadona

[Add my rating]
[Create a different product]
```

Duplicate matching is advisory. The user may create a distinct product when the suggestions are incorrect.

### 5.3 Existing product

If the product already exists, the app creates only the user's personal diary entry and its category relations.

### 5.4 New product

If the product does not exist, the app creates:

1. the shared product;
2. its initial shared image data;
3. the creator's personal diary entry;
4. the creator's category assignments.

The operation should be transactional so a failure does not leave a half-created record.

## 6. Rating rules

Allowed ratings:

```text
0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
```

A rating is required when a product is added to the diary in the MVP.

The app must display a clear half-star interaction and a numeric value for accessibility.

A product's shared average rating is not stored directly in the product row. It is calculated from eligible entries through a query or database view when public/social behavior is introduced.

## 7. Favorites

Favorite state belongs to the user's diary entry.

Marking a product as favorite never changes another user's data.

The MVP requires an existing diary entry before a product can be marked as favorite.

## 8. Category hierarchy and filtering

A category may contain subcategories.

Example:

```text
Comida asiática
└── Gyozas
    └── Gyozas de pollo
```

Rules:

- categories are private to their owner;
- a category cannot use itself as parent;
- category cycles are forbidden;
- a category cannot use another user's category as parent;
- the UI should support at least three levels comfortably;
- the database may support deeper nesting;
- selecting a parent category in search includes descendants by default.

A diary entry may have multiple categories.

When multiple category filters are selected, the product must match all selected category branches using AND semantics.

Example:

```text
Mercadona + Quesos + Favoritos + rating >= 4
```

returns only the current user's favorite Mercadona cheese entries rated at least four stars.

## 9. Search scope

The main Search tab is personal-first.

It searches the current user's diary and related data:

- product name;
- brand;
- establishment name;
- personal categories;
- review text when useful.

The creation flow separately searches the shared catalog to avoid duplicate products.

A future version may add a clear distinction between:

- My diary;
- Shared catalog;
- Recommendations.

That distinction is outside the MVP.

## 10. Cumulative filters

Supported MVP filters:

- free text;
- result type: all, products, establishments, categories;
- one or more establishments;
- one or more categories;
- minimum rating;
- favorites only;
- date range or recent-first ordering;
- alphabetical ordering;
- highest-rated ordering.

Active filters appear as removable chips. A single action clears all filters.

## 11. Home screen

The Home tab contains compact horizontal sections.

Initial sections:

1. Recent establishments.
2. Recently added products.
3. Favorites or top-rated products.

Product cards:

- square image;
- rating overlaid in a dark capsule;
- optional favorite icon;
- no large text block below the image.

Establishment cards:

- image-first;
- optional name overlaid at the bottom;
- no long description.

The MVP does not display algorithmic recommendations. With one user and a small manually created catalog, useful initial sections are recents, favorites, and top-rated items.

## 12. Main navigation

Bottom tabs:

1. Home.
2. Search.
3. Create.
4. Profile.

Secondary screens use stack navigation and a back action.

## 13. Create tab

The Create tab offers three clear actions:

- Create product.
- Create establishment.
- Create category.

Creating a product is visually emphasized as the primary action.

## 14. Product detail

The product detail screen shows two visually distinct areas.

### Shared product information

- image gallery;
- product name;
- brand;
- establishment link;
- general description.

### My diary information

- my rating;
- favorite state;
- my categories;
- my review;
- price paid;
- date tried;
- edit action;
- remove-from-diary action.

A creator-only edit action for shared product information may be shown when authorized.

## 15. Establishment detail

- cover image and gallery;
- name;
- type;
- address or location text when relevant;
- website when relevant;
- description;
- products associated with the establishment;
- add product action;
- creator-only shared edit action;
- safe delete behavior.

## 16. Category detail

- image or visual placeholder;
- category name;
- parent category;
- child categories;
- current user's matching products;
- edit action;
- safe delete action.

## 17. Profile

- avatar;
- display name;
- username;
- email from authentication;
- optional biography;
- product, establishment, and category counts;
- favorites shortcut;
- edit profile;
- sign out.

## 18. Authentication

MVP:

- email and password registration;
- email and password login;
- password recovery;
- session persistence;
- protected app routes;
- logout.

Social login is not part of the MVP.

## 19. Image behavior

MVP requirements:

- product images;
- establishment images;
- category image optional;
- profile avatar;
- choose from Android gallery;
- visible upload progress or loading state;
- image validation;
- safe retry behavior;
- cover image selection where relevant.

Camera capture may be added after gallery selection works reliably.

## 20. Create, view, and edit consistency

View, create, and edit screens should share layout and components where practical.

Examples:

- `ProductForm` is reused for create and edit modes;
- display components use the same field order as the form;
- destructive actions remain outside the normal save controls;
- the user receives explicit confirmation before deletion.

## 21. Deletion behavior

### Remove a product from my diary

Deletes the current user's diary entry and category assignments. It does not delete another user's data.

### Delete a shared product

Allowed only through a reviewed safe operation when:

- the requester is authorized;
- no other user depends on the product;
- associated images can be handled safely.

Otherwise the app must block deletion.

### Delete an establishment

Blocked while products still reference it.

### Delete a category

Blocked while it has child categories unless they are reassigned or removed. The UI must show the impact before deletion.

## 22. Loading, empty, error, and success states

Every data screen must define:

- loading;
- empty;
- error;
- success;
- retry behavior where applicable.

Forms must prevent duplicate submissions and display field-level validation.

## 23. MVP scope

Included:

- authentication and profile;
- establishments;
- products;
- one personal entry per product;
- ratings and reviews;
- favorites;
- personal hierarchical categories;
- photos;
- Home sections;
- cumulative search;
- edit and safe delete flows;
- Android installation/testing path;
- documented Supabase schema and RLS.

Not included:

- followers;
- comments;
- likes on reviews;
- public activity feed;
- direct messaging;
- complete retailer catalog imports;
- barcode scanning;
- OCR ticket import;
- maps;
- AI recommendations;
- offline-first synchronization;
- iOS-specific release work;
- web application.

## 24. Future possibilities

- multiple tasting entries for the same product over time;
- public reviews and social profiles;
- recommendations;
- product comparison;
- personal statistics;
- barcode scanning;
- receipt import;
- location branches;
- local cache and offline queue;
- shareable review cards.

Future features must not complicate the MVP until the current roadmap is complete.
