
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <Link key={product.id} to={`/product/${product.id}`} className="block">
          <div className="bg-black border border-white/10 rounded-[14px] overflow-hidden transition-all duration-300 hover:border-white/30 h-full">
            <div className="p-3">
              <div className="aspect-video mb-3 rounded-sm overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left px-1">
                <h3 className="font-medium mb-1 text-sm">{product.name}</h3>
                <p className="text-white/80 text-xs font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
