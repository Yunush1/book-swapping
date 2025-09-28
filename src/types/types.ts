
// // Types
// interface User {
//   id: number;
//   username: string;
//   email: string;
// }

// interface BookItem {
//   id: number;
//   title: string;
//   author: string;
//   condition: 'excellent' | 'good' | 'fair';
//   description: string;
//   image: string;
//   owner: string;
//   ownerId: number;
//   createdAt: string;
// }

// interface BookRequest {
//   id: number;
//   bookId: number;
//   bookTitle: string;
//   requesterName?: string;
//   requesterId?: number;
//   ownerName?: string;
//   ownerId?: number;
//   status: 'pending' | 'accepted' | 'declined';
//   message: string;
//   date: string;
//   type: 'incoming' | 'outgoing';
// }

// interface Notification {
//   id: number;
//   message: string;
//   type: 'request' | 'status_update';
//   read: boolean;
//   createdAt: string;
// }

// interface AuthFormData {
//   username: string;
//   email: string;
//   password: string;
// }

// interface BookFormData {
//   title: string;
//   author: string;
//   condition: 'excellent' | 'good' | 'fair';
//   description: string;
//   image: string;
// }

// type ViewType = 'home' | 'mybooks' | 'requests';

// // Components
// interface BookCardProps {
//   book: BookItem;
//   onRequest?: (bookId: number) => void;
//   onEdit?: (book: BookItem) => void;
//   onDelete?: (bookId: number) => void;
//   showActions?: boolean;
//   isOwner?: boolean;
// }

//csdcdoiciodnv
// types/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  username?: string;
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
}

export interface BookFormData {
  title: string;
  author: string;
  condition: 'excellent' | 'good' | 'fair';
  description: string;
  image: string;
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
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  date: string;
  type: 'incoming' | 'outgoing';
}

// export type {
//   User,
//   BookItem,
//   BookRequest,
//   Notification,
//   AuthFormData,
//   BookFormData,
//   ViewType,
//   BookCardProps,
// };