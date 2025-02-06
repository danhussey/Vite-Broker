import React from 'react';
import { Phone, CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { useRetellCalls } from '../../hooks/useRetellCalls';

export default function RetellCallList() {
  const { calls, loading, error } = useRetellCalls();

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading calls...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 rounded-lg text-red-700">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {calls.map((call) => (
        <div key={call.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {call.status === 'active' ? (
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Phone className="animate-pulse" size={18} />
                </div>
              ) : call.status === 'completed' ? (
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle size={18} />
                </div>
              ) : (
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <XCircle size={18} />
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">
                  Call {call.retellCallId}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(call.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            {call.recordingUrl && (
              <a
                href={call.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
              >
                <Play size={16} />
                Play Recording
              </a>
            )}
          </div>

          {/* Transcript Preview */}
          {call.transcripts.length > 0 && (
            <div className="space-y-2 mt-4">
              {call.transcripts.slice(0, 3).map((transcript, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock size={12} />
                    {new Date(transcript.timestamp).toLocaleTimeString()}
                  </div>
                  <div className={`flex-1 p-3 rounded-lg ${
                    transcript.speaker === 'agent' 
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-gray-50 text-gray-800'
                  }`}>
                    <div className="text-xs font-medium mb-1">
                      {transcript.speaker === 'agent' ? 'AI Agent' : 'Customer'}
                    </div>
                    <p className="text-sm">{transcript.content}</p>
                  </div>
                </div>
              ))}
              {call.transcripts.length > 3 && (
                <div className="text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}