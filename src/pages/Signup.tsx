import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Star, ArrowLeft } from "lucide-react";
import { OTPVerification } from "@/components/OTPVerification";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "YOUR_SUPABASE_URL", // Replace with your Supabase URL
  "YOUR_SUPABASE_ANON_KEY" // Replace with your Supabase Anon Key
);

const signupSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  const sendOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://cyber-gear-emporium.lovable.app/login", // Adjust this to your app's login URL
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${email}`,
      });
      setShowOTP(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setUserEmail(data.email);

    try {
      await sendOTP(data.email);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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

                <h2 className="text-2xl font-bold text-white mb-2">Send OTP</h2>
                <p className="text-muted-foreground mb-8">Enter your email to receive an OTP</p>
              </>
            )}
          </div>

          {showOTP ? (
            <OTPVerification
              onVerify={() => navigate("/login")}
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

                <Button
                  type="submit"
                  variant="cyber"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;