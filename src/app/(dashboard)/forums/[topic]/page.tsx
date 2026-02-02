'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AIDisclaimer } from '@/components/forums/AIDisclaimer';
import { FORUM_TOPICS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import type { Thread } from '@/lib/types';

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topic as string;
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const topic = FORUM_TOPICS.find((t) => t.id === topicId);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/threads?topicId=${topicId}`);
      const data = await response.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Topic not found</h2>
        <Link href="/forums" className="text-blue-600 hover:text-blue-700">
          Back to Forums
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/forums" className="hover:text-gray-700">
          Forums
        </Link>
        <span>/</span>
        <span className="text-gray-900">{topic.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{topic.name}</h1>
          <p className="text-gray-600">{topic.description}</p>
        </div>
        <Button>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Thread
        </Button>
      </div>

      {/* AI Disclaimer */}
      {topic.id === 'ai-discussion' && <AIDisclaimer className="mb-6" />}

      {/* Threads List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No threads yet</h3>
          <p className="text-gray-500 mb-4">
            Be the first to start a discussion in {topic.name}!
          </p>
          <Button>Start First Thread</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/forums/${topicId}/${thread.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Avatar
                  src={thread.authorPhotoURL}
                  name={thread.authorName}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {thread.isPinned && (
                      <Badge size="sm" variant="warning">
                        Pinned
                      </Badge>
                    )}
                    {thread.isLocked && (
                      <Badge size="sm" variant="error">
                        Locked
                      </Badge>
                    )}
                    <h3 className="font-medium text-gray-900 truncate">
                      {thread.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {thread.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{thread.authorName}</span>
                    <span>{formatRelativeTime(thread.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {thread.repliesCount} replies
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {thread.views} views
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
