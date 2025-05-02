
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info } from 'lucide-react';
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
    <div className="cyber-card group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.inStock <= 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-cyber-green text-cyber-navy font-bold">NEW</Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-cyber-light line-clamp-1">{product.name}</h3>
          <span className="text-cyber-blue font-bold">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <Link to={`/product/${product.id}`}>
            <Button variant="ghost" size="sm" className="text-cyber-light hover:text-cyber-blue">
              <Info className="h-4 w-4 mr-1" /> Details
            </Button>
          </Link>
          
          <Button 
            variant="default"
            size="sm"
            className="bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue hover:text-cyber-navy"
            onClick={handleAddToCart}
            disabled={product.inStock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
