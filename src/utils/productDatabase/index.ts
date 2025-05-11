
import { isSupabaseConfigured } from './config';

// Export all functionality from their modules
export { fetchProducts, getFeaturedProducts, getProductsByCategory, searchProducts } from './fetchProducts';
export { createProduct, getProductById, updateProduct, deleteProduct } from './productOperations';

// Re-export the configuration check for external use
export { isSupabaseConfigured };
