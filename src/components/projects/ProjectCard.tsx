'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Image count badge */}
          {project.images?.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {project.images.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge size="sm" variant="info">
              {project.gradeLevel}
            </Badge>
            <Badge size="sm">
              {project.designCyclePhase}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar
              src={project.authorPhotoURL}
              name={project.authorName || 'Unknown'}
              size="xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate">
                {project.authorName || 'Unknown'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {project.authorSchool || ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {project.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {project.commentsCount || 0}
            </span>
            <span className="ml-auto text-xs">
              {formatRelativeTime(project.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
