export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  addresses?: Address[];
  wishlist?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
