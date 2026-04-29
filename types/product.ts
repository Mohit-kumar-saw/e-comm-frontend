export interface Product {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  categoryId?: string;
  categorySlug?: string;
  category?: string;
  gender?: string;
  rating: number;
  reviewsCount: number;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  image: string;
  description?: string;
}
