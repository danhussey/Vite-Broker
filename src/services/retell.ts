import { supabase } from '../lib/supabase';

interface AgentConfig {
  agentName: string;
  voiceId: string;
  voiceModel: string;
  voiceSpeed?: number;
  language?: string;
}

class RetellService {
  private static instance: RetellService;
  
  private defaultAgentConfig: AgentConfig = {
    agentName: "AI Assistant",
    voiceId: "11labs-Adrian",
    voiceModel: "eleven_turbo_v2",
    voiceSpeed: 1.0,
    language: "en-US"
  };

  private constructor() {}

  static getInstance(): RetellService {
    if (!RetellService.instance) {
      RetellService.instance = new RetellService();
    }
    return RetellService.instance;
  }

  private async validateSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Authentication required');
    }
    return session;
  }

  async createAgent(prompt: string, config?: Partial<AgentConfig>) {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    try {
      const session = await this.validateSession();

      // Log the request payload for debugging
      const requestPayload = {
        prompt,
        ...this.defaultAgentConfig,
        ...config,
        normalize_for_speech: true,
        enable_transcription_formatting: true
      };
      console.log('Creating agent with payload:', requestPayload);

      const { data, error } = await supabase.functions.invoke('retell-agent', {
        body: requestPayload,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      console.log('Response from edge function:', { data, error });

      if (error) {
        throw new Error(`Failed to create agent: ${error.message}`);
      }

      if (!data?.agentId || !data?.llmId) {
        throw new Error('Failed to create agent - missing required data');
      }

      return {
        agentId: data.agentId,
        llmId: data.llmId,
        config: requestPayload
      };

    } catch (error) {
      console.error('RetellService.createAgent error:', error);
      throw error;
    }
  }
}

export const retellService = RetellService.getInstance();
