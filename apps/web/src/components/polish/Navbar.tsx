'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EyeOff, Menu, X, Shield, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout } = useAuth();

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/organizations', label: 'Organizations' },
    { href: '/donate', label: 'Donate' },
  ];

  return (
    <nav className="border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-50 transition-all pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center transition-all group-hover:rotate-6 group-hover:bg-indigo-600/20">
            <EyeOff className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col -space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tighter text-2xl text-white">HSSS</span>
              {role && role !== 'PARTICIPANT' && (
                <span className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-indigo-400">
                  {role}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500/80">Foundation</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10 text-[13px] font-bold uppercase tracking-wider">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-zinc-500 hover:text-white transition-all hover:tracking-[0.1em]"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center space-x-4 pl-8 border-l border-white/5">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="h-10 inline-flex items-center justify-center rounded-full px-6 text-zinc-400 hover:text-white hover:bg-white/5 transition-all gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  className="h-10 inline-flex items-center justify-center rounded-full px-6 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="h-11 inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-900/20 transition-all active:scale-95 active:bg-indigo-700"
                  href="/services"
                >
                  Get Support
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300 pb-[env(safe-area-inset-bottom)]">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-zinc-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid gap-3 pt-6 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    className="h-12 w-full inline-flex items-center justify-center rounded-md border border-white/10 text-base font-medium text-white hover:bg-white/10"
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="h-12 w-full inline-flex items-center justify-center rounded-md bg-red-500/10 border border-red-500/20 text-base font-medium text-red-400"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="h-12 w-full inline-flex items-center justify-center rounded-md border border-white/10 text-base font-medium text-white hover:bg-white/10"
                    href="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    className="h-12 w-full inline-flex items-center justify-center rounded-md bg-indigo-600 text-base font-medium text-white hover:bg-indigo-500"
                    href="/services"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Support
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
