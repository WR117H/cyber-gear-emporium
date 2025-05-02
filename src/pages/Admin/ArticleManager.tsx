
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Article } from '@/types/article';
import { 
  ArrowLeft, Search, Plus, Edit, Trash2, Eye, LogOut
} from 'lucide-react';
import { setAdminAuthenticated } from '@/utils/adminAuth';
import { useNavigate } from 'react-router-dom';
import { fetchArticles, deleteArticle } from '@/utils/articleDatabase';
import { format } from 'date-fns';

export default function ArticleManager() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load articles from localStorage
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const articlesData = await fetchArticles();
        setArticles(articlesData);
      } catch (error) {
        console.error('Error loading articles:', error);
        toast({
          title: "Error loading articles",
          description: "Could not load articles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, [toast]);

  const filteredArticles = articles.filter((article) => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteArticle = async (id: string) => {
    try {
      const success = await deleteArticle(id);
      
      if (success) {
        setArticles(articles.filter(article => article.id !== id));
        toast({
          title: "Article deleted",
          description: "The article has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete article. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the article.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = () => {
    setAdminAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You've been logged out of the admin panel"
    });
    navigate('/admin/login');
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Article Management</h1>
            <p className="text-muted-foreground">Manage your blog articles</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm" className="w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/admin/articles/new">
              <Button className="bg-cyber-blue text-cyber-navy hover:bg-cyber-blue/80 w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} size="sm" className="w-auto">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-muted border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-white">Loading articles...</p>
          </div>
        ) : (
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-white">Article</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Published</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id} className="bg-card/50">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded overflow-hidden">
                            <img 
                              src={article.coverImage} 
                              alt={article.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>{article.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {article.category}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {article.publishedAt ? format(new Date(article.publishedAt), 'MMM dd, yyyy') : 'Draft'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link to={`/article/${article.slug}`}>
                            <Button variant="ghost" size="icon" className="w-auto h-auto">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/articles/edit/${article.id}`}>
                            <Button variant="ghost" size="icon" className="w-auto h-auto">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteArticle(article.id)}
                            className="w-auto h-auto"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No articles found. Try adjusting your search or add a new article.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
