
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Account from '@/pages/Account';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';
import Articles from '@/pages/Articles';
import Article from '@/pages/Article';
import AdminLogin from '@/pages/Admin/AdminLogin';
import Dashboard from '@/pages/Admin/Dashboard';
import ProductManager from '@/pages/Admin/ProductManager';
import ArticleManager from '@/pages/Admin/ArticleManager';
import ArticleForm from '@/pages/Admin/ArticleForm';
import OrderManager from '@/pages/Admin/OrderManager';
import AdminTranslations from '@/pages/Admin/AdminTranslations';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TONConnectProvider } from '@/context/TONConnectProvider';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import BilingualContentEditor from '@/pages/Admin/BilinguaContentEditor';
import EnhancedProductForm from '@/pages/Admin/EnhancedProductForm';

function App() {
  // Create a mock session for the Account component
  const mockSession = {
    user: {
      id: 'mock-user-id',
      email: 'user@example.com'
    }
  };

  return (
    <BrowserRouter>
      <LanguageProvider>
        <TonConnectUIProvider manifestUrl={`${window.location.origin}/tonconnect-manifest.json`}>
          <TONConnectProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={<Account session={mockSession} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Shopping routes */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                
                {/* Blog/Articles */}
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<Article />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={
                  <ProtectedAdminRoute>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="products" element={<ProductManager />} />
                      <Route path="products/new" element={<EnhancedProductForm />} />
                      <Route path="products/:id" element={<EnhancedProductForm />} />
                      <Route path="articles" element={<ArticleManager />} />
                      <Route path="articles/new" element={<ArticleForm />} />
                      <Route path="articles/:id" element={<ArticleForm />} />
                      <Route path="orders" element={<OrderManager />} />
                      <Route path="translations" element={<AdminTranslations />} />
                      <Route path="bilingual" element={<BilingualContentEditor />} />
                    </Routes>
                  </ProtectedAdminRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </CartProvider>
          </TONConnectProvider>
        </TonConnectUIProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
