import React, { useState } from 'react';
import { useDocumentData } from '../../hooks/useDocumentData';
import DocumentList from './DocumentList';
import DocumentDetail from './DocumentDetail';

export default function DocumentPortal() {
  const { 
    documents, 
    loading, 
    error,
    updateDocument,
    addComment
  } = useDocumentData();
  
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateStatus = async (docId: string, newStatus: string) => {
    try {
      await updateDocument(docId, { status: newStatus as any });
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  const handleAddNote = async (docId: string, note: string) => {
    try {
      await addComment(docId, note);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const selectedDocument = documents.find(doc => doc.id === selectedDoc);

  return (
    <div className="flex h-screen bg-gray-100">
      <DocumentList
        documents={documents}
        selectedDocId={selectedDoc}
        onSelectDocument={(doc) => setSelectedDoc(doc.id)}
        filter={filter}
        onFilterChange={setFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        loading={loading}
        error={error}
      />
      
      {selectedDocument ? (
        <DocumentDetail
          document={selectedDocument}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a document to view details
        </div>
      )}
    </div>
  );
}
