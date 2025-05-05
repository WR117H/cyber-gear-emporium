
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchProducts } from '@/utils/productDatabase';
import { searchArticles } from '@/utils/articleDatabase';
import { Product } from '@/types/product';
import { Article } from '@/types/article';

interface SearchBarProps {
  onClose: () => void;
}

interface SearchResults {
  products: Product[];
  articles: Article[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ products: [], articles: [] });
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Add event listener for Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.length < 2) {
        setResults({ products: [], articles: [] });
        return;
      }
      
      setIsSearching(true);
      try {
        // Search products and articles in parallel
        const [productResults, articleResults] = await Promise.all([
          searchProducts(query),
          searchArticles(query)
        ]);
        
        setResults({
          products: productResults,
          articles: articleResults
        });
      } catch (error) {
        console.error('Error performing search:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Add debounce to prevent excessive searches
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const handleArticleClick = (slug: string) => {
    navigate(`/article/${slug}`);
    onClose();
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for products and articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 py-6 bg-black text-white placeholder:text-white/50 border-white/10 focus:border-cyber-blue"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-cyber-blue" />
          )}
        </div>
        <Button 
          variant="ghost" 
          className="ml-2 text-white hover:text-cyber-blue" 
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
      
      {/* Results */}
      {(results.products.length > 0 || results.articles.length > 0) && (
        <div className="absolute z-50 mt-2 w-full bg-black border border-white/10 shadow-lg rounded-md max-h-[70vh] overflow-y-auto">
          {results.products.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">Products</h3>
              <div className="space-y-1">
                {results.products.map(product => (
                  <button
                    key={product.id}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors rounded-md flex items-center"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="h-8 w-8 bg-gray-900 rounded-md mr-2 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/100x100/1a1a2e/FFFFFF?text=CG';
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-white">{product.name}</p>
                      <p className="text-white/50 text-sm">${product.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {results.articles.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">Articles</h3>
              <div className="space-y-1">
                {results.articles.map(article => (
                  <button
                    key={article.id}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors rounded-md flex items-center"
                    onClick={() => handleArticleClick(article.slug)}
                  >
                    <div className="h-8 w-8 bg-gray-900 rounded-md mr-2 overflow-hidden">
                      <img 
                        src={article.coverImage || article.imageUrl} 
                        alt={article.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/100x100/1a1a2e/FFFFFF?text=CG';
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-white">{article.title}</p>
                      <p className="text-white/50 text-sm">{article.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {query.length >= 2 && !isSearching && results.products.length === 0 && results.articles.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-black border border-white/10 shadow-lg rounded-md p-4 text-center">
          <p className="text-white/70">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
