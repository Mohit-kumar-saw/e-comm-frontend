'use client'
import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check, Heart } from 'lucide-react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface AddToCartSectionProps {
  product: Product;
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, user, isAuthenticated } = useAuth();

  const isWishlisted = user?.wishlist?.some((item: any) =>
    (item._id || item) === (product._id || product.id)
  );

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(res => setTimeout(res, 600));
    await addToCart(product, quantity);
    setIsAdding(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsCartOpen(true);
    }, 1200);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return alert('Please login to use wishlist');
    await toggleWishlist(product._id || product.id || '');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quantity Selector */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Select Quantity</span>
        <div className="flex items-center w-32 border border-gray-200 rounded-lg overflow-hidden h-12 bg-gray-50/30">
          <button
            type="button"
            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
            className="flex-1 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-bold text-[#111]">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            className="flex-1 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Button Action Row */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`relative h-14 flex-1 uppercase tracking-[0.2em] font-bold text-sm transition-all duration-300 shadow-xl overflow-hidden
            ${showSuccess ? 'bg-green-600' : 'bg-[#4d1111] hover:bg-[#330a0a]'} text-white`}
        >
          <div className={`flex items-center justify-center gap-3 transition-transform duration-300 ${isAdding ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
            {showSuccess ? (
              <>
                <Check className="w-5 h-5 animate-in zoom-in" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Bag</span>
              </>
            )}
          </div>

          {isAdding && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </button>

        <button
          onClick={handleWishlist}
          className={`w-14 h-14 border-2 flex items-center justify-center transition-all duration-300 shadow-md transform hover:scale-105 active:scale-95
             ${isWishlisted ? 'border-[#cc2b2b] bg-red-50' : 'border-gray-200 bg-white hover:border-[#cc2b2b]'}`}
        >
          <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-[#cc2b2b] text-[#cc2b2b]' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium tracking-wide">
        <span>Estimated Delivery: <span className="text-gray-900">4-7 Working Days</span></span>
      </div>
    </div>
  );
};

export default AddToCartSection;
