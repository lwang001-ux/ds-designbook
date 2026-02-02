import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';
import type { Thread } from '@/lib/types';

interface ThreadsData {
  [topicId: string]: Thread[];
}

// GET threads for a topic
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');

    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID required' }, { status: 400 });
    }

    const allThreads = await readData<ThreadsData>('threads.json');
    const threads = allThreads[topicId] || [];

    // Sort: pinned first, then by creation date (newest first)
    threads.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Error reading threads:', error);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
}

// POST create new thread
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, title, content, authorId, authorName, authorPhotoURL } = body;

    if (!topicId || !title || !content || !authorId) {
      return NextResponse.json({ error: 'Topic ID, title, content, and author required' }, { status: 400 });
    }

    const allThreads = await readData<ThreadsData>('threads.json');

    if (!allThreads[topicId]) {
      allThreads[topicId] = [];
    }

    const newThread: Thread = {
      id: generateId(),
      topicId,
      title,
      content,
      authorId,
      authorName,
      authorPhotoURL: authorPhotoURL || null,
      repliesCount: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastReplyAt: null,
    };

    allThreads[topicId].push(newThread);
    await writeData('threads.json', allThreads);

    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}

// PUT update thread (pin/lock/etc)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, threadId, ...updates } = body;

    if (!topicId || !threadId) {
      return NextResponse.json({ error: 'Topic ID and thread ID required' }, { status: 400 });
    }

    const allThreads = await readData<ThreadsData>('threads.json');

    if (!allThreads[topicId]) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const threadIndex = allThreads[topicId].findIndex((t) => t.id === threadId);

    if (threadIndex === -1) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    allThreads[topicId][threadIndex] = {
      ...allThreads[topicId][threadIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeData('threads.json', allThreads);

    return NextResponse.json(allThreads[topicId][threadIndex]);
  } catch (error) {
    console.error('Error updating thread:', error);
    return NextResponse.json({ error: 'Failed to update thread' }, { status: 500 });
  }
}

// DELETE thread
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    const threadId = searchParams.get('threadId');

    if (!topicId || !threadId) {
      return NextResponse.json({ error: 'Topic ID and thread ID required' }, { status: 400 });
    }

    const allThreads = await readData<ThreadsData>('threads.json');

    if (!allThreads[topicId]) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const filteredThreads = allThreads[topicId].filter((t) => t.id !== threadId);

    if (filteredThreads.length === allThreads[topicId].length) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    allThreads[topicId] = filteredThreads;
    await writeData('threads.json', allThreads);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 });
  }
}
