"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import { 
  AlertTriangle, 
  ChevronLeft, 
  XCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function CancelOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !id) return;
      try {
        const response = await api.get(`/orders/${id}`);
        if (response.status === 'success') {
          setOrder(response.data.order);
        }
      } catch (err: any) {
        setError(err.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }

    setCancelling(true);
    setError('');

    try {
      const response = await api.patch(`/orders/cancel/${id}`, { reason });
      if (response.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          router.push('/orders');
        }, 2500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel the order. It may have already been shipped.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-10 h-10 text-[#cc2b2b] animate-spin" />
           <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Verifying request...</p>
         </div>
       </div>
     );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
           <CheckCircle2 className="w-12 h-12 text-[#cc2b2b] relative z-10" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4 uppercase">Order Cancelled</h1>
        <p className="text-gray-500 mb-10 font-medium max-w-md">Your artisanal piece has been removed from processing. Any payments made will be refunded to the original payment method within 5-7 business days.</p>
        <Link href="/orders" className="bg-black text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#cc2b2b] transition-all">Back to History</Link>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-100 mb-6" />
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-4 uppercase">Error</h1>
        <p className="text-gray-500 mb-8 max-w-sm font-medium">{error}</p>
        <Link href="/orders" className="bg-black text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#cc2b2b] transition-all">Back to History</Link>
      </div>
    );
  }

  const isCancellable = ['pending', 'processing'].includes(order?.status.toLowerCase());

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 md:py-20 px-6 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <Link href={`/orders/${id}`} className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 hover:text-[#cc2b2b] transition-colors mb-8 group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Order
        </Link>
        
        <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

           <div className="flex items-center gap-4 mb-8">
              <div className="bg-red-50 p-4 rounded-2xl text-[#cc2b2b]">
                 <XCircle className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase leading-none">Cancel Order</h1>
                 <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mt-2">#{order._id.toUpperCase()}</p>
              </div>
           </div>

           {!isCancellable ? (
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
                 <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                 <div>
                    <p className="font-bold text-orange-900 mb-1">Cannot Cancel Order</p>
                    <p className="text-sm text-orange-800/80">This order is already <strong>{order.status}</strong> and cannot be cancelled at this stage. Please contact support for further assistance.</p>
                 </div>
              </div>
           ) : (
              <form onSubmit={handleCancel} className="space-y-8 relative z-10">
                 <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                       You are about to cancel this order. If you proceed, the artisanal preparation will be halted. Please let us know why you are cancelling.
                    </p>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#cc2b2b] mb-4">Cancellation Reason</label>
                    <div className="relative">
                       <select
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-sm font-bold tracking-wide outline-none focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all appearance-none cursor-pointer"
                          required
                       >
                          <option value="" disabled>Select a reason...</option>
                          <option value="Ordered by mistake">Ordered by mistake</option>
                          <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                          <option value="Shipping time is too long">Shipping time is too long</option>
                          <option value="Changed my mind">Changed my mind</option>
                          <option value="Other">Other</option>
                       </select>
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronLeft className="w-5 h-5 text-gray-400 -rotate-90" />
                       </div>
                    </div>
                 </div>

                 {error && (
                    <p className="text-xs font-bold text-red-500 tracking-wide bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>
                 )}

                 <div className="pt-4 border-t border-gray-100">
                    <button
                       type="submit"
                       disabled={cancelling}
                       className="w-full bg-[#cc2b2b] hover:bg-black text-white font-black tracking-[0.2em] text-xs uppercase py-6 rounded-2xl transition-all shadow-xl shadow-red-900/20 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:-translate-y-0 flex justify-center items-center gap-3"
                    >
                       {cancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Cancellation'}
                    </button>
                    <p className="text-[10px] font-bold text-center mt-6 text-gray-400 tracking-wider">This action cannot be undone.</p>
                 </div>
              </form>
           )}
        </div>
      </div>
    </div>
  );
}
