
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.inStock <= 0) return;
    
    // Add to cart using the context
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      description: product.description
    });
    
    // Call the optional onAddToCart prop if provided
    if (onAddToCart) {
      onAddToCart(product);
    }
  };
  
  return (
    <div className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-video relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isNew && (
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs px-2 py-1 border-0">
                NEW
              </Badge>
            )}
            {product.inStock <= 0 && (
              <Badge className="bg-red-500/90 text-white font-bold text-xs px-2 py-1 border-0">
                OUT OF STOCK
              </Badge>
            )}
          </div>

          {/* Quick actions overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-3">
              <Link to={`/product/${product.id}`}>
                <Button size="sm" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                  <Info className="h-4 w-4" />
                </Button>
              </Link>
              
              <Button 
                size="sm"
                onClick={handleAddToCart}
                disabled={product.inStock <= 0}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 border-0 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-white line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        
        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">Free shipping</span>
          </div>
          
          <Button 
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 border-0 rounded-xl px-6 font-medium"
            onClick={handleAddToCart}
            disabled={product.inStock <= 0}
          >
            Add to Cart
          </Button>
        </div>
        
        {/* Stock indicator */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Stock</span>
            <span className={`font-medium ${product.inStock > 10 ? 'text-green-400' : product.inStock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {product.inStock > 0 ? `${product.inStock} left` : 'Out of stock'}
            </span>
          </div>
          
          {/* Stock bar */}
          <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                product.inStock > 10 ? 'bg-green-400' : 
                product.inStock > 0 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.min((product.inStock / 20) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
