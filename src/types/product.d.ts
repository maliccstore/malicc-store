import { Rating } from './rating';

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: Rating;
  category: string;
  inStock: boolean;
  createdAt: string;
};

