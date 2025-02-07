import React from 'react';
import { Phone, Mail, FileCheck, Building2, Clock, ExternalLink } from 'lucide-react';
import { Call } from '../types';

interface TimelineProps {
  events: Call['timeline'];
}

function getEventIcon(type?: string) {
  const iconProps = { size: 18 };
  switch (type) {
    case 'call':
      return <Phone {...iconProps} />;
    case 'email':
      return <Mail {...iconProps} />;
    case 'document':
      return <FileCheck {...iconProps} />;
    case 'provider':
      return <Building2 {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
}

function getEventLink(type: string | undefined, event: Call['timeline'][0]) {
  switch (type) {
    case 'call':
      return {
        text: 'View Call Details',
        section: 'calls'
      };
    case 'email':
      return {
        text: 'View Email',
        section: 'emails'
      };
    case 'document':
      return {
        text: 'View Document',
        section: 'documents'
      };
    case 'provider':
      return {
        text: 'View Provider Details',
        section: 'providers'
      };
    default:
      return null;
  }
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h2>
      <div className="space-y-6">
        {events.map((event, index) => (
          <div
            key={index}
            className={`relative pl-8 ${
              index !== events.length - 1 ? 'pb-6' : ''
            }`}
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-px ${
                event.status === 'completed'
                  ? 'bg-green-200'
                  : event.status === 'current'
                  ? 'bg-blue-200'
                  : 'bg-gray-200'
              }`}
            />
            <div
              className={`absolute left-0 top-1.5 transform -translate-x-1/2 w-8 h-8 rounded-full 
                flex items-center justify-center border-2 ${
                event.status === 'completed'
                  ? 'bg-green-500 border-green-200'
                  : event.status === 'current'
                  ? 'bg-blue-500 border-blue-200'
                  : 'bg-gray-300 border-gray-200'
              }`}
            >
              <div className="text-white">
                {getEventIcon(event.type)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleString()}
                </div>
                {event.status === 'current' && (
                  <span className="text-sm text-blue-600">In Progress</span>
                )}
              </div>
              <div className="font-medium text-gray-900 mb-1">{event.title}</div>
              <div className="text-gray-600 mb-3">{event.description}</div>

              {event.type && getEventLink(event.type, event) && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Navigate to ${getEventLink(event.type, event)?.section}`);
                  }}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  {getEventLink(event.type, event)?.text}
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
