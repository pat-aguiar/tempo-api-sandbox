// deno-lint-ignore-file no-import-prefix
import "jsr:@supabase/functions-js@2/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Process-component edge function initialized.");

Deno.serve(async (req) => {
  try {
    // 1. Parse the Webhook Payload from Supabase Database
    const payload = await req.json();
    const record = payload.record;

    if (!record || !record.id || !record.component_code) {
      return new Response(
        JSON.stringify({ error: "Invalid payload or missing component data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Processing newly uploaded component ID: ${record.id}`);

    // 2. Simulate API Spec Generation (AI integration placeholder)
    // Generating a JSON object to represent the OpenAPI spec
    const generatedSpec = {
      openapi: "3.0.0",
      info: {
        title: "Sandbox Component API",
        version: "1.0.0",
        description:
          "Auto-generated API specification for the uploaded React component.",
      },
      paths: {
        "/component": {
          get: {
            summary: "Retrieve component render state",
            responses: {
              "200": { description: "Successful render" },
            },
          },
        },
      },
    };

    // 3. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Critical Configuration Error: Missing Supabase environment variables.",
      );
    }

    // SERVICE_ROLE_KEY to bypass RLS so our backend can safely update the row
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Update the database record with the new spec
    const { error: updateError } = await supabaseAdmin
      .from("components")
      .update({ openapi_spec: generatedSpec })
      .eq("id", record.id);

    if (updateError) throw updateError;

    console.log(
      `Successfully updated component ID: ${record.id} with OpenAPI spec.`,
    );

    return new Response(
      JSON.stringify({ message: "Component processed successfully" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    console.error("Critical error in edge function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
