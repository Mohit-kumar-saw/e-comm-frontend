"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { ShoppingBag, ArrowRight, User, Mail, Lock, Phone, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center px-8 md:px-20 py-12 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-50 rounded-full -translate-x-1/2 -translate-y-1/2 -z-10"></div>

        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex flex-col items-center mb-12 group">
            <span className="text-3xl font-black tracking-[0.3em] text-[#cc2b2b] uppercase">Rangeela</span>
            <span className="text-xs tracking-[0.4em] font-light text-gray-400 group-hover:text-black transition-colors uppercase">STUDIO</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-[#111] mb-3">Join the Rebellion.</h1>
            <p className="text-gray-500 font-medium tracking-wide">Create an account to track orders and more.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-8 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#cc2b2b] transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all font-medium"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#cc2b2b] transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all font-medium"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#cc2b2b] transition-colors" />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all font-medium"
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#cc2b2b] transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all font-medium"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#cc2b2b] transition-colors" />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-[#cc2b2b] focus:ring-4 focus:ring-red-50 transition-all font-medium"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <p className="text-[10px] text-gray-400 px-2">
              By signing up, you agree to our <span className="text-gray-900 font-bold underline cursor-pointer">Terms</span> and <span className="text-gray-900 font-bold underline cursor-pointer">Privacy Policy</span>.
            </p>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase hover:bg-[#cc2b2b] transition-all focus:ring-4 focus:ring-red-100 disabled:opacity-50 flex items-center justify-center gap-3 group shadow-2xl shadow-black/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> </>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-sm font-medium text-gray-500 tracking-wide">
            Already have an account? <Link href="/auth/login" className="text-[#cc2b2b] font-bold hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Right side: Image/Marketing */}
      <div className="hidden lg:block relative overflow-hidden bg-gray-100">
        <Image
          src="/images/sneaker_product_1_1777449355597.png"
          alt="Rangeela Style"
          fill
          className="object-cover opacity-90 transition-transform duration-[2s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-20 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4 bg-white/10 w-max px-3 py-1 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Verified Artisan Quality</span>
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-6">Built for the Bold.</h2>
            <p className="text-lg text-white/70 font-medium leading-relaxed mb-8 italic">
              "Accessories shouldn't just complement an outfit; they should tell a story of rebellion and tradition."
            </p>
            <div className="flex gap-4">
              <div className="h-1 w-12 bg-[#cc2b2b] rounded-full"></div>
              <div className="h-1 w-4 bg-white/30 rounded-full"></div>
              <div className="h-1 w-4 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
