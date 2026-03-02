# ADR 001: Core Tech Stack Selection

**Status:** Accepted
**Date:** 2026-03-02

## Context
We need to rapidly develop a Sandbox application that allows users to submit React components and generate OpenAPI specifications via a backend service. The architecture must be secure, type-safe, and easily maintainable, demonstrating production-readiness for a modern developer tooling environment.

## Decision
We have selected the following stack:
* **Frontend:** React + Vite + TypeScript. Provides rapid local development and strict type safety out of the box.
* **Styling:** Tailwind CSS v4. Delivers utility-first styling with the modern Vite plugin integration, removing the need for legacy PostCSS configuration.
* **Backend & Auth:** Supabase. Provides a managed PostgreSQL database, secure magic-link authentication, Row Level Security (RLS), and the Edge Functions required for the OpenAPI generation.

## Consequences
* **Positive:** Drastically reduced boilerplate; out-of-the-box secure auth; strict typing prevents runtime errors before PRs are merged.
* **Negative:** Vendor lock-in with Supabase for Auth and Edge Function APIs, though the underlying PostgreSQL database remains highly portable.