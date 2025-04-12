
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { Product } from '@/types/product';

const productSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  image: z.string().url({ message: 'Please enter a valid image URL' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  inStock: z.coerce.number().int().nonnegative({ message: 'Stock must be zero or a positive number' }),
  featured: z.boolean(),
  isNew: z.boolean(),
  // We'll handle specifications separately as they can be dynamic
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id !== 'new';

  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  
  // Available product categories
  const categories = ['network', 'wireless', 'hardware', 'software'];
  
  // Find the product to edit if in edit mode
  const productToEdit = isEditMode 
    ? mockProducts.find(p => p.id === id)
    : null;
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: productToEdit ? {
      name: productToEdit.name,
      description: productToEdit.description,
      price: productToEdit.price,
      image: productToEdit.image,
      category: productToEdit.category,
      inStock: productToEdit.inStock,
      featured: productToEdit.featured,
      isNew: productToEdit.isNew,
    } : {
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      inStock: 0,
      featured: false,
      isNew: true,
    },
  });
  
  // Initialize specifications if editing an existing product
  useEffect(() => {
    if (productToEdit?.specifications) {
      const specs = Object.entries(productToEdit.specifications).map(([key, value]) => ({
        key,
        value: value.toString(),
      }));
      setSpecifications(specs);
    }
  }, [productToEdit]);
  
  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecifications([...specifications, { key: specKey, value: specValue }]);
      setSpecKey('');
      setSpecValue('');
    }
  };
  
  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
  };
  
  const onSubmit = (data: ProductFormValues) => {
    // Create the specifications object
    const specs: Record<string, string> = {};
    specifications.forEach(spec => {
      specs[spec.key] = spec.value;
    });
    
    // Create the product object
    const productData: Partial<Product> = {
      ...data,
      specifications: specs,
      // Generate a unique ID if creating a new product
      id: isEditMode ? id : Math.random().toString(36).substring(2, 11),
    };
    
    console.log('Saving product:', productData);
    
    // In a real application, this would make an API call to save the product
    toast({
      title: isEditMode ? 'Product updated' : 'Product created',
      description: isEditMode 
        ? 'The product has been updated successfully.' 
        : 'The product has been created successfully.',
    });
    
    // Navigate back to product manager
    navigate('/admin/products');
  };
  
  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? 'Edit Product' : 'New Product'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? 'Update product details' : 'Add a new product to your store'}
            </p>
          </div>
          <Link to="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-6 border border-white/10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Product Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter product name" 
                          className="bg-white/10 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="99.99" 
                          className="bg-white/10 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        className="bg-white/10 border-white/20 text-white resize-none min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          className="bg-white/10 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the product image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Stock Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="bg-white/10 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-white">Featured Product</FormLabel>
                        <FormDescription>
                          Display this product on the homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-white">New Product</FormLabel>
                        <FormDescription>
                          Mark this product as new
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Specifications</h3>
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={spec.key}
                      disabled
                      className="flex-1 bg-white/10 border-white/20 text-white"
                    />
                    <Input
                      value={spec.value}
                      disabled
                      className="flex-1 bg-white/10 border-white/20 text-white"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSpecification(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Specification name"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="Specification value"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addSpecification}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
