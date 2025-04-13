
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Admin/Dashboard";
import ProductManager from "./pages/Admin/ProductManager";
import ProductForm from "./pages/Admin/ProductForm";
import AdminLogin from "./pages/Admin/AdminLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          
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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
