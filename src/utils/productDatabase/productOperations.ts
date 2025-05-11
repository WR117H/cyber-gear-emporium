
import { supabase } from '@/utils/supabaseClient';
import { Product } from '@/types/product';
import { fetchProducts } from './fetchProducts';
import { saveProducts } from './config';

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
    
    // Transform Supabase data to match our Product interface
    const product = data as any;
    
    // Create a fully typed Product object
    const typedProduct: Product = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.instock || 0,
      featured: product.featured || false,
      isNew: product.isnew || false,
      specifications: product.specifications || {},
      compatibleWith: (product.compatiblewith || []) as string[],
      // New fields
      images: product.images || [],
      article: product.article || '',
      videoLinks: product.videolinks || [],
      community: product.community || { enabled: false, comments: [] }
    };
    
    return typedProduct;
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
    // Format the data for Supabase (adjusting field names)
    const supabaseData: any = {
      ...productData,
      // Convert camelCase to lowercase field names for Supabase
      instock: productData.inStock,
      isnew: productData.isNew,
      compatiblewith: productData.compatibleWith as string[],
      videolinks: productData.videoLinks
    };
    
    // Remove fields that don't match Supabase schema
    delete supabaseData.inStock;
    delete supabaseData.isNew;
    delete supabaseData.compatibleWith;
    delete supabaseData.videoLinks;
    
    // Try to update in Supabase
    const { data, error } = await supabase
      .from('products')
      .update(supabaseData)
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
    
    // Transform Supabase data to match our Product interface
    const product = data as any;
    
    // Create a fully typed Product object
    const typedProduct: Product = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.instock || 0,
      featured: product.featured || false,
      isNew: product.isnew || false,
      specifications: product.specifications || {},
      compatibleWith: (product.compatiblewith || []) as string[],
      // New fields
      images: product.images || [],
      article: product.article || '',
      videoLinks: product.videolinks || [],
      community: product.community || { enabled: false, comments: [] }
    };
    
    return typedProduct;
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
