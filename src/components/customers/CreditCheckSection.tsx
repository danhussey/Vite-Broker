import React from 'react';
import { CreditCard, AlertTriangle, CheckCircle, XCircle, RefreshCw, TrendingUp, Clock, Calendar } from 'lucide-react';
import { CreditCheck } from '../../types';

interface CreditCheckSectionProps {
  creditCheck: CreditCheck;
  onRefresh: () => void;
}

export default function CreditCheckSection({ creditCheck, onRefresh }: CreditCheckSectionProps) {
  const isExpired = creditCheck.status === 'completed' && 
    new Date(creditCheck.completedDate!).getTime() < Date.now() - (30 * 24 * 60 * 60 * 1000);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard size={24} className="text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Credit Assessment</h2>
        </div>
        {(creditCheck.status === 'completed' || creditCheck.status === 'failed') && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 
              rounded-lg text-gray-700 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh Report
          </button>
        )}
      </div>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg ${
        creditCheck.status === 'completed' && !isExpired ? 'bg-green-50 border border-green-200' :
        creditCheck.status === 'failed' ? 'bg-red-50 border border-red-200' :
        creditCheck.status === 'in_progress' ? 'bg-blue-50 border border-blue-200' :
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center gap-2">
          {creditCheck.status === 'completed' && !isExpired && (
            <CheckCircle size={20} className="text-green-500" />
          )}
          {creditCheck.status === 'failed' && (
            <XCircle size={20} className="text-red-500" />
          )}
          {creditCheck.status === 'in_progress' && (
            <RefreshCw size={20} className="text-blue-500 animate-spin" />
          )}
          {(creditCheck.status === 'pending' || isExpired) && (
            <AlertTriangle size={20} className="text-yellow-500" />
          )}
          <span className={`font-medium ${
            creditCheck.status === 'completed' && !isExpired ? 'text-green-800' :
            creditCheck.status === 'failed' ? 'text-red-800' :
            creditCheck.status === 'in_progress' ? 'text-blue-800' :
            'text-yellow-800'
          }`}>
            {creditCheck.status === 'completed' && isExpired ? 'Report Expired' :
             creditCheck.status === 'in_progress' ? 'Check in Progress' :
             creditCheck.status.charAt(0).toUpperCase() + creditCheck.status.slice(1)}
          </span>
        </div>
        <div className="mt-1 text-sm">
          {creditCheck.status === 'completed' && !isExpired && 'Credit check completed successfully'}
          {creditCheck.status === 'failed' && creditCheck.error}
          {creditCheck.status === 'in_progress' && 'Fetching credit information...'}
          {creditCheck.status === 'pending' && 'Awaiting credit check initiation'}
          {isExpired && 'This report is over 30 days old and needs to be refreshed'}
        </div>
      </div>

      {creditCheck.status === 'completed' && creditCheck.report && !isExpired && (
        <>
          {/* Credit Score */}
          <div className="mb-8 text-center">
            <div className="inline-block p-6 bg-blue-50 rounded-full">
              <div className="text-5xl font-bold text-blue-700 mb-1">
                {creditCheck.score}
              </div>
              <div className="text-blue-600 font-medium">Credit Score</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <TrendingUp size={18} className="text-blue-500" />
                <span className="font-medium">Credit Utilization</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {creditCheck.report.creditUtilization}%
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Clock size={18} className="text-green-500" />
                <span className="font-medium">Payment History</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-green-600 font-medium">{creditCheck.report.paymentHistory.onTime}%</div>
                  <div className="text-gray-500">On Time</div>
                </div>
                <div>
                  <div className="text-yellow-600 font-medium">{creditCheck.report.paymentHistory.late}%</div>
                  <div className="text-gray-500">Late</div>
                </div>
                <div>
                  <div className="text-red-600 font-medium">{creditCheck.report.paymentHistory.missed}%</div>
                  <div className="text-gray-500">Missed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Account History</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Oldest Account</div>
                  <div className="text-lg font-medium text-gray-900">
                    {creditCheck.report.accountAges.oldest} years
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Average Age</div>
                  <div className="text-lg font-medium text-gray-900">
                    {creditCheck.report.accountAges.average} years
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Credit Events</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Defaults</div>
                  <div className={`text-lg font-medium ${
                    creditCheck.report.defaultHistory ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {creditCheck.report.defaultHistory ? 'Yes' : 'None'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Bankruptcy</div>
                  <div className={`text-lg font-medium ${
                    creditCheck.report.bankruptcyHistory ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {creditCheck.report.bankruptcyHistory ? 'Yes' : 'None'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Recent Inquiries</div>
                  <div className="text-lg font-medium text-gray-900">
                    {creditCheck.report.inquiries}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Footer */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Generated: {new Date(creditCheck.completedDate!).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={16} />
              <span>Provider: {creditCheck.provider}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}