"use client";
import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import data from '../app/data.json';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
   const [query, setQuery] = useState('');

   if (!isOpen) return null;

   const featured = data.products.filter(p => data.featuredSearches.includes(p.id));

   return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black/50 backdrop-blur-sm">
         <div className="bg-white w-full max-w-4xl mx-auto mt-20 shadow-2xl overflow-hidden rounded-t-lg">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
               <Search className="w-5 h-5 text-gray-400 ml-2" />
               <input
                  autoFocus
                  type="text"
                  placeholder="Search Products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 border-none outline-none px-4 text-lg bg-transparent"
               />
               <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            {/* Content */}
            <div className="flex h-[400px]">
               {/* Left: Suggestions */}
               <div className="w-1/2 p-6 border-r border-gray-100">
                  <h3 className="text-sm font-semibold tracking-wide text-gray-900 mb-4 uppercase">Search Suggestions</h3>
                  <ul className="space-y-3">
                     {data.searchSuggestions.map((s, i) => (
                        <li key={i}><button className="text-gray-600 hover:text-black hover:underline underline-offset-4">{s}</button></li>
                     ))}
                  </ul>
               </div>

               {/* Right: Products */}
               <div className="w-1/2 p-6 bg-[#f9f9f9] overflow-y-auto">
                  <h3 className="text-sm font-semibold tracking-wide text-gray-900 mb-4 uppercase">Product Suggestions</h3>
                  <div className="space-y-4">
                     {featured.map(product => (
                        <Link href={`/products/${product.slug}`} key={product.id} onClick={onClose} className="flex gap-4 items-center group">
                           <div className="bg-gray-200 w-20 h-20 relative shrink-0 overflow-hidden">
                              <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                           </div>
                           <div>
                              <p className="font-semibold text-sm group-hover:text-[#cc2b2b] transition-colors">{product.name}</p>
                              <p className="text-sm text-gray-600 mt-1">₹{product.price.toLocaleString()}</p>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
