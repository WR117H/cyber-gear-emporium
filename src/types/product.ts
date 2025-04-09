
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: number;
  featured: boolean;
  isNew: boolean;
  specifications?: Record<string, string>;
  compatibleWith?: string[];
}
