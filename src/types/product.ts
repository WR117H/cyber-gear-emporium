
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];  // Added: support for multiple images
  category: string;
  inStock: number;
  featured: boolean;
  isNew: boolean;
  specifications?: Record<string, string>;
  compatibleWith?: string[];
  article?: string;  // Added: for long-form content
  videoLinks?: string[];  // Added: for YouTube/video links
  community?: {  // Added: community discussion structure
    enabled: boolean;
    comments?: ProductComment[];
  };
}

export interface ProductComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  replies?: ProductComment[];
}
