import React from 'react';
import { Phone, Clock, ArrowRight } from 'lucide-react';
import { Call } from '../../types';
import { formatDistanceToNow } from '../../utils';

interface CustomerCallsProps {
  calls: Call[];
  onCallSelect: (call: Call) => void;
}

export default function CustomerCalls({ calls, onCallSelect }: CustomerCallsProps) {
  if (calls.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Call History</h2>
        <div className="text-gray-500 text-center py-8">
          No calls recorded for this customer
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Call History</h2>
      <div className="space-y-4">
        {calls.map((call) => (
          <button
            key={call.id}
            onClick={() => onCallSelect(call)}
            className="w-full text-left group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  call.status === 'new' ? 'bg-blue-100 text-blue-600' :
                  call.status === 'flagged' ? 'bg-red-100 text-red-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{call.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{call.duration}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(call.timestamp))}</span>
                  </div>
                </div>
              </div>
              <ArrowRight 
                size={18} 
                className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"
              />
            </div>
            <p className="text-gray-600 line-clamp-2">{call.summary}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{
                backgroundColor: getLoanTypeColor(call.loanType),
                color: 'white'
              }}>
                {call.loanType.charAt(0).toUpperCase() + call.loanType.slice(1)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getLoanTypeColor(loanType: Call['loanType']): string {
  const colors = {
    personal: '#6366F1',
    mortgage: '#8B5CF6',
    auto: '#EC4899',
    business: '#14B8A6'
  };
  return colors[loanType];
}
