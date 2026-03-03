# ADR 002: Persistence Strategy for Component Metadata and Assets

**Status:** Accepted
**Date:** 2026-03-03

## Context
The application needs to store two distinct types of data:
1. Large binary files (reference images uploaded by users).
2. Structured metadata (React component code and eventually OpenAI/Claude-generated specifications).

## Decision
We will use a hybrid persistence approach using Supabase:
- **Supabase Storage:** Files will be stored in a non-public bucket named `component_images`. Files will be indexed using UUIDs to prevent filename collisions.
- **Supabase Database (PostgreSQL):** A `components` table will store the relational data and a reference URL to the storage asset.

### Security Implementation
- **Row Level Security (RLS):** Both the storage bucket and the database table will enforce `auth.uid() = owner/user_id`.
- **Relational Integrity:** The `user_id` in the database will be a foreign key to `auth.users` to ensure data remains orphaned-proof.

## Consequences
- **Pros:** High security with minimal backend code; scalable storage for large assets; structured querying for the UI.
- **Cons:** Requires two separate network requests from the client (Upload then Insert), creating a small window for orphaned files if the second request fails (to be mitigated by a cleanup cron job if necessary).