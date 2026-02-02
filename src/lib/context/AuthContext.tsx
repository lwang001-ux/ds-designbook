'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: string;
  school: string;
  jobTitle: string;
  bio: string;
  location: string;
  contactEmail: string;
  socialLinks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; displayName: string; school?: string; jobTitle?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ds-designbook-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ds-designbook-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      localStorage.setItem('ds-designbook-user', JSON.stringify(data.user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; displayName: string; school?: string; jobTitle?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setUser(result.user);
      localStorage.setItem('ds-designbook-user', JSON.stringify(result.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ds-designbook-user');
  };

  const refreshUser = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      const currentUser = users.find((u: User) => u.id === user.id);
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('ds-designbook-user', JSON.stringify(currentUser));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
