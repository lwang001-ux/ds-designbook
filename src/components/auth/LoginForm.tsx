'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error('Name is required');
        }
        await register({ email, password, displayName, school });
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {mode === 'login' ? 'Welcome back' : 'Join DS DesignBook'}
      </h2>
      <p className="text-gray-600 mb-6">
        {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {mode === 'register' && (
          <>
            <Input
              label="Your Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Smith"
              required
            />
            <Input
              label="School"
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Your school name"
            />
          </>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.edu"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'register' ? 'Create a password' : 'Enter your password'}
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            New here?{' '}
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create an account
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
