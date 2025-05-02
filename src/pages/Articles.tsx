
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Article } from '@/types/article';
import { fetchArticles } from '@/utils/articleDatabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const articlesData = await fetchArticles();
        // Sort by most recent first
        articlesData.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(articlesData);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, []);

  // Extract unique categories
  const categories = Array.from(
    new Set(articles.map((article) => article.category))
  );

  const filteredArticles = articles.filter((article) => {
    // Filter by search term
    const matchesSearch = 
      !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">Articles & Guides</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our latest articles, tutorials and resources on cybersecurity tools and techniques.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-white/5 border-white/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-white">Loading articles...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link to={`/article/${article.slug}`} key={article.id}>
                <div className="cyber-card h-full flex flex-col hover:scale-[1.01] transition-transform">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-cyber-blue/20 text-cyber-blue text-xs px-2 py-1 rounded-full">
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-white">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-xs text-white">
                        By {article.author}
                      </div>
                      <div>
                        <Button variant="link" size="sm" className="text-cyber-blue p-0">
                          Read Article →
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white text-lg">
              No articles found matching your search criteria.
            </p>
            <Button 
              variant="link" 
              onClick={() => {setSearchTerm(''); setSelectedCategory(null);}}
              className="text-cyber-blue mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
