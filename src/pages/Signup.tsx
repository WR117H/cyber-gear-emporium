import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Star, ArrowLeft } from 'lucide-react';
import { OTPVerification } from '@/components/OTPVerification';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
@@ -26,6 +27,7 @@ const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
@@ -47,7 +49,34 @@ const Signup = () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Instead of immediately registering, show OTP verification
      setShowOTP(true);
      
      toast({
        title: "Verification needed",
        description: "Please enter the code sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOTPVerify = async (code: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would verify the OTP code
      console.log('OTP verification with code:', code);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
@@ -56,8 +85,8 @@ const Signup = () => {
      navigate('/login');
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid code",
        variant: "destructive",
      });
    } finally {
@@ -67,7 +96,7 @@ const Signup = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-black z-[-1]"></div>
      <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>

      <div className="flex-1 flex items-center justify-center p-4">
@@ -87,102 +116,116 @@ const Signup = () => {
              </div>
            </div>

            {!showOTP ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
                <p className="text-muted-foreground mb-8">Sign up to get started</p>
              </>
            ) : (
              <h2 className="text-2xl font-bold text-white mb-2">Verify your identity</h2>
            )}
          </div>

          {!showOTP ? (
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
          ) : (
            <OTPVerification 
              length={6} 
              onVerify={handleOTPVerify} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
    </div>
