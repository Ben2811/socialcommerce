export interface Product {
  id: number;
  name: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  discount?: number;
  sold?: number;
  author?: string;
}

