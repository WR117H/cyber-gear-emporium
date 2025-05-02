
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, createArticle, updateArticle } from '@/utils/articleDatabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { slugify } from '@/utils/helpers';
import { Article } from '@/types/article';

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<Article, 'id'>>({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString(),
    imageUrl: '',
    excerpt: '',
    slug: '',
    tags: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const article = getArticleById(id);
      if (article) {
        setFormData({
          title: article.title,
          content: article.content,
          author: article.author,
          date: article.date,
          imageUrl: article.imageUrl,
          excerpt: article.excerpt,
          slug: article.slug,
          tags: article.tags || []
        });
      }
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: slugify(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsValue = e.target.value;
    // Convert comma-separated string to array
    const tagsArray = tagsValue.split(',').map(tag => tag.trim()).filter(Boolean);
    
    setFormData({
      ...formData,
      tags: tagsArray
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (id) {
        // Update existing article
        updateArticle(id, formData);
        toast({
          title: "Article updated",
          description: "The article has been updated successfully."
        });
      } else {
        // Create new article
        createArticle(formData);
        toast({
          title: "Article created",
          description: "The article has been created successfully."
        });
      }
      navigate('/admin/articles');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the article.",
        variant: "destructive"
      });
      console.error("Error saving article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tagsString = Array.isArray(formData.tags) 
    ? formData.tags.join(', ')
    : '';

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/articles')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Button>

      <Card className="bg-black/40 border border-white/10 text-white">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {id ? 'Edit Article' : 'Create New Article'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="bg-black/60 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium">
                Slug (URL)
              </label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="bg-black/60 border-white/20"
              />
              <p className="text-sm text-gray-400">
                Auto-generated from title, can be edited
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="block text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                className="bg-black/60 border-white/20 min-h-[80px]"
                placeholder="A short summary of the article"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                className="bg-black/60 border-white/20 min-h-[300px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-medium">
                Author
              </label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="bg-black/60 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium">
                Featured Image URL
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="bg-black/60 border-white/20"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm font-medium">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                value={tagsString}
                onChange={handleTagsChange}
                className="bg-black/60 border-white/20"
                placeholder="cyberpunk, news, gear (comma separated)"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy"
              >
                {isSubmitting
                  ? id
                    ? 'Updating...'
                    : 'Creating...'
                  : id
                    ? 'Update Article'
                    : 'Create Article'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
