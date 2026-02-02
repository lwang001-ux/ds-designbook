'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <LoginForm />
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">{APP_NAME}</h1>
          <p className="text-xl text-white/90 mb-6">
            A private community space for design teachers to connect, share, and inspire.
          </p>
          <div className="flex flex-wrap gap-2">
            {['MYP Design', 'PYP Design', 'Digital Fabrication', 'Assessment'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/20 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
