
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Article as ArticleType } from '@/types/article';
import { getArticleBySlug } from '@/utils/articleDatabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        if (slug) {
          const articleData = await getArticleBySlug(slug);
          if (articleData) {
            setArticle(articleData);
          } else {
            setNotFound(true);
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <p className="text-white">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="bg-black min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/articles">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/articles" className="text-cyber-blue hover:underline inline-flex items-center mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-cyber-blue/20 text-cyber-blue text-sm px-3 py-1 rounded-full">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center text-muted-foreground mb-6">
              <User className="h-4 w-4 mr-1" />
              <span>By {article.author}</span>
            </div>
          </div>
          
          <div className="w-full h-96 mb-8 rounded-xl overflow-hidden">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-invert max-w-none mb-8">
            {/* Split content into paragraphs */}
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-6 mt-8">
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-white/10 text-muted-foreground text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
}
