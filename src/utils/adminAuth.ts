
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Admin table name in Supabase
const ADMIN_TABLE = 'admins';

// Fallback admin password for development
const ADMIN_PASSWORD = "admin123"; 

export const checkAdminPassword = async (password: string): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using local admin password.');
      return password === ADMIN_PASSWORD;
    }
    
    const { data, error } = await supabase
      .from(ADMIN_TABLE)
      .select('*')
      .eq('password', password)
      .single();

    if (error) {
      console.error('Error checking admin password:', error);
      return password === ADMIN_PASSWORD;
    }

    return !!data;
  } catch (err) {
    console.error('Error in admin authentication:', err);
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
