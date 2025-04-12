
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { Filter, SortDesc, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Product } from '@/types/product';
import { fetchProducts } from '@/utils/productDatabase';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  
  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [toast]);
  
  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }
    
    // Filter by price
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by stock
    if (inStockOnly) {
      result = result.filter(product => product.inStock > 0);
    }
    
    // Sort
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = result.filter(product => product.isNew).concat(
          result.filter(product => !product.isNew)
        );
        break;
      case 'featured':
      default:
        result = result.filter(product => product.featured).concat(
          result.filter(product => !product.featured)
        );
    }
    
    setFilteredProducts(result);
  }, [sortOption, priceRange, inStockOnly, selectedCategories, products]);
  
  // Handle category filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Handle adding to cart
  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const categories = [
    { id: 'network', name: 'Network Tools' },
    { id: 'wireless', name: 'Wireless Devices' },
    { id: 'hardware', name: 'Hardware Kits' },
    { id: 'software', name: 'Software Tools' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {categoryParam 
                ? categories.find(c => c.id === categoryParam)?.name || 'Products'
                : 'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Loading products...' : `${filteredProducts.length} products available`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 md:w-auto w-full">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Categories</h3>
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-lg">Price Range</h3>
                      <span className="text-sm text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    
                    <Slider 
                      defaultValue={[0, 500]} 
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mt-6"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Availability</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={() => setInStockOnly(!inStockOnly)}
                      />
                      <label 
                        htmlFor="in-stock"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="relative">
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-2">Loading products...</h3>
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
