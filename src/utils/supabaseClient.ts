
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sfnifgnevvoxceiqjrdi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbmlmZ25ldnZveGNlaXFqcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MzI0NDEsImV4cCI6MjA2MDAwODQ0MX0.s5l7nU39_QYsETZMJr6v4iAhy8ocR8a6F9y8irFAEvQ';


// Create Supabase client with better error handling
// The empty string check is critical - createClient requires non-empty strings
export const supabase = createClient(
  // Always provide a valid URL string, even if it's just a placeholder
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY
);

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey && 
         supabaseUrl !== PLACEHOLDER_URL &&
         supabaseAnonKey !== PLACEHOLDER_KEY;
};

// Log configuration status to help with debugging
console.log('Supabase configuration status:', 
  isSupabaseConfigured() ? 'Configured correctly' : 'Not configured properly');
console.log('Using URL:', supabaseUrl || PLACEHOLDER_URL);
