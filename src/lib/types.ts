// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'member' | 'admin';
  school: string;
  jobTitle: string;
  bio: string;
  location: string;
  contactEmail: string;
  phone?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  invitedBy: string;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastActiveAt' | 'invitedBy'>;

// Pin types
export type PinType = 'photo' | 'quote' | 'video' | 'link';

export interface PinContent {
  // For photo pins
  imageUrl?: string;
  caption?: string;
  // For quote pins
  quote?: string;
  author?: string;
  // For video pins
  videoUrl?: string;
  thumbnail?: string;
  // For link pins
  url?: string;
  title?: string;
  description?: string;
  favicon?: string;
}

export interface Pin {
  id: string;
  type: PinType;
  content: PinContent;
  position: {
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
  };
  rotation: number; // Degrees -15 to 15
  pinColor: string;
  zIndex: number;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  isSticky: boolean;
}

export type PinFormData = Omit<Pin, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'authorPhotoURL' | 'likes' | 'isSticky' | 'zIndex'>;

// Project types
export type GradeLevel = 'PYP' | 'MYP' | 'DP' | 'CP' | 'Multi-grade';
export type DesignCyclePhase = 'Inquiring' | 'Developing' | 'Creating' | 'Evaluating' | 'Full Cycle';

export interface ProjectImage {
  url: string;
  thumbnail: string;
  caption?: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: ProjectImage[];
  coverImageUrl?: string;
  gradeLevel: string;
  designCyclePhase: string;
  unit: string;
  tags: string[];
  authorId: string;
  authorName?: string;
  authorSchool?: string;
  authorPhotoURL?: string | null;
  likes: string[];
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  status?: 'published' | 'draft';
}

export interface ProjectComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: string;
  updatedAt: string;
}

// Forum types
export interface ForumTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  disclaimer?: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  topicId: string;
  topicName?: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  repliesCount: number;
  lastReplyAt: string | null;
  lastReplyBy?: string;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  parentReplyId: string | null;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

// Invitation types
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface Invitation {
  id: string;
  email: string;
  token: string;
  invitedById: string;
  invitedByName: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedUserId?: string;
}

// Activity types
export type ActivityType = 'pin_created' | 'project_posted' | 'thread_created' | 'reply_posted' | 'member_joined';
export type TargetType = 'pin' | 'project' | 'thread' | 'reply' | 'user';

export interface Activity {
  id: string;
  type: ActivityType;
  actorId: string;
  actorName: string;
  actorPhotoURL: string | null;
  targetType: TargetType;
  targetId: string;
  targetTitle?: string;
  createdAt: string;
}
