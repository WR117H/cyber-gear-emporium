
import { supabase, isSupabaseConfigured } from '@/utils/supabaseClient';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/products';

// Mock database stored in localStorage (as fallback)
const PRODUCTS_STORAGE_KEY = 'cyber_gear_products';

/**
 * Helper to initialize local storage with mock data if empty
 * @returns {Product[]} Array of products
 */
const initializeLocalStorage = () => {
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

// Helper function to seed Supabase with mock products
const seedSupabaseWithMockProducts = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  
  try {
    console.log('Attempting to seed Supabase with mock products');
    
    // First check if table exists, if not create it
    try {
      const { error: tableCheckError } = await supabase.rpc('table_exists', { 
        table_name: 'products' 
      });
      
      if (tableCheckError) {
        console.log('Could not check if table exists, attempting insert anyway');
      }
    } catch (tableCheckError) {
      console.log('Error checking table existence:', tableCheckError);
    }
    
    // Attempt to insert or update the mock products
    const { error } = await supabase.from('products').upsert(
      mockProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        instock: p.inStock,
        featured: p.featured,
        isnew: p.isNew,
        specifications: p.specifications,
        compatiblewith: p.compatibleWith
      }))
    );
    
    if (error) {
      console.error('Error seeding Supabase with mock products:', error);
      return false;
    }
    
    console.log('Successfully seeded Supabase with mock products');
    return true;
  } catch (seedError) {
    console.error('Exception seeding Supabase with mock products:', seedError);
    return false;
  }
};

// Helper to save all products in localStorage (fallback)
const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    // Try to save to Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct as any])
      .select()
      .single();
      
    if (error) {
      console.error('Error saving product to Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      saveProducts([...products, newProduct]);
      return newProduct;
    }
    
    return data as unknown as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Fallback to local storage
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    const products = await fetchProducts();
    saveProducts([...products, newProduct]);
    return newProduct;
  }
};

// Get a product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // Try to fetch from Supabase
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
    
    return data as unknown as Product;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    // Fallback to local storage
    const products = await fetchProducts();
    return products.find(product => product.id === id);
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    // Try to update in Supabase
    const { data, error } = await supabase
      .from('products')
      .update(productData as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating product in Supabase:', error);
      // Fallback to local storage
      const products = await fetchProducts();
      const productIndex = products.findIndex(product => product.id === id);
      
      if (productIndex === -1) return null;
      
      const updatedProduct = {
        ...products[productIndex],
        ...productData,
      };
      
      products[productIndex] = updatedProduct;
      saveProducts(products);
      
      return updatedProduct;
    }
    
    return data as unknown as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Fallback to local storage
    const products = await fetchProducts();
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) return null;
    
    const updatedProduct = {
      ...products[productIndex],
      ...productData,
    };
    
    products[productIndex] = updatedProduct;
    saveProducts(products);
    
    return updatedProduct;
  }
};

// Delete a product
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
      const filteredProducts = products.filter(product => product.id !== id);
      
      if (filteredProducts.length === products.length) return false;
      
      saveProducts(filteredProducts);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    
    // Fallback to local storage
    const products = await fetchProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    
    if (filteredProducts.length === products.length) return false;
    
    saveProducts(filteredProducts);
    return true;
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
