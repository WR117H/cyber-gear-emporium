
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = "https://sfnifgnevvoxceiqjrdi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbmlmZ25ldnZveGNlaXFqcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MzI0NDEsImV4cCI6MjA2MDAwODQ0MX0.s5l7nU39_QYsETZMJr6v4iAhy8ocR8a6F9y8irFAEvQ";

// Create Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

// Log configuration status to help with debugging
console.log('Supabase configuration status:', 
  isSupabaseConfigured() ? 'Configured correctly' : 'Not configured properly');
