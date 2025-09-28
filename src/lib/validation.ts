
// lib/validation.ts
import { BookFormData, AuthFormData } from '@/types/types';
import { validateEmail } from './utils';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateAuthForm(data: AuthFormData, isLogin: boolean): ValidationResult {
  const errors: Record<string, string> = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  // Username validation for registration
  if (!isLogin) {
    if (!data.username) {
      errors.username = 'Username is required';
    } else if (data.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBookForm(data: BookFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!data.author.trim()) {
    errors.author = 'Author is required';
  } else if (data.author.length > 100) {
    errors.author = 'Author name must be less than 100 characters';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!data.image.trim()) {
    errors.image = 'Image URL is required';
  } else {
    try {
      new URL(data.image);
    } catch {
      errors.image = 'Please enter a valid URL';
    }
  }

  if (!['excellent', 'good', 'fair'].includes(data.condition)) {
    errors.condition = 'Please select a valid condition';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}