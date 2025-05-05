
import { supabase } from '@/integrations/supabase/client';

// Key for storing admin status in localStorage
const ADMIN_AUTH_KEY = 'admin_authenticated';
// Default admin password
const DEFAULT_PASSWORD = "admin123";

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

// Initialize the admin password in the database if not set
export const initializeAdminPassword = async (): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('key', 'admin_password')
      .single();
      
    if (error || !data) {
      // Insert the default password if not found
      await supabase
        .from('admin_settings')
        .insert([{ key: 'admin_password', value: DEFAULT_PASSWORD }]);
    }
  } catch (error) {
    console.error('Error initializing admin password:', error);
  }
};

// Check if password is correct by comparing with the one in the database
export const checkAdminPassword = async (password: string): Promise<boolean> => {
  // For debugging
  console.log('Input password:', password);
  
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();
      
    if (error) {
      console.error('Error fetching admin password from database:', error);
      // Fallback to default password if db fetch fails
      return password === DEFAULT_PASSWORD;
    }
    
    const storedPassword = data?.value;
    console.log('Stored password:', storedPassword);
    console.log('Match?', password === storedPassword);
    
    return password === storedPassword;
  } catch (error) {
    console.error('Error checking admin password:', error);
    // Fallback to default password if there's an error
    return password === DEFAULT_PASSWORD;
  }
};

// Change admin password
export const changeAdminPassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_settings')
      .update({ value: newPassword })
      .eq('key', 'admin_password');
      
    if (error) {
      console.error('Error updating admin password in database:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error changing admin password:', error);
    return false;
  }
};

// Reset admin password to default (admin123)
export const resetAdminPassword = async (): Promise<boolean> => {
  return await changeAdminPassword(DEFAULT_PASSWORD);
};

// Call initialization function when the file is imported
if (typeof window !== 'undefined') {
  initializeAdminPassword();
}
