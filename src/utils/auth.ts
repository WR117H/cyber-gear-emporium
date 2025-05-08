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

export const signInWithGitHub = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured: GitHub login requires proper Supabase setup');
      toast({
        title: "GitHub Login unavailable",
        description: "Supabase not configured. GitHub login requires proper setup.",
        variant: "destructive"
      });
      return { success: false, error: "GitHub login requires Supabase configuration" };
    }
    
    // First, directly check if GitHub provider is enabled in Supabase
    try {
      // Make a preliminary attempt to start the GitHub OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}`,
        }
      });

      if (error) {
        if (error.message.includes("provider is not enabled")) {
          console.error("GitHub provider is not enabled in Supabase:", error);
          toast({
            title: "GitHub login unavailable",
            description: "The GitHub provider is not enabled in your Supabase project. Please enable it in the Supabase dashboard.",
            variant: "destructive",
          });
          return { success: false, error: error.message };
        } else {
          toast({
            title: "GitHub login failed",
            description: error.message,
            variant: "destructive",
          });
          return { success: false, error: error.message };
        }
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Error during GitHub login:', error);
      toast({
        title: "GitHub login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  } catch (error: any) {
    console.error('Error during GitHub login:', error);
    toast({
      title: "GitHub login failed",
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

// 2. Fix the password reset functionality with proper redirection
export const resetPassword = async (email: string) => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured: Using mock authentication for password reset');
      toast({
        title: "Development Mode",
        description: "Supabase not configured. In a real environment, a reset link would be sent to your email.",
      });
      
      return { success: true };
    }
    
    // Update the redirect path to point to a specific reset-password page
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    console.log('Reset password response:', data);
    toast({
      title: "Password reset email sent",
      description: "Check your email for a password reset link",
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error during password reset:', error);
    toast({
      title: "Password reset failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};
