import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';
import type { Pin } from '@/lib/types';

// GET all pins
export async function GET() {
  try {
    const pins = await readData<Pin[]>('pins.json');
    return NextResponse.json(pins);
  } catch (error) {
    console.error('Error reading pins:', error);
    return NextResponse.json({ error: 'Failed to fetch pins' }, { status: 500 });
  }
}

// POST create new pin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pins = await readData<Pin[]>('pins.json');

    // Get next zIndex
    const maxZIndex = pins.reduce((max, pin) => Math.max(max, pin.zIndex || 0), 0);

    const newPin: Pin = {
      id: generateId(),
      type: body.type,
      content: body.content,
      position: body.position,
      rotation: body.rotation || 0,
      pinColor: body.pinColor,
      zIndex: maxZIndex + 1,
      authorId: body.authorId,
      authorName: body.authorName,
      authorPhotoURL: body.authorPhotoURL || null,
      createdAt: new Date().toISOString() as any,
      updatedAt: new Date().toISOString() as any,
      likes: [],
      isSticky: false,
    };

    pins.push(newPin);
    await writeData('pins.json', pins);

    return NextResponse.json(newPin);
  } catch (error) {
    console.error('Error creating pin:', error);
    return NextResponse.json({ error: 'Failed to create pin' }, { status: 500 });
  }
}

// PUT update pin
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const pins = await readData<Pin[]>('pins.json');
    const pinIndex = pins.findIndex((p) => p.id === id);

    if (pinIndex === -1) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }

    pins[pinIndex] = {
      ...pins[pinIndex],
      ...updates,
      updatedAt: new Date().toISOString() as any,
    };

    await writeData('pins.json', pins);

    return NextResponse.json(pins[pinIndex]);
  } catch (error) {
    console.error('Error updating pin:', error);
    return NextResponse.json({ error: 'Failed to update pin' }, { status: 500 });
  }
}

// DELETE pin
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Pin ID required' }, { status: 400 });
    }

    const pins = await readData<Pin[]>('pins.json');
    const filteredPins = pins.filter((p) => p.id !== id);

    if (filteredPins.length === pins.length) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }

    await writeData('pins.json', filteredPins);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pin:', error);
    return NextResponse.json({ error: 'Failed to delete pin' }, { status: 500 });
  }
}
