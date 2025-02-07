import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Customer, SortDirection, CustomerSortField } from '../../types';
import CustomerCard from './CustomerCard';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomerId: string | null;
  loading: boolean;
  error: string | null;
}

export default function CustomerList({ 
  customers, 
  onSelectCustomer, 
  selectedCustomerId,
  loading,
  error
}: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<CustomerSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<Customer['status'] | 'all'>('all');

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'name') return a.name.localeCompare(b.name) * direction;
      if (sortField === 'joinDate') return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime() * direction;
      if (sortField === 'lastContact') return new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime() * direction;
      if (sortField === 'activeLoans') return (a.activeLoans - b.activeLoans) * direction;
      return 0;
    });

  const handleSort = (field: CustomerSortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (error) {
    return (
      <div className="w-96 bg-white border-r border-gray-200 h-screen overflow-hidden flex flex-col">
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-r border-gray-200 h-screen overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customers</h2>
        
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'active', 'inactive', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Advanced filters"
          >
            <SlidersHorizontal size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading customers...</span>
            </div>
          </div>
        ) : filteredAndSortedCustomers.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No customers found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                isSelected={customer.id === selectedCustomerId}
                onClick={() => onSelectCustomer(customer)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
