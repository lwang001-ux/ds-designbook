import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

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

// GET all users (without passwords)
export async function GET() {
  try {
    const users = await readData<User[]>('users.json');
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PUT update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const users = await readData<User[]>('users.json');
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't allow password updates through this endpoint
    delete updates.password;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeData('users.json', users);

    const { password, ...userWithoutPassword } = users[userIndex];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
