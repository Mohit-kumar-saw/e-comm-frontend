"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import SearchModal from './SearchModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const { cartCount, setIsCartOpen } = useCart();
   const { isAuthenticated, user } = useAuth();
   const pathname = usePathname();
   const isAuthPage = pathname?.startsWith('/auth');

   return (
      <header className="w-full border-b border-gray-200">
         {/* Top Promo Bar - Hidden on Auth Pages */}
         {!isAuthPage && (
            <div className="bg-[#cc2b2b] text-white text-center py-2 text-sm font-medium tracking-wide">
               Free Express Shipping across India 🇮🇳
            </div>
         )}
         <div className="py-4 px-6 md:px-12 flex justify-between items-center bg-white">
            <div className="flex md:hidden">
               <Menu className="w-6 h-6" />
            </div>
            {/* Search Icon */}
            <div className="hidden md:flex items-center gap-2 cursor-pointer w-1/3" onClick={() => setIsSearchOpen(true)}>
               <Search className="w-5 h-5 text-gray-700" />
               <span className="text-gray-400 text-sm border border-gray-200 px-3 py-2 rounded-md w-full max-w-[200px]">Search Products</span>
            </div>

            <Link href="/" className="text-2xl font-bold tracking-widest text-[#cc2b2b] uppercase text-center w-1/3 flex flex-col items-center">
               Rangeela
               <span className="text-sm tracking-[0.2em] font-light mt-1">STUDIO</span>
            </Link>

            <div className="flex justify-end gap-6 items-center w-1/3">
               {isAuthenticated ? (
                  <Link href="/profile" className="flex items-center gap-2 group">
                     <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Welcome,</span>
                        <span className="text-xs font-bold text-[#111] leading-tight">{user?.name.split(' ')[0]}</span>
                     </div>
                     <User className="w-5 h-5 text-gray-700 group-hover:text-[#cc2b2b] cursor-pointer transition-colors" />
                  </Link>
               ) : (
                  <div className="flex items-center gap-4">
                     <Link href="/auth/login" className="text-xs font-bold tracking-widest text-gray-600 hover:text-black uppercase hidden md:block">Login</Link>
                     <Link href="/auth/signup" className="text-[10px] font-black tracking-[0.2em] bg-black text-white px-4 py-2 rounded-full hover:bg-[#cc2b2b] transition-all uppercase">Signup</Link>
                  </div>
               )}
               <button onClick={() => setIsCartOpen(true)} className="relative group">
                  <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-black cursor-pointer transition-colors" />
                  {cartCount > 0 && (
                     <span className="absolute -top-2 -right-2 bg-[#cc2b2b] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                        {cartCount}
                     </span>
                  )}
               </button>
            </div>
         </div>

         {/* Links - Hidden on Auth Pages */}
         {!isAuthPage && (
            <nav className="hidden md:flex justify-center gap-8 py-4 bg-[#f9f9f9] text-sm font-semibold tracking-widest text-[#222]">
               <Link href="/collections/men" className="hover:text-[#cc2b2b] transition-colors">MEN</Link>
               <Link href="/collections/womens" className="hover:text-[#cc2b2b] transition-colors">WOMEN</Link>
               <Link href="/collections" className="hover:text-[#cc2b2b] transition-colors">COLLECTIONS</Link>
               <Link href="/" className="hover:text-[#cc2b2b] transition-colors">REVIEWS</Link>
               <div className="relative group cursor-pointer z-40">
                  <div className="flex items-center gap-1 hover:text-[#cc2b2b] transition-colors text-[#cc2b2b]">
                     MORE <ChevronDown className="w-4 h-4 group-hover:-rotate-180 transition-transform" />
                  </div>
                  <div className="absolute top-10 left-0 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 flex flex-col font-medium tracking-wide text-gray-700 border-t-2 border-[#cc2b2b]">
                     <Link href="/about" className="px-5 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors">Contact Us</Link>
                     <Link href="/about" className="px-5 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors">About us</Link>
                     <Link href="/profile" className="px-5 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors">Order Tracking</Link>
                     <Link href="/about" className="px-5 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors">Rangeela Info</Link>
                  </div>
               </div>
            </nav>
         )}

         <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </header>
   );
};

export default Navbar;
