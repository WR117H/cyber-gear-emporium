
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Link key={product.id} to={`/product/${product.id}`} className="block">
          <div className="bg-card/80 border border-cyber-blue/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-cyber-blue/40">
            <div className="p-4">
              <div className="aspect-square mb-4 rounded-md overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2">{product.name}</h3>
                <p className="text-cyber-blue font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
