# AI Component Sandbox & Live Render Engine

## Overview
This project is an advanced developer tool that allows users to store, inspect, and execute raw React components dynamically. It features an AI-driven pipeline that automatically reverse-engineers OpenAPI specifications from uploaded code, paired with a custom in-browser execution engine.

## Key Features
* **Live Component Execution:** Dynamically transpiles and renders raw React string payloads in the browser using `@babel/standalone` and a scoped `new Function` constructor.
* **AI-Generated OpenAPI Schemas:** Integrates with Supabase Edge Functions and AI to automatically extract property contracts, default values, and prop types from prop-less components.
* **Interactive Code Playground:** Features a built-in code editor with 500ms debouncing and React Error Boundaries to prevent runtime crashes during live editing.
* **Event Bubbling Isolation:** Custom event handling to separate live component interactions from the application's UI state.

## Technical Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons
* **Execution Engine:** `@babel/standalone`
* **Backend:** Supabase (PostgreSQL), Supabase Edge Functions (Deno)

## Architecture Decisions
Key architectural choices are documented in the `docs/adr` directory:
* **[ADR 007: Live Component Rendering Engine](docs/adr/007-live-component-rendering.md):** Details the decision to use a Scoped Function Execution model over traditional iframes to provide a seamless WYSIWYG experience.

## Future Iterations
Known limitations and planned features are tracked in [`docs/TODO.md`](docs/TODO.md), including mapping the AI-generated schemas to dynamic UI controls and mitigating Tailwind CSS JIT compiler limitations for runtime classes.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install frontend dependencies.
3. Configure your Supabase environment variables in a `.env` file.
4. Run `npm run dev` to start the local development server.