# ADR 007: Live Component Rendering Engine

## Status
Accepted

## Context
The application stores React components as raw strings in the database. To provide a "WYSIWYG" (What You See Is What You Get) experience, the frontend must execute this string as a live React component without relying on a traditional build cycle or external iframe services.

## Decision
We implemented a **Scoped Function Execution** model using `@babel/standalone` and the `new Function` constructor. 
1. The raw string is cleaned of `import`/`export` statements via Regex.
2. Babel transpiles the JSX and TypeScript into standard JavaScript executable by the browser.
3. We inject a strict, safe scope (providing `React`, standard hooks, and `lucide-react`) to resolve dependencies dynamically.

## Technical Details
* **Transpilation:** Configured Babel with `['react', 'typescript']` presets to handle complex component signatures.
* **Event Isolation:** Used `e.stopPropagation()` on the preview wrapper to prevent internal component clicks (like toggling a button) from triggering the parent card's API Inspector drawer.
* **Agnostic Sandbox:** Removed hardcoded mock props. Components are now rendered universally; if a component expects props, it naturally falls back to its `undefined` or default state.

## Consequences
* **Positive:** Achieved a true, dynamic Live Render environment natively within the app.
* **Negative (Limitation):** Tailwind CSS JIT compiler cannot process dynamic classes added at runtime (e.g., a button turning green on click), requiring future mitigation (like safelisting or CDN injection).