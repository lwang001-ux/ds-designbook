'use client';

import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const imageSizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  if (src) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-gray-100',
          sizes[size],
          className
        )}
      >
        <Image
          src={src}
          alt={name}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  // Fallback to initials
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  // Generate consistent color based on name
  const colorIndex = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-medium text-white',
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
