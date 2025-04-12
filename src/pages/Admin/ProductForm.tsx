
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { Product } from '@/types/product';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/utils/productDatabase';

// Form validation schema
const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  inStock: z.coerce.number().min(0, { message: "Stock can't be negative" }),
  featured: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  // Load product if editing
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const products = await fetchProducts();
        const existingProduct = products.find(p => p.id === id);
        
        if (existingProduct) {
          setProduct(existingProduct);
        } else {
          toast({
            title: "Product not found",
            description: "The requested product could not be found",
            variant: "destructive"
          });
          navigate('/admin/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Error",
          description: "Could not load product details",
          variant: "destructive"
        });
      }
    };
    
    loadProduct();
  }, [id, navigate, toast]);

  // Find product if editing
  const isEditMode = !!id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      featured: product.featured,
      isNew: product.isNew,
    } : {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      inStock: 0,
      featured: false,
      isNew: false,
    },
    values: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      featured: product.featured,
      isNew: product.isNew,
    } : undefined,
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);

    try {
      if (isEditMode && id) {
        // Update existing product
        const updatedProduct = await updateProduct(id, data);
        
        if (updatedProduct) {
          toast({
            title: "Product updated",
            description: `${data.name} has been updated successfully.`
          });
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        // Create new product
        const newProductData: Omit<Product, 'id'> = {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image: data.image,
          inStock: data.inStock,
          featured: data.featured || false,
          isNew: data.isNew || false,
          specifications: {},
          compatibleWith: []
        };
        
        const newProduct = await createProduct(newProductData);
        
        if (!newProduct) {
          throw new Error("Failed to create product");
        }
        
        toast({
          title: "Product created",
          description: `${data.name} has been added to your store.`
        });
      }

      // Redirect back to product list
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the product.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !id) return;

    setIsLoading(true);

    try {
      const success = await deleteProduct(id);
      
      if (!success) {
        throw new Error("Failed to delete product");
      }
      
      toast({
        title: "Product deleted",
        description: `The product has been removed from your store.`
      });

      // Redirect back to products list
      navigate('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the product.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while product is being fetched
  if (isEditMode && !product) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Update your product information" 
                : "Create a new product listing"}
            </p>
          </div>
          <div className="space-x-2">
            <Link to="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            {isEditMode && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </Button>
            )}
          </div>
        </div>
        
        <Card className="bg-card/50 border-white/10">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Product Name</FormLabel>
                        <FormControl>
                          <Input className="bg-white/10 border-white/20 text-white" {...field} />
                        </FormControl>
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
                            <SelectItem value="network">Network</SelectItem>
                            <SelectItem value="wireless">Wireless</SelectItem>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                          </SelectContent>
                        </Select>
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
                          rows={4}
                          className="bg-white/10 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Image URL</FormLabel>
                        <FormControl>
                          <Input className="bg-white/10 border-white/20 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white">
                            Featured Product
                          </FormLabel>
                          <FormDescription className="text-muted-foreground">
                            This product will appear in the featured section
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white">
                            New Release
                          </FormLabel>
                          <FormDescription className="text-muted-foreground">
                            Mark this product as a new release
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy"
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Product"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
