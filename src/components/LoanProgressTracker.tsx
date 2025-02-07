import React, { useState } from 'react';
import { 
  Phone, FileCheck, Calculator, Building, UserCheck, 
  FileText, BadgeCheck, CheckCircle2, Clock, XCircle,
  ChevronDown, ChevronUp, ArrowRight, Loader2,
  Info
} from 'lucide-react';
import { Call } from '../types';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  icon: React.ComponentType<any>;
  substeps: {
    id: string;
    title: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
  }[];
}

interface LoanProgressTrackerProps {
  call: Call;
  onUpdateStatus: (status: string) => void;
}

interface SmartProgressButtonProps {
  currentStep: Step;
  nextStep: Step;
  onProgress: () => Promise<void>;
}

function SmartProgressButton({ currentStep, nextStep, onProgress }: SmartProgressButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleProgress = async () => {
    setIsProcessing(true);
    try {
      await onProgress();
    } catch (error) {
      console.error('Failed to progress loan:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionDescription = () => {
    switch (nextStep.id) {
      case 'identity_verification':
        return 'System will process ID documents and initiate credit checks';
      case 'document_collection':
        return 'Automated document collection and verification process';
      case 'assessment':
        return 'Comprehensive assessment of income and expenses';
      case 'property_valuation':
        return 'Property valuation and market analysis';
      case 'final_approval':
        return 'Final review of all verifications and assessments';
      case 'documentation':
        return 'Preparation of required loan documentation';
      default:
        return 'Process next stage of the loan application';
    }
  };

  return (
    <div className="px-4 space-y-4">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-left"
      >
        <div className="flex items-center gap-2">
          <Info size={20} className="text-blue-500" />
          <span className="font-medium">Next Actions</span>
        </div>
        {showDetails ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>

      {showDetails && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900 mb-1">Next Process</p>
              <p className="text-gray-600">{getActionDescription()}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900 mb-1">Required Actions</p>
              <ul className="space-y-2">
                {nextStep.substeps.map(substep => (
                  <li key={substep.id} className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    {substep.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleProgress}
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-4
          flex items-center justify-center gap-3 font-medium transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ArrowRight size={20} />
            Progress to: {nextStep.title}
          </>
        )}
      </button>
    </div>
  );
}

function getStepIcon(step: Step) {
  const iconProps = { size: 24, className: 'flex-shrink-0' };
  
  switch (step.status) {
    case 'completed':
      return <CheckCircle2 {...iconProps} className="text-green-500" />;
    case 'failed':
      return <XCircle {...iconProps} className="text-red-500" />;
    case 'in_progress':
      return <Clock {...iconProps} className="text-blue-500" />;
    default:
      return <step.icon {...iconProps} className="text-gray-400" />;
  }
}

export default function LoanProgressTracker({ call, onUpdateStatus }: LoanProgressTrackerProps) {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const loanSteps: Step[] = [
    {
      id: 'initial_contact',
      title: 'Initial Contact',
      description: 'First contact and basic information collection',
      status: 'completed',
      icon: Phone,
      substeps: [
        { id: 'basic_info', title: 'Collect basic information', status: 'completed' },
        { id: 'loan_requirements', title: 'Understand loan requirements', status: 'completed' }
      ]
    },
    {
      id: 'identity_verification',
      title: 'Identity Verification',
      description: 'Verify identity and perform credit checks',
      status: 'in_progress',
      icon: UserCheck,
      substeps: [
        { id: 'id_docs', title: 'Verify identification documents', status: 'in_progress' },
        { id: 'credit_check', title: 'Perform credit assessment', status: 'pending' }
      ]
    },
    {
      id: 'document_collection',
      title: 'Document Collection',
      description: 'Gather and verify required documentation',
      status: 'pending',
      icon: FileCheck,
      substeps: [
        { id: 'income_docs', title: 'Income verification documents', status: 'pending' },
        { id: 'bank_statements', title: 'Bank statements', status: 'pending' },
        { id: 'tax_returns', title: 'Tax returns', status: 'pending' }
      ]
    },
    {
      id: 'assessment',
      title: 'Loan Assessment',
      description: 'Evaluate loan application and financial position',
      status: 'pending',
      icon: Calculator,
      substeps: [
        { id: 'income_assessment', title: 'Income assessment', status: 'pending' },
        { id: 'expense_analysis', title: 'Expense analysis', status: 'pending' },
        { id: 'serviceability', title: 'Serviceability calculation', status: 'pending' }
      ]
    },
    {
      id: 'property_valuation',
      title: 'Property Valuation',
      description: 'Property assessment and valuation',
      status: 'pending',
      icon: Building,
      substeps: [
        { id: 'property_details', title: 'Property details collection', status: 'pending' },
        { id: 'valuation_report', title: 'Valuation report', status: 'pending' }
      ]
    },
    {
      id: 'final_approval',
      title: 'Final Approval',
      description: 'Final review and loan approval',
      status: 'pending',
      icon: BadgeCheck,
      substeps: [
        { id: 'final_review', title: 'Final application review', status: 'pending' },
        { id: 'approval_decision', title: 'Approval decision', status: 'pending' }
      ]
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Prepare and sign loan documentation',
      status: 'pending',
      icon: FileText,
      substeps: [
        { id: 'prepare_docs', title: 'Prepare loan documents', status: 'pending' },
        { id: 'client_signing', title: 'Client signing', status: 'pending' }
      ]
    }
  ];

  const currentStep = loanSteps.find(step => step.status === 'in_progress') || loanSteps[0];
  const nextStepIndex = loanSteps.findIndex(step => step.id === currentStep.id) + 1;
  const nextStep = nextStepIndex < loanSteps.length ? loanSteps[nextStepIndex] : null;

  const handleProgressLoan = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    onUpdateStatus('progressed');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Loan Progress</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {loanSteps.map((step) => (
            <div key={step.id} className="relative">
              <button
                onClick={() => toggleStep(step.id)}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  step.status === 'in_progress' 
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {getStepIcon(step)}
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
                {expandedSteps.includes(step.id) ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>

              {expandedSteps.includes(step.id) && (
                <div className="mt-2 ml-12 space-y-2">
                  {step.substeps.map((substep) => (
                    <div
                      key={substep.id}
                      className="flex items-center gap-3 p-2 text-sm"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        substep.status === 'completed' ? 'bg-green-500' :
                        substep.status === 'in_progress' ? 'bg-blue-500' :
                        substep.status === 'failed' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`} />
                      <span className="text-gray-700">{substep.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {nextStep && (
        <div className="py-4">
          <SmartProgressButton
            currentStep={currentStep}
            nextStep={nextStep}
            onProgress={handleProgressLoan}
          />
        </div>
      )}
    </div>
  );
}
