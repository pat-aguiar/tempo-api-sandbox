# ADR 003: Database and Storage Refinement

## Status
Accepted

## Context
During the implementation of the component submission feature, three infrastructure issues were identified:
1. A unique constraint violation occurred (`components_pkey`) because `user_id` was acting as the primary key.
2. The UI failed to render the submission history because it expected to sort by a missing `created_at` column.
3. Uploaded reference images rendered as broken links because the storage bucket lacked public read access.

## Decision
- **Primary Key:** Added a dedicated `id` column using the `uuid` type with `gen_random_uuid()` as the default generator.
- **Foreign Key:** The `user_id` column remains a standard column referencing `auth.users`, enabling a one-to-many relationship.
- **Metadata:** Added a `created_at` column with a `timestamptz` type and `now()` default to support chronological sorting.
- **Storage Policy:** Updated the `component_images` bucket settings to "Public" to allow the frontend to resolve image URLs.

## Consequences
- Resolves duplicate key submission bugs.
- Enables the frontend to correctly fetch and order user submission history.
- Allows seamless rendering of visual assets in the UI without complex signed URLs.