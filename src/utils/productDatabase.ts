
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { localStorageMock } from './helpers';

const PRODUCTS_STORAGE_KEY = 'cyber_gear_products';

export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  try {
    // In a real implementation, this would fetch from the 'products' table
    // Since we don't have that table yet, we'll return the local storage data
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  // Try to load from localStorage if defined
  if (typeof window === 'undefined') return [];
  
  try {
    // First try to fetch from local storage
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
    
    // If no products in local storage, return static data
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const products = await fetchProducts();
    return products.find(product => product.id === id);
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return undefined;
  }
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const products = await fetchProducts();
    
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const products = await fetchProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) return null;
    
    const updatedProduct = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const products = await fetchProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) return false;
    
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filteredProducts));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    
    if (!query) return products;
    
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    
    if (!category || category === 'all') return products;
    
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};

// Functions for featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    return products.filter(product => product.featured);
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
};

// Functions for new releases
export const getNewReleases = async (): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    // Sort by createdAt and take the first 6
    return products
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  } catch (error) {
    console.error('Error getting new releases:', error);
    return [];
  }
};
