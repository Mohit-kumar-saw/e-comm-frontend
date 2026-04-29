"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsCartOpen]);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#cc2b2b]" />
            <h2 className="text-xl font-bold tracking-tight text-[#111]">
              Your Bag <span className="text-sm font-normal text-gray-400 ml-1">({cartCount} items)</span>
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-gray-500 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 tracking-wide">Your bag is empty</p>
                <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-[#111] text-white px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#cc2b2b] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id || item.product._id}-${item.size || ''}-${item.color || ''}`} className="flex gap-4 group">
                {/* Product Image */}
                <div className="relative w-24 h-28 bg-gray-50 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                  <Image
                    src={item.product.image?.startsWith('http') ? item.product.image : (item.product.image?.startsWith('/') ? item.product.image : `http://localhost:4000${item.product.image}`)}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-bold text-[#111] hover:text-[#cc2b2b] transition-colors line-clamp-1 pr-4"
                      onClick={() => setIsCartOpen(false)}
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.product.id || item.product._id || '', item.size, item.color)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex flex-wrap gap-x-3 gap-y-1 mb-3">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 && updateQuantity(item.product.id || item.product._id || '', item.quantity - 1, item.size, item.color)}
                        className="p-1 px-2 hover:bg-gray-50 text-gray-500 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#111]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id || item.product._id || '', item.quantity + 1, item.size, item.color)}
                        className="p-1 px-2 hover:bg-gray-50 text-gray-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-[#111]">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111] pt-1">
                <span className="uppercase tracking-widest">Total</span>
                <span className="text-lg">₹{cartTotal.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-gray-400 italic">Shipping and taxes calculated at checkout.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="bg-[#111] text-white py-4 px-6 text-sm font-bold tracking-[0.2em] text-center uppercase hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-xl"
              >
                Secure Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
