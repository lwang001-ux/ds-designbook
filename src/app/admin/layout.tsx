'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { Navbar } from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Invites', href: '/admin/invites' },
  { label: 'Members', href: '/admin/members' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          {/* Admin Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-6 h-12">
                <span className="text-sm font-medium text-gray-500">Admin</span>
                <nav className="flex items-center gap-1">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                        pathname === item.href
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <main>{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
