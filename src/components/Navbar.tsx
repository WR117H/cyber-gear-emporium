
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';
import LanguageToggle from './LanguageToggle';
import SearchBar from './SearchBar';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const { items } = useCart();
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        try {
          const userData = await getCurrentUser();
          setUserName(userData?.user?.email?.split('@')[0] || null);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    checkAuth();
  }, [location.pathname]); // Re-check when route changes

  // Calculate cart count
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={`bg-black border-b border-white/10 py-4 sticky top-0 z-50 backdrop-blur-lg bg-opacity-70 ${isRTL ? 'font-mirza' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-white font-bold text-xl md:text-2xl tracking-tight">CYBER<span className="text-cyber-blue">GEAR</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-cyber-blue transition-colors">{t('home')}</Link>
            <Link to="/about" className="text-white hover:text-cyber-blue transition-colors">{t('about')}</Link>
            <Link to="/contact" className="text-white hover:text-cyber-blue transition-colors">{t('contact')}</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center">
            <button 
              onClick={toggleSearch} 
              className="text-white hover:text-cyber-blue p-2 transition-colors"
              aria-label={t('search')}
            >
              <Search />
            </button>
            
            <Link to="/cart" className="text-white hover:text-cyber-blue p-2 relative transition-colors">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-cyber-pink text-white" variant="destructive">
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {isLoggedIn ? (
              <Link to="/profile" className="text-white hover:text-cyber-blue p-2 transition-colors">
                <User />
              </Link>
            ) : (
              <Link to="/login">
                <Button className="ml-2 bg-cyber-blue hover:bg-cyber-blue/90 text-cyber-navy" size="sm">
                  {t('login')}
                </Button>
              </Link>
            )}

            <LanguageToggle className="ml-3" />
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white p-2 ml-2 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 mt-2 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-white hover:text-cyber-blue py-2 transition-colors" onClick={closeMenu}>{t('home')}</Link>
              <Link to="/about" className="text-white hover:text-cyber-blue py-2 transition-colors" onClick={closeMenu}>{t('about')}</Link>
              <Link to="/contact" className="text-white hover:text-cyber-blue py-2 transition-colors" onClick={closeMenu}>{t('contact')}</Link>
              
              {isLoggedIn && (
                <div className="border-t border-white/10 pt-3 mt-2">
                  <p className="text-sm text-white/70">{t('logged_in_as')} {userName}</p>
                  <Link to="/profile" className="text-cyber-blue hover:text-cyber-blue/70 py-2 transition-colors block" onClick={closeMenu}>
                    {t('view_profile')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Search Panel */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 bg-black border-b border-white/10 p-4 shadow-lg">
            <SearchBar onClose={toggleSearch} />
          </div>
        )}
      </div>
    </nav>
  );
}
