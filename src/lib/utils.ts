
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(date);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateBookId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function getBookConditionColor(condition: 'excellent' | 'good' | 'fair'): string {
  const colors = {
    excellent: 'text-green-600 bg-green-50',
    good: 'text-blue-600 bg-blue-50',
    fair: 'text-yellow-600 bg-yellow-50',
  };
  return colors[condition];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// lib/constants.ts
export const APP_NAME = 'BookSwap';
export const APP_DESCRIPTION = 'Trade books with fellow readers';

export const BOOK_CONDITIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new condition' },
  { value: 'good', label: 'Good', description: 'Minor wear, fully readable' },
  { value: 'fair', label: 'Fair', description: 'Some wear, still readable' },
] as const;

export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Poetry',
  'Children',
  'Young Adult',
  'Horror',
  'Thriller',
  'Comedy',
  'Drama',
] as const;

export const REQUEST_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  BOOKS: {
    LIST: '/books',
    CREATE: '/books',
    UPDATE: '/books',
    DELETE: '/books',
    SEARCH: '/books/search',
  },
  REQUESTS: {
    LIST: '/requests',
    CREATE: '/requests',
    UPDATE: '/requests',
    DELETE: '/requests',
  },
} as const;
