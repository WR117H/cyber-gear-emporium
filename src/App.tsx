
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TONConnectProvider } from "./context/TONConnectProvider";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Admin/Dashboard";
import ProductManager from "./pages/Admin/ProductManager";
import ProductForm from "./pages/Admin/ProductForm";
import AdminLogin from "./pages/Admin/AdminLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Profile from "./pages/Profile";
import OrderTracking from "./pages/OrderTracking";
import Articles from "./pages/Articles";
import Article from "./pages/Article";
import ArticleManager from "./pages/Admin/ArticleManager";
import ArticleForm from "./pages/Admin/ArticleForm";
import OrderManager from "./pages/Admin/OrderManager";
import AdminTranslations from "./pages/Admin/AdminTranslations";
import BilingualContentEditor from "./pages/Admin/BilinguaContentEditor";

import CryptoJS from "crypto-js";

const queryClient = new QueryClient();

// Update the manifest URL to point to a valid location
const manifestUrl="https://cyber-gear-emporium.lovable.app/tonconnect-manifest.json";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <TONConnectProvider>
        <LanguageProvider>
          <BrowserRouter>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/order/:id" element={<OrderTracking />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/article/:slug" element={<Article />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={
                    <ProtectedAdminRoute>
                      <Dashboard />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedAdminRoute>
                      <ProductManager />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/products/new" element={
                    <ProtectedAdminRoute>
                      <ProductForm />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/products/edit/:id" element={
                    <ProtectedAdminRoute>
                      <ProductForm />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/articles" element={
                    <ProtectedAdminRoute>
                      <ArticleManager />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/articles/new" element={
                    <ProtectedAdminRoute>
                      <ArticleForm />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/articles/edit/:id" element={
                    <ProtectedAdminRoute>
                      <ArticleForm />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedAdminRoute>
                      <OrderManager />
                    </ProtectedAdminRoute>
                  } />
                  {/* New routes for translations and bilingual content */}
                  <Route path="/admin/translations" element={
                    <ProtectedAdminRoute>
                      <AdminTranslations />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/bilingual-content" element={
                    <ProtectedAdminRoute>
                      <BilingualContentEditor />
                    </ProtectedAdminRoute>
                  } />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </CartProvider>
          </BrowserRouter>
        </LanguageProvider>
      </TONConnectProvider>
    </TonConnectUIProvider>
  </QueryClientProvider>
);

export default App;
