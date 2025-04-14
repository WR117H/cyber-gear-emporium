
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, Image, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isAuthenticated, getCurrentUser, signOut } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getCount } = useCart();
  
  const categories = [
    { name: 'Network Tools', path: '/products?category=network' },
    { name: 'Wireless Devices', path: '/products?category=wireless' },
    { name: 'Hardware Kits', path: '/products?category=hardware' },
    { name: 'Software Tools', path: '/products?category=software' }
  ];

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus);
      
      if (authStatus) {
        const { user } = await getCurrentUser();
        setUserData(user);
      }
    };
    
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      setUserData(null);
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const cartItemCount = getCount();

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo area */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Image className="h-6 w-6 text-white" />
            </Link>
          </div>
          
          {/* Center logo/brand for Apple TV+ style */}
          <div className="hidden md:flex items-center justify-center flex-grow">
            <Link to="/" className="flex items-center">
              <span className="text-white font-bold text-2xl tracking-wider">CYBER<span className="text-white">GEAR</span></span>
            </Link>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Search button - visible on desktop */}
            <div className="hidden md:flex items-center">
              <Button variant="ghost" size="icon" className="text-white">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Auth/Profile buttons */}
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/profile')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 rounded-full">
                  Login/SignUp
                </Button>
              </Link>
            )}
            
            {/* Cart button */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-white">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white"
              >
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-white/10">
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Search products..."
                className="cyber-input w-full"
              />
            </div>
            
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            
            {!isLoggedIn && (
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-white hover:text-white/80"
                onClick={() => setIsOpen(false)}
              >
                Login/SignUp
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
