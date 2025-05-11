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
import { LanguageContextProvider } from '@/context/LanguageContext';
import { TONConnectUIProvider } from '@tonconnect/ui-react';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import BilingualContentEditor from '@/pages/Admin/BilinguaContentEditor';
import EnhancedProductForm from '@/pages/Admin/EnhancedProductForm';

function App() {
  return (
    <BrowserRouter>
      <LanguageContextProvider>
        <TONConnectUIProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<Account />} />
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
              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductManager />} />
                <Route path="/admin/products/new" element={<EnhancedProductForm />} />
                <Route path="/admin/products/:id" element={<EnhancedProductForm />} />
                <Route path="/admin/articles" element={<ArticleManager />} />
                <Route path="/admin/articles/new" element={<ArticleForm />} />
                <Route path="/admin/articles/:id" element={<ArticleForm />} />
                <Route path="/admin/orders" element={<OrderManager />} />
                <Route path="/admin/translations" element={<AdminTranslations />} />
                <Route path="/admin/bilingual" element={<BilingualContentEditor />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </CartProvider>
        </TONConnectUIProvider>
      </LanguageContextProvider>
    </BrowserRouter>
  );
}

export default App;
