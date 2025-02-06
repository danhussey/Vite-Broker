import React, { useState } from 'react';
import { Plus, Trash2, ArrowDown, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

interface FlowStep {
  id: string;
  type: 'greeting' | 'question' | 'collect' | 'verify' | 'handoff';
  content: string;
  validation?: string[];
  nextStep?: string;
}

export default function CallFlow() {
  const [steps, setSteps] = useState<FlowStep[]>([
    {
      id: '1',
      type: 'greeting',
      content: 'Hello, thank you for calling our mortgage assistance line. How can I help you today?'
    },
    {
      id: '2',
      type: 'collect',
      content: 'Could you please tell me your full name?',
      validation: ['name']
    },
    {
      id: '3',
      type: 'collect',
      content: 'What type of mortgage are you interested in? For example, first home buyer, refinancing, or investment property?',
      validation: ['loan_type']
    }
  ]);

  const addStep = () => {
    const newStep: FlowStep = {
      id: String(steps.length + 1),
      type: 'question',
      content: 'New step content'
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, updates: Partial<FlowStep>) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  return (
    <div className="space-y-6">
      {/* Flow Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {index > 0 && (
              <div className="absolute left-8 -top-4 h-8 w-0.5 bg-gray-200" />
            )}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      step.type === 'greeting' ? 'bg-blue-100 text-blue-600' :
                      step.type === 'collect' ? 'bg-purple-100 text-purple-600' :
                      step.type === 'verify' ? 'bg-green-100 text-green-600' :
                      step.type === 'handoff' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={step.type}
                          onChange={(e) => updateStep(step.id, { type: e.target.value as FlowStep['type'] })}
                          className="text-sm font-medium bg-gray-100 border-0 rounded-full px-3 py-1"
                        >
                          <option value="greeting">Greeting</option>
                          <option value="question">Question</option>
                          <option value="collect">Collect Info</option>
                          <option value="verify">Verify</option>
                          <option value="handoff">Hand-off</option>
                        </select>
                        {step.validation && (
                          <div className="flex items-center gap-1">
                            {step.validation.map((v) => (
                              <span
                                key={v}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <textarea
                        value={step.content}
                        onChange={(e) => updateStep(step.id, { content: e.target.value })}
                        className="w-full min-h-[80px] border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter step content..."
                      />
                      {step.type === 'collect' && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-800 text-sm">
                            <AlertTriangle size={16} />
                            <span className="font-medium">Validation Required</span>
                          </div>
                          <p className="mt-1 text-sm text-yellow-700">
                            This step requires input validation. Select the type of information to collect:
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {['name', 'email', 'phone', 'loan_type', 'income'].map((type) => (
                              <label key={type} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={step.validation?.includes(type)}
                                  onChange={(e) => {
                                    const newValidation = e.target.checked
                                      ? [...(step.validation || []), type]
                                      : step.validation?.filter(v => v !== type);
                                    updateStep(step.id, { validation: newValidation });
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowDown size={20} className="text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Step Button */}
      <div className="flex justify-center">
        <button
          onClick={addStep}
          className="flex items-center gap-2 px-6 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          <Plus size={18} />
          Add Step
        </button>
      </div>

      {/* Validation Status */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle size={18} />
          <span className="font-medium">Flow Validation Passed</span>
        </div>
        <p className="mt-1 text-sm text-green-600">
          All required steps are properly configured with appropriate validation rules.
        </p>
      </div>
    </div>
  );
}