# ADR 005: Real-time OpenAPI Spec Updates

## Status
Accepted

## Context
The system generates OpenAPI specifications asynchronously using a Supabase Edge Function and the Anthropic API. Because this process can take 5–15 seconds, the frontend needs a way to update the UI automatically once the AI finishes, without requiring the user to refresh the page.

## Decision
We implemented **Supabase Realtime** using PostgreSQL CDC (Change Data Capture). Specifically:
1. Enabled the `supabase_realtime` publication for the `components` table via SQL.
2. Implemented a `useEffect` listener in the React frontend using the `supabase-js` SDK.

## Technical Details
* **Filtered Realtime:** We opted for a **Filtered Realtime** approach using a `user_id` filter (`user_id=eq.${userId}`). 
* **Reasoning:** This ensures that the client only receives updates for their own data. It optimizes performance by reducing unnecessary network traffic and prepares the application for multi-user scaling.
* **Cleanup:** The subscription is properly disposed of in the `useEffect` cleanup phase to prevent memory leaks.

## Consequences
* **Positive:** Improved UX with "instant" feedback once the AI finishes processing.
* **Positive:** Reduced server load compared to "polling" the database.
* **Negative:** Slight increase in WebSocket connections, which is handled by Supabase's infrastructure.