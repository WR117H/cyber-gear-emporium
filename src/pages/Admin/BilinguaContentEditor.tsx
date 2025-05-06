
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct } from '@/utils/productDatabase';
import { fetchArticles, createArticle, updateArticle } from '@/utils/articleDatabase';
import { useLanguage } from '@/context/LanguageContext';
import { v4 as uuidv4 } from 'uuid';

type ContentType = 'product' | 'article';

interface BilingualContent {
  en: {
    title: string;
    description: string;
    content?: string;
  };
  fa: {
    title: string;
    description: string;
    content?: string;
  };
  common: {
    image: string;
    category: string;
    price?: number;
    inStock?: number;
    featured?: boolean;
    isNew?: boolean;
  };
}

export default function BilingualContentEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateTranslation } = useLanguage();
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'fa'>('en');
  const [contentType, setContentType] = useState<ContentType>('product');
  
  const [content, setContent] = useState<BilingualContent>({
    en: {
      title: '',
      description: '',
      content: '',
    },
    fa: {
      title: '',
      description: '',
      content: '',
    },
    common: {
      image: '',
      category: '',
      price: 0,
      inStock: 10,
      featured: false,
      isNew: true,
    }
  });

  const handleCommonChange = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      common: {
        ...prev.common,
        [field]: value
      }
    }));
  };

  const handleLanguageChange = (lang: 'en' | 'fa', field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (field: 'featured' | 'isNew') => {
    setContent(prev => ({
      ...prev,
      common: {
        ...prev.common,
        [field]: !prev.common[field]
      }
    }));
  };

  const handleSave = async () => {
    try {
      const id = uuidv4();
      const translationKeyPrefix = contentType === 'product' ? `product_${id}` : `article_${id}`;
      
      // Save translations for both languages
      updateTranslation(`${translationKeyPrefix}_title`, {
        en: content.en.title,
        fa: content.fa.title
      });
      
      updateTranslation(`${translationKeyPrefix}_description`, {
        en: content.en.description,
        fa: content.fa.description
      });

      if (contentType === 'article' && content.en.content && content.fa.content) {
        updateTranslation(`${translationKeyPrefix}_content`, {
          en: content.en.content,
          fa: content.fa.content
        });
      }

      if (contentType === 'product') {
        // Create product
        await createProduct({
          id,
          name: content.en.title, // Use English as default
          description: content.en.description, // Use English as default
          price: content.common.price || 0,
          image: content.common.image,
          category: content.common.category,
          inStock: content.common.inStock || 0,
          featured: content.common.featured || false,
          isNew: content.common.isNew || false,
          specifications: {}
        });

        toast({
          title: "Product created",
          description: "Bilingual product has been created successfully."
        });
        
        navigate('/admin/products');
      } else {
        // Create article
        const slug = content.en.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        await createArticle({
          id,
          title: content.en.title, // Use English as default
          content: content.en.content || '',
          excerpt: content.en.description,
          author: 'Admin',
          date: new Date().toISOString(),
          imageUrl: content.common.image,
          coverImage: content.common.image,
          publishedAt: new Date().toISOString(),
          category: content.common.category,
          slug,
          tags: [content.common.category]
        });

        toast({
          title: "Article created",
          description: "Bilingual article has been created successfully."
        });
        
        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save the content. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Bilingual Content Editor</h1>
            <p className="text-muted-foreground">Create and edit bilingual content for your site</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button 
              onClick={handleSave} 
              size="sm"
              className="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Content
            </Button>
          </div>
        </div>

        <Tabs value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
          <TabsList className="mb-6">
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="article">Article</TabsTrigger>
          </TabsList>

          <Card className="bg-secondary border-none mb-6">
            <CardHeader>
              <CardTitle>Common Properties</CardTitle>
              <CardDescription>These properties are the same in both languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    value={content.common.image}
                    onChange={(e) => handleCommonChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-black/50"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={content.common.category}
                    onChange={(e) => handleCommonChange('category', e.target.value)}
                    placeholder="Category"
                    className="bg-black/50"
                  />
                </div>
                
                {contentType === 'product' && (
                  <>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input 
                        id="price" 
                        type="number"
                        value={content.common.price}
                        onChange={(e) => handleCommonChange('price', Number(e.target.value))}
                        placeholder="Price"
                        className="bg-black/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inStock">Stock Quantity</Label>
                      <Input 
                        id="inStock" 
                        type="number"
                        value={content.common.inStock}
                        onChange={(e) => handleCommonChange('inStock', Number(e.target.value))}
                        placeholder="In Stock"
                        className="bg-black/50"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={content.common.featured}
                        onChange={() => handleCheckboxChange('featured')}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isNew"
                        checked={content.common.isNew}
                        onChange={() => handleCheckboxChange('isNew')}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isNew">New Product</Label>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'fa')}>
            <TabsList className="mb-6">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="fa">Persian</TabsTrigger>
            </TabsList>

            <TabsContent value={activeLanguage}>
              <Card className="bg-secondary border-none">
                <CardHeader>
                  <CardTitle>{activeLanguage === 'en' ? 'English Content' : 'Persian Content'}</CardTitle>
                  <CardDescription>
                    {activeLanguage === 'en' 
                      ? 'Edit the English version of your content' 
                      : 'Edit the Persian version of your content'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor={`${activeLanguage}-title`}>Title</Label>
                      <Input 
                        id={`${activeLanguage}-title`} 
                        value={content[activeLanguage].title}
                        onChange={(e) => handleLanguageChange(activeLanguage, 'title', e.target.value)}
                        placeholder={activeLanguage === 'en' ? 'Title' : 'عنوان'}
                        dir={activeLanguage === 'fa' ? 'rtl' : 'ltr'}
                        className={`bg-black/50 ${activeLanguage === 'fa' ? 'font-mirza' : ''}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${activeLanguage}-description`}>
                        {contentType === 'article' ? 'Excerpt' : 'Description'}
                      </Label>
                      <Textarea 
                        id={`${activeLanguage}-description`} 
                        value={content[activeLanguage].description}
                        onChange={(e) => handleLanguageChange(activeLanguage, 'description', e.target.value)}
                        placeholder={activeLanguage === 'en' ? 'Description' : 'توضیحات'}
                        dir={activeLanguage === 'fa' ? 'rtl' : 'ltr'}
                        className={`bg-black/50 min-h-[100px] ${activeLanguage === 'fa' ? 'font-mirza' : ''}`}
                      />
                    </div>
                    
                    {contentType === 'article' && (
                      <div>
                        <Label htmlFor={`${activeLanguage}-content`}>Content</Label>
                        <Textarea 
                          id={`${activeLanguage}-content`} 
                          value={content[activeLanguage].content}
                          onChange={(e) => handleLanguageChange(activeLanguage, 'content', e.target.value)}
                          placeholder={activeLanguage === 'en' ? 'Article content...' : 'محتوای مقاله...'}
                          dir={activeLanguage === 'fa' ? 'rtl' : 'ltr'}
                          className={`bg-black/50 min-h-[300px] ${activeLanguage === 'fa' ? 'font-mirza' : ''}`}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Tabs>
      </div>
    </div>
  );
}
