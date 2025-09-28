
// lib/auth.ts
import { AuthFormData, AuthResponse, User } from './authService';


class AuthService {
  async login(credentials: AuthFormData): Promise<AuthResponse> {
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    const mockUser: User = {
      id: Date.now(),
      username: credentials.email.split('@')[0],
      email: credentials.email,
      createdAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  async register(userData: AuthFormData): Promise<AuthResponse> {
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error('All fields are required');
    }

    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const mockUser: User = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      createdAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  async getCurrentUser(): Promise<User> {
    // Mock current user retrieval
    const userData = localStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    return JSON.parse(userData);
  }

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
  }
}

export const authService = new AuthService();
