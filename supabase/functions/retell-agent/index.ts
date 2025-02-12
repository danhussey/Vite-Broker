// @ts-ignore 
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore 
const RETELL_API_KEY = Deno.env.get('RETELL_API_KEY')
if (!RETELL_API_KEY) {
  throw new Error('Missing RETELL_API_KEY environment variable')
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS'
}

async function makeRetellRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RetellAI API error (${response.status}): ${errorText}`);
    }

    // For DELETE requests, just return success status
    if (options.method === 'DELETE') {
      return { success: true };
    }

    // For other requests, parse JSON
    return await response.json();
  } catch (error) {
    console.error(`RetellAI request failed for ${url}:`, error);
    throw new Error(`RetellAI request failed: ${error.message}`);
  }
}

serve(async (req) => {
  console.log('Request URL:', req.url);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method === 'DELETE' && req.url.includes('/delete-phone/')) {
    try {
      // Extract phone number from URL
      const phoneNumber = req.url.split('/delete-phone/')[1];
      if (!phoneNumber) {
        return new Response(
          JSON.stringify({ error: 'Phone number is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Deleting phone number:', phoneNumber);
      await makeRetellRequest(`https://api.retellai.com/delete-phone-number/${phoneNumber}`, {
        method: 'DELETE'
      });

      return new Response(
        JSON.stringify({ message: `Phone number ${phoneNumber} deleted successfully` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error deleting phone number:', error);
      return new Response(
        JSON.stringify({ error: `Error deleting phone number: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (req.method === 'POST' && (req.url.endsWith('/create-phone') || req.url.endsWith('/retell-agent/create-phone'))) {
    console.log('Handling create-phone request');
    try {
      const { area_code, inbound_agent_id, outbound_agent_id, nickname } = await req.json();
      console.log('Request body:', { area_code, inbound_agent_id, outbound_agent_id, nickname });
      
      // Only validate area_code if it's provided
      if (area_code !== undefined && (typeof area_code !== 'number' || area_code.toString().length !== 3)) {
        return new Response(
          JSON.stringify({ error: 'If area_code is provided, it must be a 3-digit number.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      try {
        const phoneData = await makeRetellRequest('https://api.retellai.com/create-phone-number', {
          method: 'POST',
          body: JSON.stringify({
            area_code,
            inbound_agent_id,
            outbound_agent_id,
            nickname
          })
        });

        console.log('Retell API response:', phoneData);
        return new Response(
          JSON.stringify(phoneData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Retell API error:', error);
        return new Response(
          JSON.stringify({ error: `Error from Retell API: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(
        JSON.stringify({ error: `Error processing request: ${error.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  try {
    const body = await req.json().catch(() => ({}));
    console.log('Request received:', { method: req.method, body });

    if (req.method === 'POST' && body.prompt) {
      // First create the Retell LLM
      const llmData = await makeRetellRequest('https://api.retellai.com/create-retell-llm', {
        method: 'POST',
        body: JSON.stringify({
          model: "claude-3.5-sonnet",
          general_prompt: body.prompt,
          general_tools: [
            {
              type: "end_call",
              name: "end_call",
              description: "End the call with user."
            }
          ]
        })
      });

      console.log('LLM created:', llmData);

      // Then create the agent using the LLM ID
      const agentData = await makeRetellRequest('https://api.retellai.com/create-agent', {
        method: 'POST',
        body: JSON.stringify({
          agent_name: "AI Assistant",
          response_engine: {
            type: "retell-llm",
            llm_id: llmData.llm_id
          },
          voice_id: "11labs-Adrian",
          voice_model: "eleven_turbo_v2",
          voice_speed: 1.0,
          language: "en-US",
          normalize_for_speech: true,
          enable_transcription_formatting: true
        })
      });

      console.log('Agent created:', agentData);

      return new Response(
        JSON.stringify({
          llmId: llmData.llm_id,
          agentId: agentData.agent_id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (req.method === 'DELETE') {
      if (body.agentId) {
        // Delete the agent
        const deleteAgentResponse = await makeRetellRequest(`https://api.retellai.com/delete-agent/${body.agentId}`, {
          method: 'DELETE'
        });

        console.log('Agent deleted:', deleteAgentResponse);

        return new Response(
          JSON.stringify({ success: true, message: 'Agent deleted successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (body.llmId) {
        // Delete the LLM
        const deleteLlmResponse = await makeRetellRequest(`https://api.retellai.com/delete-retell-llm/${body.llmId}`, {
          method: 'DELETE'
        });

        console.log('LLM deleted:', deleteLlmResponse);

        return new Response(
          JSON.stringify({ success: true, message: 'LLM deleted successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Missing required field: agentId or llmId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
