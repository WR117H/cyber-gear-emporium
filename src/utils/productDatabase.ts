
import { supabase } from './supabaseClient';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/products';

// Table name in Supabase
const PRODUCTS_TABLE = 'products';

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      // Fallback to localStorage if Supabase fails
      return getLocalProducts();
    }

    if (data && data.length > 0) {
      return data as Product[];
    }

    // If no products in the database yet, initialize with mockProducts
    await initializeProducts();
    return mockProducts;
  } catch (err) {
    console.error('Error in fetchProducts:', err);
    // Fallback to localStorage
    return getLocalProducts();
  }
};

// Initialize Supabase with mock products if empty
export const initializeProducts = async (): Promise<void> => {
  try {
    // Check if products exist first
    const { count, error: countError } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking products count:', countError);
      return;
    }
    
    // If no products, insert mock products
    if (count === 0) {
      const { error } = await supabase
        .from(PRODUCTS_TABLE)
        .insert(mockProducts);
      
      if (error) {
        console.error('Error initializing products:', error);
      }
    }
  } catch (err) {
    console.error('Error in initializeProducts:', err);
  }
};

// Create a new product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert([{ ...product, id: `prod_${Date.now()}` }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data as Product;
  } catch (err) {
    console.error('Error in createProduct:', err);
    return null;
  }
};

// Update an existing product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return data as Product;
  } catch (err) {
    console.error('Error in updateProduct:', err);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    return false;
  }
};

// Fallback to localStorage if needed
const getLocalProducts = (): Product[] => {
  const storedProducts = localStorage.getItem('admin_products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  return mockProducts;
};
