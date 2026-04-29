"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  ChevronLeft, 
  ShoppingBag, 
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  XCircle
} from 'lucide-react';

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !id) return;
      try {
        const response = await api.get(`/orders/${id}`);
        if (response.status === 'success') {
          setOrder(response.data.order);
        }
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError(err.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  if (loading) {
     return (
       <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-10 h-10 text-[#cc2b2b] animate-spin" />
           <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Tracking your journey...</p>
         </div>
       </div>
     );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-100 mb-6" />
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-4 uppercase">Order Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm font-medium">We couldn't locate the artisanal journey you're looking for.</p>
        <Link href="/orders" className="bg-black text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#cc2b2b] transition-all">Back to History</Link>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', status: 'pending', icon: Package, date: order.createdAt },
    { label: 'Processing', status: 'processing', icon: Clock, date: null },
    { label: 'Shipped', status: 'shipped', icon: Truck, date: null },
    { label: 'Delivered', status: 'delivered', icon: CheckCircle2, date: null }
  ];

  const currentStatusIndex = steps.findIndex(s => s.status === order.status.toLowerCase());
  const finalIndex = order.status === 'delivered' ? 3 : (currentStatusIndex === -1 ? 0 : currentStatusIndex);

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <Link href="/orders" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 hover:text-[#cc2b2b] transition-colors mb-6 group">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to History
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase leading-none">Track Journey</h1>
            <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#cc2b2b] mt-3">Order #{order._id.toUpperCase()}</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
             <div className="p-4 rounded-2xl bg-green-50 text-green-600">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Order Status</p>
                <p className="font-bold tracking-widest uppercase text-gray-900">{order.status}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Tracking Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-50" />
               
               <h3 className="text-xl font-black tracking-widest uppercase mb-12 relative z-10">Journey Progress</h3>
               
               <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-start space-y-8 sm:space-y-0 before:hidden sm:before:block before:absolute before:left-10 before:right-10 before:top-4 before:h-[2px] before:bg-gray-100 z-10 w-full mt-4">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= finalIndex;
                    const isCurrent = idx === finalIndex;
                    const Icon = step.icon;

                    return (
                      <div key={idx} className={`relative flex flex-row sm:flex-col items-center gap-4 sm:gap-4 transition-all duration-700 w-full sm:w-1/4 ${isCompleted ? "opacity-100" : "opacity-30"}`}>
                        {/* Vertical line specifically for mobile stacked layout */}
                        {idx !== steps.length - 1 && <div className="sm:hidden absolute left-4 top-8 bottom-[-2rem] w-[2px] bg-gray-100 -z-10" />}
                        
                        {/* Primary Node Point */}
                        <div className={`shrink-0 w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-all duration-700 z-20 shadow-sm ${isCompleted ? "bg-[#cc2b2b] border-white shadow-[#cc2b2b]/30" : "bg-white border-gray-200"} ${isCurrent ? "scale-125" : ""}`}>
                           {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>

                        {/* Node Content Container */}
                        <div className="flex flex-col items-start sm:items-center text-left sm:text-center mt-0 sm:mt-2">
                           <div className={`hidden sm:flex mb-3 p-3 rounded-2xl transition-all duration-700 ${isCurrent ? "bg-[#cc2b2b] text-white shadow-xl shadow-[#cc2b2b]/20 scale-110" : isCompleted ? "bg-red-50 text-[#cc2b2b]" : "bg-gray-50 text-gray-400"}`}>
                              <Icon className="w-5 h-5" />
                           </div>
                           
                           {/* Mobile version icon row */}
                           <div className="sm:hidden flex items-center gap-2 mb-1">
                              <Icon className={`w-4 h-4 ${isCompleted ? "text-[#cc2b2b]" : "text-gray-400"}`} />
                              <p className={`font-bold tracking-widest uppercase text-xs ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                           </div>

                           <p className={`hidden sm:block font-bold tracking-widest uppercase text-[10px] sm:text-xs ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                           
                           {isCompleted && (
                             <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium mt-1 tracking-wider sm:whitespace-nowrap">
                               {step.date ? formatDate(step.date) : 'Verification Complete'}
                             </p>
                           )}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Item List */}
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
               <div className="p-8 md:p-10 border-b border-gray-50">
                  <h3 className="text-xl font-black tracking-widest uppercase">Artisanal Details</h3>
               </div>
               <div className="divide-y divide-gray-50">
                   {order.items.map((item: any) => (
                    <Link href={`/products/${item.product?.slug}`} key={item._id} className="p-6 md:p-8 flex items-center gap-6 group hover:bg-[#fff9f9] transition-colors">
                       <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-500 shrink-0">
                          <Image src={item.product?.image || '/images/hero_banner_shoes_1777449275010.png'} alt="Product" fill className="object-cover" />
                       </div>
                       <div className="flex-1">
                          <p className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-[#cc2b2b] transition-colors block mb-1">
                             {item.product?.name || 'Artisanal Piece'}
                          </p>
                          <div className="flex flex-wrap gap-4 items-center">
                             <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Qty: {item.quantity}</p>
                             <div className="w-1 h-1 bg-gray-300 rounded-full" />
                             <p className="text-sm font-bold text-[#cc2b2b]">₹{item.price.toLocaleString()}</p>
                          </div>
                       </div>
                    </Link>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Address */}
          <div className="space-y-8">
             {/* Shipping Box */}
             <div className="bg-black text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#cc2b2b]/20 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                <div className="flex items-center gap-4 mb-8">
                   <div className="bg-white/10 p-3 rounded-2xl text-white">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <h4 className="font-black tracking-widest uppercase text-sm">Delivery Destination</h4>
                </div>
                <div className="space-y-1 mb-8">
                   <p className="text-xl font-bold tracking-wide">{order.shippingAddress.address}</p>
                   <p className="text-white/60 font-medium tracking-wider">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                   <p className="text-white/60 font-medium tracking-wider">India</p>
                </div>
                <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Payment Method</p>
                      <div className="flex items-center gap-2">
                         <CreditCard className="w-4 h-4 text-[#cc2b2b]" />
                         <span className="font-bold text-xs uppercase tracking-widest">{order.paymentMethod}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-[#cc2b2b] tracking-widest mb-1">Payment Status</p>
                      <p className="font-black text-xs uppercase tracking-widest">{order.isPaid ? 'PAID' : 'PENDING'}</p>
                   </div>
                </div>
             </div>

             {/* Financial Overview */}
             <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                <h4 className="font-black tracking-widest uppercase text-sm mb-8">Financial Overview</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-400 uppercase tracking-widest text-[10px] font-black">Subtotal</span>
                      <span className="font-bold">₹{(order.totalAmount + (order.discount || 0)).toLocaleString()}</span>
                   </div>
                   {order.discount > 0 && (
                      <div className="flex justify-between items-center text-sm font-medium text-green-600">
                         <span className="uppercase tracking-widest text-[10px] font-black">Rebellion Discount</span>
                         <span className="font-bold">-₹{order.discount.toLocaleString()}</span>
                      </div>
                   )}
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-400 uppercase tracking-widest text-[10px] font-black">Shipping</span>
                      <span className="font-black text-green-600 uppercase tracking-widest text-[10px]">FREE</span>
                   </div>
                   <div className="pt-6 border-t border-gray-100 flex justify-between items-center mt-6">
                      <span className="text-gray-900 uppercase tracking-widest text-[11px] font-black">Total Investment</span>
                      <span className="text-2xl font-black text-[#cc2b2b] tracking-tight">₹{order.totalAmount.toLocaleString()}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                {['pending', 'processing'].includes(order.status.toLowerCase()) && (
                  <Link href={`/orders/${order._id}/cancel`} className="w-full bg-red-50 hover:bg-red-100 text-[#cc2b2b] border border-red-200 py-6 rounded-2xl flex items-center justify-center gap-3 transition-all group font-black tracking-widest text-[10px] uppercase">
                     <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Cancel Order
                  </Link>
                )}
                <button className="w-full bg-[#f8f8f8] hover:bg-gray-100 border border-gray-200 py-6 rounded-2xl flex items-center justify-center gap-3 transition-all group font-black tracking-widest text-[10px] uppercase">
                   <div className="w-2 h-2 bg-[#cc2b2b] rounded-full group-hover:scale-150 transition-transform" /> Need help with this order?
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
