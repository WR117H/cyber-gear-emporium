
import { supabase } from '@/utils/supabaseClient';
import { mockProducts } from '@/data/products';

// Constants
export const PRODUCTS_STORAGE_KEY = 'cyber_gear_products';

/**
 * Helper to check if Supabase is configured
 */
export const isSupabaseConfigured = (): boolean => {
  // Check if Supabase URL and key are available
  return !!supabase && !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;
};

/**
 * Helper to initialize local storage with mock data if empty
 * @returns {Product[]} Array of products
 */
export const initializeLocalStorage = () => {
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!storedProducts) {
      console.log('Initializing local storage with mock products');
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mockProducts));
      return mockProducts;
    }
    return JSON.parse(storedProducts);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return mockProducts;
  }
};

/**
 * Helper to save all products in localStorage (fallback)
 */
export const saveProducts = (products: any[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};
