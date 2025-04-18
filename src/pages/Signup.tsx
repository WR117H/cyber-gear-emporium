import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Star, ArrowLeft } from 'lucide-react';
import { signUp } from '@/utils/auth';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
@@ -27,7 +27,6 @@ const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
@@ -43,19 +42,12 @@ const Signup = () => {
    setIsLoading(true);

    try {
      const result = await signUp(data.email, data.password, data.name);


      if (result.success) {
        // Navigate to login page
        navigate('/login');
      }






    } catch (error) {
      toast({
        title: "Registration failed",
@@ -67,33 +59,6 @@ const Signup = () => {
    }
  };




























  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-black z-[-1]"></div>
@@ -116,116 +81,102 @@ const Signup = () => {
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-muted-foreground mb-8">Sign up to get started</p>






          </div>

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
