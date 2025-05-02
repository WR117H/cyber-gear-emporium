
import CryptoJS from 'crypto-js';

// Default password hash (hashed value of "admin123")
const DEFAULT_PASSWORD_HASH = "3c3662bcb661d6de679c636744c66b62";

// Key for storing admin status in localStorage
const ADMIN_AUTH_KEY = 'admin_authenticated';
// Key for storing the admin password hash
const ADMIN_PASSWORD_HASH_KEY = 'admin_password_hash';

// Initialize password hash if not set
if (typeof window !== 'undefined' && window.localStorage) {
  if (!localStorage.getItem(ADMIN_PASSWORD_HASH_KEY)) {
    localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, DEFAULT_PASSWORD_HASH);
  }
}

// Check if admin is authenticated
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

// Set admin authenticated state
export const setAdminAuthenticated = (value: boolean): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  
  if (value) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};

// Check if password is correct
export const checkAdminPassword = (password: string): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  
  const storedHash = localStorage.getItem(ADMIN_PASSWORD_HASH_KEY) || DEFAULT_PASSWORD_HASH;
  const inputHash = CryptoJS.MD5(password).toString();
  return inputHash === storedHash;
};

// Change admin password
export const changeAdminPassword = (newPassword: string): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  
  try {
    const newHash = CryptoJS.MD5(newPassword).toString();
    localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, newHash);
    return true;
  } catch (error) {
    console.error('Error changing admin password:', error);
    return false;
  }
};
