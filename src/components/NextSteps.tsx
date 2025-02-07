import React from 'react';
import { ArrowRight } from 'lucide-react';

interface NextStepsProps {
  steps: string[];
}

export default function NextSteps({ steps }: NextStepsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-default"
          >
            <ArrowRight size={18} className="text-blue-500 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
            <span className="text-gray-700">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
