import React from 'react';
import { Search, Filter, AlertCircle, CheckCircle, Clock, XCircle, Bot } from 'lucide-react';
import { Document } from '../../types';

interface DocumentListProps {
  documents: Document[];
  selectedDocId: string | null;
  onSelectDocument: (doc: Document) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function DocumentList({
  documents,
  selectedDocId,
  onSelectDocument,
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
}: DocumentListProps) {
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doc.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-96 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'pending_upload', 'uploaded', 'processing', 'verified', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              selectedDocId === doc.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DocumentStatusIcon status={doc.status} aiStatus={doc.aiVerificationStatus} />
                <h3 className="font-medium text-gray-900">
                  {doc.documentType.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
              </div>
              {doc.required && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  Required
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{doc.customerName}</p>
                <p className="text-xs text-gray-500">
                  {doc.uploadDate 
                    ? new Date(doc.uploadDate).toLocaleDateString()
                    : 'Pending Upload'}
                </p>
              </div>
              {doc.expiryDate && new Date(doc.expiryDate) < new Date() && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  Expired
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentStatusIcon({ 
  status, 
  aiStatus 
}: { 
  status: Document['status'], 
  aiStatus?: Document['aiVerificationStatus'] 
}) {
  switch (status) {
    case 'pending_upload':
      return <Clock size={18} className="text-gray-400" />;
    case 'uploaded':
      return <AlertCircle size={18} className="text-blue-500" />;
    case 'processing':
      return <Bot size={18} className="text-purple-500" />;
    case 'verified':
      return <CheckCircle size={18} className="text-green-500" />;
    case 'rejected':
      return <XCircle size={18} className="text-red-500" />;
    default:
      return <AlertCircle size={18} className="text-gray-400" />;
  }
}