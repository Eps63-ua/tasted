# Tasted — Glossary

## API

A defined way for one program to communicate with another. Supabase exposes APIs that the mobile app uses to read and change allowed data.

## Authentication

The process of proving who the user is, for example through email and password.

## Authorization

The rules deciding what an authenticated user may read or change. In Tasted, authorization is primarily enforced with RLS.

## Catalog

Shared establishment and product records that multiple users may reference.

## Component

A reusable React Native piece of interface, such as a button, card, rating input, or screen section.

## Constraint

A database rule that rejects invalid data, such as a rating above 5 or a duplicate user-product entry.

## CRUD

Create, Read, Update, Delete. A shorthand for the basic operations around an entity.

## Diary entry

The personal relationship between one user and one product. It contains rating, review, favorite state, categories, price, and date.

## Environment variable

Configuration read by the app from the environment. `.env` holds local values and is not committed.

## Expo

The framework and toolchain used to build and run the React Native application.

## Expo Go

The Android application currently used to load the development project by scanning a QR code.

## Expo Router

File-based navigation: route files under `app/` define screens and navigation structure.

## Foreign key

A database field that points to another table's row, for example `products.establishment_id`.

## Migration

A versioned SQL file that changes the database schema in a reproducible way.

## MVP

Minimum Viable Product: the smallest complete version that solves the main problem well.

## Query

A request to read or modify data. In PostgreSQL this is expressed in SQL; in the app it is usually called through Supabase's client.

## RLS

Row Level Security. PostgreSQL rules that determine which rows each user may read or modify.

## RPC

A database function called remotely through Supabase. Useful for safe transactional operations involving several tables.

## Shared data

Data intended to be referenced by multiple users, such as products and establishments.

## Personal data

Data owned by one user, such as categories, favorites, ratings, and private reviews.

## Storage bucket

A Supabase Storage container for files such as avatars and product images.

## TanStack Query

A library planned for fetching, caching, invalidating, and representing server data in the app.

## Transaction

A group of database operations that either all succeed or all fail, avoiding partially created records.

## TypeScript

JavaScript with static types. It helps detect mistakes before the app runs.

## Validation

Checking that data follows rules before it is accepted. Tasted validates both in the app and in PostgreSQL.

## Working tree

The current files on the computer, including edits not yet committed to Git.
