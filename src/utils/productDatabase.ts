
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

const PRODUCTS_STORAGE_KEY = 'cyber_gear_products';

export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      // Fallback to local storage
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return storedProducts ? JSON.parse(storedProducts) : [];
    }
    
    if (data && data.length > 0) {
      return data as Product[];
    }
    
    // If no data in Supabase, try local storage
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  // First, try to fetch from Supabase
  try {
    return await fetchProductsFromSupabase();
  } catch (error) {
    console.error('Error fetching products from Supabase, falling back to localStorage:', error);
    
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
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching product from Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      return products.find(product => product.id === id);
    }
    
    return data as Product;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return undefined;
  }
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    // Try to save to Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();
      
    if (error) {
      console.error('Error saving product to Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      products.push(newProduct);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      return newProduct;
    }
    
    return data as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    // Try to update in Supabase
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating product in Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex === -1) return null;
      
      const updatedProduct = {
        ...products[productIndex],
        ...updates
      };
      
      products[productIndex] = updatedProduct;
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      
      return updatedProduct;
    }
    
    return data as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // Try to delete from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      const filteredProducts = products.filter(p => p.id !== id);
      
      if (filteredProducts.length === products.length) return false;
      
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filteredProducts));
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

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
      
      return data as Product[];
    } else {
      // If no query, return all products
      return fetchProducts();
    }
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    // Try to fetch from Supabase filtered by category
    if (category && category !== 'all') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
        
      if (error) {
        console.error('Error fetching products by category from Supabase:', error);
        // Fallback to local storage
        const products = await fetchProducts();
        return products.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      return data as Product[];
    } else {
      // If no category or 'all', return all products
      return fetchProducts();
    }
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};

// Functions for featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Try to fetch featured products from Supabase
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
    
    return data as Product[];
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
};

// Functions for new releases
export const getNewReleases = async (): Promise<Product[]> => {
  try {
    // Try to fetch new releases from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('isNew', true)
      .limit(6);
      
    if (error) {
      console.error('Error fetching new releases from Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      // Sort by created_at and take the first 6
      return products
        .filter(product => product.isNew)
        .slice(0, 6);
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error getting new releases:', error);
    return [];
  }
};
