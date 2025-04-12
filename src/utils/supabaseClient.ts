const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Define a placeholder URL and key for development/fallback
const PLACEHOLDER_URL = 'https://placeholder-project.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key';

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
