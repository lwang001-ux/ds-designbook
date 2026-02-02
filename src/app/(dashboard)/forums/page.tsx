'use client';

import { TopicCard } from '@/components/forums/TopicCard';
import { FORUM_TOPICS } from '@/lib/constants';

export default function ForumsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Discussion Forums</h1>
        <p className="text-gray-600">
          Connect with other design teachers on specific topics
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FORUM_TOPICS.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
