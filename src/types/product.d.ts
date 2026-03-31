import { Rating } from './rating';

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  rating: Rating;
  category: string;
  inStock: boolean;
  isActive: boolean;
  createdAt: string;
};

export interface ProductFilterInput {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  search?: string;
}

