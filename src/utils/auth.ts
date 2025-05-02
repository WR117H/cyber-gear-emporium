
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { toast } from '@/hooks/use-toast';

export const signUp = async (email: string, password: string, name: string) => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured: Using mock authentication for signup');
      toast({
        title: "Development Mode",
        description: "Supabase not configured. Using mock authentication.",
      });
      
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
      return { success: false, error: error.message };
    }

    toast({
      title: "Verification email sent",
      description: "Please check your email to verify your account",
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Error during signup:', error);
    toast({
      title: "Sign up failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured: Using mock authentication for signin');
      toast({
        title: "Development Mode",
        description: "Supabase not configured. Using mock authentication.",
      });
      
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
      return { success: false, error: error.message };
    }

    toast({
      title: "Login successful",
      description: "Welcome back!",
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Error during login:', error);
    toast({
      title: "Login failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
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
      return { success: false, error: error.message };
    }

    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error during logout:', error);
    toast({
      title: "Logout failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
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

// Add the missing updateUserProfile function
export const updateUserProfile = async (updates: any) => {
  try {
    if (!isSupabaseConfigured()) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({...user, ...updates}));
        return { success: true };
      }
      return { success: false, error: "No user found" };
    }
    
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      return { success: false, error: userError || "No user found" };
    }
    
    const { error } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};
