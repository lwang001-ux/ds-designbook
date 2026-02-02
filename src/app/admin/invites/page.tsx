'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate, isValidEmail } from '@/lib/utils';
import type { Invitation } from '@/lib/types';

export default function InvitesPage() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadInvitations = useCallback(async () => {
    try {
      const response = await fetch('/api/invitations');
      const invites = await response.json();
      setInvitations(invites);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!user) return;

    setSending(true);
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          invitedById: user.id,
          invitedByName: user.displayName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invitation');
      }

      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      loadInvitations();
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setSending(false);
    }
  };

  const handleRevoke = async (inviteId: string) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) return;

    try {
      await fetch('/api/invitations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inviteId, status: 'revoked' }),
      });
      loadInvitations();
    } catch (error) {
      console.error('Error revoking invitation:', error);
    }
  };

  const getStatusBadge = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'expired':
        return <Badge>Expired</Badge>;
      case 'revoked':
        return <Badge variant="error">Revoked</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invite Management</h1>
        <p className="text-gray-600">Invite new members to join the community</p>
      </div>

      {/* Send Invite Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Invitation</h2>
        <form onSubmit={handleSendInvite} className="flex gap-3">
          <div className="flex-1">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@school.edu"
              error={error}
            />
          </div>
          <Button type="submit" isLoading={sending}>
            Send Invite
          </Button>
        </form>
        {success && (
          <p className="mt-2 text-sm text-green-600">{success}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          The invitation will expire in 7 days. The recipient will receive an email with a link to join.
        </p>
      </div>

      {/* Invitations List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sent Invitations</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No invitations sent yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {invitations.map((invite) => (
              <div key={invite.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{invite.email}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>Sent {formatDate(invite.createdAt)}</span>
                    <span>by {invite.invitedByName}</span>
                    {invite.status === 'pending' && (
                      <span>Expires {formatDate(invite.expiresAt)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(invite.status)}
                  {invite.status === 'pending' && (
                    <button
                      onClick={() => handleRevoke(invite.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
