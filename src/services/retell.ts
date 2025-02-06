const RETELL_API_KEY = import.meta.env.VITE_RETELL_API_KEY;

if (!RETELL_API_KEY) {
  throw new Error('Missing RetellAI API key. Please add VITE_RETELL_API_KEY to your .env file.');
}

export class RetellService {
  private static instance: RetellService;
  private baseUrl = 'https://api.retell.ai';

  private constructor() {}

  static getInstance() {
    if (!RetellService.instance) {
      RetellService.instance = new RetellService();
    }
    return RetellService.instance;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${RETELL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const text = await response.text();
        let error;
        try {
          const data = JSON.parse(text);
          error = data.error || data.message || 'RetellAI API request failed';
        } catch {
          error = text || 'RetellAI API request failed';
        }
        throw new Error(error);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to RetellAI. Please check your internet connection.');
        }
        throw new Error(`RetellAI Error: ${err.message}`);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createAgent(prompt: string) {
    if (!prompt) {
      throw new Error('Agent prompt is required');
    }

    return this.request('/create-agent', {
      method: 'POST',
      body: JSON.stringify({
        response_engine: {
          type: 'retell-llm',
          llm_id: 'gpt-4',
          prompt
        },
        voice_id: 'nova',
        agent_name: 'Mortgage Assistant'
      })
    });
  }

  async createPhoneNumber(agentId: string) {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }

    return this.request('/create-phone-number', {
      method: 'POST',
      body: JSON.stringify({
        area_code: '415',
        inbound_agent_id: agentId,
        nickname: 'Mortgage Support Line'
      })
    });
  }

  async deleteAgent(agentId: string) {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }

    return this.request(`/delete-agent/${agentId}`, {
      method: 'DELETE'
    });
  }

  async getAgent(agentId: string) {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }

    return this.request(`/get-agent/${agentId}`);
  }
}

export const retellService = RetellService.getInstance();