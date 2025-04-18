import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/utils/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: "https://your-site.com/welcome", // Adjust this to your actual redirect URL
        },
      });

      if (error) throw error;

      toast({
        title: "Check your inbox",
        description: "We've sent you a magic link to log in.",
      });
    } catch (error: any) {
      toast({
        title: "Magic link not sent",
        description: error.message || "An error occurred while sending the magic link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold">Sign up with Magic Link</h2>

        <input {...register('name')} placeholder="Name" className="w-full p-2 rounded bg-gray-800" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input {...register('email')} placeholder="Email" className="w-full p-2 rounded bg-gray-800" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending link...' : 'Send Magic Link'}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
