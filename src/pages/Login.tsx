
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Star, ArrowLeft, Mail, Github, AlertTriangle } from 'lucide-react';
import { signIn, resetPassword, signInWithGitHub, isAuthenticated } from '@/utils/auth';
import { 
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [gitHubError, setGitHubError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const isLoggedIn = await isAuthenticated();
      if (isLoggedIn) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn(data.email, data.password);

      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setGitHubError(null);
    try {
      const result = await signInWithGitHub();
      if (!result.success && result.error) {
        setGitHubError(result.error);
      }
    } catch (error: any) {
      setGitHubError(error.message || "An unexpected error occurred");
    }
  };

  const onForgotPassword = async (data: ForgotPasswordFormValues) => {
    setIsResetLoading(true);

    try {
      const result = await resetPassword(data.email);

      if (result.success) {
        setShowForgotDialog(false);
        forgotPasswordForm.reset();
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions"
        });
      }
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-black z-[-1]"></div>
      <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 backdrop-blur-lg bg-black/40 p-8 rounded-xl border border-white/10">
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="mx-auto mb-6 w-12 h-12 relative">
              <div className="absolute inset-0 bg-cyber-blue/30 rounded-full blur-lg"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <Star className="w-8 h-8 text-cyber-blue" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to your account</p>
          </div>

          {gitHubError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {gitHubError.includes("provider is not enabled") 
                  ? "GitHub login is not available. Please contact the administrator to enable it."
                  : gitHubError}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="cyber"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative px-4 text-sm text-muted-foreground bg-black/40">
                  OR
                </div>
              </div>
              
              <Button
                type="button" 
                variant="outline" 
                className="w-full border-white/20 hover:bg-white/10"
                onClick={handleGitHubLogin}
              >
                <Github className="h-5 w-5 mr-2" />
                Continue with GitHub
              </Button>

              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-cyber-blue hover:underline">
                    Sign up
                  </Link>
                </div>
                
                <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="link" 
                      className="text-xs text-cyber-blue p-0 h-auto font-normal w-full"
                      type="button"
                    >
                      Forgot your password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-black border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Reset your password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...forgotPasswordForm}>
                      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4 pt-4">
                        <FormField
                          control={forgotPasswordForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                                  <Input
                                    placeholder="you@example.com"
                                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="submit"
                            variant="cyber"
                            className="w-full"
                            disabled={isResetLoading}
                          >
                            {isResetLoading ? "Sending..." : "Send Reset Link"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
