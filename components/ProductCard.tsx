'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { Product } from '../types/product';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }: { product: Product }) {
   const { toggleWishlist, user, isAuthenticated } = useAuth();

   const isWishlisted = user?.wishlist?.some((item: any) =>
      (item._id || item) === (product._id || product.id)
   );

   const handleWishlist = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) return alert('Please login to use wishlist');
      await toggleWishlist(product._id || product.id || '');
   };

   return (
      <Link href={`/products/${product.slug || product._id}`} className="group relative block w-full max-w-sm mx-auto">
         {/* Badge */}
         {(product.isNewArrival || product.isFeatured) && (
            <div className="absolute top-4 left-4 z-10 bg-white border border-[#cc2b2b] text-[#cc2b2b] text-[10px] font-bold px-2 py-1 flex items-center gap-1 uppercase tracking-wider">
               {product.isFeatured ? 'Featured ✨' : 'New Arrival 🔥'}
            </div>
         )}

         {/* Wishlist Button */}
         <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center group-hover:bg-white transition-all hover:scale-110 active:scale-95"
         >
            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-[#cc2b2b] text-[#cc2b2b]' : 'text-gray-400'}`} />
         </button>

         <div className="bg-[#f2f2f2] aspect-[5/4] relative overflow-hidden mb-4 rounded-xl">
            <Image
               src={product.image?.startsWith('http') ? product.image : (product.image?.startsWith('/') ? product.image : `https://e-comm-backend-tnab.onrender.com${product.image}`)}
               alt={product.name}
               fill
               className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
         </div>
         <div className="text-center px-2">
            <h3 className="text-sm font-semibold text-[#333] tracking-wide mb-1 uppercase drop-shadow-sm">{product.name}</h3>
            <div className="flex justify-center items-center gap-1 mb-2">
               {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#cc2b2b] fill-[#cc2b2b]' : 'text-gray-300 fill-gray-300'}`} />
               ))}
               <span className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-tighter">{product.reviewsCount} Reviews</span>
            </div>
            <p className="text-sm font-black text-gray-900 tracking-wider">₹{product.price.toLocaleString()}</p>
         </div>
      </Link>
   );
}
