'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';
import type { User } from '@/lib/types';

export default function AdminMembersPage() {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      setMembers(users);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleRoleChange = async (userId: string, newRole: 'member' | 'admin') => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      loadMembers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
        <p className="text-gray-600">Manage member roles and permissions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No members found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={member.photoURL}
                    name={member.displayName}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{member.displayName}</p>
                      {member.role === 'admin' && (
                        <Badge size="sm" variant="info">Admin</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <p className="text-xs text-gray-400">
                      {member.school} | Joined {formatDate(member.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Role Actions */}
                {currentUser?.id !== member.id && (
                  <div>
                    {member.role === 'member' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(member.id, 'admin')}
                      >
                        Make Admin
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(member.id, 'member')}
                      >
                        Remove Admin
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
