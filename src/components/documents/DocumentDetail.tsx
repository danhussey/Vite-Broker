import React, { useState } from 'react';
import { Download, Upload, Bot, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { Document } from '../../types';

interface DocumentDetailProps {
  document: Document;
  onUpdateStatus: (docId: string, newStatus: Document['status']) => void;
  onAddNote: (docId: string, note: string) => void;
}

export default function DocumentDetail({
  document,
  onUpdateStatus,
  onAddNote
}: DocumentDetailProps) {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    onAddNote(document.id, newNote);
    setNewNote('');
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'uploaded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {document.documentType.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">Submitted by {document.customerName}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
                      {document.status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </div>
                </div>
              </div>
              {document.url && (
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <Download size={18} />
                  Download
                </a>
              )}
            </div>

            {/* Status Controls */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Status
                </label>
                <select
                  value={document.status}
                  onChange={(e) => onUpdateStatus(document.id, e.target.value as Document['status'])}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending_upload">Pending Upload</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="processing">Processing</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Verification Status
                </label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Bot size={18} className="text-purple-500" />
                  <span className="text-gray-900">
                    {document.aiVerificationStatus === 'success' && 'Verified by AI'}
                    {document.aiVerificationStatus === 'failed' && 'AI Verification Failed'}
                    {document.aiVerificationStatus === 'needs_review' && 'Needs Manual Review'}
                    {document.aiVerificationStatus === 'pending' && 'AI Processing'}
                    {!document.aiVerificationStatus && 'Not Started'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Details */}
          {document.verificationDetails && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Details</h2>
              <div className="grid gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="font-medium text-gray-900">Verification Status</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>Verified by: {document.verificationDetails.verifiedBy || 'Not verified'}</p>
                    {document.verificationDetails.verifiedAt && (
                      <p>Verified at: {new Date(document.verificationDetails.verifiedAt).toLocaleString()}</p>
                    )}
                    {document.verificationDetails.score && (
                      <p>Confidence Score: {document.verificationDetails.score}%</p>
                    )}
                  </div>
                </div>

                {document.verificationDetails.issues?.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={18} className="text-red-500" />
                      <span className="font-medium text-red-900">Issues Found</span>
                    </div>
                    <ul className="space-y-1 text-red-700">
                      {document.verificationDetails.issues.map((issue, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <div className="space-y-4 mb-6">
              {document.notes.map((note, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{note}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Added {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddNote}>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                className="w-full h-32 border border-gray-200 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Note
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Timeline</h2>
            <div className="space-y-4">
              {document.uploadDate && (
                <TimelineEvent
                  icon={<Upload size={18} />}
                  title="Document Uploaded"
                  date={document.uploadDate}
                />
              )}
              {document.verificationDetails?.verifiedAt && (
                <TimelineEvent
                  icon={document.verificationDetails.verifiedBy === 'ai' 
                    ? <Bot size={18} />
                    : <CheckCircle size={18} />
                  }
                  title={`Verified by ${document.verificationDetails.verifiedBy === 'ai' ? 'AI' : 'Staff'}`}
                  date={document.verificationDetails.verifiedAt}
                />
              )}
              {document.expiryDate && (
                <TimelineEvent
                  icon={<Clock size={18} />}
                  title="Document Expiry"
                  date={document.expiryDate}
                  status={new Date(document.expiryDate) < new Date() ? 'expired' : 'upcoming'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineEventProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  status?: 'completed' | 'upcoming' | 'expired';
}

function TimelineEvent({ icon, title, date, status = 'completed' }: TimelineEventProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${
        status === 'completed' ? 'bg-green-100 text-green-600' :
        status === 'expired' ? 'bg-red-100 text-red-600' :
        'bg-blue-100 text-blue-600'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-900 font-medium">{title}</p>
        <p className="text-sm text-gray-500">
          {new Date(date).toLocaleString()}
        </p>
      </div>
    </div>
  );
}