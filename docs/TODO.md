# Project TODOs & Future Iterations

## High Priority
- [ ] **Interactive Props Injection:** Map the AI-generated OpenAPI schemas to a dynamic UI form, allowing users to inject live props into the `ComponentPreview` sandbox.
- [ ] **Tailwind JIT Mitigation:** Implement a robust solution (such as iframe isolation with the Tailwind CDN) so dynamically applied state classes (e.g., `hover:bg-green-600`) render correctly in the browser.
- [ ] **Live Code Editor:** Add a toggle in the UI to allow users to edit the raw React component string and watch the sandbox re-render in real-time.

## Backlog
- [ ] Expand the `ComponentPreview` scope registry to support additional external libraries dynamically.
- [ ] Implement error boundary logging to track which user-uploaded components fail to transpile.