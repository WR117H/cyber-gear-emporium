import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { signUp } from '@/utils/auth';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
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

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black z-[-1]"></div>
      <div className="w-full max-w-md p-6 bg-white/5 rounded-xl border border-white/20 backdrop-blur">
        <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
        <p className="text-muted-foreground mb-8">Sign up to get started</p>

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
              className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy"
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
      </div>
    </div>
  );
}
