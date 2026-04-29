"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import data from '../data.json';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types/product';

export default function CollectionsPage() {
   const [recentProducts, setRecentProducts] = useState<Product[] | null>(null);

   useEffect(() => {
      // Load recently viewed functionality by reading localStorage
      try {
         const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
         if (viewedIds.length > 0) {
            const found = viewedIds.map((id: string) => data.products.find(p => p.id === id)).filter(Boolean) as Product[];
            setRecentProducts(found.slice(0, 4));
         } else {
            // Fallback to random/featured if none viewed
            setRecentProducts(data.products.slice(0, 4) as Product[]);
         }
      } catch (e) {
         setRecentProducts(data.products.slice(0, 4) as Product[]);
      }
   }, []);

   return (
      <div className="w-full mb-20 font-sans">
         <div className="bg-[#111] py-16 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase shadow-sm">All Collections</h1>
            <p className="mt-4 text-gray-300 tracking-wide max-w-2xl mx-auto italic">Explore our entire catalogue of premium artisan footwear.</p>
         </div>

         {/* Categories */}
         <section className="py-20 px-6 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto text-center mb-12">
               <h2 className="text-2xl font-bold tracking-widest text-[#222] uppercase">Shop by Category</h2>
               <div className="w-16 h-1 bg-[#cc2b2b] mx-auto mt-4"></div>
            </div>
            <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 md:gap-14">
               {/* Fixed top level segments */}
               <Link href="/collections/men" className="flex flex-col items-center group">
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-[3px] border-transparent group-hover:border-[#cc2b2b] p-1 overflow-hidden transition-all duration-300 bg-white shadow-md">
                     <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                        <Image src="/images/hero_banner_shoes_1777449275010.png" alt="Men's Collection" fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
                     </div>
                  </div>
                  <span className="mt-5 text-sm font-bold text-gray-800 tracking-wide uppercase transition-colors group-hover:text-[#cc2b2b]">Men's</span>
               </Link>
               <Link href="/collections/womens" className="flex flex-col items-center group">
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-[3px] border-transparent group-hover:border-[#cc2b2b] p-1 overflow-hidden transition-all duration-300 bg-white shadow-md">
                     <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                        <Image src="/images/hero_banner_womens_1777451578867.png" alt="Women's Collection" fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
                     </div>
                  </div>
                  <span className="mt-5 text-sm font-bold text-gray-800 tracking-wide uppercase transition-colors group-hover:text-[#cc2b2b]">Women's</span>
               </Link>

               {/* Dynamic categories from data */}
               {data.categories.map(cat => (
                  <Link href={`/collections/${cat.slug}`} key={cat.id} className="flex flex-col items-center group">
                     <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-[3px] border-transparent group-hover:border-[#cc2b2b] p-1 overflow-hidden transition-all duration-300 bg-white shadow-md">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                           <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
                        </div>
                     </div>
                     <span className="mt-5 text-sm font-bold text-gray-800 tracking-wide uppercase transition-colors group-hover:text-[#cc2b2b]">{cat.name}</span>
                  </Link>
               ))}
            </div>
         </section>

         {/* Recently Viewed Products */}
         <section className="max-w-7xl mx-auto py-20 px-6">
            <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-4">
               <h2 className="text-xl font-bold tracking-widest text-[#222] uppercase">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {recentProducts ? recentProducts.map((product: Product) => (
                  <ProductCard key={`recent-${product.id || product._id}`} product={product} />
               )) : (
                  Array.from({length: 4}).map((_, i) => (
                     <div key={i} className="w-full aspect-[4/5] bg-gray-100 animate-pulse rounded-md" />
                  ))
               )}
            </div>
         </section>
      </div>
   );
}
