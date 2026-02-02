import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData } from '@/lib/db';

interface User {
  id: string;
  email: string;
  password: string;
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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const users = await readData<User[]>('users.json');
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
