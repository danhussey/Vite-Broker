import React from 'react';
import { Phone, Mail, Globe, Star, TrendingUp, Clock, DollarSign, Percent, CheckCircle } from 'lucide-react';
import { Provider } from '../../data/providers';

interface ProviderDetailProps {
  provider: Provider;
}

export default function ProviderDetail({ provider }: ProviderDetailProps) {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={provider.logo}
                alt={provider.name}
                className="w-16 h-16 object-contain"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                  <div className="flex items-center gap-1">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span className="font-medium">{provider.rating}/5</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{provider.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Percent size={18} className="text-green-500" />
                  <span className="font-medium">Starting Rate</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{provider.rates.starting}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <TrendingUp size={18} className="text-blue-500" />
                  <span className="font-medium">Comparison Rate</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{provider.rates.comparison}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock size={18} className="text-purple-500" />
                  <span className="font-medium">Approval Time</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">{provider.approvalTime}</div>
              </div>
            </div>
          </div>

          {/* Loan Types */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Loan Types</h2>
            <div className="grid gap-4">
              {provider.loanTypes.map((loan, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{loan.type}</h3>
                  <p className="text-gray-600 text-sm mb-3">{loan.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500" />
                      <span>Up to ${(loan.maxLoanAmount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      <span>Up to {loan.maxLoanTerm} years</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features and Requirements */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h2>
              <div className="space-y-3">
                {provider.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Minimum Income</div>
                  <div className="font-medium text-gray-900">${provider.requirements.minIncome.toLocaleString()}/year</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Minimum Deposit</div>
                  <div className="font-medium text-gray-900">{provider.requirements.minDeposit}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Minimum Credit Score</div>
                  <div className="font-medium text-gray-900">{provider.requirements.creditScore}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-3 gap-4">
              <a
                href={`tel:${provider.contact.phone}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone size={18} className="text-gray-500" />
                <span className="text-blue-600">{provider.contact.phone}</span>
              </a>
              <a
                href={`mailto:${provider.contact.email}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail size={18} className="text-gray-500" />
                <span className="text-blue-600">{provider.contact.email}</span>
              </a>
              <a
                href={provider.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe size={18} className="text-gray-500" />
                <span className="text-blue-600">Visit Website</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
