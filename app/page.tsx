"use client";
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import ProductCard from "./../components/ProductCard";
import data from "./data.json";
import { Product } from "../types/product";
import { api } from "../services/api";
import { Star, FileVideo, ChevronDown, CheckCircle2, Sparkles, ShieldCheck, Landmark, Palette, HeartHandshake, Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');
  const [reviewSort, setReviewSort] = useState('Featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const heroBanners = [

    {
      src: "/images/hero_banner_womens_1777451578867.png",
      title: "Women's Collection",
      subtitle: "Skillfully crafted shoes that depict our profound love for drama and contrast.",
      cta: "VIEW COLLECTION",
      link: "/collections/womens"
    },
    {
      src: "/images/shoemaking_process_1777453349046.png",
      title: "The Art of Handcrafting",
      subtitle: "Every pair is a masterpiece, meticulously built by Indian master artisans.",
      cta: "OUR STORY",
      link: "/about"
    },
    {
      src: "/images/hero_banner_shoes_1777449275010.png",
      title: "Bori बोम्बर Sneakers",
      subtitle: "Timelessly fashionable statement pieces with impeccable construction.",
      cta: "SHOP NOW",
      link: "/collections/men"
    }
  ];

  React.useEffect(() => {
    if (heroBanners.length <= 1) return;
    const t = setInterval(() => setHeroIndex(i => (i + 1) % heroBanners.length), 5000);
    return () => clearInterval(t);
  }, [heroBanners.length]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to local data if API fails
        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derive products for tabs from live data
  const menProducts = products.filter(p =>
    p.gender === 'male' ||
    p.gender === 'unisex' ||
    (p.category !== 'women' && p.category !== 'womens')
  );

  const womenProducts = products.filter(p =>
    p.gender === 'female' ||
    p.category === 'women' ||
    p.category === 'womens'
  );

  const displayProducts = activeTab === 'men' ? menProducts.slice(0, 4) : womenProducts.slice(0, 4);
  const riotBomber = products.find(p => p.slug === 'riot-bomber-sneakers') || products[0] || data.products[0];

  const infoBanners = [
    { title: "Indian Artisanal Craftsmanship", bg: "bg-[#b32b2b]", icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" /> },
    { title: "Premium Quality Materials", bg: "bg-[#7d7d7d]", icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" /> },
    { title: "Indian Heritage and Storytelling", bg: "bg-[#7d7d7d]", icon: <Landmark className="w-6 h-6 md:w-8 md:h-8" /> },
    { title: "Distinctive Statement Designs", bg: "bg-[#7d7d7d]", icon: <Palette className="w-6 h-6 md:w-8 md:h-8" /> },
    { title: "Support for Local Artisanal Families", bg: "bg-[#7d7d7d]", icon: <HeartHandshake className="w-6 h-6 md:w-8 md:h-8" /> }
  ];

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Dynamic Hero Banner */}
      <section className="relative w-full h-[85vh] flex flex-col justify-center items-center text-white overflow-hidden bg-[#1a1a1a]">
        {heroBanners.map((hero, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 z-0 ${idx === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={hero.src} alt={hero.title} fill className="object-cover object-center opacity-70 scale-105" priority={idx === 0} />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ))}

        <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-normal tracking-wide mb-6 drop-shadow-2xl text-white">
            {heroBanners[heroIndex]?.title}
          </h1>
          <p className="text-sm md:text-base font-light tracking-[0.1em] max-w-lg mb-12 drop-shadow-lg text-gray-200 uppercase leading-relaxed">
            {heroBanners[heroIndex]?.subtitle}
          </p>

          <Link href={heroBanners[heroIndex]?.link || '#'} className="group flex flex-col items-center">
            <span className="text-sm font-bold tracking-[0.3em] uppercase border-b border-white pb-1 transition-all group-hover:border-b-2">
              {heroBanners[heroIndex]?.cta}
            </span>
          </Link>
        </div>

        {/* Banner Nav Dots */}
        <div className="absolute bottom-10 z-10 flex gap-3">
          {heroBanners.map((_, idx) => (
            <button key={idx} onClick={() => setHeroIndex(idx)} className={`w-3 h-3 rounded-full transition-colors shadow-sm ${idx === heroIndex ? 'bg-[#cc2b2b]' : 'bg-white/50 hover:bg-white'}`} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 px-6 bg-[#fafafa] text-center w-full">
        <h2 className="text-4xl font-normal tracking-wide text-[#333] mb-8">New Arrivals</h2>

        <div className="flex justify-center items-center gap-8 border-b border-gray-300 w-fit mx-auto mb-12">
          <button
            onClick={() => setActiveTab('men')}
            className={`pb-3 text-sm font-semibold tracking-wider transition-colors uppercase ${activeTab === 'men' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black border-transparent border-b-2'}`}
          >
            Men's Collection
          </button>
          <button
            onClick={() => setActiveTab('women')}
            className={`pb-3 text-sm font-semibold tracking-wider transition-colors uppercase ${activeTab === 'women' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black border-transparent border-b-2'}`}
          >
            Women's Collection
          </button>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {displayProducts.length > 0 ? displayProducts.map((product: Product) => (
            <ProductCard key={`${product.id || product._id}-${activeTab}`} product={product} />
          )) : (
            <div className="col-span-4 text-center py-10 text-gray-400">No products available in this category yet.</div>
          )}
        </div>
      </section>

      {/* Standalone Featured Sneaker */}
      <section className="py-20 bg-white w-full border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full flex justify-center mb-8">
            <div className="relative w-full max-w-3xl aspect-[21/9] bg-[#fdfdfd] overflow-hidden flex items-center justify-center">
              <Image src={riotBomber.image} alt={riotBomber.name} fill className="object-cover" />
              <div className="absolute top-4 left-0 bg-[#cc2b2b] text-white text-xs font-bold px-2 py-1 tracking-widest uppercase">Gift 🎁</div>
            </div>
          </div>
          <div className="text-center w-full max-w-xl mx-auto flex flex-col items-center">
            <h3 className="text-lg font-bold tracking-widest text-[#222] mb-2">{riotBomber.name}</h3>
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-3 h-3 fill-[#cc2b2b] text-[#cc2b2b]" />
              <span className="text-xs text-gray-500 ml-1 font-semibold">{riotBomber.reviewsCount || 0} Reviews</span>
            </div>
            <p className="text-gray-500 mb-8 tracking-wider">₹{riotBomber.price.toLocaleString()}</p>
            <Link href={`/products/${riotBomber.slug}`} className="bg-[#b32b2b] hover:bg-[#8f2121] text-white px-10 py-3 text-sm font-bold tracking-widest transition-colors inline-block w-48 shadow-lg">
              VIEW ALL
            </Link>
          </div>
        </div>
      </section>

      {/* Info Ribbon */}
      <section className="w-full bg-[#fcfcfc] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row shadow-2xl border border-gray-100 rounded-lg overflow-hidden min-h-[120px]">
          {infoBanners.map((banner, i) => (
            <div key={i} className={`flex-1 ${banner.bg} text-white flex flex-row md:flex-col items-center justify-center p-6 gap-4 md:gap-5 text-center border-b md:border-b-0 md:border-r last:border-r-0 border-white/10 transition-all hover:brightness-110 group cursor-default`}>
              <div className="transition-transform duration-300 group-hover:scale-110">
                {banner.icon}
              </div>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase leading-tight w-full text-center">
                {banner.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Rangeela */}
      <section className="py-20 bg-[#f4f4f4] w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center overflow-visible">
          <div className="w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide text-[#111] mb-8">Why choose Rangeela Studio?</h2>
            <h3 className="text-xl font-bold tracking-widest uppercase text-[#222] mb-6">Indian Artisanal Craftsmanship</h3>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto relative z-10 text-sm md:text-base">
              Each pair is meticulously handcrafted by skilled artisans, ensuring unparalleled quality and attention to detail.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-0">
            <div className="relative aspect-square md:aspect-[5/4] rounded-xl overflow-hidden shadow-2xl">
              <Image src="/images/shoemaking_process_1777453349046.png" alt="Shoemaking process" fill className="object-cover transition-transform hover:scale-105 duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white w-full border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal tracking-wide text-[#111] uppercase mb-4">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-[#cc2b2b] mx-auto"></div>
          </div>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 p-5 rounded transition-all duration-300 open:bg-gray-50 cursor-pointer shadow-sm hover:border-[#cc2b2b]">
                <summary className="font-semibold text-gray-800 list-none flex justify-between items-center outline-none tracking-wide text-sm md:text-base">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-[#cc2b2b] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-200 pt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Component */}
      <section className="py-24 bg-[#f8f8f8] w-full">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          {/* Global Rating Box */}
          <div className="border border-gray-300 bg-white rounded flex flex-col items-center overflow-hidden shadow-sm mb-12 w-64 hover:border-[#cc2b2b] transition-colors cursor-pointer">
            <div className="p-4 flex items-center justify-center gap-3 w-full">
              <Star className="w-8 h-8 fill-[#cc2b2b] text-[#cc2b2b]" />
              <div className="flex flex-col">
                <span className="text-2xl font-black border-b-2 border-gray-100 pb-1 leading-none tracking-wider text-gray-900">
                  4.5<span className="text-lg text-gray-400 font-bold">/5</span>
                </span>
                <span className="text-xs font-bold tracking-widest pt-2 uppercase text-gray-600">964 reviews</span>
              </div>
            </div>
            <div className="bg-[#2c2c2c] text-gray-300 text-[10px] w-full py-1.5 text-center tracking-widest uppercase font-semibold">
              Powered by <span className="font-bold text-white tracking-widest ml-1">LOOX</span>
            </div>
          </div>

          {/* Sub-header inside reviews */}
          <div className="w-full flex justify-between items-center border-b border-gray-200 pb-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex text-[#cc2b2b]">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current opacity-30" />
              </div>
              <span className="text-sm font-semibold text-gray-700 ml-2 tracking-wide">964 Reviews <ChevronDown className="w-4 h-4 inline" /></span>
            </div>

            <div className="relative">
              <button onClick={() => setIsSortOpen(!isSortOpen)} className="bg-gray-100 hover:bg-gray-200 p-2 rounded shadow-sm border border-gray-200 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-2xl border border-gray-100 w-56 rounded-lg p-3 z-50 text-sm font-semibold text-gray-700">
                  <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest px-2 py-2 mb-2 border-b border-gray-100">Sort by</div>
                  {['Featured', 'Newest', 'Highest Ratings', 'Lowest Ratings'].map(s => (
                    <button
                      key={s}
                      onClick={() => { setReviewSort(s); setIsSortOpen(false); }}
                      className="w-full text-left px-3 py-3 hover:bg-gray-50 flex justify-between items-center rounded transition-colors"
                    >
                      <span className="tracking-wide">{s}</span>
                      {reviewSort === s && <CheckCircle2 className="w-4 h-4 text-black" />}
                    </button>
                  ))}
                  <div className="text-[10px] text-right mt-3 text-gray-400 uppercase tracking-widest">Powered by LOOX</div>
                </div>
              )}
            </div>
          </div>

          {/* Masonry Review Output (Mocked) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-white border text-left border-gray-100 overflow-hidden shadow-sm group hover:shadow-md transition-shadow rounded">
                <div className="relative aspect-[4/5] w-full bg-[#f4f4f4] overflow-hidden cursor-pointer">
                  <Image src={productPhotos[num % 3]} alt="Review" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  {num !== 2 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/40 p-4 rounded-full text-white backdrop-blur-sm group-hover:bg-black/60 transition-colors shadow-lg">
                        <FileVideo className="w-8 h-8 opacity-90" />
                      </div>
                    </div>
                  )}
                  {num === 2 && (
                    <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 mt-1 rounded text-xs font-bold shadow border border-gray-100 flex items-center gap-1">
                      📸 <span className="tracking-wider">+2</span>
                    </div>
                  )}
                </div>
                <div className="p-5 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-1.5 tracking-wide uppercase">
                    {names[num % 3]} <CheckCircle2 className="w-3.5 h-3.5 text-green-600 ml-0.5" /> <span className="font-semibold text-gray-400 normal-case tracking-normal">Verified</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mb-3 tracking-widest uppercase">01/04/2026</div>
                  <div className="flex text-[#cc2b2b] mb-3">
                    <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 tracking-wide">Incredible. Good quality and very fast shipping to the UK!</p>

                  {num === 1 && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3 cursor-pointer group/product">
                      <div className="w-10 h-10 relative border border-gray-200 rounded shrink-0 overflow-hidden group-hover/product:border-[#cc2b2b] transition-colors">
                        <Image src={productPhotos[0]} fill className="object-cover" alt="Thumb" />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 max-w-[150px] leading-tight group-hover/product:text-[#cc2b2b] transition-colors">Project Ink Bomber Sneakers</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}

// Temporary constants mimicking backend reviews
const productPhotos = [
  "/images/totem_sneaker_1777451633097.png",
  "/images/sneaker_product_1_1777449355597.png",
  "/images/hero_banner_shoes_1777449275010.png"
];
const names = ["Huma T.", "Gafur Ismail S.", "Aaditya B."];
