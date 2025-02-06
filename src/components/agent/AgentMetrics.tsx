import React from 'react';
import { PhoneCall, Clock, UserCheck, AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react';

export default function AgentMetrics() {
  // Mock data - would be replaced with real metrics
  const metrics = {
    totalCalls: 156,
    avgDuration: '4:32',
    successRate: 87,
    handoffRate: 13,
    commonIssues: [
      { issue: 'Income verification unclear', count: 23 },
      { issue: 'Multiple speakers on call', count: 15 },
      { issue: 'Background noise interference', count: 12 }
    ],
    recentCalls: [
      {
        id: '1',
        timestamp: '2024-03-15T10:30:00',
        duration: '5:23',
        outcome: 'success',
        summary: 'First-time homebuyer inquiry, collected basic information and scheduled follow-up'
      },
      {
        id: '2',
        timestamp: '2024-03-15T11:15:00',
        duration: '3:45',
        outcome: 'handoff',
        summary: 'Complex refinancing case, transferred to human agent'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 text-blue-600 mb-4">
            <PhoneCall size={24} />
            <h3 className="font-medium">Total Calls</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.totalCalls}</div>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 text-purple-600 mb-4">
            <Clock size={24} />
            <h3 className="font-medium">Average Duration</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.avgDuration}</div>
          <p className="text-sm text-gray-500 mt-1">Minutes per call</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 text-green-600 mb-4">
            <UserCheck size={24} />
            <h3 className="font-medium">Success Rate</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.successRate}%</div>
          <p className="text-sm text-gray-500 mt-1">Completed without handoff</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 text-yellow-600 mb-4">
            <TrendingUp size={24} />
            <h3 className="font-medium">Handoff Rate</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.handoffRate}%</div>
          <p className="text-sm text-gray-500 mt-1">Transferred to agents</p>
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-500" />
          Common Issues
        </h2>
        <div className="space-y-4">
          {metrics.commonIssues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-gray-700">{issue.issue}</span>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                {issue.count} occurrences
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Calls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-500" />
          Recent Calls
        </h2>
        <div className="space-y-4">
          {metrics.recentCalls.map((call) => (
            <div key={call.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    call.outcome === 'success' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {call.outcome === 'success' ? 'Completed' : 'Handed Off'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(call.timestamp).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Duration: {call.duration}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{call.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}