import { useState } from 'react';
import { retellService } from '../services/retell';
import { useAgentConfig } from './useAgentConfig';

interface RetellAgentConfig {
  status: 'inactive' | 'deploying' | 'active' | 'error';
  errorMessage: string | null;
  phoneNumber: string | null;
  agentId: string | null;
}

export function useRetellAgent() {
  const [config, setConfig] = useState<RetellAgentConfig>({
    status: 'inactive',
    errorMessage: null,
    phoneNumber: null,
    agentId: null
  });
  const [loading, setLoading] = useState(false);
  const { prompt } = useAgentConfig();

  const deployAgent = async () => {
    if (!prompt) {
      setConfig(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Agent prompt is required. Please configure the prompt first.'
      }));
      return;
    }

    try {
      setLoading(true);
      setConfig(prev => ({
        ...prev,
        status: 'deploying',
        errorMessage: null
      }));

      // Create agent
      const { id: agentId } = await retellService.createAgent(prompt);

      // Wait for agent to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify agent status
      const agentStatus = await retellService.getAgent(agentId);
      if (agentStatus.status !== 'active') {
        throw new Error('Agent failed to initialize');
      }

      // Create phone number
      const { phone_number } = await retellService.createPhoneNumber(agentId);

      setConfig({
        status: 'active',
        errorMessage: null,
        phoneNumber: phone_number,
        agentId: agentId
      });
    } catch (err) {
      console.error('Error deploying RetellAI agent:', err);
      setConfig(prev => ({
        ...prev,
        status: 'error',
        errorMessage: err instanceof Error ? err.message : 'Failed to deploy agent'
      }));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const stopAgent = async () => {
    if (!config.agentId) {
      return;
    }

    try {
      setLoading(true);
      await retellService.deleteAgent(config.agentId);

      setConfig({
        status: 'inactive',
        errorMessage: null,
        phoneNumber: null,
        agentId: null
      });
    } catch (err) {
      console.error('Error stopping RetellAI agent:', err);
      setConfig(prev => ({
        ...prev,
        status: 'error',
        errorMessage: err instanceof Error ? err.message : 'Failed to stop agent'
      }));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    loading,
    deployAgent,
    stopAgent
  };
}