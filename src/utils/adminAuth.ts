
// Key for storing admin status in localStorage
const ADMIN_AUTH_KEY = 'admin_authenticated';
// Key for storing the admin password in plaintext (not secure, but as requested)
const ADMIN_PASSWORD_KEY = 'admin_password';

// Default admin password
const DEFAULT_PASSWORD = "admin123";

// Initialize password if not set
if (typeof window !== 'undefined' && window.localStorage) {
  if (!localStorage.getItem(ADMIN_PASSWORD_KEY)) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);
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

// Check if password is correct - directly compare without hashing
export const checkAdminPassword = (password: string): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  
  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
  
  // For debugging
  console.log('Input password:', password);
  console.log('Stored password:', storedPassword);
  console.log('Match?', password === storedPassword);
  
  return password === storedPassword;
};

// Change admin password
export const changeAdminPassword = (newPassword: string): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    return true;
  } catch (error) {
    console.error('Error changing admin password:', error);
    return false;
  }
};

// Reset admin password to default (admin123)
export const resetAdminPassword = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);
    return true;
  } catch (error) {
    console.error('Error resetting admin password:', error);
    return false;
  }
};
