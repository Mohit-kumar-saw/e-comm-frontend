"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/user';
import { api } from '../services/api';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, redirect?: boolean) => Promise<void>;
  signup: (userData: any, redirect?: boolean) => Promise<void>;
  logout: () => void;
  addAddress: (addressData: any) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        if (token && user) {
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Verify token validity with backend
          try {
            const response = await api.get('/auth/me'); // Assuming this endpoint exists
            if (response.status === 'success') {
              const freshUser = response.data.user;
              localStorage.setItem('user', JSON.stringify(freshUser));
              setState(prev => ({ ...prev, user: freshUser }));
            }
          } catch (err) {
            console.error('Token verification failed');
            // If token is invalid, you might want to logout
            // logout(); 
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, redirect: boolean = true) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.status === 'success') {
      const { token, data } = response;
      const user = data.user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      if (redirect) {
        router.push('/profile');
      }
    }
  };

  const signup = async (userData: any, redirect: boolean = true) => {
    const response = await api.post('/auth/register', userData);
    if (response.status === 'success') {
      const { token, data } = response;
      const user = data.user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      if (redirect) {
        router.push('/profile');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push('/');
  };

  const addAddress = async (addressData: any) => {
    const response = await api.post('/auth/address', addressData);
    if (response.status === 'success') {
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const toggleWishlist = async (productId: string) => {
    const response = await api.post('/auth/wishlist', { productId });
    if (response.status === 'success') {
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, addAddress, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
