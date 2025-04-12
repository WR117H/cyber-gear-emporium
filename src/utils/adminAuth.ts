
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Admin table name in Supabase
const ADMIN_TABLE = 'admins';

// This is still kept for fallback but we'll use Supabase when available
const ADMIN_PASSWORD = "admin123"; 

export const checkAdminPassword = async (password: string): Promise<boolean> => {
  try {
    // If Supabase is not configured, fall back to local password check
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using local admin password.');
      return password === ADMIN_PASSWORD;
    }
    
    // Check if the provided password matches an admin in the database
    const { data, error } = await supabase
      .from(ADMIN_TABLE)
      .select('*')
      .eq('password', password)
      .single();

    if (error) {
      console.error('Error checking admin password:', error);
      // Fallback to local password if Supabase fails
      return password === ADMIN_PASSWORD;
    }

    return !!data;
  } catch (err) {
    console.error('Error in admin authentication:', err);
    // Fallback to local password if Supabase fails
    return password === ADMIN_PASSWORD;
  }
};

export const setAdminAuthenticated = (isAuthenticated: boolean): void => {
  if (isAuthenticated) {
    localStorage.setItem("adminAuthenticated", "true");
  } else {
    localStorage.removeItem("adminAuthenticated");
  }
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem("adminAuthenticated") === "true";
};
