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
            
            <div className="">
              <Button asChild variant="default" size="lg" className="rounded-full">
                <a href="#gadgets" className="bg-zinc-300flex flex-wrap justify-center gap-4 max-w-md mx-0 px-0 py-0 round-sm\n">GITHUB</a>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-full">
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
        
        {/* Login/Sign Up Section */}
        <section className="py-8 px-4 bg-black border-t border-white/10">
          <div className="max-w-6xl mx-auto flex justify-end">
            <div className="flex gap-4 w-full max-w-xs">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full">
                Login
              </Button>
              <Button className="bg-white text-black hover:bg-white/90 rounded-full">
                SignUp
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Categories */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Browse Categories</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {['Network', 'Wireless', 'Hardware', 'Software', 'Forensics'].map((category, index) => <Link key={index} to={`/products?category=${category.toLowerCase()}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center mb-2">
                      <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-center">{category}</span>
                  </div>
                </Link>)}
            </div>
          </div>
        </section>
        
        {/* Featured Content */}
        <section className="py-12 px-4 bg-black border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Top Releases</h2>
              <p className="text-muted-foreground">Check out our newest security tools and gadgets</p>
            </div>
            
            <div className="relative overflow-hidden rounded-xl aspect-video mb-6">
              <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200" alt="Featured content" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">MOMENTS</h3>
                  <p className="text-lg md:text-xl mb-4">Catch the most exciting releases from our latest drop.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(item => <div key={item} className="bg-black border border-white/10 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img src={`https://images.unsplash.com/photo-152637468${item * 4}-7f61d4dc18c${item}?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600`} alt={`Content ${item}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 text-left">
                    <p className="font-medium text-sm">Product release v{item}.0</p>
                  </div>
                </div>)}
            </div>
            
            <div className="mt-12 max-w-md mx-auto">
              <Button className="bg-white text-black hover:bg-white/90 rounded-full w-full py-6 text-lg">
                Renew Apple TV+
              </Button>
              <p className="text-center mt-4 text-muted-foreground">$9.99/month until canceled</p>
              
              <div className="flex justify-center mt-8 space-x-2">
                {[...Array(8)].map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`}></div>)}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Index;