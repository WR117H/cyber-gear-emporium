
import { supabase } from '@/utils/supabaseClient';
import { mockProducts } from '@/data/products';
import { isSupabaseConfigured } from './config';

// Helper function to seed Supabase with mock products
export const seedSupabaseWithMockProducts = async (): Promise<boolean> => {
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
    
    // Fix the type error by explicitly typing the products array for upsert
    const productsToUpsert = mockProducts.map(p => {
      return {
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
        // Fix: Explicitly type as string[] and provide an empty array as fallback
        compatiblewith: (p.compatibleWith || []) as string[]
      };
    });
    
    // Attempt to insert or update the mock products
    const { error } = await supabase
      .from('products')
      .upsert(productsToUpsert);
    
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
