'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeTime, getVideoEmbedUrl } from '@/lib/utils';
import type { Pin as PinType } from '@/lib/types';

interface PinProps {
  pin: PinType;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLike: () => void;
}

export function Pin({ pin, isOwner, onEdit, onDelete, onLike }: PinProps) {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);

  const renderContent = () => {
    switch (pin.type) {
      case 'photo':
        return (
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {pin.content.imageUrl && !imageError ? (
              <Image
                src={pin.content.imageUrl}
                alt={pin.content.caption || 'Pin image'}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {pin.content.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs line-clamp-2">{pin.content.caption}</p>
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg min-h-[100px]">
            <svg className="w-6 h-6 text-amber-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-gray-800 text-sm font-medium leading-relaxed">
              {pin.content.quote}
            </p>
            {pin.content.author && (
              <p className="text-gray-500 text-xs mt-2">— {pin.content.author}</p>
            )}
          </div>
        );

      case 'video':
        const embedUrl = pin.content.videoUrl ? getVideoEmbedUrl(pin.content.videoUrl) : null;
        return (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : pin.content.thumbnail ? (
              <Image
                src={pin.content.thumbnail}
                alt="Video thumbnail"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
        );

      case 'link':
        return (
          <a
            href={pin.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-2">
              {pin.content.favicon && (
                <Image
                  src={pin.content.favicon}
                  alt=""
                  width={16}
                  height={16}
                  className="mt-0.5"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {pin.content.title || pin.content.url}
                </p>
                {pin.content.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {pin.content.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-blue-600">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-xs">Open link</span>
            </div>
          </a>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden"
      style={{
        transform: `rotate(${pin.rotation}deg)`,
        maxWidth: pin.type === 'video' ? '280px' : '200px',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Pin head */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md z-10"
        style={{ backgroundColor: pin.pinColor }}
      />

      {/* Content */}
      <div className="p-2 pt-4">{renderContent()}</div>

      {/* Footer */}
      <div className="px-2 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar src={pin.authorPhotoURL} name={pin.authorName} size="xs" />
          <span className="text-xs text-gray-500 truncate max-w-[80px]">
            {pin.authorName}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {formatRelativeTime(pin.createdAt)}
        </span>
      </div>

      {/* Actions overlay */}
      {showActions && (
        <div className="absolute top-3 right-2 flex items-center gap-1">
          <button
            onClick={onLike}
            className="p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            title="Like"
          >
            <svg
              className={`w-4 h-4 ${pin.likes?.length > 0 ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {isOwner && (
            <>
              <button
                onClick={onEdit}
                className="p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
