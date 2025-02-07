import React, { useState } from 'react';
import { Phone, Mail, Calendar, CreditCard, Wallet, History, MapPin, RefreshCw } from 'lucide-react';
import { Customer, Call } from '../../types';
import CustomerCalls from './CustomerCalls';
import CreditCheckSection from './CreditCheckSection';

interface CustomerDetailProps {
  customer: Customer;
  onCallSelect: (call: Call) => void;
  onRequestCreditCheck: (customerId: string) => Promise<void>;
}

export default function CustomerDetail({ 
  customer, 
  onCallSelect,
  onRequestCreditCheck 
}: CustomerDetailProps) {
  const [isRequestingCheck, setIsRequestingCheck] = useState(false);

  const handleCreditCheck = async () => {
    setIsRequestingCheck(true);
    try {
      await onRequestCreditCheck(customer.id);
    } catch (error) {
      console.error('Failed to request credit check:', error);
    } finally {
      setIsRequestingCheck(false);
    }
  };

  const canRequestCreditCheck = !customer.creditCheck || 
    (customer.creditCheck.status === 'failed' || 
    (customer.creditCheck.status === 'completed' && 
      new Date(customer.creditCheck.completedDate!).getTime() < Date.now() - (30 * 24 * 60 * 60 * 1000)));

  // Generate avatar URL using UI Avatars
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&size=256`;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="space-y-6 fade-in">
          {/* Customer Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={avatarUrl}
                alt={customer.name}
                className="w-24 h-24 rounded-full object-cover bg-gray-100"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{customer.name}</h1>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    customer.status === 'active' ? 'bg-green-100 text-green-700' :
                    customer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                  <span className="text-gray-500">
                    Customer since {new Date(customer.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-500" size={20} />
                <a href={`mailto:${customer.email}`} className="text-blue-600 hover:text-blue-800">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-gray-500" size={20} />
                <a href={`tel:${customer.phone}`} className="text-blue-600 hover:text-blue-800">
                  {customer.phone}
                </a>
              </div>
              {customer.address && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="text-gray-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{customer.address}</span>
                </div>
              )}
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {customer.creditScore ? (
                <StatCard
                  icon={<CreditCard className="text-blue-500" />}
                  label="Credit Score"
                  value={customer.creditScore.toString()}
                />
              ) : (
                <div className="col-span-2 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <CreditCard size={20} />
                    <span className="font-medium">Credit Check Required</span>
                  </div>
                  <button
                    onClick={handleCreditCheck}
                    disabled={isRequestingCheck || !canRequestCreditCheck}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 
                      disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-blue-700 
                      transition-colors text-sm border border-blue-200"
                  >
                    {isRequestingCheck ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      'Request Credit Check'
                    )}
                  </button>
                </div>
              )}
              <StatCard
                icon={<Wallet className="text-green-500" />}
                label="Active Loans"
                value={customer.activeLoans.toString()}
              />
              <StatCard
                icon={<History className="text-purple-500" />}
                label="Total Loans"
                value={customer.totalLoans.toString()}
              />
              <StatCard
                icon={<Calendar className="text-indigo-500" />}
                label="Last Contact"
                value={new Date(customer.lastContact).toLocaleDateString()}
              />
            </div>
          </div>

          {/* Credit Check Section */}
          {customer.creditCheck && (
            <div className="bg-white rounded-xl shadow-sm">
              <CreditCheckSection creditCheck={customer.creditCheck} onRefresh={handleCreditCheck} />
            </div>
          )}

          {/* Call History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <CustomerCalls calls={[]} onCallSelect={onCallSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}
