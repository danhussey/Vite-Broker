import React from 'react';
import { Bot, Phone, Play, Pause, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRetellAgent } from '../../hooks/useRetellAgent';
import BotConfiguration from './BotConfiguration';

export default function AgentPortal() {
  const { organizationRole } = useAuth();
  const { config, loading, deployAgent, stopAgent } = useRetellAgent();

  const handleDeploy = async () => {
    try {
      await deployAgent();
    } catch (error) {
      console.error('Failed to deploy agent:', error);
    }
  };

  const handleStop = async () => {
    try {
      await stopAgent();
    } catch (error) {
      console.error('Failed to stop agent:', error);
    }
  };

  if (organizationRole !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="text-center max-w-md">
          <div className="p-4 bg-gray-100 rounded-full inline-block mb-6">
            <Bot size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Admin Access Required</h2>
          <p className="text-gray-600 leading-relaxed">
            Only organization administrators can manage the voice agent. Please contact your organization admin for access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-none p-6 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <Bot size={28} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Voice Agent</h1>
                <p className="text-gray-600">Deploy an AI assistant to handle mortgage inquiries</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {config.status === 'active' && config.phoneNumber && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  <Phone size={18} />
                  <span className="font-medium">{config.phoneNumber}</span>
                </div>
              )}
              <button
                onClick={config.status === 'active' ? handleStop : handleDeploy}
                disabled={config.status === 'deploying' || loading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  config.status === 'active'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : config.status === 'deploying'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {config.status === 'active' ? (
                  <>
                    <Pause size={18} />
                    Stop Agent
                  </>
                ) : config.status === 'deploying' ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Deploy Agent
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {config.errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-6 mt-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle size={18} />
              <span className="font-medium">Deployment Error</span>
            </div>
            <p className="mt-1 text-sm text-red-600">{config.errorMessage}</p>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm">
            <BotConfiguration />
          </div>
        </div>
      </div>
    </div>
  );
}