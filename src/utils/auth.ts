
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { toast } from '@/hooks/use-toast';

export const signUp = async (email: string, password: string, name: string) => {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured: Using mock authentication for signup');
      // Mock successful signup
      toast({
        title: "Development Mode",
        description: "Supabase not configured. Using mock authentication.",
      });
      
      // Store mock user in localStorage for development
      localStorage.setItem('user', JSON.stringify({ email, name }));
      
      return { success: true, data: { user: { email, user_metadata: { name } } } };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }

    toast({
      title: "Verification email sent",
      description: "Please check your email to verify your account",
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error during signup:', error);
    toast({
      title: "Sign up failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured: Using mock authentication for signin');
      // Mock successful login
      toast({
        title: "Development Mode",
        description: "Supabase not configured. Using mock authentication.",
      });
      
      // Store mock user in localStorage for development
      localStorage.setItem('user', JSON.stringify({ email }));
      
      return { success: true, data: { user: { email } } };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }

    toast({
      title: "Login successful",
      description: "Welcome back!",
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error during login:', error);
    toast({
      title: "Login failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const signOut = async () => {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      localStorage.removeItem("user");
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      return { success: true };
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }

    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });

    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    toast({
      title: "Logout failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      const storedUser = localStorage.getItem('user');
      return { user: storedUser ? JSON.parse(storedUser) : null, error: null };
    }
    
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { user: null, error };
    }
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

export const isAuthenticated = async () => {
  const { user } = await getCurrentUser();
  return !!user;
};
