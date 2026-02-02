'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">{children}</main>
      </div>
    </AuthGuard>
  );
}
