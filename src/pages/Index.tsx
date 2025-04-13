
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/products';
import { ShoppingCart, Star, Info } from 'lucide-react';
import NewReleasesSlider from '@/components/NewReleasesSlider';

const Index = () => {
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 3);
  
  return <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-white py-10 px-4 relative">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Logo/Icon */}
            <div className="mx-auto mb-6 w-12 h-12 relative">
              <div className="relative flex items-center justify-center w-full h-full">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              StealthByte <span className="text-cyber-blue">Pen-testing gears</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Pentest gears for the curious, the bold, and the ones who don't wait for per******n.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
              <Button asChild variant="cyber" size="lg">
                <a href="https://github.com/WR117H" target="_blank" rel="noopener noreferrer">GITHUB</a>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white/30 rounded-full">
                <Link to="/login">Login/SignUp</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* New Releases Slider */}
        <NewReleasesSlider />
        
        {/* Gadgets Section */}
        <section id="gadgets" className="py-8 px-4 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-white">Our gadgets</h2>
              <Link to="/products" className="text-white hover:underline">See more</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredProducts.map(product => <Link key={product.id} to={`/product/${product.id}`}>
                  <div className="border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30 bg-black">
                    <div className="p-3">
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-muted">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left px-1">
                        <h3 className="font-medium text-sm text-white">{product.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>)}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};

export default Index;
