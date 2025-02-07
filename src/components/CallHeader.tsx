import React from 'react';
import { Clock } from 'lucide-react';
import { Call } from '../types';

interface CallHeaderProps {
  call: Call;
}

export default function CallHeader({ call }: CallHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {call.customerName}
        </h1>
        <p className="text-gray-600">{call.subject}</p>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500">
          {new Date(call.timestamp).toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-gray-500 mt-1">
          <Clock size={16} />
          <span>{call.duration}</span>
        </div>
      </div>
    </div>
  );
}
