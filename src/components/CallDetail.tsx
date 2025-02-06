import React from 'react';
import { Call } from '../types';
import CallHeader from './CallHeader';
import LoanStats from './LoanStats';
import ContactDetails from './ContactDetails';
import DocumentList from './DocumentList';
import Timeline from './Timeline';
import NextSteps from './NextSteps';
import LoanProgressTracker from './LoanProgressTracker';

interface CallDetailProps {
  call: Call;
}

export default function CallDetail({ call }: CallDetailProps) {
  if (!call) return null;

  const handleUpdateStatus = (status: string) => {
    // Handle status update
    console.log('Status updated:', status);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="space-y-6 fade-in">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <CallHeader call={call} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <LoanProgressTracker call={call} onUpdateStatus={handleUpdateStatus} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <LoanStats call={call} />
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Call Summary</h2>
              <p className="text-gray-700 leading-relaxed">{call.summary}</p>
            </div>

            <ContactDetails contact={call.contact} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <DocumentList documents={call.documents} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <NextSteps steps={call.nextSteps} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Timeline events={call.timeline} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Transcript</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {call.transcript}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}