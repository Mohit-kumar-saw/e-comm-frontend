import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="w-full mb-10">
      <div className="bg-[#f2f2f2] py-16 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-[#333] uppercase">About Us</h1>
        <p className="mt-4 text-gray-600 tracking-wide max-w-2xl mx-auto">Discover the art, heritage, and craftsmen behind Rangeela Studio.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 aspect-[21/9] relative w-full overflow-hidden bg-gray-100 shadow-lg rounded-sm">
          {/* Reusing hero banner as a placeholder for the studio pic */}
          <Image src="/images/hero_banner_shoes_1777449275010.png" alt="Studio" fill className="object-cover" />
        </div>

        <h2 className="text-2xl font-semibold tracking-widest text-[#222] mb-6 inline-block border-b-2 border-[#cc2b2b] pb-2">OUR HERITAGE</h2>
        <div className="prose prose-lg text-gray-700 leading-relaxed font-sans max-w-none">
          <p className="mb-6">
            Rangeela is an exploration of indigenous Indian crafts re-imagined through contemporary aesthetics. We are passionate about storytelling through meticulous hand-painted details, intricate embroidery, and superior footwear engineering.
          </p>
          <p className="mb-6">
            We collaborate with small artisan clusters, supporting sustainable livelihoods and preserving age-old techniques that have been passed down for generations.
          </p>
          <p>
            Every pair from Rangeela Studio is an investment. It is not just clothing; it is a wearable piece of art designed to last a lifetime.
          </p>
        </div>
      </div>
    </div>
  );
}
