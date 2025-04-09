
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-cyber-navy/80 backdrop-blur-md border-b border-cyber-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-cyber-blue font-bold text-xl tracking-wider">CYBER<span className="text-cyber-green">GEAR</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {categories.map((category) => (
                <Link 
                  key={category.name}
                  to={category.path}
                  className="px-3 py-2 text-sm font-medium text-cyber-light hover:text-cyber-blue transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center ml-4 space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="cyber-input pr-10 w-36 sm:w-48 md:w-64 h-9"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-cyber-light hover:text-cyber-blue">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-cyber-green text-cyber-navy rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-2">
              <Button variant="ghost" size="icon" className="text-cyber-light hover:text-cyber-blue">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-cyber-green text-cyber-navy rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  3
                </span>
              </Button>
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-cyber-light hover:text-cyber-blue"
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
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-cyber-navy/95 border-t border-cyber-blue/20">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block px-3 py-2 text-base font-medium text-cyber-light hover:text-cyber-blue"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Search products..."
                className="cyber-input w-full"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
