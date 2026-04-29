"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User as UserIcon, ShieldCheck, ChevronRight, Plus, CheckCircle2, MapPin, Phone, Mail, ShoppingBag, Tag, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Address } from '../../types/user';
import { api } from '../../services/api';
import { CartItem } from '../../types/cart';

export default function CheckoutPage() {
   const { user, isAuthenticated, addAddress, signup, login } = useAuth();
   const { cart, cartTotal, clearCart } = useCart();
   const [step, setStep] = useState(isAuthenticated ? 2 : 1);
   const [paymentMethod, setPaymentMethod] = useState('UPI');
   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
   const [orderSuccess, setOrderSuccess] = useState(false);
   const [phone, setPhone] = useState(user?.phoneNumber || '');
   const [email, setEmail] = useState(user?.email || '');
   const [name, setName] = useState(user?.name || '');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [isLoginView, setIsLoginView] = useState(false);
   const [authError, setAuthError] = useState('');
   const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
   const [showAddressForm, setShowAddressForm] = useState(false);

   // Address form state
   const [newAddress, setNewAddress] = useState({
      street: '',
      city: '',
      state: '',
      pinCode: ''
   });

   const [couponCode, setCouponCode] = useState('');
   const [appliedCoupon, setAppliedCoupon] = useState<{ type: string; value: number; code: string } | null>(null);
   const [couponError, setCouponError] = useState('');

   // Use real cart items
   const cartItems = cart;
   const subtotal = cartTotal;

   const discount = appliedCoupon
      ? appliedCoupon.type === 'percentage'
         ? (subtotal * appliedCoupon.value) / 100
         : appliedCoupon.value
      : 0;

   const totalAmount = subtotal - discount + (paymentMethod === 'COD' ? 199 : 0);

   const handleApplyCoupon = async () => {
      if (!couponCode) return;
      setCouponError('');
      try {
         const response = await api.post('/coupons/validate', { code: couponCode });
         if (response.success) {
            setAppliedCoupon({
               type: response.discountType,
               value: response.discountValue,
               code: response.code
            });
            setCouponCode('');
         }
      } catch (err: any) {
         setCouponError(err.message || 'Invalid coupon code');
         setAppliedCoupon(null);
      }
   };

   const [newOrderId, setNewOrderId] = useState<string | null>(null);

   const handlePlaceOrder = async () => {
      setIsPlacingOrder(true);
      try {
         const orderData = {
            items: cartItems.map(item => ({
               product: item.product._id || item.product.id,
               quantity: item.quantity,
               price: item.product.price
            })),
            totalAmount: totalAmount,
            discount: discount,
            couponCode: appliedCoupon?.code,
            shippingAddress: {
               address: selectedAddress?.street,
               city: selectedAddress?.city,
               postalCode: selectedAddress?.pinCode,
               country: 'India'
            },
            paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod
         };

         const response = await api.post('/orders', orderData);
         if (response.status === 'success') {
            setNewOrderId(response.data.order._id);
            setOrderSuccess(true);
            clearCart();
         }
      } catch (err) {
         console.error('Failed to place order:', err);
      } finally {
         setIsPlacingOrder(false);
      }
   };

   const handleContinue = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      
      if (isAuthenticated) {
         setStep(2);
         return;
      }

      if (!isLoginView && phone.length !== 10) {
         setAuthError('Mobile number must be exactly 10 digits');
         return;
      }
      
      if (password.length < 6) {
         setAuthError('Password must be at least 6 characters');
         return;
      }

      try {
         if (isLoginView) {
            await login(email, password, false);
         } else {
            await signup({ name, email, password, phoneNumber: phone }, false);
         }
         setStep(2);
      } catch (err: any) {
         let errMsg = err.message || (isLoginView ? 'Login failed' : 'Registration failed');
         if (errMsg.includes('E11000') || errMsg.toLowerCase().includes('duplicate')) {
            errMsg = 'Email or phone number is already registered. Please login instead.';
         }
         setAuthError(errMsg);
      }
   };

   const handleAddressSelect = (address: Address) => {
      setSelectedAddress(address);
      setStep(3); // Move to Payment
   };

   const handleAddAddress = async (e: React.FormEvent) => {
      e.preventDefault();

      if (isAuthenticated) {
         try {
            const updatedUser = await addAddress(newAddress);
            if (updatedUser && updatedUser.addresses && updatedUser.addresses.length > 0) {
               // The newly added address is typically the last one in the array
               const newlyAddedAddress = updatedUser.addresses[updatedUser.addresses.length - 1];
               setSelectedAddress(newlyAddedAddress);
            }
            setStep(3);
         } catch (err) {
            console.error('Failed to save address:', err);
         }
      } else {
         // Guest mode
         const address: Address = { ...newAddress, isDefault: false, _id: Math.random().toString() };
         setSelectedAddress(address);
         setStep(3);
      }
   };

   return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#fcfcfc] absolute inset-0 z-[100] w-full">
         {/* Left Side: Order Summary (Razorpay style red pane) */}
         <div className="w-full md:w-1/3 bg-[#cc2b2b] text-white p-8 md:p-12 shadow-xl shrink-0 flex flex-col">
            <Link href="/collections" className="text-white/80 hover:text-white mb-8 inline-block tracking-widest text-sm uppercase font-bold">← Back to Shop</Link>

            <div className="flex items-center gap-4 mb-8">
               <div className="bg-white p-2 rounded-full h-16 w-16 flex items-center justify-center shrink-0">
                  <Image src="/images/hero_banner_womens_1777451578867.png" alt="Logo" width={40} height={40} className="rounded-full object-cover" />
               </div>
               <div>
                  <h2 className="text-xl font-bold tracking-widest">Rangeela Studio</h2>
                  <div className="flex items-center gap-1 text-xs mt-1 text-green-300 font-bold uppercase tracking-wider">
                     <ShieldCheck className="w-4 h-4" /> Trusted Business
                  </div>
               </div>
            </div>

            <p className="font-semibold mb-8 tracking-wide text-lg">India's Handcrafted Rebellion</p>

            {/* Order Summary Box */}
            <div className="bg-white text-black rounded-2xl p-6 mb-6 shadow-md">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-600">Order summary</h3>
               </div>
               {cartItems.map(item => (
                  <div key={item.product._id || item.product.id} className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-4">
                        <Image src={item.product.image} alt={item.product.name} width={54} height={54} className="rounded-xl bg-gray-100" />
                        <div>
                           <p className="text-sm font-semibold tracking-wide w-40 truncate">{item.product.name}</p>
                           <p className="text-xs text-gray-500 mt-1">Qty. {item.quantity}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-gray-400 line-through">₹{(item.product.price + 500).toLocaleString()}</p>
                        <span className="font-bold text-lg">₹{item.product.price.toLocaleString()}</span>
                     </div>
                  </div>
               ))}
               <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-[#cc2b2b] text-sm font-semibold tracking-widest uppercase cursor-pointer">
                  <span>Order instructions</span>
                  <span>Add ⊕</span>
               </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white text-black rounded-2xl p-6 shadow-md mb-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold tracking-wide">Promotional Passphrase</h3>
                  <Tag className="w-4 h-4 text-[#cc2b2b]" />
               </div>

               {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-xl">
                     <div>
                        <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Coupon Applied</p>
                        <p className="font-bold text-sm tracking-widest">{appliedCoupon.code}</p>
                     </div>
                     <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-[10px] font-black uppercase text-red-500 tracking-widest hover:underline"
                     >
                        Remove
                     </button>
                  </div>
               ) : (
                  <div className="space-y-3">
                     <div className="flex gap-2">
                        <input
                           type="text"
                           placeholder="Enter Code"
                           className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold tracking-widest uppercase outline-none focus:border-[#cc2b2b]"
                           value={couponCode}
                           onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        />
                        <button
                           onClick={handleApplyCoupon}
                           className="bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#cc2b2b] transition-all"
                        >
                           Apply
                        </button>
                     </div>
                     {couponError && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-2">{couponError}</p>}
                  </div>
               )}
            </div>

            <div className="mt-auto pt-16 flex items-center gap-2 text-xs text-white/80">
               Secured by <span className="font-bold text-white tracking-widest italic text-lg">Razorpay</span>
            </div>
         </div>

         {/* Right Side: Flow */}
         <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col max-w-4xl max-h-screen overflow-y-auto">
            {/* Steps Header */}
            <div className="flex items-center justify-between text-sm tracking-widest text-[#cc2b2b] font-semibold mb-12 border-b border-gray-200 pb-4">
               <button onClick={() => setStep(1)} className={`flex items-center gap-2 ${step === 1 ? 'font-black scale-105' : 'opacity-70'}`}>Contact <ChevronRight className="w-4 h-4" /></button>
               <button onClick={() => step > 1 && setStep(2)} className={`flex items-center gap-2 ${step === 2 ? 'font-black scale-105' : step < 2 ? 'text-gray-400 font-normal cursor-not-allowed' : 'opacity-70'}`}>Address <ChevronRight className="w-4 h-4" /></button>
               <button className={`flex items-center gap-2 ${step === 3 ? 'font-black bg-[#fce8e8] px-4 py-1 rounded-full' : 'text-gray-400 font-normal'} cursor-default`}>Payment</button>
            </div>

            {orderSuccess ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                     <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4 uppercase">Order Placed Successfully!</h1>
                  <p className="text-gray-500 font-medium tracking-wide mb-10 max-w-md">Your artisanal rebellion is being prepared. We've sent the confirmation to your email.</p>
                  <Link href={`/orders/${newOrderId || ''}`} className="bg-black text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#cc2b2b] transition-all">Track Order</Link>
               </div>
            ) : step === 1 ? (
               <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="relative mb-8">
                     <div className="absolute inset-0 bg-gray-50 rounded-full animate-ping opacity-20 scale-150"></div>
                     <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center bg-white relative z-10 shadow-sm">
                        <UserIcon className="w-6 h-6 text-gray-600" />
                     </div>
                  </div>
                  <h1 className="text-2xl font-bold tracking-wide mb-2 text-center text-gray-900 uppercase">Step 1: Contact details</h1>
                  <p className="text-gray-500 mb-10 text-center tracking-wide text-sm font-medium">Verify your contact info to proceed</p>

                  <form className="w-full space-y-5" onSubmit={handleContinue}>
                     {!isLoginView && (
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#cc2b2b] transition-colors group">
                           <input
                              type="text"
                              placeholder="Full Name"
                              required={!isLoginView}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="p-4 outline-none w-full bg-transparent font-medium"
                           />
                        </div>
                     )}
                     
                     <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#cc2b2b] transition-colors group">
                        <input
                           type="email"
                           placeholder="Email address"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="p-4 outline-none w-full bg-transparent font-medium"
                        />
                     </div>

                     {!isLoginView && (
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#cc2b2b] transition-colors group">
                           <div className="bg-gray-50 px-4 py-4 border-r border-gray-200 flex items-center font-medium text-gray-700 text-sm">
                              🇮🇳 +91
                           </div>
                           <input
                              type="tel"
                              placeholder="Mobile number"
                              required={!isLoginView}
                              maxLength={10}
                              pattern="\d{10}"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                              className="flex-1 p-4 outline-none w-full bg-transparent font-medium"
                           />
                        </div>
                     )}

                     <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#cc2b2b] transition-colors group relative">
                        <input
                           type={showPassword ? "text" : "password"}
                           placeholder={isLoginView ? "Password" : "Password (min 6 characters)"}
                           required
                           minLength={6}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="flex-1 p-4 outline-none w-full bg-transparent font-medium"
                        />
                        <button 
                           type="button" 
                           onClick={() => setShowPassword(!showPassword)}
                           className="p-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                     </div>

                     {authError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center mt-2">{authError}</p>}

                     <div className="text-center mt-4">
                        <button 
                           type="button" 
                           onClick={() => setIsLoginView(!isLoginView)} 
                           className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest underline underline-offset-4"
                        >
                           {isLoginView ? 'Need an account? Register' : 'Already have an account? Login'}
                        </button>
                     </div>

                     <label className="flex items-center gap-3 text-sm text-gray-700 mt-6 cursor-pointer font-medium select-none group">
                        <input type="checkbox" defaultChecked className="rounded text-black accent-black w-5 h-5 cursor-pointer group-hover:scale-110 transition-transform" />
                        Send me updates on WhatsApp
                     </label>

                     <button type="submit" className="w-full bg-[#1b0a0a] hover:bg-black text-white font-bold tracking-[0.2em] uppercase py-5 rounded-2xl mt-8 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0">
                        Continue
                     </button>
                  </form>
               </div>
            ) : step === 2 ? (
               <div className="flex-1 flex flex-col w-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-10">
                     <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">SHIPPING ADDRESS</h1>
                     <p className="text-gray-500 font-medium tracking-wide">Where should we send your rebellion?</p>
                  </div>

                  {/* Address List for Logged-in Users */}
                  {isAuthenticated && user?.addresses && user.addresses.length > 0 && !showAddressForm ? (
                     <div className="space-y-6 max-w-2xl">
                        <div className="grid grid-cols-1 gap-4">
                           {user.addresses.map((addr: Address) => (
                              <div
                                 key={addr._id}
                                 onClick={() => handleAddressSelect(addr)}
                                 className="group relative border-2 border-gray-100 hover:border-[#cc2b2b] bg-white p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                              >
                                 <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                       <div className="bg-red-50 p-2 rounded-lg text-[#cc2b2b]">
                                          <MapPin className="w-5 h-5" />
                                       </div>
                                       <span className="font-bold tracking-widest text-xs uppercase text-gray-400">Saved Address</span>
                                    </div>
                                    {addr.isDefault && <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">Default</span>}
                                 </div>
                                 <p className="text-gray-800 font-bold text-lg mb-1">{addr.street}</p>
                                 <p className="text-gray-500 font-medium tracking-wide">{addr.city}, {addr.state} - {addr.pinCode}</p>

                                 <div className="mt-6 flex items-center gap-2 text-[#cc2b2b] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    Deliver to this address <ChevronRight className="w-4 h-4" />
                                 </div>
                              </div>
                           ))}
                        </div>

                        <button
                           onClick={() => setShowAddressForm(true)}
                           className="w-full border-2 border-dashed border-gray-200 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#cc2b2b] hover:bg-red-50 group transition-all"
                        >
                           <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#cc2b2b] group-hover:text-white transition-colors">
                              <Plus className="w-6 h-6" />
                           </div>
                           <span className="font-bold tracking-widest text-xs uppercase text-gray-500 group-hover:text-[#cc2b2b]">Add New Address</span>
                        </button>
                     </div>
                  ) : (
                     /* Add/New Address Form */
                     <form onSubmit={handleAddAddress} className="max-w-xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="md:col-span-2">
                              <label className="block text-[10px] font-black tracking-[0.2em] text-[#cc2b2b] uppercase mb-2 ml-1">Street Address</label>
                              <input
                                 type="text"
                                 placeholder="House No, Building, Street Name"
                                 required
                                 className="w-full bg-white border border-gray-200 rounded-xl p-4 font-medium outline-none focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all"
                                 value={newAddress.street}
                                 onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black tracking-[0.2em] text-[#cc2b2b] uppercase mb-2 ml-1">City</label>
                              <input
                                 type="text"
                                 placeholder="New Delhi"
                                 required
                                 className="w-full bg-white border border-gray-200 rounded-xl p-4 font-medium outline-none focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all"
                                 value={newAddress.city}
                                 onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black tracking-[0.2em] text-[#cc2b2b] uppercase mb-2 ml-1">State</label>
                              <input
                                 type="text"
                                 placeholder="Delhi"
                                 required
                                 className="w-full bg-white border border-gray-200 rounded-xl p-4 font-medium outline-none focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all"
                                 value={newAddress.state}
                                 onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black tracking-[0.2em] text-[#cc2b2b] uppercase mb-2 ml-1">Pin Code</label>
                              <input
                                 type="text"
                                 placeholder="110001"
                                 required
                                 className="w-full bg-white border border-gray-200 rounded-xl p-4 font-medium outline-none focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all"
                                 value={newAddress.pinCode}
                                 onChange={e => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                              />
                           </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                           {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
                              <button
                                 type="button"
                                 onClick={() => setShowAddressForm(false)}
                                 className="flex-1 border-2 border-gray-900 text-gray-900 font-bold tracking-widest text-xs uppercase py-5 rounded-2xl hover:bg-gray-50 transition-all"
                              >
                                 Cancel
                              </button>
                           )}
                           <button
                              type="submit"
                              className="flex-[2] bg-black text-white font-bold tracking-[0.2em] text-xs uppercase py-5 rounded-2xl hover:bg-[#cc2b2b] transition-all shadow-xl shadow-black/10 hover:shadow-red-900/20"
                           >
                              Continue to Payment
                           </button>
                        </div>
                     </form>
                  )}
               </div>
            ) : (
               <div className="flex-1 flex flex-col w-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between mb-8">
                     <h1 className="text-2xl font-black tracking-widest uppercase">3. Payment Options</h1>
                     <div className="flex gap-4">
                        <button onClick={() => setStep(1)} className="text-[10px] font-black tracking-widest text-gray-400 hover:text-black uppercase underline underline-offset-4">Contact</button>
                        <button onClick={() => setStep(2)} className="text-[10px] font-black tracking-widest text-gray-400 hover:text-black uppercase underline underline-offset-4">Address</button>
                     </div>
                  </div>

                  {/* Delivery Summary Review */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-10 flex flex-wrap gap-6 items-center">
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Deliver to:</span>
                        <span className="text-xs font-bold text-gray-800">{selectedAddress?.street}, {selectedAddress?.city}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Contact:</span>
                        <span className="text-xs font-bold text-gray-800">{phone || user?.phoneNumber || email}</span>
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start relative">
                     {/* Payment Types Left Pane */}
                     <div className="w-full md:w-1/2 space-y-4">
                        <div
                           onClick={() => setPaymentMethod('UPI')}
                           className={`border rounded-xl p-5 shadow-sm cursor-pointer flex justify-between items-center transition-all ${paymentMethod === 'UPI' ? 'border-green-200 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
                        >
                           <div>
                              <p className="font-bold tracking-wide">UPI</p>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold tracking-wider mt-2 inline-block">5 Offers</span>
                           </div>
                        </div>

                        <div
                           onClick={() => setPaymentMethod('Cards')}
                           className={`border rounded-xl p-5 shadow-sm transition-all cursor-pointer flex justify-between items-center ${paymentMethod === 'Cards' ? 'border-red-200 bg-red-50 ring-1 ring-[#cc2b2b]' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
                        >
                           <div>
                              <p className={`font-bold tracking-wide ${paymentMethod === 'Cards' ? 'text-[#cc2b2b]' : 'text-gray-600'}`}>Cards</p>
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold tracking-wider mt-2 inline-block">Get 5% Rewards</span>
                           </div>
                        </div>

                        <div
                           onClick={() => setPaymentMethod('Snapmint')}
                           className={`border rounded-xl p-5 shadow-sm transition-all cursor-pointer flex justify-between items-center ${paymentMethod === 'Snapmint' ? 'border-red-200 bg-red-50 ring-1 ring-[#cc2b2b]' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
                        >
                           <div>
                              <p className={`font-bold tracking-wide ${paymentMethod === 'Snapmint' ? 'text-[#cc2b2b]' : 'text-gray-600'}`}>Snapmint</p>
                           </div>
                        </div>

                        <div
                           onClick={() => setPaymentMethod('EMI')}
                           className={`border rounded-xl p-5 shadow-sm transition-all cursor-pointer flex justify-between items-center ${paymentMethod === 'EMI' ? 'border-red-200 bg-red-50 ring-1 ring-[#cc2b2b]' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
                        >
                           <div>
                              <p className={`font-bold tracking-wide ${paymentMethod === 'EMI' ? 'text-[#cc2b2b]' : 'text-gray-600'}`}>EMI</p>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold tracking-wider mt-2 inline-block">3 Offers</span>
                           </div>
                        </div>

                        <div
                           onClick={() => setPaymentMethod('COD')}
                           className={`border rounded-xl p-5 shadow-sm transition-all cursor-pointer flex justify-between items-center ${paymentMethod === 'COD' ? 'border-[#cc2b2b] bg-red-50 ring-1 ring-[#cc2b2b]' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
                        >
                           <div>
                              <p className={`font-bold tracking-wide ${paymentMethod === 'COD' ? 'text-[#cc2b2b]' : 'text-gray-600'}`}>Cash on Delivery</p>
                              <span className="text-xs text-[#cc2b2b] px-2 py-1 rounded-full font-bold tracking-wider mt-2 inline-block">+₹199 extra charge</span>
                           </div>
                        </div>
                     </div>

                     {/* Payment Specific Right Pane */}
                     <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-2xl bg-white shadow-lg sticky top-0 min-h-[400px] flex flex-col">
                        {paymentMethod === 'UPI' ? (
                           <>
                              <div className="flex justify-between items-center mb-6">
                                 <h3 className="font-bold tracking-wide text-gray-800">Available Offers</h3>
                              </div>
                              <div className="bg-red-50 rounded-xl p-4 mb-8 border border-red-200 flex justify-between items-center group cursor-pointer hover:bg-red-100 transition-colors">
                                 <span className="font-semibold text-[#cc2b2b] text-sm tracking-wide">₹200 instant discount on all UPI...</span>
                                 <span className="text-xs font-bold bg-[#cd2b2b] text-white px-3 py-1 rounded-full group-hover:scale-105 transition-transform">Apply</span>
                              </div>

                              <h3 className="font-bold tracking-wide text-gray-800 mb-6">UPI QR</h3>
                              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square mt-4">
                                 <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-md mb-6 w-48 h-48 flex items-center justify-center text-center font-bold text-gray-400">
                                    [ Mock QR Code ]
                                 </div>
                                 <p className="text-sm font-semibold tracking-wide text-gray-600 mb-4">Scan the QR using any UPI App</p>
                                 <button className="bg-white border hover:bg-gray-50 text-gray-800 font-bold tracking-widest text-sm px-6 py-2 rounded-full shadow-sm transition-all focus:ring-2 focus:ring-[#cc2b2b]">
                                    Show QR
                                 </button>
                              </div>
                           </>
                        ) : paymentMethod === 'COD' ? (
                           <div className="flex flex-col h-full items-center justify-center text-center animate-in fade-in duration-300">
                              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                 <ShoppingBag className="w-10 h-10 text-[#cc2b2b]" />
                              </div>
                              <h3 className="text-xl font-bold mb-2">Cash on Delivery</h3>
                              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Pay conveniently with cash or digital methods when your order is delivered. <br /><span className="text-[#cc2b2b] font-bold">Extra ₹199 handling fee applies.</span></p>

                              <div className="w-full border-t border-b border-gray-100 py-4 mb-8">
                                 <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Order Amount</span>
                                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                                 </div>
                                 {discount > 0 && (
                                    <div className="flex justify-between text-sm mb-2 text-green-600 font-bold">
                                       <span>Artisan Discount</span>
                                       <span>-₹{discount.toLocaleString()}</span>
                                    </div>
                                 )}
                                 <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">COD Handling Fee</span>
                                    <span className="font-bold">₹199</span>
                                 </div>
                                 <div className="flex justify-between text-lg font-black mt-4 pt-4 border-t border-gray-100">
                                    <span>TOTAL</span>
                                    <span className="text-[#cc2b2b]">₹{totalAmount.toLocaleString()}</span>
                                 </div>
                              </div>

                              <button
                                 onClick={handlePlaceOrder}
                                 disabled={isPlacingOrder}
                                 className="w-full bg-[#1b0a0a] hover:bg-[#cc2b2b] text-white font-black tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl hover:-translate-y-1 block uppercase text-sm"
                              >
                                 {isPlacingOrder ? 'Processing...' : 'Place Order Now'}
                              </button>
                           </div>
                        ) : (
                           <div className="flex flex-col h-full items-center justify-center text-center text-gray-400">
                              <p className="font-bold tracking-widest uppercase text-xs mb-2">Notice</p>
                              <p className="text-sm font-medium">{paymentMethod} is coming soon!</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* Footer Notice */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400 tracking-wide">
               By proceeding, I agree to Razorpay's <span className="font-semibold text-gray-600">Privacy Notice</span> • <span className="font-semibold text-gray-600">Edit Preferences</span>
            </div>
         </div>
      </div>
   );
}
