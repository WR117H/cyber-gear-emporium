
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useTONConnect } from '@/context/TONConnectProvider';
import { createOrder } from '@/utils/orderDatabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CryptoPayment from '@/components/CryptoPayment';
import AddressForm from '@/components/AddressForm';
import { OrderAddress } from '@/types/order';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';

enum CheckoutStep {
  Address = 'address',
  Payment = 'payment',
  Confirmation = 'confirmation',
}

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isConnected } = useTONConnect();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.Address);
  const [address, setAddress] = useState<OrderAddress | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if cart is empty and user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const auth = await isAuthenticated();
      setIsLoggedIn(auth);
      
      if (auth) {
        const { user } = await getCurrentUser();
        setUserId(user.id);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    if (items.length === 0) {
      navigate('/cart');
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checking out."
      });
    }
  }, [items, navigate, toast]);
  
  const total = getTotal();
  
  const handleAddressSubmit = (shippingAddress: OrderAddress) => {
    setAddress(shippingAddress);
    setCurrentStep(CheckoutStep.Payment);
  };
  
  const handlePaymentComplete = async (method: string = 'ton') => {
    if (!address || !userId) {
      toast({
        title: "Error",
        description: "Missing address or user information",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create new order regardless of payment method
      const newOrder = await createOrder({
        userId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description
        })),
        total,
        paymentMethod: method,
        address,
        paymentStatus: 'paid',
        shippingAddress: {
          fullName: address.fullName,
          street: address.streetAddress,
          city: address.city,
          state: address.state,
          zipCode: address.postalCode,
          country: address.country
        },
        date: new Date().toISOString(),
        notes: ''
      });
      
      // Clear cart
      clearCart();
      
      // Set confirmation step
      setCurrentStep(CheckoutStep.Confirmation);
      
      // Show success message
      toast({
        title: "Order placed successfully!",
        description: "Your payment has been processed."
      });
      
      // Save the order ID for the confirmation page
      sessionStorage.setItem('lastOrderId', newOrder.id);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error processing order",
        description: "There was a problem creating your order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Add this new function to handle credit card payments
  const handleCreditCardPayment = () => {
    // In a real app, this would integrate with a payment processor
    // For now, we'll simulate a successful payment
    toast({
      title: "Payment processing",
      description: "Processing your credit card payment..."
    });
    
    // Simulate payment processing delay
    setTimeout(() => {
      handlePaymentComplete('credit_card');
    }, 1500);
  };
  
  const handleViewOrder = () => {
    const orderId = sessionStorage.getItem('lastOrderId');
    if (orderId) {
      navigate(`/order/${orderId}`);
    } else {
      navigate('/profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <p className="text-white text-xl">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-card/50 border-white/10">
            <h2 className="text-2xl font-bold text-center mb-6">Login Required</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please log in to continue with your checkout.
            </p>
            <Button 
              onClick={() => navigate('/login', { state: { returnUrl: '/checkout' } })}
              className="w-full"
            >
              Log In / Sign Up
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Checkout</h1>
          
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger 
                value={CheckoutStep.Address}
                disabled={currentStep !== CheckoutStep.Address}
                className={currentStep === CheckoutStep.Address ? "data-[state=active]:text-white" : ""}
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger 
                value={CheckoutStep.Payment}
                disabled={currentStep !== CheckoutStep.Payment}
                className={currentStep === CheckoutStep.Payment ? "data-[state=active]:text-white" : ""}
              >
                Payment
              </TabsTrigger>
              <TabsTrigger 
                value={CheckoutStep.Confirmation}
                disabled={currentStep !== CheckoutStep.Confirmation}
                className={currentStep === CheckoutStep.Confirmation ? "data-[state=active]:text-white" : ""}
              >
                Confirmation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={CheckoutStep.Address} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="p-6 bg-card/50 border-white/10">
                    <h2 className="text-xl font-semibold mb-4 text-white">Shipping Address</h2>
                    <AddressForm 
                      onSubmit={handleAddressSubmit} 
                      submitLabel="Continue to Payment"
                    />
                  </Card>
                </div>
                
                <div>
                  <Card className="p-6 bg-card/50 border-white/10">
                    <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal</p>
                          <p className="text-white">${total.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between pt-2">
                          <p className="font-semibold text-white">Total</p>
                          <p className="font-semibold text-white">${total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value={CheckoutStep.Payment} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="p-6 bg-card/50 border-white/10">
                    <h2 className="text-xl font-semibold mb-4 text-white">Payment Method</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-white mb-3">Crypto Payment</h3>
                        <CryptoPayment 
                          amount={total} 
                          onComplete={() => handlePaymentComplete('ton')} 
                        />
                      </div>
                      
                      <div className="pt-6 border-t border-white/10">
                        <h3 className="font-medium text-white mb-3">Credit Card Payment</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          For testing purposes only. No real payment will be processed.
                        </p>
                        <Button 
                          variant="default" 
                          onClick={handleCreditCardPayment}
                          className="w-full"
                        >
                          Pay with Credit Card
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(CheckoutStep.Address)}
                        className="w-full mt-4"
                      >
                        Back to Shipping
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div>
                  <Card className="p-6 bg-card/50 border-white/10">
                    <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
                    <div className="space-y-4">
                      {address && (
                        <div className="mb-4">
                          <h3 className="text-sm text-muted-foreground">Shipping Address:</h3>
                          <p className="text-white">{address.fullName}</p>
                          <p className="text-white text-sm">{address.streetAddress}</p>
                          <p className="text-white text-sm">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-white text-sm">{address.country}</p>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal</p>
                          <p className="text-white">${total.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between pt-2">
                          <p className="font-semibold text-white">Total</p>
                          <p className="font-semibold text-white">${total.toFixed(2)}</p>
                        </div>
                        <div className="pt-2 text-xs text-muted-foreground">
                          <p>Approximately {(total * 0.3).toFixed(2)} TON</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value={CheckoutStep.Confirmation} className="mt-0">
              <Card className="p-8 bg-card/50 border-white/10 text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-500/20 rounded-full mb-4">
                  <svg
                    className="h-8 w-8 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-white">Order Complete!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. Your order has been received and is now being processed.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button onClick={handleViewOrder}>
                    View Order Status
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/products')}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
