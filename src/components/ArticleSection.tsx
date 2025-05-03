
import React, { useEffect, useState } from 'react';
import { Article } from '@/types/article';
import { fetchArticles } from '@/utils/articleDatabase';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ArticleSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      const fetchedArticles = await fetchArticles();
      // Sort by publishedAt date, newest first
      fetchedArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      setArticles(fetchedArticles.slice(0, 3)); // Get latest 3 articles
      setIsLoading(false);
    };

    loadArticles();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-black to-cyber-navy py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Loading articles...</h2>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-black to-cyber-navy py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white">Latest Articles</h2>
            <p className="text-gray-400 mt-2">Discover tips, guides and news about cyberpunk gear</p>
          </div>
          <Link to="/articles" className="mt-4 md:mt-0">
            <Button variant="ghost" className="text-cyber-blue">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link to={`/article/${article.slug}`} key={article.id}>
              <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden hover:border-cyber-blue transition-colors duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.coverImage || article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs text-cyber-blue uppercase tracking-wide">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center mt-4">
                    <div className="text-sm">
                      <span className="text-gray-400">By </span>
                      <span className="text-white">{article.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
