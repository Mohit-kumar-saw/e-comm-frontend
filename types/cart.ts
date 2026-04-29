import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (productId: string, size?: string, color?: string) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}
