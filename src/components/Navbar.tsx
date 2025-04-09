
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const categories = [
    { name: 'Network Tools', path: '/products?category=network' },
    { name: 'Wireless Devices', path: '/products?category=wireless' },
    { name: 'Hardware Kits', path: '/products?category=hardware' },
    { name: 'Software Tools', path: '/products?category=software' }
  ];

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
          <div className="flex items-center">
            {/* Search button - visible on desktop */}
            <div className="hidden md:flex items-center mr-4">
              <Button variant="ghost" size="icon" className="text-white">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Cart button */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-white">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  3
                </span>
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
