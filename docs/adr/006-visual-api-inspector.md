# ADR 006: Visual API Inspector & Robust JSON Parsing

## Status
Accepted

## Context
Generated OpenAPI specs were previously invisible to the user. Additionally, raw AI responses occasionally included conversational text, causing JSON parsing failures in the Edge Function.

## Decision
1. **UI:** Implemented a Slide-over "Inspector" Panel to visualize component metadata and schemas.
2. **Logic:** Added Regex-based JSON extraction in the Edge Function to isolate the OpenAPI object from any surrounding AI commentary.

## Technical Details
* **UI Pattern:** Side Drawer (using Tailwind and Lucide-react).
* **Regex Extraction:** Used `\{[\s\S]*\}` to ensure the Edge Function only attempts to parse valid JSON blocks.
* **Type Safety:** Centralized `SavedComponent` interface in `src/lib/types.ts`.

## Consequences
* **Positive:** Drastically increased pipeline reliability for "chatty" AI models.
* **Positive:** Professional, IDE-like experience for users exploring components.