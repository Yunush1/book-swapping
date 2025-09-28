// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User, AuthFormData } from '@/types/types';
import {authService} from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: AuthFormData) => {
    setLoading(true);
    setError('');
    try {
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('accessToken', token);
      setUser(user);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: AuthFormData) => {
    setLoading(true);
    setError('');
    try {
      const { user, token } = await authService.register(userData);
      localStorage.setItem('accessToken', token);
      setUser(user);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setError('');
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};