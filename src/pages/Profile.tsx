import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAuthenticated, getCurrentUser, updateUserProfile, signOut } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { getOrdersByUserId } from '@/utils/orderDatabase';
import { Order } from '@/types/order';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressForm from '@/components/AddressForm';
import { format } from 'date-fns';
import { 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  User, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  MapPin,
  ExternalLink
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  defaultAddress?: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      if (!auth) {
        navigate('/login', { state: { returnUrl: '/profile' } });
        return;
      }
      
      try {
        const { user } = await getCurrentUser();
        setUser({
          id: user.id,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          defaultAddress: user.defaultAddress
        });
        setNameInput(user.displayName || user.email.split('@')[0]);
        
        // Load user's orders
        if (user.id) {
          const userOrders = await getOrdersByUserId(user.id);
          // Sort by most recent first
          userOrders.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile information.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      await updateUserProfile({
        displayName: nameInput
      });
      
      setUser({
        ...user,
        displayName: nameInput
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddressSubmit = async (address: any) => {
    if (!user) return;
    
    try {
      await updateUserProfile({
        defaultAddress: address
      });
      
      setUser({
        ...user,
        defaultAddress: address
      });
      
      toast({
        title: "Address updated",
        description: "Your shipping address has been saved."
      });
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Update failed",
        description: "Could not save your shipping address. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'payment_confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'processing':
        return <Package className="h-4 w-4 text-purple-400" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-green-400" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <Clock className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-white">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and orders</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-card/50 border-white/10 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {user?.displayName || 'User'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">{user?.email}</p>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white/5"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="orders" className="data-[state=active]:text-white">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="address" className="data-[state=active]:text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping Address
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <Card className="bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div 
                            key={order.id} 
                            className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  {getOrderStatusIcon(order.status)}
                                  <span className="text-white font-medium capitalize">
                                    {order.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Order #{order.id} • {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                </p>
                              </div>
                              
                              <div className="flex flex-col md:items-end">
                                <span className="text-white font-medium">${order.total.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">
                                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                              {order.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="w-16 h-16 overflow-hidden rounded border border-white/10">
                                  <img 
                                    src={item.image || item.imageUrl} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = "https://placehold.co/200x200/1a1a2e/FFFFFF?text=CyberGear";
                                    }}
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-16 h-16 flex items-center justify-center rounded border border-white/10 bg-white/5">
                                  <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <Link to={`/order/${order.id}`}>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                  Track Order
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't placed any orders yet.
                        </p>
                        <Button asChild>
                          <Link to="/products">Browse Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="address">
                <Card className="bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddressForm 
                      onSubmit={handleAddressSubmit}
                      initialAddress={user?.defaultAddress}
                      submitLabel="Save Address"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ''}
                        disabled
                        className="bg-white/10 border-white/20 text-white opacity-70"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed
                      </p>
                    </div>
                    
                    <Button onClick={handleUpdateProfile}>
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
