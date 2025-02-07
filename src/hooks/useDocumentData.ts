import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Document } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useDocumentData() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization, user } = useAuth();

  const fetchDocuments = async () => {
    if (!organization?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: docsError } = await supabase
        .from('documents')
        .select(`
          *,
          customer:customers(full_name),
          versions:document_versions(
            id,
            version_number,
            file_url,
            file_type,
            file_size,
            uploaded_at
          ),
          comments:document_comments(
            id,
            content,
            created_at,
            user_id
          ),
          shares:document_shares(
            id,
            shared_with,
            access_level,
            expires_at
          )
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      // Transform the data to match our Document type
      const transformedDocs: Document[] = data.map(doc => ({
        id: doc.id,
        customerId: doc.customer_id,
        customerName: doc.customer?.full_name || 'Unknown Customer',
        documentType: doc.type,
        status: doc.status,
        aiVerificationStatus: doc.ai_verification_status,
        uploadDate: doc.versions?.[0]?.uploaded_at,
        expiryDate: doc.expiry_date,
        required: doc.required,
        notes: doc.comments?.map(comment => comment.content) || [],
        url: doc.versions?.[0]?.file_url,
        verificationDetails: doc.metadata?.verification || null
      }));

      setDocuments(transformedDocs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [organization?.id]);

  const addDocument = async (document: Partial<Document>) => {
    try {
      if (!organization?.id) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('documents')
        .insert([{
          organization_id: organization.id,
          customer_id: document.customerId,
          name: document.documentType,
          type: document.documentType,
          status: 'pending_upload',
          required: document.required
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchDocuments();
      return data;
    } catch (err) {
      console.error('Error adding document:', err);
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          status: updates.status,
          ai_verification_status: updates.aiVerificationStatus,
          metadata: updates.verificationDetails ? {
            verification: updates.verificationDetails
          } : undefined
        })
        .eq('id', id);

      if (error) throw error;
      await fetchDocuments();
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  const addComment = async (documentId: string, content: string) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('document_comments')
        .insert([{
          document_id: documentId,
          user_id: user.id,
          content
        }]);

      if (error) throw error;
      await fetchDocuments(); // Refresh documents to show new comment
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    addComment,
    refresh: fetchDocuments
  };
}
