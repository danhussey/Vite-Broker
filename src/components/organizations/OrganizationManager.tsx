import React, { useState, useEffect } from 'react';
import { Building, Users, Settings, Plus, Trash2, UserPlus, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface Member extends OrganizationMember {
  profile: Profile;
}

export default function OrganizationManager() {
  const { user, organization, organizationRole } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (organization) {
      fetchMembers();
    }
  }, [organization]);

  async function fetchMembers() {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('organization_id', organization?.id);

      if (error) throw error;
      setMembers(data as Member[]);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }

  async function inviteMember(e: React.FormEvent) {
    e.preventDefault();
    if (!organization || !inviteEmail.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail)
        .single();

      if (userError) {
        setError('User not found. Please ensure they have registered first.');
        return;
      }

      // Add user to organization
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organization.id,
          user_id: userData.id,
          role: 'member'
        });

      if (memberError) throw memberError;

      setInviteEmail('');
      fetchMembers();
    } catch (error) {
      console.error('Error inviting member:', error);
      setError('Failed to invite member. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function removeMember(memberId: string) {
    if (!organization || organizationRole !== 'admin') return;

    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  }

  if (!organization) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Organization</h2>
          <p className="text-gray-600 mb-4">You are not currently part of any organization.</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{organization.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{members.length} members</span>
        </div>
      </div>

      {/* Member Management */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          {organizationRole === 'admin' && (
            <form onSubmit={inviteMember} className="flex gap-2">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <UserPlus size={18} />
                Invite
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {member.profile.full_name?.[0] || member.profile.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {member.profile.full_name || 'Unnamed User'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} />
                    {member.profile.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {member.role}
                </span>
                {organizationRole === 'admin' && member.user_id !== user?.id && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove member"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Settings */}
      {organizationRole === 'admin' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Settings</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-gray-500" />
                <span className="font-medium text-gray-900">General Settings</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}