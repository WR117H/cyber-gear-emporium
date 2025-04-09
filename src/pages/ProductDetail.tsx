
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockProducts } from '@/data/products';
import { Product } from '@/types/product';
import { ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  
  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    }
  };
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link to="/products" className="text-cyber-blue hover:underline">
              Back to products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/products" 
            className="inline-flex items-center text-cyber-light hover:text-cyber-blue"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to products
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="glow animate-pulse-glow">
            <div className="aspect-square bg-cyber-navy/50 rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {product.isNew && (
                  <Badge className="bg-cyber-green text-cyber-navy font-medium">NEW</Badge>
                )}
                <Badge className="bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30">
                  {categories.find(c => c.id === product.category)?.name || product.category}
                </Badge>
                {product.inStock <= 0 ? (
                  <Badge variant="destructive">Out of stock</Badge>
                ) : product.inStock <= 5 ? (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">Low stock</Badge>
                ) : (
                  <Badge variant="outline" className="border-green-500 text-green-500">In stock</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold text-cyber-blue">${product.price.toFixed(2)}</span>
                {product.isNew && (
                  <span className="ml-3 text-sm text-muted-foreground line-through">${(product.price * 1.2).toFixed(2)}</span>
                )}
              </div>
              
              <p className="text-muted-foreground mb-6">{product.description}</p>
              
              {product.inStock > 0 && (
                <div className="flex items-center mb-6">
                  <div className="border border-cyber-blue/30 rounded-md flex mr-4">
                    <button 
                      className="px-3 py-1 text-cyber-blue hover:bg-cyber-blue/10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-cyber-blue/30 min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button 
                      className="px-3 py-1 text-cyber-blue hover:bg-cyber-blue/10"
                      onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                  
                  <span className="text-sm text-muted-foreground">
                    {product.inStock} items available
                  </span>
                </div>
              )}
              
              <Button
                className="w-full bg-cyber-blue text-cyber-navy hover:bg-cyber-green mb-4"
                size="lg"
                disabled={product.inStock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center p-3 border border-cyber-blue/20 rounded-lg bg-cyber-navy/30">
                  <Shield className="h-6 w-6 text-cyber-blue mb-2" />
                  <span className="text-xs text-center">Secure Purchase</span>
                </div>
                <div className="flex flex-col items-center p-3 border border-cyber-blue/20 rounded-lg bg-cyber-navy/30">
                  <Truck className="h-6 w-6 text-cyber-blue mb-2" />
                  <span className="text-xs text-center">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center p-3 border border-cyber-blue/20 rounded-lg bg-cyber-navy/30">
                  <RotateCcw className="h-6 w-6 text-cyber-blue mb-2" />
                  <span className="text-xs text-center">30-Day Returns</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-6 bg-cyber-blue/20" />
            
            <Tabs defaultValue="specifications">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                <TabsTrigger value="legal">Legal Notice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="space-y-4">
                {product.specifications && (
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 text-sm">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="compatibility">
                {product.compatibleWith ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Compatible Systems</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.compatibleWith.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Compatibility information not available for this product.</p>
                )}
              </TabsContent>
              
              <TabsContent value="legal">
                <div className="text-sm text-muted-foreground space-y-4">
                  <p>
                    This product is intended for authorized security testing and educational purposes only. 
                    The buyer assumes all responsibility for the proper and legal use of this product.
                  </p>
                  <p>
                    Use of this product to access systems or networks without explicit permission is illegal 
                    and may result in civil and/or criminal penalties. Always obtain proper authorization
                    before conducting security assessments.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Categories for reference
const categories = [
  { id: 'network', name: 'Network Tools' },
  { id: 'wireless', name: 'Wireless Devices' },
  { id: 'hardware', name: 'Hardware Kits' },
  { id: 'software', name: 'Software Tools' }
];

export default ProductDetail;
