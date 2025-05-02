
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  coverImage: string; // Added back
  publishedAt: string; // Added back
  category: string; // Added back
  slug: string;
  tags: string[];
}
