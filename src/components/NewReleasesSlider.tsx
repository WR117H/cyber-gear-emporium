
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { mockProducts } from '@/data/products';

const NewReleasesSlider = () => {
  // Get first 6 products to display in the slider
  const featuredProducts = mockProducts.slice(0, 6);
  
  // Group products into categories to mimic the design in the image
  const categories = {
    'GADGETS': featuredProducts.slice(0, 2),
    'TOOLS': featuredProducts.slice(2, 4),
    'SECURITY': featuredProducts.slice(4, 6),
  };

  return (
    <section className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-white mb-8">New Releases</h2>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {Object.entries(categories).map(([category, products]) => (
              products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="flex flex-col h-full">
                    <Link to={`/product/${product.id}`}>
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
                    <div className="mt-3">
                      <p className="text-gray-400 uppercase text-sm tracking-wider">{category}</p>
                      <Link to={`/product/${product.id}`} className="text-white text-2xl font-bold hover:underline">
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
          <div className="flex justify-end mt-4">
            <CarouselPrevious className="relative inset-0 translate-y-0 mr-2" />
            <CarouselNext className="relative inset-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default NewReleasesSlider;
