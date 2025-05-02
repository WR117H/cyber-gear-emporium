
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
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Article } from '@/types/article';
import { createArticle, getArticleById, updateArticle, deleteArticle } from '@/utils/articleDatabase';

// Form validation schema
const articleSchema = z.object({
  title: z.string().min(4, { message: "Title must be at least 4 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }).max(160, { message: "Excerpt must not exceed 160 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  author: z.string().min(2, { message: "Author name is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  coverImage: z.string().url({ message: "Please enter a valid image URL" }),
  publishedAt: z.string().optional(),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag !== '')),
  slug: z.string().min(3, { message: "Slug is required for SEO" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase letters, numbers, and hyphens only" }),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const isEditMode = !!id;

  // Load article if editing
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        const existingArticle = await getArticleById(id);
        
        if (existingArticle) {
          setArticle(existingArticle);
        } else {
          toast({
            title: "Article not found",
            description: "The requested article could not be found",
            variant: "destructive"
          });
          navigate('/admin/articles');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        toast({
          title: "Error",
          description: "Could not load article details",
          variant: "destructive"
        });
      }
    };
    
    loadArticle();
  }, [id, navigate, toast]);

  // Convert tags array to comma-separated string for the form
  const tagsToString = (tags: string[]) => {
    return tags.join(', ');
  };

  // Initialize the form with default values or article data if editing
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      coverImage: "",
      publishedAt: new Date().toISOString().split('T')[0],
      tags: "",
      slug: "",
    }
  });

  // Update form values when article is loaded
  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        coverImage: article.coverImage,
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : undefined,
        tags: tagsToString(article.tags),
        slug: article.slug,
      });
    }
  }, [article, form]);

  // When title changes, suggest a slug if slug is empty
  const watchTitle = form.watch("title");
  
  useEffect(() => {
    const slugValue = form.getValues("slug");
    if (!isEditMode && watchTitle && !slugValue) {
      const suggestedSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", suggestedSlug);
    }
  }, [watchTitle, form, isEditMode]);

  const onSubmit = async (data: ArticleFormValues) => {
    setIsLoading(true);

    try {
      if (isEditMode && id) {
        // Update existing article
        const updatedArticle = await updateArticle(id, {
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        });
        
        if (updatedArticle) {
          toast({
            title: "Article updated",
            description: `${data.title} has been updated successfully.`
          });
          navigate('/admin/articles');
        } else {
          throw new Error("Failed to update article");
        }
      } else {
        // Create new article
        const newArticleData: Omit<Article, 'id'> = {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          category: data.category,
          coverImage: data.coverImage,
          publishedAt: data.publishedAt || new Date().toISOString(),
          tags: Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          slug: data.slug
        };
        
        const newArticle = await createArticle(newArticleData);
        
        toast({
          title: "Article created",
          description: `${data.title} has been published successfully.`
        });
        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the article.",
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
      const success = await deleteArticle(id);
      
      if (!success) {
        throw new Error("Failed to delete article");
      }
      
      toast({
        title: "Article deleted",
        description: `The article has been removed successfully.`
      });

      // Redirect back to articles list
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the article.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while article is being fetched
  if (isEditMode && !article && isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white">Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? "Edit Article" : "Create New Article"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Update your article content" : "Write and publish a new article"}
            </p>
          </div>
          <div className="space-x-2">
            <Link to="/admin/articles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
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
                Delete Article
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Title</FormLabel>
                        <FormControl>
                          <Input className="bg-white/10 border-white/20 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Slug</FormLabel>
                        <FormControl>
                          <Input className="bg-white/10 border-white/20 text-white" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Used for the URL: cybertool.com/article/your-slug
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={2}
                          className="bg-white/10 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        A short summary that appears in article previews (160 chars max)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={12}
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
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Author</FormLabel>
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
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tutorials">Tutorials</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="guides">Guides</SelectItem>
                            <SelectItem value="reviews">Reviews</SelectItem>
                            <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="publishedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Publication Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-white/10 border-white/20 text-white" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Cover Image URL</FormLabel>
                        <FormControl>
                          <Input className="bg-white/10 border-white/20 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Tags</FormLabel>
                        <FormControl>
                          <Input className="bg-white/10 border-white/20 text-white" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Comma-separated list of tags (e.g., security, hardware, network)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy w-auto"
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : isEditMode ? "Update Article" : "Publish Article"}
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
