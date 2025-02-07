import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Call } from '../types';

interface CallDetailProps {
  call: Call;
}

export default function CallDetail({ call }: CallDetailProps) {
  if (!call) return null;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="space-y-6 fade-in">
          {/* Customer Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{call.customerName}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-500" size={20} />
                <a href={`mailto:${call.contact.email}`} className="text-blue-600 hover:text-blue-800">
                  {call.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-gray-500" size={20} />
                <a href={`tel:${call.contact.phone}`} className="text-blue-600 hover:text-blue-800">
                  {call.contact.phone}
                </a>
              </div>
              {call.contact.address && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="text-gray-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{call.contact.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Transcript */}
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
