import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Star, ArrowLeft } from 'lucide-react';
import { supabase } from '@/utils/supabase'; // Adjust the import based on your project structure
import { OTPVerification } from '@/components/OTPVerification';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<any>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Send OTP request and handle email submission
  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setUserEmail(data.email);

    try {
      // Call Supabase to send OTP to the user's email
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: true, // Automatically create a user
          emailRedirectTo: "https://cyber-gear-emporium.lovable.app/verify", // Adjust your redirect URL here
        },
      });

      if (error) throw error;

      // Store user data for later use (password, name)
      setUserData({
        name: data.name,
        email: data.email,
        password: data.password, // Optionally store password to use later
      });
      setShowOTP(true); // Show OTP input form after request
    } catch (error: any) {
      toast({
        title: "OTP not sent",
        description: error.message || "An error occurred while sending OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async (code: string) => {
    setIsLoading(true);

    try {
      // Verify OTP and proceed with account creation
      const { user, error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: code, // Pass OTP code
      });

      if (error) throw error;

      // Now sign up the user with email and password
      const result = await supabase.auth.signUp({
        email: userEmail,
        password: userData.password,
      });

      if (result.error) throw result.error;

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });

      navigate('/login'); // Redirect to login after success
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "An error occurred during verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            
            {!showOTP && (
              <>
                <div className="mx-auto mb-6 w-12 h-12 relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
                <p className="text-muted-foreground mb-8">Sign up to get started</p>
              </>
            )}
          </div>
          
          {showOTP ? (
            <OTPVerification 
              onVerify={handleOTPVerify} 
              isLoading={isLoading} 
              email={userEmail}
            />
          ) : (
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
                  variant="cyber"
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-cyber-blue hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;