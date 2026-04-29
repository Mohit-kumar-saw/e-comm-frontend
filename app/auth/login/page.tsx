"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { ShoppingBag, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Form side */}
      <div className="flex flex-col justify-center px-8 md:px-20 py-12 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-50 rounded-full translate-x-1/2 translate-y-1/2 -z-10"></div>

        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex flex-col items-center mb-12 group">
            <span className="text-3xl font-black tracking-[0.3em] text-[#cc2b2b] uppercase">Rangeela</span>
            <span className="text-xs tracking-[0.4em] font-light text-gray-400 group-hover:text-black transition-colors uppercase">STUDIO</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-[#111] mb-3">Welcome Back.</h1>
            <p className="text-gray-500 font-medium tracking-wide">Enter your details to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-8 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div className="space-y-2">
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
              <div className="flex justify-end px-2">
                <Link href="/auth/forgot-password" title="Coming Soon" className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">Forgot Password?</Link>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase hover:bg-[#cc2b2b] transition-all focus:ring-4 focus:ring-red-100 disabled:opacity-50 flex items-center justify-center gap-3 group shadow-2xl shadow-black/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> </>
              )}
            </button>
          </form>

          <p className="text-center mt-12 text-sm font-medium text-gray-500 tracking-wide">
            New to Rangeela? <Link href="/auth/signup" className="text-[#cc2b2b] font-bold hover:underline underline-offset-4">Create Account</Link>
          </p>
        </div>
      </div>

      {/* Side image */}
      <div className="hidden lg:block relative overflow-hidden bg-gray-100">
        <Image
          src="/images/hero_banner_womens_1777451578867.png"
          alt="Rangeela Studio"
          fill
          className="object-cover transition-transform duration-[3s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#cc2b2b]/40 to-black/80 flex flex-col justify-center p-20 text-white">
          <div className="max-w-md">
            <h2 className="text-6xl font-black tracking-tighter mb-8 leading-[0.9]">Experience True Craft.</h2>
            <p className="text-xl text-white/90 font-medium leading-relaxed mb-10">
              Log in to access your curated wishlist, saved addresses, and artisanal order history.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 bg-gray-300 overflow-hidden">
                    <div className="w-full h-full bg-black/40" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase">Join 50k+ Rebels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
