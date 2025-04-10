
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/products';
import { ShoppingCart, Star, Info } from 'lucide-react';

const Index = () => {
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 3);
  
  return <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-black text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo/Icon */}
            <div className="mx-auto mb-6 w-12 h-12 relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All you want from a <span className="text-white">gadget store</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Harnessed for productivity. Designed for collaboration.
              Celebrated for built-in security. Welcome to the platform developers love.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
              <Button asChild variant="default" size="lg" className="rounded-[14px]">
                <a href="#gadgets" className="mx-0 my-0 px-0 py-0">GITHUB</a>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-[14px]">
                <a href="#about">About</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Gadgets Section */}
        <section id="gadgets" className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Our gadgets</h2>
              <Link to="/products" className="text-white hover:underline">See more</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredProducts.map(product => <Link key={product.id} to={`/product/${product.id}`}>
                  <div className="bg-black border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30">
                    <div className="p-3">
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-muted">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left px-1">
                        <h3 className="font-medium text-sm">{product.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>)}
            </div>
          </div>
        </section>
        
        {/* I've removed the "Browse Categories" and "Top Releases" sections as requested */}
      </main>
      
      <Footer />
    </div>;
};

export default Index;
