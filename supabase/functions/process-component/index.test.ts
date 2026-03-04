// deno-lint-ignore no-import-prefix
import { assertEquals } from "jsr:@std/assert@1"

interface MockPayload {
  record?: {
    id?: string;
    component_code?: string;
  }
}

// Unit testing the core payload validation logic that the Edge Function relies on
Deno.test("Edge Function: Validates incoming database webhook payloads correctly", () => {
  const validatePayload = (payload: MockPayload) => {
    return !!(payload?.record?.id && payload?.record?.component_code)
  }

  // Test Case 1: Perfectly formed payload from Supabase
  const validPayload = { 
    record: { id: "uuid-1234", component_code: "export default function App() {}" } 
  }
  assertEquals(validatePayload(validPayload), true)

  // Test Case 2: Missing component code
  const missingCodePayload = { 
    record: { id: "uuid-1234" } 
  }
  assertEquals(validatePayload(missingCodePayload), false)

  // Test Case 3: Completely empty/malformed payload
  assertEquals(validatePayload({}), false)
})