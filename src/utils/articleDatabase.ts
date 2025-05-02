
import { v4 as uuidv4 } from 'uuid';
import { Article } from '@/types/article';

// Mock database stored in localStorage
const ARTICLES_STORAGE_KEY = 'cyber_gear_articles';

// Helper to get all articles
export const fetchArticles = (): Article[] => {
  const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
  return storedArticles ? JSON.parse(storedArticles) : [];
};

// Helper to save all articles
const saveArticles = (articles: Article[]): void => {
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
};

// Create a new article
export const createArticle = (articleData: Omit<Article, 'id'>): Article => {
  const articles = fetchArticles();
  
  const newArticle: Article = {
    ...articleData,
    id: uuidv4()
  };
  
  saveArticles([...articles, newArticle]);
  return newArticle;
};

// Get an article by ID
export const getArticleById = (id: string): Article | undefined => {
  const articles = fetchArticles();
  return articles.find(article => article.id === id);
};

// Get an article by slug
export const getArticleBySlug = (slug: string): Article | undefined => {
  const articles = fetchArticles();
  return articles.find(article => article.slug === slug);
};

// Update an article
export const updateArticle = (id: string, articleData: Partial<Article>): Article | null => {
  const articles = fetchArticles();
  const articleIndex = articles.findIndex(article => article.id === id);
  
  if (articleIndex === -1) return null;
  
  const updatedArticle = {
    ...articles[articleIndex],
    ...articleData,
  };
  
  articles[articleIndex] = updatedArticle;
  saveArticles(articles);
  
  return updatedArticle;
};

// Delete an article
export const deleteArticle = (id: string): boolean => {
  const articles = fetchArticles();
  const filteredArticles = articles.filter(article => article.id !== id);
  
  if (filteredArticles.length === articles.length) return false;
  
  saveArticles(filteredArticles);
  return true;
};
