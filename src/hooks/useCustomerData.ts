import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Customer } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useCustomerData() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  useEffect(() => {
    if (!organization?.id) return;

    async function fetchCustomers() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: customersError } = await supabase
          .from('customers')
          .select(`
            *,
            credit_checks (
              status,
              provider,
              request_date,
              completed_date,
              score,
              report,
              error
            )
          `)
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false });

        if (customersError) throw customersError;

        // Transform the data to match our Customer type
        const transformedCustomers: Customer[] = data.map(customer => ({
          id: customer.id,
          name: customer.full_name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          status: customer.status,
          joinDate: customer.created_at,
          lastContact: customer.last_contact,
          totalLoans: customer.total_loans,
          activeLoans: customer.active_loans,
          creditScore: customer.credit_score,
          profileImage: customer.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.full_name)}&background=random`,
          tags: customer.tags || [],
          creditCheck: customer.credit_checks?.[0] ? {
            status: customer.credit_checks[0].status,
            provider: customer.credit_checks[0].provider,
            requestDate: customer.credit_checks[0].request_date,
            completedDate: customer.credit_checks[0].completed_date,
            score: customer.credit_checks[0].score,
            report: customer.credit_checks[0].report,
            error: customer.credit_checks[0].error
          } : undefined
        }));

        setCustomers(transformedCustomers);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to fetch customers. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [organization?.id]);

  return { customers, loading, error };
}
