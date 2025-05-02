
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderById } from '@/utils/orderDatabase';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Package,
  Truck,
  Home,
  ChevronLeft,
  PackageOpen
} from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const orderData = await getOrderById(id);
          if (orderData) {
            setOrder(orderData);
          }
        }
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrder();
  }, [id]);

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: <Clock className="h-5 w-5" /> },
      { key: 'payment_confirmed', label: 'Payment Confirmed', icon: <CheckCircle className="h-5 w-5" /> },
      { key: 'processing', label: 'Processing Order', icon: <Package className="h-5 w-5" /> },
      { key: 'shipped', label: 'Shipped', icon: <Truck className="h-5 w-5" /> },
      { key: 'delivered', label: 'Delivered', icon: <Home className="h-5 w-5" /> }
    ];
    
    if (!order) return steps;
    
    const statusIndex = steps.findIndex(step => step.key === order.status);
    if (order.status === 'cancelled') {
      return steps.map(step => ({ ...step, status: 'cancelled' }));
    }
    
    return steps.map((step, index) => {
      if (index < statusIndex) return { ...step, status: 'complete' };
      if (index === statusIndex) return { ...step, status: 'current' };
      return { ...step, status: 'upcoming' };
    });
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-white">Loading order information...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-black min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">The order you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate('/profile')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatAddress = (address: Order['address']) => {
    return `${address.streetAddress}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="cyber-card p-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Order Tracking
              </h1>
              <p className="text-muted-foreground mb-6">
                Track the status of your order #{order.id.slice(0, 8)}
              </p>
              
              {order.status === 'cancelled' ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <h3 className="text-red-400 font-semibold mb-2 flex items-center">
                    <PackageOpen className="h-5 w-5 mr-2" />
                    Order Cancelled
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This order has been cancelled. If you have any questions, please contact customer support.
                  </p>
                </div>
              ) : (
                <div className="relative mb-8">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />
                  <div className="space-y-8">
                    {getStatusSteps().map((step, index) => {
                      let iconClass = '';
                      let lineClass = '';
                      
                      if (step.status === 'complete') {
                        iconClass = 'bg-green-500 text-green-900';
                        lineClass = 'border-green-500';
                      } else if (step.status === 'current') {
                        iconClass = 'bg-cyber-blue text-cyber-navy';
                        lineClass = 'border-cyber-blue';
                      } else if (step.status === 'cancelled') {
                        iconClass = 'bg-red-500/20 text-red-400';
                        lineClass = 'border-red-500/50';
                      } else {
                        iconClass = 'bg-white/10 text-white/50';
                        lineClass = '';
                      }
                      
                      return (
                        <div key={step.key} className="relative flex items-start">
                          <div className={`absolute left-0 flex items-center justify-center w-16 h-16 rounded-full ${iconClass}`}>
                            {step.icon}
                          </div>
                          <div className="ml-24 pt-3">
                            <h3 className={`font-bold ${step.status === 'cancelled' ? 'text-red-400' : step.status === 'upcoming' ? 'text-white/50' : 'text-white'}`}>
                              {step.label}
                            </h3>
                            {step.status === 'current' && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {step.key === 'processing' && 'Your order is being prepared for shipment.'}
                                {step.key === 'shipped' && order.trackingNumber && `Tracking number: ${order.trackingNumber}`}
                                {step.key === 'shipped' && order.estimatedDelivery && 
                                  ` • Estimated delivery: ${format(new Date(order.estimatedDelivery), 'MMM dd, yyyy')}`}
                              </p>
                            )}
                            {step.status === 'complete' && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {step.key === 'pending' && `Placed on ${format(new Date(order.createdAt), 'MMM dd, yyyy')}`}
                                {step.key === 'shipped' && order.trackingNumber && `Tracking number: ${order.trackingNumber}`}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {order.trackingNumber && order.status !== 'cancelled' && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-mono text-white">{order.trackingNumber}</p>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="mt-2 md:mt-0">
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p className="text-white">{format(new Date(order.estimatedDelivery), 'MMMM dd, yyyy')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="cyber-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="text-white">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="text-white capitalize">{order.paymentMethod} {order.paymentMethod === 'ton' && 'Wallet'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Address</p>
                  <p className="text-white">{order.address.fullName}</p>
                  <p className="text-white text-sm">{formatAddress(order.address)}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-white font-medium mb-2">Order Items</h3>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {item.name} <span className="text-xs">x{item.quantity}</span>
                        </span>
                        <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cyber-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about your order, our support team is here to help.
              </p>
              <Button className="w-full">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
