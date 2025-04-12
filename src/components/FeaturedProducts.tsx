
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { fetchProducts } from '@/utils/productDatabase';

const FeaturedProducts = () => {
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await fetchProducts();
        const featured = productsData.filter(product => product.featured).slice(0, 4);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  if (isLoading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8" id="featured">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Loading featured products...
            </p>
          </div>
        </div>
      </section>
    );
  }
  
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
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No featured products available at this time.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
