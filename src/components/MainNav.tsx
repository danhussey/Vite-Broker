import React, { useState } from 'react';
import { Phone, Users, FileText, Building2, User, Settings, LogOut, Building, Bot, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CreateOrganizationDialog from './organizations/CreateOrganizationDialog';

interface MainNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function MainNav({ activeSection, onSectionChange }: MainNavProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const { user, profile, organization, organizationRole, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { id: 'calls', icon: Phone, label: 'Call Inbox' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'providers', icon: Building2, label: 'Providers' },
    { id: 'agent', icon: Bot, label: 'Digital Agent' }
  ];

  return (
    <>
      <div className="w-16 bg-gradient-to-b from-gray-100 to-gray-200 h-screen flex flex-col items-center py-6 border-r border-gray-200">
        <div className="flex-1 w-full">
          {navItems.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`w-full p-3 flex justify-center group relative ${
                activeSection === id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
              }`}
              title={id.charAt(0).toUpperCase() + id.slice(1)}
            >
              <div className={`p-3 rounded-xl transition-all ${
                activeSection === id 
                  ? 'bg-white shadow-md text-blue-600' 
                  : 'group-hover:bg-white/60'
              }`}>
                <Icon size={22} />
              </div>
              {activeSection === id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="relative w-full px-3">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full p-3 flex justify-center group relative ${
              isUserMenuOpen ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Account"
          >
            <div className={`p-3 rounded-xl transition-all ${
              isUserMenuOpen ? 'bg-white shadow-md text-blue-600' : 'group-hover:bg-white/60'
            }`}>
              <User size={22} />
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute bottom-full left-16 mb-2 w-64 bg-white rounded-lg shadow-lg py-3 border border-gray-200">
              {/* User Profile Section */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {profile?.full_name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Organization Section */}
              <div className="px-4 py-2 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Organization</h4>
                {organization ? (
                  <div className="flex items-center gap-2 px-2 py-2 bg-gray-50 rounded-md">
                    <Building size={16} className="text-gray-400" />
                    <span className="text-gray-700">{organization.name}</span>
                    {organizationRole && (
                      <span className="ml-auto text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {organizationRole}
                      </span>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowCreateOrg(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Plus size={18} />
                    <span className="text-sm">Create Organization</span>
                  </button>
                )}
              </div>
              
              {/* Menu Items */}
              <div className="px-2 py-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings size={18} />
                  <span className="text-sm">Settings</span>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>

              {/* Arrow */}
              <div className="absolute -right-2 bottom-4 transform translate-x-full">
                <div className="w-2 h-2 rotate-45 bg-white border-l border-b border-gray-200" />
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateOrganizationDialog 
        isOpen={showCreateOrg} 
        onClose={() => setShowCreateOrg(false)} 
      />
    </>
  );
}
