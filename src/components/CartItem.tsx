
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center py-4 border-b border-cyber-blue/20">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-cyber-blue/30">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-cyber-light">{item.name}</h3>
          <p className="ml-4 text-cyber-blue font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{item.description}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-cyber-blue/30 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-md text-cyber-blue hover:bg-cyber-blue/10"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-md text-cyber-blue hover:bg-cyber-blue/10"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-cyber-blue hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
