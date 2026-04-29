import React from 'react';
import Image from 'next/image';
import { Star, ChevronDown } from 'lucide-react';
import ProductCard from '../../../components/ProductCard';
import Link from 'next/link';
import RecentViewTracker from '../../../components/RecentViewTracker';
import AddToCartSection from '../../../components/AddToCartSection';
import { api } from '../../../services/api';
import data from '../../data.json';
import { Product } from '../../../types/product';

export async function generateStaticParams() {
   try {
      const response = await api.get('/products');
      return response.data.products.map((product: Product) => ({
         slug: String(product.slug || product._id || product.id),
      }));
   } catch (error) {
      return data.products.map(product => ({
         slug: String(product.slug || product.id),
      }));
   }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
   const { slug } = await params;

   let product: Product | null = null;
   let products: Product[] = [];

   try {
      const response = await api.get('/products');
      products = response.data.products;
      product = products.find((p: Product) => p.slug === slug || String(p._id) === slug || String(p.id) === slug) || null;
   } catch (error) {
      console.error('Failed to fetch product:', error);
      product = (data.products.find(p => p.slug === slug || String((p as any)._id) === slug || String(p.id) === slug) as Product) || null;
      products = data.products;
   }

   if (!product) return <div className="p-20 text-center font-bold text-xl">Product Not Found</div>;

   const relatedProducts = products.filter((p: Product) => p._id !== product._id && p.id !== product.id).slice(0, 4);
   const reviews = data.reviews.filter(r => r.productId === product.id || r.productId === product._id);

   const productImage = product.image?.startsWith('http')
      ? product.image
      : (product.image?.startsWith('/') ? product.image : `https://e-comm-backend-tnab.onrender.com${product.image}`);

   return (
      <div className="max-w-7xl mx-auto w-full px-6 py-12 mb-10">
         <RecentViewTracker productId={product.id || product._id || ''} />
         {/* Breadcrumb */}
         <div className="text-xs text-gray-500 mb-8 tracking-wide font-medium">
            <Link href="/" className="hover:text-black">HOME</Link> / <Link href="/collections" className="hover:text-black">COLLECTIONS</Link> / <span className="text-black">{product.name.toUpperCase()}</span>
         </div>

         {/* Top Section */}
         <div className="flex flex-col md:flex-row gap-12 lg:gap-20 mb-20">
            {/* Image */}
            <div className="w-full md:w-1/2">
               <div className="bg-[#f0f0f0] aspect-[4/5] relative mb-4 sticky top-10 overflow-hidden">
                  <Image src={productImage} alt={product.name} fill className="object-cover" />
               </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 flex flex-col mt-4">
               <h1 className="text-3xl font-semibold tracking-wide text-[#222] mb-2">{product.name}</h1>

               <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#cc2b2b] fill-[#cc2b2b]' : 'text-gray-300'}`} />
                     ))}
                  </div>
                  <span className="text-sm text-gray-500">{product.reviewsCount} Reviews</span>
               </div>

               <p className="text-2xl font-semibold mb-8 text-[#111]">
                  ₹{product.price.toLocaleString()}
                  {product.originalPrice && <span className="text-gray-400 line-through text-lg ml-3 font-normal">₹{product.originalPrice.toLocaleString()}</span>}
               </p>

               <div className="prose prose-sm text-gray-700 leading-relaxed mb-10 max-w-none">
                  <p>{product.description}</p>
                  <p className="mt-4">Timelessly fashionable statement pieces with impeccable construction and handcrafted perfection.</p>
               </div>

               {/* Add to Cart */}
               <div className="mb-10">
                  <AddToCartSection product={product} />
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
                     <span>or 3 Monthly Payments of <span className="font-semibold text-gray-800">₹{(product.price / 3).toFixed(0)}</span></span>
                  </div>
               </div>

               {/* Features Details */}
               <ul className="text-sm text-gray-600 mb-10 space-y-2 list-disc pl-5">
                  <li>Artisan crafted with premium materials</li>
                  <li>Includes a protective dust bag</li>
                  <li>Custom tailored fit available on request</li>
               </ul>

               {/* FAQs */}
               <div className="border-t border-gray-200 pt-8 mt-4">
                  <h3 className="text-xl font-semibold tracking-wide mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                     {data.faqs.map((faq, i) => (
                        <details key={i} className="group border border-gray-200 p-4 transition-all duration-300 open:bg-gray-50 cursor-pointer">
                           <summary className="font-medium text-gray-800 list-none flex justify-between items-center outline-none">
                              {faq.question}
                              <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                           </summary>
                           <p className="mt-4 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                        </details>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Reviews */}
         <div className="mb-24 bg-gray-50 p-10 rounded-xl">
            <h2 className="text-2xl font-semibold tracking-widest text-center mb-10">CUSTOMER REVIEWS</h2>
            {reviews.length > 0 ? (
               <div className="space-y-6">
                  {reviews.map((r, idx) => (
                     <div key={idx} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 w-full max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-[#cc2b2b] fill-[#cc2b2b]' : 'text-gray-300'}`} />
                              ))}
                           </div>
                           <span className="text-sm font-semibold">{r.author}</span>
                           <span className="text-xs text-gray-500 ml-auto">{r.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm italic">"{r.content}"</p>
                     </div>
                  ))}
               </div>
            ) : (
               <p className="text-center text-gray-500">No reviews yet.</p>
            )}
         </div>

         {/* You May Also Like */}
         <div>
            <h2 className="text-xl font-semibold tracking-widest text-[#222] mb-8 border-b border-gray-200 pb-4">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {relatedProducts.map((p: Product) => (
                  <ProductCard key={p.id} product={p} />
               ))}
            </div>
         </div>
      </div>
   );
}
