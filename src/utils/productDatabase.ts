
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/products';

// Table name in Supabase
const PRODUCTS_TABLE = 'products';

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using local data instead.');
      return getLocalProducts();
    }
    
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
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
    return getLocalProducts();
  }
};

// Initialize Supabase with mock products if empty
export const initializeProducts = async (): Promise<void> => {
  try {
    if (!isSupabaseConfigured()) {
      return;
    }
    
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
      const productsWithIds = mockProducts.map(product => ({
        ...product,
        id: product.id || `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      }));
      
      const { error } = await supabase
        .from(PRODUCTS_TABLE)
        .insert(productsWithIds);
      
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
    const newProductId = `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newProduct = { ...product, id: newProductId };
    
    if (!isSupabaseConfigured()) {
      console.log('Creating product in local storage');
      const localProducts = getLocalProducts();
      localStorage.setItem('admin_products', JSON.stringify([...localProducts, newProduct]));
      return newProduct;
    }
    
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert([newProduct])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product in Supabase:', error);
      // Fall back to local storage
      const localProducts = getLocalProducts();
      localStorage.setItem('admin_products', JSON.stringify([...localProducts, newProduct]));
      return newProduct;
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
    if (!isSupabaseConfigured()) {
      console.log('Updating product in local storage');
      const localProducts = getLocalProducts();
      const productToUpdate = localProducts.find(p => p.id === id);
      
      if (!productToUpdate) {
        console.error('Product not found in local storage');
        return null;
      }
      
      const updatedProduct = { ...productToUpdate, ...updates };
      const updatedProducts = localProducts.map(p => p.id === id ? updatedProduct : p);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      return updatedProduct;
    }
    
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product in Supabase:', error);
      // Fall back to local storage
      const localProducts = getLocalProducts();
      const productToUpdate = localProducts.find(p => p.id === id);
      
      if (!productToUpdate) {
        return null;
      }
      
      const updatedProduct = { ...productToUpdate, ...updates };
      const updatedProducts = localProducts.map(p => p.id === id ? updatedProduct : p);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      return updatedProduct;
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
    if (!isSupabaseConfigured()) {
      console.log('Deleting product from local storage');
      const localProducts = getLocalProducts();
      const filteredProducts = localProducts.filter(p => p.id !== id);
      localStorage.setItem('admin_products', JSON.stringify(filteredProducts));
      return true;
    }
    
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      // Fall back to local storage
      const localProducts = getLocalProducts();
      const filteredProducts = localProducts.filter(p => p.id !== id);
      localStorage.setItem('admin_products', JSON.stringify(filteredProducts));
      return true;
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
    try {
      return JSON.parse(storedProducts);
    } catch (e) {
      console.error('Error parsing stored products:', e);
      return mockProducts;
    }
  }
  return mockProducts;
};
