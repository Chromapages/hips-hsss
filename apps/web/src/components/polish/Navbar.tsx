'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EyeOff, Menu, X, Shield } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/organizations', label: 'Organizations' },
    { href: '/donate', label: 'Donate' },
  ];

  return (
    <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center transition-transform group-hover:scale-110">
            <EyeOff className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl text-white">H.I.P.S.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
            <Link
              className="h-10 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              href="/sign-in"
            >
              Sign In
            </Link>
            <Link
              className="h-10 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              href="/services"
            >
              Get Support
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid gap-3 pt-6 border-t border-white/10">
              <Link
                className="h-12 w-full inline-flex items-center justify-center rounded-md border border-white/10 text-base font-medium text-white hover:bg-white/10"
                href="/sign-in"
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
