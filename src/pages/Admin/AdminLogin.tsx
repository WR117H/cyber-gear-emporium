
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock } from 'lucide-react';
import { checkAdminPassword, setAdminAuthenticated } from '@/utils/adminAuth';

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isCorrect = await checkAdminPassword(password);
      
      if (isCorrect) {
        setAdminAuthenticated(true);
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Authentication failed",
          description: "The password you entered is incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10">
        <div className="text-center">
          <div className="h-20 w-20 bg-white/10 rounded-lg mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-400 mt-2">Enter your password to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-cyber-blue hover:bg-cyber-blue/90 text-cyber-navy transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Access Admin Panel"}
          </Button>

          <div className="text-center">
            <p className="text-xs text-white/50">
              Only authorized personnel should access this area.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
