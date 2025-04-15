
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';
import { Loader2, User, MapPin, CreditCard, Wallet } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const addressSchema = z.object({
  street: z.string().min(3, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
});

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<any>(null);
  const [showCryptoDialog, setShowCryptoDialog] = useState(false);
  
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isAuthenticated();
      if (!loggedIn) {
        navigate('/login');
        return;
      }

      try {
        const { user } = await getCurrentUser();
        setUserData(user);
        
        // Check if we have address data saved in localStorage
        const savedAddress = localStorage.getItem(`address_${user?.id || user?.email}`);
        if (savedAddress) {
          const parsedAddress = JSON.parse(savedAddress);
          setUserAddress(parsedAddress);
          form.reset(parsedAddress);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Could not load user profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast, form]);

  const onSubmit = (data: z.infer<typeof addressSchema>) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would save this to your database
      // For now, we'll use localStorage
      const userId = userData?.id || userData?.email;
      localStorage.setItem(`address_${userId}`, JSON.stringify(data));
      setUserAddress(data);
      
      toast({
        title: "Address updated",
        description: "Your shipping address has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">My Account</h1>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white/20">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="address" className="data-[state=active]:bg-white/20">
                <MapPin className="mr-2 h-4 w-4" />
                Address
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-white/20">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card className="bg-black border border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    View and manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <p className="text-muted-foreground">{userData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Name</p>
                      <p className="text-muted-foreground">{userData?.user_metadata?.name || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <Card className="bg-black border border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your shipping address for orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userAddress ? (
                    <div className="mb-4 p-4 border border-white/10 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Current Address</h3>
                      <p className="text-muted-foreground">{userAddress.street}</p>
                      <p className="text-muted-foreground">
                        {userAddress.city}, {userAddress.state} {userAddress.zipCode}
                      </p>
                      <p className="text-muted-foreground">{userAddress.country}</p>
                    </div>
                  ) : null}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123 Main St" 
                                className="bg-white/10 border-white/20 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="City" 
                                  className="bg-white/10 border-white/20 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="State" 
                                  className="bg-white/10 border-white/20 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="12345" 
                                  className="bg-white/10 border-white/20 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Country" 
                                  className="bg-white/10 border-white/20 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        variant="cyber"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : "Save Address"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4">
              <Card className="bg-black border border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your payment options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                 
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 border-white/20">
                          tonConnectUI.openModal(); // Trigger wallet connect
                          Cryptocurrency
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black border border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle>Cryptocurrency Payment</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Send cryptocurrency to one of our wallets
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Bitcoin (BTC)</p>
                            <div className="p-2 bg-white/10 rounded break-all text-xs">
                              bc1q34nq38g0v3jxwsh6ftx47wc9yc7yv0g3s3mzcz
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Ethereum (ETH)</p>
                            <div className="p-2 bg-white/10 rounded break-all text-xs">
                              0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
                            </div>
                          </div>
                          
                          <div className="space-y-2 pb-2">
                            <p className="text-sm font-medium">After sending, contact support with:</p>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                              <li>Transaction ID</li>
                              <li>Your order number</li>
                              <li>Email address</li>
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
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
