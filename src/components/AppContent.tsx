import React, { useState } from 'react';
import CallList from './CallList';
import CallDetail from './CallDetail';
import MainNav from './MainNav';
import CustomerList from './customers/CustomerList';
import CustomerDetail from './customers/CustomerDetail';
import DocumentPortal from './documents/DocumentPortal';
import AgentPortal from './agent/AgentPortal';
import { useCallData } from '../hooks/useCallData';
import { useCustomerData } from '../hooks/useCustomerData';
import { Call, Customer } from '../types';
import { Construction } from 'lucide-react';

export default function AppContent() {
  const { calls, loading: callsLoading, error: callsError } = useCallData();
  const { customers, loading: customersLoading, error: customersError } = useCustomerData();
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeSection, setActiveSection] = useState('calls');

  const handleCallSelect = (call: Call) => {
    setSelectedCall(call);
    setActiveSection('calls');
  };

  const handleRequestCreditCheck = async (customerId: string) => {
    // TODO: Implement credit check request
    console.log('Requesting credit check for customer:', customerId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <MainNav activeSection={activeSection} onSectionChange={setActiveSection} />
      {activeSection === 'calls' && (
        <>
          <CallList
            calls={calls}
            selectedCallId={selectedCall?.id || null}
            onSelectCall={setSelectedCall}
            loading={callsLoading}
            error={callsError}
          />
          {selectedCall ? (
            <CallDetail call={selectedCall} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a call to view details</p>
            </div>
          )}
        </>
      )}
      {activeSection === 'customers' && (
        <>
          <CustomerList
            customers={customers}
            selectedCustomerId={selectedCustomer?.id || null}
            onSelectCustomer={setSelectedCustomer}
            loading={customersLoading}
            error={customersError}
          />
          {selectedCustomer ? (
            <CustomerDetail 
              customer={selectedCustomer} 
              onCallSelect={handleCallSelect}
              onRequestCreditCheck={handleRequestCreditCheck}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a customer to view details</p>
            </div>
          )}
        </>
      )}
      {activeSection === 'documents' && (
        <DocumentPortal />
      )}
      {activeSection === 'providers' && (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center max-w-md p-8">
            <div className="bg-blue-100 rounded-full p-6 inline-block mb-6">
              <Construction size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We're working on bringing you a comprehensive loan provider management system. 
              This feature will be available soon with enhanced capabilities to manage and 
              track loan providers.
            </p>
          </div>
        </div>
      )}
      {activeSection === 'agent' && (
        <AgentPortal />
      )}
    </div>
  );
}