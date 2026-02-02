'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface Stats {
  totalMembers: number;
  pendingInvites: number;
  admins: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    pendingInvites: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const [usersRes, invitesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/invitations'),
      ]);

      const users = await usersRes.json();
      const invitations = await invitesRes.json();

      setStats({
        totalMembers: users.length,
        pendingInvites: invitations.filter((i: { status: string }) => i.status === 'pending').length,
        admins: users.filter((u: { role: string }) => u.role === 'admin').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statCards = [
    {
      label: 'Total Members',
      value: stats.totalMembers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-blue-600 bg-blue-100',
      link: '/admin/members',
    },
    {
      label: 'Pending Invites',
      value: stats.pendingInvites,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-amber-600 bg-amber-100',
      link: '/admin/invites',
    },
    {
      label: 'Admins',
      value: stats.admins,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'text-purple-600 bg-purple-100',
      link: '/admin/members',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your community</p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <Link key={stat.label} href={stat.link}>
              <Card hover className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/invites">
          <Card hover className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Invite New Member</h3>
                <p className="text-sm text-gray-500">Send an email invitation</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/members">
          <Card hover className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Members</h3>
                <p className="text-sm text-gray-500">View and edit member roles</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
