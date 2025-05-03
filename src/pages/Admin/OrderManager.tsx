
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Order, OrderStatus } from '@/types/order';
import {
  ArrowLeft, Search, Truck, Calendar, LogOut, Clock
} from 'lucide-react';
import { setAdminAuthenticated } from '@/utils/adminAuth';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, updateOrderStatus, updateOrderTracking, debugAllOrders } from '@/utils/orderDatabase';
import { format } from 'date-fns';

export default function OrderManager() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Debug - log all orders to help troubleshoot
        console.log("Admin OrderManager - checking localStorage content:");
        console.log(localStorage.getItem('cyber_gear_orders'));
        
        const allOrders = debugAllOrders();
        console.log("Admin panel - all orders:", allOrders);
        
        const ordersData = await fetchOrders();
        // Sort by most recent first
        ordersData.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({
          title: "Error loading orders",
          description: "Could not load orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [toast]);

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchLower)) ||
      order.address.fullName.toLowerCase().includes(searchLower) ||
      order.address.city.toLowerCase().includes(searchLower) ||
      order.items.some(item => item.name.toLowerCase().includes(searchLower))
    );
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      if (updatedOrder) {
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        
        toast({
          title: "Order updated",
          description: `Order status changed to ${newStatus.replace('_', ' ')}.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update order status.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      // Calculate estimated delivery date (7 days from now)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
      
      const updatedOrder = await updateOrderTracking(
        orderId, 
        trackingNumber, 
        estimatedDelivery.toISOString()
      );
      
      if (updatedOrder) {
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        
        toast({
          title: "Tracking information updated",
          description: `Tracking number added: ${trackingNumber}`,
        });
        
        // Also update status to shipped if current status is processing
        if (updatedOrder.status === 'processing') {
          handleStatusChange(orderId, 'shipped');
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update tracking information.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating tracking info:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = () => {
    setAdminAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You've been logged out of the admin panel"
    });
    navigate('/admin/login');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'payment_confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'processing': return 'bg-purple-500/20 text-purple-400';
      case 'shipped': return 'bg-green-500/20 text-green-400';
      case 'delivered': return 'bg-green-700/20 text-green-600';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Order Management</h1>
            <p className="text-muted-foreground">Track and manage customer orders</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm" className="w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} size="sm" className="w-auto">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders by ID, customer name, or item..."
              className="pl-10 bg-muted border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-white">Loading orders...</p>
          </div>
        ) : (
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-white">Order ID</TableHead>
                  <TableHead className="text-white">Order Code</TableHead>
                  <TableHead className="text-white">Customer</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white text-right">Total</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Tracking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id} className="bg-card/50">
                      <TableCell className="font-mono text-xs text-white">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-xs text-white">
                        {order.orderCode || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{order.address?.fullName || order.shippingAddress?.fullName || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.address?.city || order.shippingAddress?.city || ''}, 
                            {order.address?.state || order.shippingAddress?.state || ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right font-medium text-white">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className={`w-[140px] ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="payment_confirmed">Payment Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {order.trackingNumber ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Truck className="h-3 w-3 text-cyber-blue" />
                              <span className="font-mono text-white">{order.trackingNumber}</span>
                            </div>
                            {order.estimatedDelivery && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Est: {format(new Date(order.estimatedDelivery), 'MMM dd')}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <Input 
                              placeholder="Add tracking #"
                              className="h-8 text-xs bg-white/10 border-white/20 w-28"
                              onBlur={(e) => {
                                if (e.target.value) {
                                  handleTrackingUpdate(order.id, e.target.value);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  handleTrackingUpdate(order.id, e.currentTarget.value);
                                }
                              }}
                            />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No orders found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
