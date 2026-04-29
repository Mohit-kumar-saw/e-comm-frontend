import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#cccccc] py-16 px-6 md:px-24 w-full mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm tracking-wide">
        <div>
          <h4 className="text-white font-semibold mb-6">GET IN TOUCH</h4>
          <p className="mb-3">Whatsapp: +91-9999474819</p>
          <p className="mb-3">Call Support: +91-9999474819</p>
          <p className="mb-3">Email: studio@Rangeela.in</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">NEED HELP?</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-white transition-colors">Order Tracking</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Exchange Portal</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">THE STUDIO</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-white transition-colors">About us</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">MORE</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-white transition-colors">Men Archives</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Women Archives</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
