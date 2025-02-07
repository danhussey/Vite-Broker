import React, { useState } from 'react';
import { Phone, Flag, CheckCircle, Search, Loader2 } from 'lucide-react';
import { Call } from '../types';
import { formatDistanceToNow } from '../utils';

interface CallListProps {
  calls: Call[];
  selectedCallId: string | null;
  onSelectCall: (call: Call) => void;
  loading: boolean;
  error: string | null;
}

export default function CallList({ 
  calls, 
  selectedCallId, 
  onSelectCall,
  loading,
  error
}: CallListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Call['status'] | 'all'>('all');

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || call.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <div className="w-96 border-r border-gray-200 h-screen overflow-hidden bg-white flex flex-col">
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 border-r border-gray-200 h-screen overflow-hidden bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Call Inbox</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search calls..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'reviewed', 'flagged'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading calls...</span>
            </div>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No calls found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-all ${
                  selectedCallId === call.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => onSelectCall(call)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{call.customerName}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(call.timestamp))}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2 line-clamp-2">{call.subject}</div>
                <div className="flex items-center gap-3">
                  {call.status === 'new' && (
                    <span className="flex items-center gap-1 text-blue-500 text-xs font-medium">
                      <Phone size={14} />
                      New
                    </span>
                  )}
                  {call.status === 'flagged' && (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                      <Flag size={14} />
                      Flagged
                    </span>
                  )}
                  {call.status === 'reviewed' && (
                    <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                      <CheckCircle size={14} />
                      Reviewed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
