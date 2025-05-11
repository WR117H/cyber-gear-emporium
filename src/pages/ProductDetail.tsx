
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product, ProductComment } from '@/types/product';
import { ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw, 
  Image as ImageIcon, MessageSquare, Youtube, BookOpenText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/utils/productDatabase';
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
  const { addItem } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [userDisplayName, setUserDisplayName] = useState('Guest');
  
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const foundProduct = await getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Initialize comments if they exist
          if (foundProduct.community?.comments) {
            setComments(foundProduct.community.comments);
          }
        }
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        description: product.description
      });
      
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: ProductComment = {
      id: Date.now().toString(),
      userId: 'guest',
      userName: userDisplayName,
      content: newComment,
      timestamp: new Date().toISOString()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted to the discussion."
    });
  };
  
  // Helper function to render markdown
  const renderMarkdown = (text: string): string => {
    if (!text) return '';
    
    let html = text;
    
    // Convert headings (# Heading)
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold my-3">$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
    
    // Convert bold (**text**)
    html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    
    // Convert italic (*text*)
    html = html.replace(/\*(.+?)\*/g, '<i>$1</i>');
    
    // Convert links ([text](url))
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-cyber-blue hover:underline">$1</a>');
    
    // Convert images (![alt](url))
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-4" />');
    
    // Convert list items
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
    
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)\n(<li>.*<\/li>)/g, '<ul class="list-disc pl-5 space-y-1 my-4">$1$2</ul>');
    
    return html;
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
  
  // Get all product images, including the main image
  const allImages = product.image ? 
    [product.image, ...(product.images || [])] : 
    (product.images || []);
  
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
          <div>
            {allImages.length > 0 ? (
              <div className="space-y-4">
                <div className="glow animate-pulse-glow">
                  <div className="aspect-square bg-cyber-navy/50 rounded-lg overflow-hidden">
                    <img 
                      src={allImages[activeImageIndex]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {allImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {allImages.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`aspect-square cursor-pointer rounded border-2 ${
                          index === activeImageIndex ? 'border-cyber-blue' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${product.name} thumbnail ${index + 1}`} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-cyber-navy/50 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-gray-500" />
              </div>
            )}
          </div>
          
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
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="specifications">Specs</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                {product.article && (
                  <TabsTrigger value="article">Detailed Info</TabsTrigger>
                )}
                {product.videoLinks && product.videoLinks.length > 0 && (
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="specifications" className="space-y-4">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 text-sm">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available for this product.</p>
                )}
              </TabsContent>
              
              <TabsContent value="compatibility">
                {product.compatibleWith && product.compatibleWith.length > 0 ? (
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
              
              {product.article && (
                <TabsContent value="article" className="space-y-4">
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(product.article) }}
                  />
                </TabsContent>
              )}
              
              {product.videoLinks && product.videoLinks.length > 0 && (
                <TabsContent value="videos" className="space-y-6">
                  {product.videoLinks.map((videoId, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={`Product video ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
        
        {/* Community Discussion Section */}
        {product.community?.enabled && (
          <div className="mt-12">
            <Separator className="my-6 bg-cyber-blue/20" />
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-xl font-bold">Community Discussion</h2>
              </div>
              
              <div className="space-y-6">
                {/* Comment input */}
                <div className="bg-black/60 border border-white/20 rounded-lg p-4">
                  <div className="flex gap-2 mb-2">
                    <Input 
                      className="bg-white/10 border-white/20"
                      placeholder="Your name"
                      value={userDisplayName}
                      onChange={(e) => setUserDisplayName(e.target.value)}
                    />
                  </div>
                  <Textarea
                    className="bg-white/10 border-white/20 min-h-[100px] mb-3"
                    placeholder="Share your thoughts or ask a question about this product..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddComment}
                    className="bg-cyber-blue text-cyber-navy hover:bg-cyber-blue/80"
                  >
                    Post Comment
                  </Button>
                </div>
                
                {/* Comments list */}
                <div className="space-y-4 pt-4">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="bg-black/40 border border-white/10 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{comment.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString()} at {new Date(comment.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                      <h3 className="text-lg font-medium mb-1">No comments yet</h3>
                      <p className="text-muted-foreground">Be the first to start the discussion!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Legal notice at the bottom */}
        <div className="mt-12 p-4 bg-black/40 border border-white/10 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Legal Notice</h3>
          <div className="text-xs text-muted-foreground space-y-2">
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
