// @ts-ignore 
import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";
// @ts-ignore 
import { load } from "https://deno.land/std@0.168.0/dotenv/mod.ts";

// Load environment variables
const env = await load();
const PROJECT_REF = env["VITE_SUPABASE_URL"]?.match(/https:\/\/(.*?)\.supabase\.co/)?.[1];
const ANON_KEY = env["VITE_SUPABASE_ANON_KEY"];

if (!PROJECT_REF || !ANON_KEY) {
  throw new Error("Missing required environment variables");
}

const BASE_URL = `https://${PROJECT_REF}.supabase.co/functions/v1/retell-agent`;

interface RetellResponse {
  llmId: string;
  agentId: string;
}
// @ts-ignore 
Deno.test({
  name: "Retell Agent API Integration Tests",
  async fn(t) {
    let llmId: string;
    let agentId: string;

    await t.step("POST - Create LLM and Agent", async () => {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "You are a helpful AI assistant who specializes in technology discussions.",
        }),
      });

      console.log('POST Response Status:', response.status);
      const responseText = await response.text();
      console.log('POST Response Body:', responseText);

      assertEquals(response.status, 200);
      const data = JSON.parse(responseText) as RetellResponse;
      assertExists(data.llmId);
      assertExists(data.agentId);
      
      llmId = data.llmId;
      agentId = data.agentId;
      
      console.log("Created resources:", { llmId, agentId });
    });

    // Add delay before deletion to ensure resources are fully created
    await new Promise(resolve => setTimeout(resolve, 2000));

    await t.step("DELETE - Clean up resources", async () => {
      // Delete agent first
      const agentResponse = await fetch(BASE_URL, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      console.log('DELETE Agent Response:', {
        status: agentResponse.status,
        body: await agentResponse.text()
      });

      assertEquals(agentResponse.status, 200);

      // Delete LLM second
      const llmResponse = await fetch(BASE_URL, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ llmId }),
      });

      console.log('DELETE LLM Response:', {
        status: llmResponse.status,
        body: await llmResponse.text()
      });

      assertEquals(llmResponse.status, 200);
      
      console.log("Cleanup successful");
    });
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
