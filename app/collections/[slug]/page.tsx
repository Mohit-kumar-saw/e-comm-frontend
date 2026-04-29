import React from 'react';
import ProductCard from '../../../components/ProductCard';
import FilterSidebar from '../../../components/FilterSidebar';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../services/api';
import data from '../../data.json';
import { Product } from '../../../types/product';

export default async function CategoryPage({ 
   params, 
   searchParams 
}: { 
   params: { slug: string },
   searchParams: { [key: string]: string | undefined }
}) {
   const { slug } = await params;
   const sParams = await searchParams;
   const category = data.categories.find(c => c.slug === slug);

   let title = category ? category.name : slug.toUpperCase();
   
   let products: Product[] = [];
   try {
      // Pass searchParams to backend API
      const queryParams = new URLSearchParams(sParams as any);
      
      // Auto-filter by category if on a specific category page
      if (category && slug !== 'men' && slug !== 'womens' && slug !== 'women') {
         queryParams.set('category', slug);
      } else if (slug === 'men') {
          queryParams.set('gender', 'male');
      } else if (slug === 'womens' || slug === 'women') {
          queryParams.set('gender', 'female');
      }

      const response = await api.get(`/products?${queryParams.toString()}`);
      products = response.data.products;
   } catch (error) {
      console.error('Failed to fetch products:', error);
      products = data.products;
   }
   
   // Hero Section for Men/Women
   if (slug === 'womens' || slug === 'men' || slug === 'women') {
      const isWomens = slug === 'womens' || slug === 'women';
      const heroImage = isWomens ? "/images/hero_banner_womens_1777451578867.png" : "/images/hero_banner_shoes_1777449275010.png";
      const heroTitle = isWomens ? "Women's collection" : "Men's collection";
      const heroDesc = isWomens 
         ? "Skillfully crafted shoes that depict our profound love for drama and contrast, for Women."
         : "Timelessly fashionable statement pieces with impeccable construction, for Men.";

      const navCategories = isWomens ? [
         { id: 'w1', name: "View Women's Collection", image: "/images/hero_banner_womens_1777451578867.png", slug: "womens" },
         { id: 'w2', name: "Bomber Sneakers", image: "/images/totem_sneaker_1777451633097.png", slug: "womens" },
         { id: 'w6', name: "All Men's Collection", image: "/images/hero_banner_shoes_1777449275010.png", slug: "men" },
      ] : [
         { id: 'm1', name: "View Men's Collection", image: "/images/hero_banner_shoes_1777449275010.png", slug: "men" },
         { id: 'm2', name: "Sneakers", image: data.categories[0]?.image || "/images/sneaker_product_1_1777449355597.png", slug: "men" },
         { id: 'm6', name: "All Women's Collection", image: "/images/hero_banner_womens_1777451578867.png", slug: "womens" },
      ];

      return (
         <div className="flex flex-col w-full font-sans mb-24">
            {/* Hero Banner */}
            <section className="relative w-full h-[50vh] flex flex-col justify-center items-center text-white overflow-hidden bg-[#111]">
               <div className="absolute inset-0 z-0">
                  <Image src={heroImage} alt={heroTitle} fill className="object-cover opacity-60" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
               </div>
               <div className="relative z-10 flex flex-col items-center px-6">
                  <h1 className="text-5xl md:text-7xl font-black tracking-widest mb-4 uppercase text-center drop-shadow-2xl">{heroTitle}</h1>
                  <p className="text-sm md:text-base font-bold tracking-[0.3em] max-w-2xl text-center uppercase text-white/80">{heroDesc}</p>
               </div>
            </section>

            <div className="max-w-[1400px] mx-auto px-6 py-16 w-full flex flex-col lg:flex-row gap-12">
               {/* Sidebar Filters */}
               <aside className="w-full lg:w-64 shrink-0">
                  <div className="sticky top-24">
                     <FilterSidebar />
                  </div>
               </aside>

               {/* Grid */}
               <div className="flex-1">
                  <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                     <h2 className="text-xs font-black tracking-[0.3em] text-gray-400 uppercase">Results ({products.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                     {products.length > 0 ? (
                        products.map((product: Product) => (
                           <ProductCard key={product.id || product._id} product={product} />
                        ))
                     ) : (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                           <p className="text-gray-400 font-bold tracking-widest uppercase">No artisanal pieces found.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // Default Generic Category Page
   return (
      <div className="w-full mb-24">
         <div className="bg-[#f2f2f2] py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-[#111] uppercase drop-shadow-sm">{title}</h1>
            <p className="mt-6 text-gray-500 font-medium tracking-[0.1em] max-w-2xl mx-auto uppercase text-xs">Exclusively Handcrafted Excellence.</p>
         </div>

         <div className="max-w-[1400px] mx-auto py-16 px-6 flex flex-col lg:flex-row gap-12">
            <aside className="w-full lg:w-64 shrink-0">
               <div className="sticky top-24">
                  <FilterSidebar />
               </div>
            </aside>

            <div className="flex-1">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {products.length > 0 ? (
                     products.map((product: Product) => (
                        <ProductCard key={product.id || product._id} product={product} />
                     ))
                  ) : (
                     <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">No products found matching your criteria.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
