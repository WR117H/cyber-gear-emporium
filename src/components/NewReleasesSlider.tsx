
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Squares } from "@/components/ui/squares-background";
import { fetchProducts } from '@/utils/productDatabase';
import { Product } from '@/types/product';

const NewReleasesSlider = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNewProducts = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProducts();
        const newReleases = products.filter(product => product.isNew).slice(0, 6);
        setNewProducts(newReleases);
      } catch (error) {
        console.error('Error loading new products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewProducts();
  }, []);
  
  // Group products into categories to mimic the design
  const categories = {
    'GADGETS': newProducts.filter(p => p.category === 'network').slice(0, 2),
    'TOOLS': newProducts.filter(p => p.category === 'hardware').slice(0, 2),
    'SECURITY': newProducts.filter(p => p.category === 'wireless').slice(0, 2),
  };

  if (isLoading) {
    return (
      <section className="py-7 px-4 bg-black relative">
        <div className="absolute inset-0 z-0">
          <Squares 
            direction="diagonal"
            speed={0.3}
            squareSize={60}
            borderColor="#1a1a1a" 
            hoverFillColor="#2a2a2a"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-5xl font-bold text-white mb-5">New Releases</h2>
          <div className="text-white">Loading new products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-7 px-4 bg-black relative">
      <div className="absolute inset-0 z-0">
        <Squares 
          direction="diagonal"
          speed={0.3}
          squareSize={60}
          borderColor="#1a1a1a" 
          hoverFillColor="#2a2a2a"
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl font-bold text-white mb-5">New Releases</h2>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {Object.entries(categories).map(([category, products]) => (
              products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="flex flex-col h-full">
                    <Link to={`/products/${product.id}`}>
                      <Card className="rounded-xl overflow-hidden border-0 bg-transparent">
                        <div className="aspect-[16/9] overflow-hidden rounded-xl">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      </Card>
                    </Link>
                    <div className="mt-2">
                      <p className="text-gray-400 uppercase text-sm tracking-wider">{category}</p>
                      <Link to={`/products/${product.id}`} className="text-white text-2xl font-bold hover:underline">
                        {product.name}
                      </Link>
                      <p className="text-gray-400 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))
            ))}
          </CarouselContent>
          <div className="flex justify-end mt-3">
            <CarouselPrevious className="relative inset-0 translate-y-0 mr-2" />
            <CarouselNext className="relative inset-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default NewReleasesSlider;
