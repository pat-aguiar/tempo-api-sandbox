# ADR 004: Event-Driven Backend via Edge Functions

## Status
Accepted

## Context
The application needs to asynchronously process uploaded React components (e.g., generating OpenAPI specifications) without blocking the user interface or requiring the frontend to wait for long-running AI tasks.

## Decision
- We will use **Supabase Edge Functions (Deno)** instead of a traditional long-running Node.js server.
- The functions will be triggered by **Database Webhooks** (listening for `INSERT` events on the `components` table).
- The function will use the `SERVICE_ROLE_KEY` to bypass Row Level Security (RLS) when writing the generated specifications back to the database.

## Consequences
- **Pros:** Zero server maintenance, infinite auto-scaling, and decoupled architecture (frontend doesn't wait for backend processing).
- **Cons:** Introduces a secondary runtime (Deno) alongside the frontend (Node.js), requiring separate testing paradigms and IDE configurations.