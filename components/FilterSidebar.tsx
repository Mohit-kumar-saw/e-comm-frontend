"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('price[gte]') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('price[lte]') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search) params.set('search', search); else params.delete('search');
    if (minPrice) params.set('price[gte]', minPrice); else params.delete('price[gte]');
    if (maxPrice) params.set('price[lte]', maxPrice); else params.delete('price[lte]');
    if (sort) params.set('sort', sort); else params.delete('sort');
    
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('-createdAt');
    router.push('?');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters
      </button>

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl p-8 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:w-64 lg:p-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between lg:hidden mb-8">
           <h2 className="font-black tracking-widest uppercase">Filters</h2>
           <button onClick={() => setIsOpen(false)}><X className="w-6 h-6" /></button>
        </div>

        <div className="space-y-10">
          {/* Search */}
          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4">Search Piece</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Name, color..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-[#cc2b2b] outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4">Price Range (₹)</label>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-xs outline-none"
              />
              <span className="text-gray-300">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-xs outline-none"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4">Order By</label>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={applyFilters}
              className="w-full bg-[#111] hover:bg-[#cc2b2b] text-white font-black tracking-[0.2em] py-4 rounded-xl text-[10px] uppercase transition-all shadow-lg active:scale-95"
            >
              Apply Filter
            </button>
            <button 
              onClick={clearFilters}
              className="text-[10px] font-black tracking-widest uppercase text-gray-300 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" />}
    </>
  );
}
