import React from 'react';
import { DollarSign, BadgePercent, Wallet, TrendingUp } from 'lucide-react';
import { Call } from '../types';

interface LoanStatsProps {
  call: Call;
}

export default function LoanStats({ call }: LoanStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<DollarSign size={20} className="text-green-500" />}
        label="Loan Amount"
        value={`$${call.loanAmount.toLocaleString()}`}
      />
      {call.creditScore && (
        <StatCard
          icon={<BadgePercent size={20} className="text-blue-500" />}
          label="Credit Score"
          value={call.creditScore.toString()}
        />
      )}
      {call.income && (
        <StatCard
          icon={<Wallet size={20} className="text-purple-500" />}
          label="Annual Income"
          value={`$${call.income.toLocaleString()}`}
        />
      )}
      <StatCard
        icon={<TrendingUp size={20} className="text-indigo-500" />}
        label="Loan Type"
        value={call.loanType.charAt(0).toUpperCase() + call.loanType.slice(1)}
      />
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