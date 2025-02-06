import React, { useState } from 'react';
import { Search, Star, TrendingUp, Clock, Percent } from 'lucide-react';
import { mockProviders } from '../../data/providers';

interface ProviderListProps {
  selectedProviderId: string | null;
  onSelectProvider: (providerId: string) => void;
}

export default function ProviderList({ selectedProviderId, onSelectProvider }: ProviderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured' | 'competitive'>('all');

  const filteredProviders = mockProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'featured' && provider.featured) ||
      (filter === 'competitive' && provider.rates.comparison < 6.5);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-96 bg-white border-r border-gray-200 h-screen overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Providers</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search providers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'featured', 'competitive'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === filterType
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            onClick={() => onSelectProvider(provider.id)}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              selectedProviderId === provider.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{provider.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star size={14} className="text-yellow-400" />
                    <span>{provider.rating}/5</span>
                  </div>
                </div>
              </div>
              {provider.featured && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Featured
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Percent size={16} className="text-green-500" />
                <span>From {provider.rates.starting}%</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} className="text-blue-500" />
                <span>{provider.approvalTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}