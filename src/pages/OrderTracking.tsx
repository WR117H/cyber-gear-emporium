
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '@/utils/orderDatabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order } from '@/types/order';

type OrderStage = {
  key: string;
  label: string;
  icon: React.ReactNode;
  status: string;
};

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedOrder = getOrderById(id);
      setOrder(fetchedOrder || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-cyber-blue hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          <Card className="bg-black/40 border border-white/10 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                <p className="text-gray-400 mb-6">The order you're looking for doesn't exist or has been removed.</p>
                <Link to="/">
                  <Button variant="cyber">Return to Homepage</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Define order stages
  const stages: OrderStage[] = [
    { 
      key: 'processing', 
      label: 'Processing', 
      icon: <Package className="h-8 w-8" />,
      status: 'processing'
    },
    { 
      key: 'shipped', 
      label: 'Shipped', 
      icon: <Truck className="h-8 w-8" />,
      status: 'shipped'
    },
    { 
      key: 'delivered', 
      label: 'Delivered', 
      icon: <CheckCircle className="h-8 w-8" />,
      status: 'delivered'
    }
  ];

  // Determine current stage index
  const getCurrentStageIndex = () => {
    const currentStage = order.status || 'processing';
    if (currentStage === 'pending' || currentStage === 'payment_confirmed') {
      return -1; // Before processing
    }
    return stages.findIndex(stage => stage.status === currentStage);
  };
  
  const currentStageIndex = getCurrentStageIndex();

  const getFallbackImage = () => {
    return "https://placehold.co/200x200/1a1a2e/FFFFFF?text=CyberGear";
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-cyber-blue hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-cyber-green">Order Tracking</h1>
        
        <Card className="bg-black/40 border border-white/10 text-white mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 mb-1">Order Date</p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Status</p>
                  <p className="capitalize">{order.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Total Amount</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Payment Method</p>
                  <p>{order.paymentMethod}</p>
                </div>
              </div>
            </div>
            
            {/* Order Stages Progress */}
            <div className="mt-8 mb-4">
              <h3 className="text-xl font-semibold mb-4">Order Progress</h3>
              <div className="relative">
                <div className="flex justify-between mb-4">
                  {stages.map((stage, index) => (
                    <div 
                      key={stage.key}
                      className={`flex flex-col items-center w-1/3 ${index <= currentStageIndex ? 'text-cyber-green' : 'text-gray-500'}`}
                    >
                      <div className={`rounded-full p-3 ${index <= currentStageIndex ? 'bg-cyber-green/20' : 'bg-gray-800'}`}>
                        {stage.icon}
                      </div>
                      <span className="mt-2 text-sm font-medium">{stage.label}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute top-6 left-0 h-0.5 bg-gray-700 w-full -z-10"></div>
                <div 
                  className="absolute top-6 left-0 h-0.5 bg-cyber-green" 
                  style={{ 
                    width: `${currentStageIndex >= stages.length - 1 
                      ? '100%' 
                      : currentStageIndex < 0 
                        ? '0' 
                        : (currentStageIndex / (stages.length - 1)) * 100 + '%'
                    }` 
                  }}
                ></div>
              </div>
            </div>
            
            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-cyber-green/10 border border-cyber-green/30 rounded-lg">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-cyber-green mr-2" />
                  <p className="text-cyber-green font-medium">Tracking Number: {order.trackingNumber}</p>
                </div>
                {order.estimatedDelivery && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border border-white/10 text-white mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            {order.shippingAddress ? (
              <div>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : order.address ? (
              <div>
                <p>{order.address.fullName}</p>
                <p>{order.address.streetAddress}</p>
                <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                <p>{order.address.country}</p>
              </div>
            ) : (
              <p className="text-gray-400">No shipping address provided</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border border-white/10 text-white">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded bg-gray-800 flex items-center justify-center mr-4">
                      {item.image || item.imageUrl ? (
                        <img 
                          src={item.image || item.imageUrl} 
                          alt={item.name}
                          className="h-full w-full object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = getFallbackImage();
                          }}
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrderTracking;
