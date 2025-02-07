import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Call } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useCallData() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  useEffect(() => {
    if (!organization?.id) return;

    async function fetchCalls() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: callsError } = await supabase
          .from('calls')
          .select(`
            *,
            call_transcripts (
              transcript
            ),
            call_documents (
              name,
              status,
              required,
              url
            ),
            call_notes (
              content,
              created_at,
              user_id
            )
          `)
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false });

        if (callsError) throw callsError;

        // Transform the data to match our Call type
        const transformedCalls: Call[] = data.map(call => ({
          id: call.id,
          customerName: call.customer_name,
          timestamp: call.created_at,
          duration: call.duration || '0:00',
          subject: call.subject,
          summary: call.summary || '',
          status: call.status,
          loanType: call.loan_type,
          loanAmount: Number(call.loan_amount) || 0,
          transcript: call.call_transcripts?.[0]?.transcript || '',
          creditScore: call.credit_score,
          income: call.annual_income,
          contact: {
            email: call.customer_email || '',
            phone: call.customer_phone || '',
          },
          documents: call.call_documents?.map(doc => ({
            name: doc.name,
            status: doc.status,
            required: doc.required,
            url: doc.url
          })) || [],
          nextSteps: [], // TODO: Implement next steps logic
          timeline: [] // TODO: Implement timeline logic
        }));

        setCalls(transformedCalls);
      } catch (err) {
        console.error('Error fetching calls:', err);
        setError('Failed to fetch calls. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCalls();
  }, [organization?.id]);

  return { calls, loading, error };
}
