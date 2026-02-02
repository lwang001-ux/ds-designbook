import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData, writeData, generateId } from '@/lib/db';

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
    const { email, password, displayName, school, jobTitle } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const users = await readData<User[]>('users.json');

    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: generateId(),
      email,
      password: hashedPassword,
      displayName,
      photoURL: null,
      role: users.length === 0 ? 'admin' : 'member', // First user is admin
      school: school || '',
      jobTitle: jobTitle || '',
      bio: '',
      location: '',
      contactEmail: email,
      socialLinks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeData('users.json', users);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
