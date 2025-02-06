import React from 'react';
import { FileText, CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';
import { Call } from '../types';

interface DocumentListProps {
  documents: Call['documents'];
}

export default function DocumentList({ documents }: DocumentListProps) {
  const groupedDocs = {
    received: documents.filter(doc => doc.status === 'received'),
    pending: documents.filter(doc => doc.status === 'pending'),
    rejected: documents.filter(doc => doc.status === 'rejected')
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
      <div className="space-y-6">
        {Object.entries(groupedDocs).map(([status, docs]) => docs.length > 0 && (
          <div key={status}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
            <div className="space-y-2">
              {docs.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-500" />
                    <div>
                      <span className="text-gray-700 block">{doc.name}</span>
                      {doc.required && (
                        <span className="text-xs text-gray-500">Required</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc.status === 'received' && (
                      <>
                        <CheckCircle2 size={18} className="text-green-500" />
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-white rounded-full transition-colors"
                            title="Download document"
                          >
                            <Download size={18} className="text-blue-500" />
                          </a>
                        )}
                      </>
                    )}
                    {doc.status === 'pending' && (
                      <AlertCircle size={18} className="text-yellow-500" />
                    )}
                    {doc.status === 'rejected' && (
                      <XCircle size={18} className="text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}