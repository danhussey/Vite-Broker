import React from 'react';
import { Customer } from '../../types';

interface CustomerCardProps {
  customer: Customer;
  isSelected: boolean;
  onClick: () => void;
}

export default function CustomerCard({ customer, isSelected, onClick }: CustomerCardProps) {
  // Generate avatar URL using UI Avatars
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&size=128`;

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-all ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={customer.name}
            className="w-12 h-12 rounded-full object-cover bg-gray-100"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            customer.status === 'active' ? 'bg-green-500' :
            customer.status === 'pending' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {customer.activeLoans} Active {customer.activeLoans === 1 ? 'Loan' : 'Loans'}
          </div>
          <div className="text-sm text-gray-500">
            Score: {customer.creditScore || 'N/A'}
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        {customer.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
