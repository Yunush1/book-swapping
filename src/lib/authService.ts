// types/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  avatar?: string;
  bio?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// types/book.ts
export interface BookItem {
  id: number;
  title: string;
  author: string;
  condition: 'excellent' | 'good' | 'fair';
  description: string;
  image: string;
  owner: string;
  ownerId: number;
  createdAt: string;
  isbn?: string;
  genre?: string;
  language?: string;
  publishedYear?: number;
}

export interface BookFormData {
  title: string;
  author: string;
  condition: 'excellent' | 'good' | 'fair';
  description: string;
  image: string;
  isbn?: string;
  genre?: string;
  language?: string;
  publishedYear?: number;
}

export interface BookFilters {
  condition?: 'excellent' | 'good' | 'fair';
  genre?: string;
  author?: string;
  minYear?: number;
  maxYear?: number;
}

// types/request.ts
export interface BookRequest {
  id: number;
  bookId: number;
  bookTitle: string;
  requesterName?: string;
  requesterId?: number;
  ownerName?: string;
  ownerId?: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  message: string;
  date: string;
  type: 'incoming' | 'outgoing';
  responseMessage?: string;
  responseDate?: string;
}

export interface CreateRequestData {
  bookId: number;
  message: string;
}

// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
