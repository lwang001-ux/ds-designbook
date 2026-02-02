import type { ForumTopic, GradeLevel, DesignCyclePhase } from './types';

// Design tokens
export const COLORS = {
  // Core colors
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  cream: '#F5F5F3',
  black: '#1A1A1A',

  // Background
  backgroundWhiteboard: '#FFFFFF',
  backgroundPage: '#F8F8F8',

  // Pin colors (playful, colorful)
  pinColors: [
    '#E54B2A', // Red
    '#E8713A', // Orange
    '#D4A72C', // Yellow/Gold
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#00BCD4', // Cyan
  ],

  // Functional grays
  gray80: 'rgba(26, 26, 26, 0.8)',
  gray60: 'rgba(26, 26, 26, 0.6)',
  gray40: 'rgba(26, 26, 26, 0.4)',
  gray20: 'rgba(26, 26, 26, 0.2)',
  gray10: 'rgba(26, 26, 26, 0.1)',
  gray05: 'rgba(26, 26, 26, 0.05)',

  // Borders
  border: '#E0E0E0',
  borderLight: '#EEEEEE',

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
} as const;

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  pin: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
} as const;

// Forum topics configuration
export const FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'myp-design-cycle',
    name: 'MYP Design Cycle',
    description: 'Discuss the MYP design cycle phases and implementation strategies',
    icon: 'cycle',
    color: '#4F46E5', // Indigo
  },
  {
    id: 'pyp-design',
    name: 'PYP Design',
    description: 'Primary Years Programme design teaching strategies and resources',
    icon: 'blocks',
    color: '#059669', // Emerald
  },
  {
    id: 'ib-design-tech',
    name: 'IB Design Tech',
    description: 'DP/CP Design Technology curriculum and assessment discussions',
    icon: 'tech',
    color: '#DC2626', // Red
  },
  {
    id: 'curriculum',
    name: 'Curriculum',
    description: 'Curriculum planning, scope & sequence discussions',
    icon: 'book',
    color: '#7C3AED', // Violet
  },
  {
    id: 'ai-discussion',
    name: 'AI',
    description: 'Discuss AI in education - for discussion only',
    icon: 'brain',
    color: '#0891B2', // Cyan
    disclaimer:
      'IMPORTANT: This forum is for discussing AI in education. It is NOT for generating or requesting AI-created lesson plans, assessments, or curriculum content. Such requests will be removed.',
  },
  {
    id: 'digital-fabrication',
    name: 'Digital Fabrication',
    description: '3D printing, laser cutting, CNC, and maker tools',
    icon: 'printer3d',
    color: '#EA580C', // Orange
  },
  {
    id: 'grading-assessment',
    name: 'Grading/Assessment',
    description: 'Assessment strategies, rubrics, and grading practices',
    icon: 'clipboard',
    color: '#65A30D', // Lime
  },
  {
    id: 'idea-generator',
    name: 'Idea Generator',
    description: 'Brainstorming space for project ideas and inspiration',
    icon: 'lightbulb',
    color: '#F59E0B', // Amber
  },
] as const;

// Grade levels
export const GRADE_LEVELS: GradeLevel[] = ['PYP', 'MYP', 'DP', 'CP', 'Multi-grade'];

// Design cycle phases
export const DESIGN_CYCLE_PHASES: DesignCyclePhase[] = [
  'Inquiring',
  'Developing',
  'Creating',
  'Evaluating',
  'Full Cycle',
];

// Upload limits
export const UPLOAD_LIMITS = {
  avatar: {
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 500,
    maxHeight: 500,
  },
  pin: {
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxWidth: 2000,
    maxHeight: 2000,
  },
  project: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 4000,
    maxHeight: 4000,
  },
} as const;

// Navigation items
export const NAV_ITEMS = [
  { label: 'Board', href: '/', icon: 'board' },
  { label: 'Projects', href: '/projects', icon: 'projects' },
  { label: 'Forums', href: '/forums', icon: 'forums' },
  { label: 'Members', href: '/members', icon: 'members' },
] as const;

// App metadata
export const APP_NAME = 'DS DesignBook';
export const APP_DESCRIPTION = 'A private community for design teachers';
