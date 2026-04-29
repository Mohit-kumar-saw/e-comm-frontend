"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, User, MapPin, Heart, LogOut, ChevronRight, ShoppingBag, Plus } from 'lucide-react';
import data from '../data.json';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Product } from '../../types/product';

type TabType = 'details' | 'orders' | 'addresses' | 'wishlist';

export default function ProfilePage() {
   const [activeTab, setActiveTab] = useState<TabType>('details');
   const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
   const { addToCart, setIsCartOpen } = useCart();
   const [orders, setOrders] = useState<any[]>([]);
   const [isLoadingOrders, setIsLoadingOrders] = useState(false);

   useEffect(() => {
     if (activeTab === 'orders' && isAuthenticated) {
       fetchOrders();
     }
   }, [activeTab, isAuthenticated]);

   const fetchOrders = async () => {
     setIsLoadingOrders(true);
     try {
       const response = await api.get('/orders/my-orders');
       if (response.status === 'success') {
         setOrders(response.data.orders);
       }
     } catch (err) {
       console.error('Failed to fetch orders:', err);
     } finally {
       setIsLoadingOrders(false);
     }
   };

    const handleCancelOrder = async (orderId: string) => {
      if (!confirm('Are you sure you want to cancel this order?')) return;
      try {
        const response = await api.patch(`/orders/cancel/${orderId}`, {});
        if (response.status === 'success') {
          fetchOrders();
          alert('Order cancelled successfully');
        }
      } catch (err) {
        console.error('Failed to cancel order:', err);
      }
    };

    const wishlistItems = (user?.wishlist || []).filter(item => item && typeof item === 'object' && item.name);

   const renderContent = () => {
      switch (activeTab) {
         case 'details':
            return (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold tracking-widest border-b border-gray-100 pb-4 mb-8 uppercase text-gray-800">Profile Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mb-10">
                     <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                        <label className="block text-xs font-bold tracking-widest text-[#cc2b2b] mb-1 uppercase">Full Name</label>
                        <p className="font-semibold text-gray-800 text-lg">{user?.name}</p>
                     </div>
                     <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                        <label className="block text-xs font-bold tracking-widest text-[#cc2b2b] mb-1 uppercase">Email Address</label>
                        <p className="font-semibold text-gray-800 text-lg">{user?.email}</p>
                     </div>
                     <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                        <label className="block text-xs font-bold tracking-widest text-[#cc2b2b] mb-1 uppercase">Phone Number</label>
                        <p className="font-semibold text-gray-800 text-lg">{user?.phoneNumber || 'Not provided'}</p>
                     </div>
                     <button className="p-5 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-[#cc2b2b] hover:bg-red-50 group transition-all">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#cc2b2b] group-hover:text-white transition-colors">
                           <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold tracking-widest text-gray-400 group-hover:text-[#cc2b2b] uppercase">Update Details</span>
                     </button>
                  </div>
               </div>
            );
         case 'orders':
            return (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold tracking-widest border-b border-gray-100 pb-4 mb-8 uppercase text-gray-800">Order History</h2>
                  {isLoadingOrders ? (
                      <div className="flex flex-col items-center justify-center p-20 gap-4">
                         <div className="w-10 h-10 border-4 border-gray-100 border-t-[#cc2b2b] rounded-full animate-spin"></div>
                         <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Loading Your Orders...</p>
                      </div>
                  ) : orders.length > 0 ? (
                     <div className="space-y-6">
                        {orders.map((order: any) => (
                          <Link 
                            href={`/orders/${order._id}`}
                            key={order._id} 
                            className="block border border-gray-100 bg-gray-50/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 group"
                          >
                             <div className="bg-white px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex gap-6">
                                   <div>
                                      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Order #</p>
                                      <p className="text-xs font-bold font-mono uppercase">{order._id.slice(-8)}</p>
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Date</p>
                                      <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Status</p>
                                      <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{order.status}</span>
                                   </div>
                                </div>
                                 <div className="text-right">
                                   <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Total</p>
                                   <p className="text-sm font-black text-[#cc2b2b]">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                             </div>
                             <div className="p-6">
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                   {order.items.map((item: any, idx: number) => (
                                      <div key={idx} className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden border border-gray-100 bg-white">
                                         <Image src={item.product?.image} alt="product" fill className="object-cover" />
                                      </div>
                                   ))}
                                   {order.items.length > 4 && <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">+{order.items.length - 4} More</div>}
                                </div>
                                 <div className="mt-6 flex justify-between items-center">
                                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 group-hover:text-black transition-colors flex items-center gap-1">View Details <ChevronRight className="w-3 h-3" /></span>
                                 </div>
                             </div>
                          </Link>
                        ))}
                     </div>
                  ) : (
                     <div className="bg-gray-50 p-16 text-center text-gray-500 rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-inner">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                           <Package className="w-10 h-10 text-gray-300" />
                        </div>
                        <span className="font-bold text-gray-700 text-lg mb-2">No orders found</span>
                        <p className="text-sm text-gray-400 max-w-xs mb-8">Ready to start your journey? Our artisan collection is waiting to be explored.</p>
                        <Link href="/collections" className="bg-black text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20 hover:scale-[1.02]">
                           Start Shopping
                        </Link>
                     </div>
                  )}
               </div>
            );
         case 'addresses':
            return (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold tracking-widest border-b border-gray-100 pb-4 mb-8 uppercase text-gray-800">Saved Addresses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="border border-[#cc2b2b] bg-red-50/30 p-6 rounded-2xl relative group">
                        <div className="absolute top-4 right-4 bg-[#cc2b2b] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Default</div>
                        <h3 className="font-bold text-gray-800 mb-3 uppercase tracking-wide">Home</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           123 Artisan Street, Block C<br />
                           Hauz Khas Village<br />
                           New Delhi - 110016<br />
                           India
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                           <button className="text-xs font-bold uppercase tracking-widest text-[#cc2b2b] hover:underline">Edit</button>
                           <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600">Remove</button>
                        </div>
                     </div>
                     <button className="border-2 border-dashed border-gray-200 p-8 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#cc2b2b] hover:text-[#cc2b2b] hover:bg-red-50/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#cc2b2b] group-hover:text-white transition-colors shadow-sm">
                           <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Add New Address</span>
                     </button>
                  </div>
               </div>
            );
         case 'wishlist':
            return (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold tracking-widest border-b border-gray-100 pb-4 mb-8 uppercase text-gray-800">Wishlist Items</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {wishlistItems.length > 0 ? (
                        wishlistItems.map((p: any) => (
                          <div key={p._id || p.id} className="flex gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                             <div className="w-24 h-24 relative rounded-xl overflow-hidden shadow-md shrink-0 bg-white">
                                <Image src={p.image} fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                             </div>
                             <div className="flex flex-col justify-center gap-1">
                                <h3 className="font-bold text-gray-800 tracking-wide text-sm">{p.name || 'Artisanal Piece'}</h3>
                                <p className="text-xs font-bold text-[#cc2b2b]">₹{(p.price || 0).toLocaleString()}</p>
                                <button 
                                 onClick={async () => {
                                   await addToCart(p, 1);
                                   setIsCartOpen(true);
                                 }}
                                 className="mt-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-2 rounded-lg hover:bg-[#cc2b2b] transition-colors flex items-center gap-2"
                               >
                                  <ShoppingBag className="w-3 h-3" /> Add to Bag
                               </button>
                             </div>
                          </div>
                        ))
                     ) : (
                       <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                          <Heart className="w-12 h-12 mb-4 opacity-10" />
                          <p className="font-bold tracking-widest uppercase text-xs">Your wishlist is empty</p>
                       </div>
                     )}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                     <Link href="/collections" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black flex items-center gap-2 transition-colors">
                        View Full Collection <ChevronRight className="w-4 h-4" />
                     </Link>
                  </div>
               </div>
            );
      }
   };

   return (
      <div className="bg-[#fafafa] min-h-[85vh] py-16 w-full font-sans">
         <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-[0.2em] text-[#111] uppercase mb-12 text-center md:text-left drop-shadow-sm">Account Dashboard</h1>
            
            <div className="flex flex-col lg:flex-row gap-10">
               {/* Sidebar navigation */}
               <div className="w-full lg:w-72 shrink-0">
                  <nav className="flex flex-col space-y-3 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5">
                     {[
                        { id: 'details', label: 'Account Details', icon: User },
                        { id: 'orders', label: 'Order History', icon: Package },
                        { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
                        { id: 'wishlist', label: 'Wishlist', icon: Heart },
                     ].map(item => (
                        <button 
                           key={item.id}
                           onClick={() => setActiveTab(item.id as TabType)}
                           className={`flex items-center justify-between px-5 py-4 font-bold text-xs uppercase tracking-[0.15em] rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-black text-white shadow-2xl shadow-black/30 scale-[1.02]' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                        >
                           <div className="flex items-center gap-4">
                              <item.icon className={`w-4 h-4 transition-transform duration-500 ${activeTab === item.id ? 'rotate-[360deg]' : ''}`} />
                              {item.label}
                           </div>
                           {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-[#cc2b2b] animate-pulse"></div>}
                        </button>
                     ))}
                     
                     <div className="h-px bg-gray-100 my-4 mx-2"></div>
                     
                     <button 
                        onClick={logout}
                        className="flex items-center gap-4 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-red-600 transition-colors group w-full text-left"
                     >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                        Sign Out
                     </button>
                  </nav>
               </div>
               
               {/* Content pane */}
               <div className="flex-1 overflow-hidden relative">
                  <div className="bg-white p-8 md:p-14 border border-gray-100 shadow-2xl shadow-black/2 rounded-[2.5rem] relative min-h-[500px]">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/30 rounded-bl-full -z-0"></div>
                     <div className="relative z-10 h-full">
                        {renderContent()}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
