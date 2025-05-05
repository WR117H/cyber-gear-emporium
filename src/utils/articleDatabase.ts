
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';

// Mock database stored in localStorage
const ARTICLES_STORAGE_KEY = 'cyber_gear_articles';

// Helper to get all articles
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('articles')
      .select('*');
      
    if (error) {
      console.error('Error fetching articles from Supabase:', error);
      // Fallback to local storage
      const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
      return storedArticles ? JSON.parse(storedArticles) : [];
    }
    
    if (data && data.length > 0) {
      return data as Article[];
    }
    
    // If no data in Supabase, try local storage
    const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return storedArticles ? JSON.parse(storedArticles) : [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Fallback to localStorage
    const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return storedArticles ? JSON.parse(storedArticles) : [];
  }
};

// Helper to save all articles
const saveArticles = (articles: Article[]): void => {
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
};

// Create a new article
export const createArticle = async (articleData: Omit<Article, 'id'>): Promise<Article> => {
  try {
    const newArticle: Article = {
      ...articleData,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    // Try to save to Supabase
    const { data, error } = await supabase
      .from('articles')
      .insert([newArticle])
      .select()
      .single();
      
    if (error) {
      console.error('Error saving article to Supabase:', error);
      // Fallback to local storage
      const articles = await fetchArticles();
      saveArticles([...articles, newArticle]);
      return newArticle;
    }
    
    return data as Article;
  } catch (error) {
    console.error('Error creating article:', error);
    
    // Fallback to local storage
    const newArticle: Article = {
      ...articleData,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    const articles = await fetchArticles();
    saveArticles([...articles, newArticle]);
    return newArticle;
  }
};

// Get an article by ID
export const getArticleById = async (id: string): Promise<Article | undefined> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching article from Supabase:', error);
      // Fallback to local storage
      const articles = await fetchArticles();
      return articles.find(article => article.id === id);
    }
    
    return data as Article;
  } catch (error) {
    console.error('Error getting article by ID:', error);
    // Fallback to local storage
    const articles = await fetchArticles();
    return articles.find(article => article.id === id);
  }
};

// Get an article by slug
export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error('Error fetching article from Supabase:', error);
      // Fallback to local storage
      const articles = await fetchArticles();
      return articles.find(article => article.slug === slug);
    }
    
    return data as Article;
  } catch (error) {
    console.error('Error getting article by slug:', error);
    // Fallback to local storage
    const articles = await fetchArticles();
    return articles.find(article => article.slug === slug);
  }
};

// Update an article
export const updateArticle = async (id: string, articleData: Partial<Article>): Promise<Article | null> => {
  try {
    // Try to update in Supabase
    const { data, error } = await supabase
      .from('articles')
      .update(articleData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating article in Supabase:', error);
      // Fallback to local storage
      const articles = await fetchArticles();
      const articleIndex = articles.findIndex(article => article.id === id);
      
      if (articleIndex === -1) return null;
      
      const updatedArticle = {
        ...articles[articleIndex],
        ...articleData,
      };
      
      articles[articleIndex] = updatedArticle;
      saveArticles(articles);
      
      return updatedArticle;
    }
    
    return data as Article;
  } catch (error) {
    console.error('Error updating article:', error);
    
    // Fallback to local storage
    const articles = await fetchArticles();
    const articleIndex = articles.findIndex(article => article.id === id);
    
    if (articleIndex === -1) return null;
    
    const updatedArticle = {
      ...articles[articleIndex],
      ...articleData,
    };
    
    articles[articleIndex] = updatedArticle;
    saveArticles(articles);
    
    return updatedArticle;
  }
};

// Delete an article
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    // Try to delete from Supabase
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting article from Supabase:', error);
      // Fallback to local storage
      const articles = await fetchArticles();
      const filteredArticles = articles.filter(article => article.id !== id);
      
      if (filteredArticles.length === articles.length) return false;
      
      saveArticles(filteredArticles);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    
    // Fallback to local storage
    const articles = await fetchArticles();
    const filteredArticles = articles.filter(article => article.id !== id);
    
    if (filteredArticles.length === articles.length) return false;
    
    saveArticles(filteredArticles);
    return true;
  }
};

// Search articles
export const searchArticles = async (query: string): Promise<Article[]> => {
  try {
    // Try to search in Supabase using ILIKE for case-insensitive search
    if (query) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%,tags.ilike.%${query}%`);
        
      if (error) {
        console.error('Error searching articles in Supabase:', error);
        // Fallback to local storage
        const articles = await fetchArticles();
        const lowerQuery = query.toLowerCase();
        return articles.filter(article => 
          article.title.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          (article.category && article.category.toLowerCase().includes(lowerQuery)) ||
          article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      }
      
      return data as Article[];
    } else {
      // If no query, return all articles
      return fetchArticles();
    }
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
};
