import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, RotateCcw, Loader2 } from 'lucide-react';
import { useAgentConfig } from '../../hooks/useAgentConfig';

const defaultPrompt = `You are a professional mortgage broker assistant. Your primary role is to collect essential information from callers.

Required Information to Collect:
1. Personal Details
   - Full name
   - Contact number
   - Email address

2. Loan Requirements
   - Purpose of loan (e.g., first home, refinance, investment)
   - Desired loan amount
   - Preferred loan term

3. Financial Information
   - Employment status
   - Annual income
   - Any existing loans

Guidelines:
- Ask one question at a time
- Confirm each piece of information before moving on
- Use clear, simple language
- Maintain a professional tone

Escalate to a Human Agent When:
- Complex financial situations are discussed
- Specific rate negotiations are requested
- After 3 failed attempts to understand the caller
- If the caller explicitly requests a human agent

Remember: Your role is to collect accurate information efficiently while providing a professional experience.`;

export default function BotConfiguration() {
  const { prompt: savedPrompt, loading, error: configError, saveConfig } = useAgentConfig();
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
  }, [savedPrompt]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await saveConfig(prompt);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPrompt(defaultPrompt);
    setShowResetConfirm(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading configuration...</span>
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 rounded-lg text-red-700">
          <p>{configError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Prompt Configuration */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">System Prompt</h2>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RotateCcw size={18} />
            Reset to Default
          </button>
        </div>

        {showResetConfirm && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Confirm Reset</h3>
            <p className="text-sm text-blue-700 mb-3">
              Are you sure you want to reset the prompt to its default value? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={20} className="text-yellow-700 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Important Guidelines</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  The system prompt defines what information to collect and when to transfer to a human agent. 
                  Keep it focused on essential data collection and clear escalation criteria.
                </p>
              </div>
            </div>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-[500px] font-mono text-sm border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter system prompt..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
}
