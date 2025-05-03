
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, Users, DollarSign, Settings, FileText, ShoppingBag } from 'lucide-react';
import { getOrderStats } from '@/utils/orderDatabase';
import { fetchArticles } from '@/utils/articleDatabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    articles: 0,
    orders: 0,
    revenue: 0
  });
  
  useEffect(() => {
    const loadStats = async () => {
      // Get article count
      const articles = await fetchArticles();
      
      // Get order stats
      const orderStats = getOrderStats();
      
      // For this demo, we'll assume 12 products (since they're defined in a static file)
      setStats({
        products: 12, // Hardcoded for now
        articles: articles.length,
        orders: orderStats.totalOrders,
        revenue: orderStats.totalRevenue
      });
    };
    
    loadStats();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store</p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-secondary border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.products}</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.articles}</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.orders}</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.revenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-secondary border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-cyber-blue" />
                Product Management
              </CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Add, edit, and remove products from your store.</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/products" className="w-full">
                <Button className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy">
                  Manage Products
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-secondary border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-cyber-blue" />
                Article Management
              </CardTitle>
              <CardDescription>Manage your blog content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Create, edit, and publish articles and guides.</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/articles" className="w-full">
                <Button className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy">
                  Manage Articles
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-secondary border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-cyber-blue" />
                Order Management
              </CardTitle>
              <CardDescription>Track and update order status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Process orders and update shipping information.</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/orders" className="w-full">
                <Button className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy">
                  Manage Orders
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-secondary border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-cyber-blue" />
                User Management
              </CardTitle>
              <CardDescription>Manage your user database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage user accounts.</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/users" className="w-full">
                <Button className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy">
                  Manage Users
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-secondary border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-cyber-blue" />
                Payment Settings
              </CardTitle>
              <CardDescription>Manage payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configure payment gateways and options.</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/payments" className="w-full">
                <Button className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy">
                  Manage Payments
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-secondary border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-cyber-blue" />
                Store Settings
              </CardTitle>
              <CardDescription>Configure store settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Update store information and preferences.</p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/settings" className="w-full">
                <Button className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy">
                  Store Settings
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
