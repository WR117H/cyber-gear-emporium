
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import { ShoppingCart, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItemType } from '@/types/cart';
import { mockProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  // In a real application, this would come from a global cart state
  const [cartItems, setCartItems] = useState<CartItemType[]>([
    {
      id: '1',
      name: mockProducts[0].name,
      description: mockProducts[0].description,
      price: mockProducts[0].price,
      image: mockProducts[0].image,
      quantity: 1
    },
    {
      id: '3',
      name: mockProducts[2].name,
      description: mockProducts[2].description,
      price: mockProducts[2].price,
      image: mockProducts[2].image,
      quantity: 2
    }
  ]);
  
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(15);
  const [total, setTotal] = useState(0);
  
  const { toast } = useToast();
  
  // Calculate totals
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shipping);
  }, [cartItems, shipping]);
  
  // Update quantity
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Remove item
  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };
  
  // Checkout
  const handleCheckout = () => {
    toast({
      title: "Checkout process",
      description: "This would proceed to payment in a real e-commerce store.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" /> Shopping Cart
        </h1>
        
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card/70 backdrop-blur-sm border border-cyber-blue/20 rounded-lg overflow-hidden p-6">
                <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
                
                {cartItems.map(item => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-card/70 backdrop-blur-sm border border-cyber-blue/20 rounded-lg overflow-hidden p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2 bg-cyber-blue/20" />
                  
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span className="text-cyber-blue text-xl">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-cyber-blue text-cyber-navy hover:bg-cyber-green mt-6"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Checkout
                  </Button>
                  
                  <Link to="/products">
                    <Button 
                      variant="link" 
                      className="w-full text-cyber-blue mt-2"
                    >
                      Continue Shopping
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-cyber-blue/10 rounded-full p-6 mb-6">
              <ShoppingCart className="h-12 w-12 text-cyber-blue" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Looks like you haven't added any products to your cart yet.
              Browse our collection to find the perfect gear for your needs!
            </p>
            
            <Button 
              asChild
              className="bg-cyber-blue text-cyber-navy hover:bg-cyber-green"
              size="lg"
            >
              <Link to="/products">
                Browse Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
