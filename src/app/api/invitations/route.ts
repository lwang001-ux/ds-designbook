import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';
import type { Invitation } from '@/lib/types';

// GET all invitations
export async function GET() {
  try {
    const invitations = await readData<Invitation[]>('invitations.json');

    // Sort by creation date (newest first)
    invitations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error reading invitations:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}

// POST create new invitation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, invitedById, invitedByName } = body;

    if (!email || !invitedById) {
      return NextResponse.json({ error: 'Email and inviter required' }, { status: 400 });
    }

    const invitations = await readData<Invitation[]>('invitations.json');

    // Check if email already has pending invitation
    const existing = invitations.find((i) => i.email === email && i.status === 'pending');
    if (existing) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
    }

    // Generate a unique token
    const token = `${generateId()}-${Math.random().toString(36).substring(2, 15)}`;

    const newInvitation: Invitation = {
      id: generateId(),
      email,
      token,
      invitedById,
      invitedByName: invitedByName || 'Admin',
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    invitations.push(newInvitation);
    await writeData('invitations.json', invitations);

    // In a real app, you would send an email here
    // For now, we'll just return the invitation with the token
    console.log(`Invitation created for ${email}. Token: ${token}`);

    return NextResponse.json(newInvitation, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
  }
}

// PUT update invitation status (accept/revoke)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, token } = body;

    const invitations = await readData<Invitation[]>('invitations.json');

    let inviteIndex: number;

    if (token) {
      // Find by token (for accepting)
      inviteIndex = invitations.findIndex((i) => i.token === token);
    } else if (id) {
      // Find by ID (for revoking)
      inviteIndex = invitations.findIndex((i) => i.id === id);
    } else {
      return NextResponse.json({ error: 'ID or token required' }, { status: 400 });
    }

    if (inviteIndex === -1) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const invitation = invitations[inviteIndex];

    // Check if expired
    if (new Date(invitation.expiresAt) < new Date()) {
      invitations[inviteIndex].status = 'expired';
      await writeData('invitations.json', invitations);
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if already used
    if (invitation.status !== 'pending') {
      return NextResponse.json({ error: `Invitation is ${invitation.status}` }, { status: 400 });
    }

    invitations[inviteIndex].status = status;
    await writeData('invitations.json', invitations);

    return NextResponse.json(invitations[inviteIndex]);
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
  }
}
