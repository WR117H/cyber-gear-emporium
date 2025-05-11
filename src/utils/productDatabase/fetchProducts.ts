
import { supabase } from '@/utils/supabaseClient';
import { Product } from '@/types/product';
import { isSupabaseConfigured, initializeLocalStorage } from './config';
import { seedSupabaseWithMockProducts } from './seedHelper';

/**
 * Helper to get all products, with fallback to local storage
 * @returns {Promise<Product[]>} Array of products
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Try to fetch from Supabase if configured
    if (isSupabaseConfigured()) {
      // First check if products table exists and has data
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(1);
          
        if (error) {
          console.error('Error checking products table in Supabase:', error);
          throw new Error('Could not check products table');
        }
        
        // If we can query the table but it's empty, seed it
        if (data && data.length === 0) {
          console.log('Products table exists but is empty, seeding with mock data');
          await seedSupabaseWithMockProducts();
        }
      } catch (checkError) {
        console.error('Error checking products table:', checkError);
        console.log('Using local storage as fallback');
        return initializeLocalStorage();
      }
    
      // Now try to fetch all products
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) {
        console.error('Error fetching products from Supabase:', error);
        return initializeLocalStorage();
      }
      
      if (data && data.length > 0) {
        console.log(`Fetched ${data.length} products from Supabase`);
        return data as unknown as Product[];
      }
      
      // If there's still no data after our check, seed again just to be sure
      console.log('No products in Supabase after check, seeding again with mock data');
      const localProducts = initializeLocalStorage();
      await seedSupabaseWithMockProducts();
      return localProducts;
    } else {
      // If Supabase is not configured, use local storage
      console.log('Supabase not configured, using local storage');
      return initializeLocalStorage();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to localStorage
    return initializeLocalStorage();
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true);
      
    if (error) {
      console.error('Error fetching featured products from Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      return products.filter(product => product.featured);
    }
    
    return data as unknown as Product[];
  } catch (error) {
    console.error('Error getting featured products:', error);
    // Fallback to local storage
    const products = await fetchProducts();
    return products.filter(product => product.featured);
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
      
    if (error) {
      console.error('Error fetching products by category from Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      return products.filter(product => product.category === category);
    }
    
    return data as unknown as Product[];
  } catch (error) {
    console.error('Error getting products by category:', error);
    // Fallback to local storage
    const products = await fetchProducts();
    return products.filter(product => product.category === category);
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // Try to search in Supabase using ILIKE for case-insensitive search
    if (query) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
        
      if (error) {
        console.error('Error searching products in Supabase:', error);
        // Fallback to local storage
        const products = await fetchProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(product => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
        );
      }
      
      return data as unknown as Product[];
    } else {
      // If no query, return all products
      return fetchProducts();
    }
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
