# TEMPO-API-SANDBOX

## Overview
TEMPO-API-SANDBOX is an advanced developer tool for interactively prototyping, inspecting, and managing React components. It provides a "what-you-see-is-what-you-get" (WYSIWYG) experience by dynamically rendering component strings in the browser. The platform features an AI-driven pipeline that automatically reverse-engineers OpenAPI specifications from your components, with real-time UI updates to reflect the process. All components, metadata, and associated assets are securely stored using Supabase's hybrid storage solution.

## Key Features
*   **Live Component Execution:** Dynamically transpiles and renders raw React component strings in the browser using `@babel/standalone`. This provides an instant, isolated preview without a build step.
*   **AI-Generated OpenAPI Specs:** An event-driven backend process, powered by Supabase Edge Functions, asynchronously analyzes components and uses AI to generate OpenAPI schemas.
*   **Real-time UI Updates:** Leverages Supabase Realtime with PostgreSQL's Change Data Capture (CDC) to update the UI instantly when background jobs (like AI spec generation) are complete. No page refresh needed.
*   **Visual API Inspector:** An IDE-like slide-over panel allows users to inspect component metadata, view the generated OpenAPI schema, and see a preview of associated assets.
*   **Secure Hybrid Storage:** Utilizes Supabase Storage for large assets like reference images and a PostgreSQL database with Row Level Security (RLS) for structured metadata, ensuring data is both scalable and secure.
*   **Robust & Type-Safe:** Built with TypeScript and Vite for a fast, modern development experience with type safety enforced across the stack.

## Technical Stack
*   **Frontend:** React, Vite, TypeScript, Tailwind CSS v4
*   **Live Rendering:** `@babel/standalone`
*   **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Realtime)
*   **Serverless Functions:** Supabase Edge Functions (Deno)
*   **UI Components:** Lucide Icons

## Architectural Decisions
This project's architecture is the result of deliberate, documented decisions. For a deeper dive into the technical trade-offs and choices, please see the Architectural Decision Records (ADRs) in the `docs/adr` directory:
*   **ADR 001:** [Core Tech Stack Selection](docs/adr/001-stack-selection.md)
*   **ADR 002:** [Persistence Strategy for Component Metadata and Assets](docs/adr/002-persistence-strategy.md)
*   **ADR 003:** [Database and Storage Refinement](docs/adr/003-database-schema-fixes.md)
*   **ADR 004:** [Event-Driven Backend via Edge Functions](docs/adr/004-event-driven-edge-functions.md)
*   **ADR 005:** [Real-time OpenAPI Spec Updates](docs/adr/005-real-time-openapi-updates.md)
*   **ADR 006:** [Visual API Inspector & Robust JSON Parsing](docs/adr/006-visual-api-inspector.md)
*   **ADR 007:** [Live Component Rendering Engine](docs/adr/007-live-component-rendering.md)

## Future Work
Known limitations and planned features are tracked in [`docs/TODO.md`](docs/TODO.md). Key upcoming tasks include mitigating Tailwind's JIT limitations for runtime-generated classes and expanding the AI pipeline's capabilities.

## Getting Started

### Prerequisites
- Node.js and npm
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Setup Instructions
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd TEMPO-API-SANDBOX
    ```

2.  **Set up Supabase:**
    - Start the local Supabase services:
      ```bash
      supabase start
      ```
    - The CLI will output your local Supabase credentials (API URL, anon key, service role key).

3.  **Configure Environment Variables:**
    - Create a `.env.local` file in the root directory.
    - Add your Supabase URL and anon key to the `.env.local` file. It should look like this:
      ```
      VITE_SUPABASE_URL=your-local-supabase-url
      VITE_SUPABASE_ANON_KEY=your-local-supabase-anon-key
      ```

4.  **Install Dependencies:**
    ```bash
    npm install
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).