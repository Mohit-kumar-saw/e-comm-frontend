"use client";
import { useEffect } from 'react';

export default function RecentViewTracker({ productId }: { productId: string }) {
   useEffect(() => {
      try {
         const existing = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
         const filtered = existing.filter((id: string) => id !== productId);
         filtered.unshift(productId); // Add to the beginning
         // Keep only the last 8 items
         localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 8)));
      } catch (e) {
         console.error('Failed to log recent product view', e);
      }
   }, [productId]);
   
   return null;
}
