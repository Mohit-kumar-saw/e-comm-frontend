"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { CartItem, CartContextType } from '../types/cart';
import { api } from '../services/api';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize from localStorage and Sync with Backend
  useEffect(() => {
    const initCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (token) {
          // If logged in, fetch from backend and merge if needed
          try {
            const response = await api.get('/cart');
            const serverCart = response.data.items || [];
            
            if (localCart.length > 0) {
              // Merge guest cart with server cart
              const guestItems = localCart.map((item: any) => ({
                productId: item.product.id || item.product._id,
                quantity: item.quantity,
                size: item.size,
                color: item.color
              }));
              
              const mergedResponse = await api.post('/cart/merge', { guestItems });
              setCart(mergedResponse.data.items || []);
              localStorage.removeItem('cart'); // Clear local cart after merge
            } else {
              setCart(serverCart);
            }
          } catch (err) {
            console.error('Failed to sync cart with server:', err);
            setCart(localCart);
          }
        } else {
          // Guest mode
          setCart(localCart);
        }
      } catch (err) {
        console.error('Error initializing cart:', err);
      } finally {
        setIsCartLoading(false);
      }
    };

    initCart();
  }, []);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!isCartLoading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoading]);

  const addToCart = async (product: Product, quantity: number = 1, size?: string, color?: string) => {
    const token = localStorage.getItem('token');
    
    // Optimistic UI Update
    setCart(prev => {
      const existingIndex = prev.findIndex(item => {
        const itemId = item.product._id || item.product.id;
        const addId = product._id || product.id;
        return itemId && addId && itemId === addId && 
               item.size === size && 
               item.color === color;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, size, color }];
    });

    // Server Sync
    if (token) {
      try {
        await api.post('/cart/add', { 
          productId: product.id || product._id, 
          quantity, 
          size, 
          color 
        });
      } catch (err) {
        console.error('Failed to sync add-to-cart with server');
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number, size?: string, color?: string) => {
    const token = localStorage.getItem('token');
    
    // Optimistic UI Update
    setCart(prev => prev.map(item => {
      const itemId = item.product._id || item.product.id;
      return (itemId === productId && 
        item.size === size && 
        item.color === color)
        ? { ...item, quantity }
        : item;
    }));

    // Server Sync
    if (token) {
      try {
        await api.patch('/cart/update', { productId, quantity, size, color });
      } catch (err) {
        console.error('Failed to sync quantity update');
      }
    }
  };

  const removeFromCart = async (productId: string, size?: string, color?: string) => {
    const token = localStorage.getItem('token');
    
    // Optimistic UI Update
    setCart(prev => prev.filter(item => {
      const itemId = item.product._id || item.product.id;
      return !(itemId === productId && 
        item.size === size && 
        item.color === color);
    }));

    // Server Sync
    if (token) {
      try {
        await api.delete('/cart/remove', { productId, size, color });
      } catch (err) {
        console.error('Failed to sync removal');
      }
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    // Note: Add server clear if needed, usually done after checkout
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      isCartLoading,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
