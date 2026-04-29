"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, ChevronRight, Package, Clock, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
};

export default function OrderHistoryPage() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await api.get('/orders/my-orders');
        if (response.status === 'success') {
          setOrders(response.data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#cc2b2b] animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Retrieving your rebellion...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <Package className="w-16 h-16 text-gray-200 mb-6" />
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-4 uppercase">Identity Required</h1>
        <p className="text-gray-500 mb-8 max-w-sm font-medium">Please sign in to view your order history and track your artisanal pieces.</p>
        <Link href="/login" className="bg-black text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#cc2b2b] transition-all">Sign In</Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
      case 'processing': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/profile" className="p-3 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-200">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Order History</h1>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#cc2b2b] mt-1">Your Curated Collection</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide">No orders yet</h2>
            <p className="text-gray-500 mb-10 font-medium">Start your journey with Rangeela Studio today.</p>
            <Link href="/collections" className="bg-black text-white px-12 py-5 rounded-2xl font-black tracking-widest uppercase hover:bg-[#cc2b2b] transition-all shadow-xl shadow-black/10">Browse Collections</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <Link 
                key={order._id} 
                href={`/orders/${order._id}`}
                className="block group bg-white hover:bg-[#fff9f9] border border-gray-100 hover:border-[#cc2b2b]/20 rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-black p-3 rounded-2xl text-white shadow-lg">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Order Identifier</p>
                        <p className="font-bold tracking-widest text-[#111]">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {order.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.status}
                      </div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-10">
                    <div className="flex -space-x-4 overflow-hidden py-2">
                       {order.items.slice(0, 3).map((item: any, idx: number) => (
                          <div key={idx} className="relative w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-50 group-hover:scale-105 transition-transform duration-500" style={{ zIndex: 10 - idx }}>
                             <Image 
                                src={item.product?.image || '/images/hero_banner_shoes_1777449275010.png'} 
                                alt="Item" 
                                fill 
                                className="object-cover"
                             />
                          </div>
                       ))}
                       {order.items.length > 3 && (
                          <div className="relative w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center z-0">
                             <span className="text-xl font-black text-[#cc2b2b]">+{order.items.length - 3}</span>
                          </div>
                       )}
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                       <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Total Amount</p>
                       <p className="text-3xl font-black text-gray-900 tracking-tight">₹{order.totalAmount.toLocaleString()}</p>
                    </div>

                    <div className="p-5 rounded-full bg-gray-50 group-hover:bg-[#cc2b2b] group-hover:text-white transition-all duration-300">
                       <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
