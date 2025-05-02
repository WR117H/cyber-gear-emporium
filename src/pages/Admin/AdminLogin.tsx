
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Lock, RefreshCw } from 'lucide-react';
import { checkAdminPassword, setAdminAuthenticated, resetAdminPassword } from '@/utils/adminAuth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetOption, setShowResetOption] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (checkAdminPassword(password)) {
        setAdminAuthenticated(true);
        toast({
          title: "Login successful",
          description: "Welcome to admin panel"
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Access denied",
          description: "Incorrect password",
          variant: "destructive"
        });
        setShowResetOption(true);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    if (resetAdminPassword()) {
      toast({
        title: "Password reset",
        description: "Admin password has been reset to the default (admin123)"
      });
      setPassword('');
    } else {
      toast({
        title: "Reset failed",
        description: "Could not reset the password",
        variant: "destructive"
      });
    }
  };

  // Check local storage on component mount
  useEffect(() => {
    const storedPassword = localStorage.getItem('admin_password');
    if (!storedPassword) {
      toast({
        title: "First time setup",
        description: "Use the default password: admin123"
      });
    }
  }, [toast]);

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 backdrop-blur-lg bg-black/40 p-8 rounded-xl border border-white/10">
        <div className="text-center">
          <div className="mx-auto mb-6 w-12 h-12 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-muted-foreground mb-8">Enter password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Enter admin password"
              required
            />
            <p className="text-xs text-cyber-blue mt-1">Default: admin123</p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy" 
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Access Admin Panel"}
          </Button>
        </form>

        {showResetOption && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Can't access? Reset to default password</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-cyber-blue border-cyber-blue/30"
              onClick={handleReset}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
