import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrdersByUserId } from '@/utils/orderDatabase';
import { Order } from '@/types/order';
import { getCurrentUser, isAuthenticated, signOut } from '@/utils/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, CalendarDays, CheckCircle, TruckIcon, ClockIcon } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      
      if (!authenticated) {
        toast({
          title: "Authentication required",
          description: "Please login to view your profile",
          variant: "destructive",
        });
        navigate('/login', { state: { returnUrl: '/profile' } });
        return;
      }
      
      try {
        setLoading(true);
        const { user } = await getCurrentUser();
        setUser(user);
        
        // Fetch user's orders
        const userOrders = await getOrdersByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem during logout",
        variant: "destructive",
      });
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case 'payment_confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
      case 'processing':
        return <Package className="h-5 w-5 text-purple-400" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-green-400" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="container mx-auto py-10 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-white">Loading profile data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">My Account</h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Order History</h2>
              
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-10">
                      <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium text-white">No orders yet</h3>
                      <p className="text-muted-foreground mt-1">When you place an order, it will appear here.</p>
                      <Button asChild className="mt-4">
                        <Link to="/products">Browse Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id} className="bg-card/40 border-white/10">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-lg text-white flex items-center">
                              Order #{order.id}
                              {order.orderCode && (
                                <span className="ml-2 text-sm text-cyber-blue bg-cyber-blue/20 px-2 py-1 rounded-md">
                                  Code: {order.orderCode}
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <CalendarDays className="h-3.5 w-3.5 mr-1" />
                              {format(new Date(order.createdAt || order.created_at), 'MMMM d, yyyy')}
                            </CardDescription>
                          </div>
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="ml-2 text-sm capitalize text-white">
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center py-2 border-b border-white/5 last:border-0">
                              <div className="h-12 w-12 rounded bg-gray-800 mr-3 overflow-hidden">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-white">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm text-white">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t border-white/5 pt-4">
                        <div>
                          <p className="text-muted-foreground text-sm">Total Amount</p>
                          <p className="text-white font-semibold">${order.total.toFixed(2)}</p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/order/${order.id}`}>Track Order</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Account Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white">Email: {user?.email}</p>
                  {/* Add more user information and forms to update it */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
