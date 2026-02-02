'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { User } from '@/lib/types';

interface MemberCardProps {
  member: User;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/members/${member.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={member.photoURL}
            name={member.displayName}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {member.displayName}
              </h3>
              {member.role === 'admin' && (
                <Badge size="sm" variant="info">Admin</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">
              {member.jobTitle}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 truncate">
          {member.school}
        </p>

        {member.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {member.bio}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Joined {formatDate(member.createdAt)}</span>
          {member.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {member.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
