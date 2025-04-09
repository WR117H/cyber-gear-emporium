
import React from 'react';
import ProductCard from './ProductCard';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/products';

const FeaturedProducts = () => {
  const { toast } = useToast();
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 4);
  
  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" id="featured">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check out our most popular penetration testing gear and security equipment
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
