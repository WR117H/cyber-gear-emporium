
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import CartItem from '@/components/CartItem';
import { mockProducts } from '@/data/products';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CreditCard, Bitcoin } from 'lucide-react';
import CryptoPayment from '@/components/CryptoPayment';
import { CartItemType } from '@/types/cart';

const Cart = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'crypto' | null>(null);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  // Convert mock products to cart items with quantity
  const cartItems: CartItemType[] = mockProducts.slice(0, 3).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    quantity: 1
  }));
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15;
  const total = subtotal + shipping;
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    // This would update the cart state in a real application
    console.log(`Updated quantity for ${id} to ${quantity}`);
  };

  const handleRemoveItem = (id: string) => {
    // This would remove the item from cart in a real application
    console.log(`Removed item ${id} from cart`);
  };
  
  const handlePaymentComplete = () => {
    setIsPaymentComplete(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" asChild size="sm">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>
        
        {isPaymentComplete ? (
          <div className="p-8 border border-cyber-blue/30 rounded-xl text-center bg-cyber-navy/20 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyber-blue/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-cyber-blue" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Thank you for your order!</h2>
            <p className="text-muted-foreground mb-6">Your payment was successful and your order is being processed.</p>
            <p className="text-sm text-white">Redirecting to homepage...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map(item => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border border-white/10 rounded-xl">
                  <p className="text-white mb-4">Your cart is empty</p>
                  <Button asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              {cartItems.length > 0 && !paymentMethod && (
                <div className="border border-white/10 rounded-xl p-6 bg-card/30 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-white">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-white">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <h3 className="text-white font-medium mb-2">Select payment method</h3>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => setPaymentMethod('credit')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit Card
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => setPaymentMethod('crypto')}
                    >
                      <Bitcoin className="mr-2 h-4 w-4" />
                      Cryptocurrency
                    </Button>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'credit' && (
                <div className="border border-white/10 rounded-xl p-6 space-y-4 bg-card/30 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Credit Card Payment
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Card Number
                      </label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456"
                        className="cyber-input w-full"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Expiration Date
                        </label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="cyber-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          CVC
                        </label>
                        <input 
                          type="text" 
                          placeholder="123"
                          className="cyber-input w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Name on Card
                      </label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="cyber-input w-full"
                      />
                    </div>
                    
                    <Button 
                      variant="cyber"
                      className="w-full"
                      onClick={handlePaymentComplete}
                    >
                      Pay ${total.toFixed(2)}
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      className="w-full"
                      onClick={() => setPaymentMethod(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'crypto' && (
                <CryptoPayment 
                  amount={total} 
                  onComplete={handlePaymentComplete} 
                />
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
