
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
import { signIn } from '@/utils/auth';
import { OTPVerification } from '@/components/OTPVerification';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
 	setIsLoading(true);
 	setUserEmail(data.email);

 	try {
	 	const { error } = await supabase.auth.signInWithOtp({
	 		email: data.email,
 			options: {
				 emailRedirectTo: `${window.location.origin}/auth/callback` // Replace with your redirect route
		 	}
		 });

 		if (error) throw error;

	 	setShowOTP(true);
 		toast({
 			title: "Check your email",
 			description: "We've sent you a login code or magic link.",
 		});
 	} catch (error: any) {
 		console.error("OTP login error:", error);
 		toast({
	 		title: "Login failed",
 			description: error.message || "An unexpected error occurred",
 			variant: "destructive",
 		});
 		setShowOTP(false);
 	} finally {
 		setIsLoading(false);
 	}
 };
  
  const handleOTPVerify = async (code: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would validate the OTP code here
      // For now, we'll just simulate a successful verification
      const password = form.getValues("password");
      const result = await signIn(userEmail, password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
        navigate('/');
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid verification code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An error occurred during verification",
        variant: "destructive"
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
                
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-muted-foreground mb-8">Sign in to your account</p>
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
                
                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-cyber-blue hover:underline">
                    Sign up
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

export default Login;
