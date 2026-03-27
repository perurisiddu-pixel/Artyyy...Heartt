export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size: string;
  isFeatured?: boolean;
  stock?: number;
  isSold?: boolean;
}

export interface CartItem extends Product {
  productId: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}
