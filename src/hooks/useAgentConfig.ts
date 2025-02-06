import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useAgentConfig() {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  useEffect(() => {
    if (!organization?.id) return;

    async function fetchConfig() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: configError } = await supabase
          .from('agent_configurations')
          .select('prompt')
          .eq('organization_id', organization.id)
          .single();

        if (configError) {
          if (configError.code === 'PGRST116') {
            // No configuration found, this is fine
            setPrompt(null);
          } else {
            throw configError;
          }
        } else {
          setPrompt(data.prompt);
        }
      } catch (err) {
        console.error('Error fetching agent configuration:', err);
        setError('Failed to fetch configuration. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [organization?.id]);

  const saveConfig = async (newPrompt: string) => {
    if (!organization?.id) return;

    try {
      setError(null);

      const { error: upsertError } = await supabase
        .from('agent_configurations')
        .upsert({
          organization_id: organization.id,
          prompt: newPrompt,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'organization_id'
        });

      if (upsertError) throw upsertError;
      setPrompt(newPrompt);
    } catch (err) {
      console.error('Error saving agent configuration:', err);
      throw new Error('Failed to save configuration. Please try again.');
    }
  };

  return {
    prompt,
    loading,
    error,
    saveConfig
  };
}