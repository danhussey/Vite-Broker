import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RetellCall {
  id: string;
  callId: string | null;
  retellCallId: string;
  status: 'active' | 'completed' | 'failed';
  recordingUrl: string | null;
  createdAt: string;
  transcripts: {
    speaker: 'agent' | 'customer';
    content: string;
    timestamp: string;
  }[];
}

export function useRetellCalls() {
  const [calls, setCalls] = useState<RetellCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  useEffect(() => {
    if (!organization?.id) return;

    const fetchCalls = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: callsError } = await supabase
          .from('retell_calls')
          .select(`
            *,
            transcripts:retell_transcripts(
              speaker,
              content,
              timestamp
            )
          `)
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false });

        if (callsError) throw callsError;

        const transformedCalls: RetellCall[] = data.map(call => ({
          id: call.id,
          callId: call.call_id,
          retellCallId: call.retell_call_id,
          status: call.status,
          recordingUrl: call.recording_url,
          createdAt: call.created_at,
          transcripts: call.transcripts.map(t => ({
            speaker: t.speaker,
            content: t.content,
            timestamp: t.timestamp
          }))
        }));

        setCalls(transformedCalls);
      } catch (err) {
        console.error('Error fetching RetellAI calls:', err);
        setError('Failed to fetch calls. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();

    // Subscribe to call updates
    const subscription = supabase
      .channel('retell_calls_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'retell_calls',
          filter: `organization_id=eq.${organization.id}`
        },
        () => {
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [organization?.id]);

  return { calls, loading, error };
}