// deno-lint-ignore-file no-import-prefix
import "jsr:@supabase/functions-js@2/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // 1. Environment & Setup
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Parse Webhook Payload
    const { record } = await req.json();
    const { id, component_code } = record;

    if (!id || !component_code) {
      throw new Error("Missing ID or Component Code in payload.");
    }

    console.log(
      `[ID: ${id}] Initializing Claude 4.6 for OpenAPI Generation...`,
    );

    // 3. AI Request (Claude 4.6 Compliant)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", // 2026 Production Standard
        max_tokens: 2048,
        system: `You are an OpenAPI 3.0.0 architect. 
        Analyze the React code and return a valid JSON OpenAPI spec.
        REQUIREMENTS:
        1. Define the props in 'components/schemas'.
        2. Create a 'POST /render' path.
        3. The 'POST /render' requestBody must use a $ref pointing to your component props schema.
        4. Output ONLY the JSON object. No markdown, no prose.`,
        messages: [
          {
            role: "user",
            content:
              `Generate a JSON OpenAPI 3.0.0 spec for the following component: \n\n${component_code}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API Error: ${response.status} - ${errorText}`);
    }

    const aiResult = await response.json();
    const rawContent = aiResult.content[0].text;
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

    // 4. Validate and Parse JSON
    if (!jsonMatch) {
      throw new Error("No valid JSON object found in AI response");
    }

    let generatedSpec;
    try {
      generatedSpec = JSON.parse(jsonMatch[0]);
    } catch (_parseError) {
      console.error("Failed to parse AI response as JSON:", jsonMatch[0]);
      throw new Error("AI returned invalid JSON format.");
    }

    console.log(`[ID: ${id}] Generation successful. Saving to Supabase...`);

    // 5. Update Database
    const { error: updateError } = await supabaseAdmin
      .from("components")
      .update({ openapi_spec: generatedSpec })
      .eq("id", id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error occurred";
    console.error("CRITICAL ERROR:", errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
