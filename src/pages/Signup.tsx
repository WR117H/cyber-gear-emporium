
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signUp, signInWithGitHub, isAuthenticated } from '@/utils/auth';
import { Progress } from '@/components/ui/progress';
import { 
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Github, Check, AlertTriangle, Info, Loader2 } from 'lucide-react';

// Password strength validator
const checkPasswordStrength = (password: string): { score: number; feedback: string } => {
  let score = 0;
  let feedback = '';
  
  // Length check
  if (password.length >= 8) score += 1;
  
  // Contains number
  if (/\d/.test(password)) score += 1;
  
  // Contains lowercase letter
  if (/[a-z]/.test(password)) score += 1;
  
  // Contains uppercase letter
  if (/[A-Z]/.test(password)) score += 1;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Give feedback based on score
  switch (score) {
    case 0:
    case 1:
      feedback = 'Very weak - use at least 8 characters';
      break;
    case 2:
      feedback = 'Weak - add numbers and special characters';
      break;
    case 3:
      feedback = 'Moderate - consider adding uppercase letters';
      break;
    case 4:
      feedback = 'Strong - good password';
      break;
    case 5:
      feedback = 'Very strong - excellent password';
      break;
  }
  
  return { score, feedback };
};

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .refine(
    (password) => checkPasswordStrength(password).score >= 3,
    { message: "Password is too weak, add uppercase, numbers, or special characters" }
  );

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
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

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const watchedPassword = form.watch("password");
  
  // Update password strength whenever password changes
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(checkPasswordStrength(watchedPassword));
    } else {
      setPasswordStrength({ score: 0, feedback: '' });
    }
  }, [watchedPassword]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const result = await signUp(data.email, data.password, data.name);
      if (result.success) {
        toast({ 
          title: "Registration successful", 
          description: "Please check your email to verify your account" 
        });
        navigate('/login');
      } else {
        toast({ 
          title: "Registration failed", 
          description: result.error || "Could not create account" 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Registration failed", 
        description: error.message || "Unknown error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    setGitHubError(null);
    try {
      setIsGitHubLoading(true);
      const result = await signInWithGitHub();
      if (!result.success && result.error) {
        setGitHubError(result.error);
      }
    } catch (error: any) {
      setGitHubError(error.message || "An unexpected error occurred");
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const getStrengthColor = (score: number) => {
    switch(score) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-400';
      case 5: return 'bg-green-600';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black z-[-1]"></div>
      <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
      <div className="w-full max-w-md p-8 bg-black/60 rounded-xl border border-white/20 backdrop-blur">
        <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
        <p className="text-muted-foreground mb-6">Sign up to get started</p>

        {gitHubError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {gitHubError.includes("provider is not enabled") 
                ? "GitHub signup is not available. Please contact the administrator to enable it."
                : gitHubError}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
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
                  {watchedPassword && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(passwordStrength.score / 5) * 100} 
                          className={`h-2 ${getStrengthColor(passwordStrength.score)}`} 
                        />
                        <span className="text-xs text-white/70">{(passwordStrength.score / 5) * 100}%</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        {passwordStrength.score < 3 ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        ) : passwordStrength.score >= 4 ? (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                        <span className="text-white/70">{passwordStrength.feedback}</span>
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
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
              className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative px-4 text-sm text-muted-foreground bg-black/10">
                OR
              </div>
            </div>
            
            <Button
              type="button" 
              variant="outline" 
              className="w-full border-white/20 hover:bg-white/10"
              onClick={handleGitHubSignup}
              disabled={isGitHubLoading}
            >
              {isGitHubLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Github className="h-5 w-5 mr-2" />
                  Sign up with GitHub
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-cyber-blue hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
