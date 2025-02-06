import { useState } from 'react';
import { retellService } from '../services/retell';
import { useAgentConfig } from './useAgentConfig';
import { supabase } from '../lib/supabase';

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

      // Create agent with auth token
      const result = await retellService.createAgent(prompt);
      
      if (!result.agentId) {
        throw new Error('Failed to create agent - missing agent ID');
      }

      setConfig({
        status: 'active',
        errorMessage: null,
        phoneNumber: null, // We'll set this later if needed
        agentId: result.agentId
      });
    } catch (err) {
      console.error('Error deploying RetellAI agent:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to deploy agent. Please try again.';
      
      setConfig(prev => ({
        ...prev,
        status: 'error',
        errorMessage,
        phoneNumber: null,
        agentId: null
      }));
      
      throw new Error(errorMessage);
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
