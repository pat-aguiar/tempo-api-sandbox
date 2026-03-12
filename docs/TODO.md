# Project Roadmap & Technical Debt

This document outlines the known limitations of the current implementation, tracks planned features, and maintains a backlog of future enhancements.

---

## ✅ Recently Completed

*   **[Feature] Live Code Editor with Debouncing**
    *   **Status:** Implemented in `ApiInspector.tsx`.
    *   **Details:** The inspector panel now includes a "Code" tab with a textarea for live editing. A 1000ms debounce is used to update the `ComponentPreview`, providing real-time feedback on changes.

---

## 🛑 Known Limitations

This section documents existing constraints and potential risks that should be acknowledged and addressed.

*   **[Security] Insecure Use of `new Function` for Code Execution**
    *   **Issue:** The live render engine uses the `new Function` constructor to execute code strings from the database. This is a significant security vulnerability, as a malicious component could execute arbitrary JavaScript in the user's browser, leading to Cross-Site Scripting (XSS) attacks.
    *   **Mitigation:** The execution scope must be properly sandboxed. This could involve running the component in a Web Worker or a secure iframe with a strict Content Security Policy (CSP) and limited API access.

*   **[Performance] In-Browser Transpilation Overhead**
    *   **Issue:** `@babel/standalone` transpiles JSX and TypeScript in the browser on every render. For complex components or a large number of components, this can lead to noticeable UI lag and a poor user experience.
    *   **Mitigation:** Explore moving transpilation to a serverless function as part of the component ingestion pipeline, storing the compiled JavaScript directly in the database.

*   **[Functionality] Lack of Dynamic Dependency Support**
    *   **Issue:** The sandbox scope is currently hardcoded to include only `React` and `lucide-react`. Components that import other libraries (e.g., `framer-motion`, `date-fns`) will fail to render.
    *   **Mitigation:** Develop a system to detect imports and dynamically fetch them from a CDN like ESM.sh.

*   **[Rendering] Tailwind CSS JIT Engine Cannot See Dynamic Classes**
    *   **Issue:** As documented in ADR-007, Tailwind's Just-In-Time compiler generates CSS at build time. It cannot generate styles for classes that are applied dynamically at runtime within a rendered component (e.g., a button changing color on click).
    *   **Mitigation:** Investigate using the Tailwind CDN within a sandboxed iframe or implementing a "safelist" generator in the build process to include potentially dynamic classes.

*   **[Rendering] No Support for Asynchronous Operations in Components**
    *   **Issue:** The current rendering logic is synchronous. A component that contains an asynchronous operation, like a `fetch` call in a `useEffect` hook, may not render correctly or could cause unexpected behavior in the preview environment.
    *   **Mitigation:** The rendering engine needs to be adapted to handle async component patterns, potentially by mocking async functions or providing a controlled data-fetching environment.

---

## 🗺️ High-Priority Roadmap

These are the next key features to be implemented.

*   **[Feature] Interactive Prop Injection UI**
    *   **Goal:** Allow users to edit component props in real-time.
    *   **Plan:** Use the AI-generated OpenAPI schema to dynamically build a UI form. The values from this form will be passed as props to the live-rendered component, providing a true interactive playground.

---

## 📚 Future Enhancements (Backlog)

Ideas and lower-priority tasks for future development cycles.

*   **[Observability] Error Boundary Logging**
    *   **Goal:** Track and analyze component rendering errors.
    *   **Plan:** Implement a logging service (e.g., Supabase Tables, Logflare) that captures errors caught by the `ErrorBoundary` in `ComponentPreview`. This will help identify common issues with user-submitted components.

*   **[Backend] Component Versioning**
    *   **Goal:** Allow users to save multiple versions of a component.
    *   **Plan:** Update the database schema to support version history for `component_code`. The UI would need a mechanism to view and revert to previous versions.

*   **[Feature] Shareable Component Previews**
    *   **Goal:** Allow users to share a link to a specific component's sandbox.
    *   **Plan:** Implement a unique URL route for each component ID that loads a read-only view of the component preview and its API inspector.