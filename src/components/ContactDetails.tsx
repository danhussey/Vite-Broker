import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Call } from '../types';

interface ContactDetailsProps {
  contact: Call['contact'];
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Mail size={20} className="text-gray-500" />
          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
            {contact.email}
          </a>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Phone size={20} className="text-gray-500" />
          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
            {contact.phone}
          </a>
        </div>
        {contact.address && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
            <MapPin size={20} className="text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">{contact.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}
