'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

// Stable nav links defined outside component to prevent recreation on re-renders
const navLinks: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/services', label: 'Services' },
  { href: '/organizations', label: 'Organizations' },
  { href: '/donate', label: 'Donate' },
];

// Human-readable role labels
const roleLabels: Record<string, string> = {
  ORGBUYER: 'Partner',
  ADMIN: 'Admin',
  FACILITATOR: 'Facilitator',
  COORDINATOR: 'Coordinator',
};

export const Navbar = React.memo(function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      toggleRef.current?.focus();
    }
  }, [isOpen]);

  // Add/remove Escape listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    menu.addEventListener('keydown', handleTabKey as EventListener);
    firstElement?.focus();

    return () => {
      menu.removeEventListener('keydown', handleTabKey as EventListener);
    };
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false);
  }, [logout]);

  const isActive = useCallback((href: string) => pathname === href, [pathname]);

  return (
    <>
      {/* Skip to content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:font-bold focus:rounded-lg"
      >
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed left-0 right-0 z-40 bg-white border-b border-zinc-200 pt-[env(safe-area-inset-top)] backdrop-blur-2xl shadow-sm transition-all"
        style={{ top: "var(--global-disclaimer-height, 0px)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center space-x-3 group"
            aria-label="H.I.P.S. Foundation - Return to homepage"
          >
            <Image
              src="/hipslogo.png"
              alt="H.I.P.S. Logo"
              width={220}
              height={220}
              className="object-contain transition-all duration-200 ease-in-out group-hover:opacity-80 group-hover:scale-[1.02]"
              quality={85}
            />
            {role && role !== 'PARTICIPANT' && (
              <span className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-primary brand-caps transition-all group-hover:bg-primary/20">
                {roleLabels[role] ?? role}
              </span>
            )}
          </Link>

          {/* Desktop Nav - uppercase with tracking per design.md */}
          <div
            className="hidden md:flex items-center space-x-10 font-bold uppercase tracking-[0.2em] font-ui text-sm"
            aria-label="Desktop navigation"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="relative text-[#173B57] hover:text-[#102A3D] transition-colors duration-200 ease-in-out group"
              >
                {link.label}
                <span
                  className={`
                    absolute -bottom-1 left-0 h-0.5 bg-[#C59A35] transition-all duration-200 ease-in-out
                    ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}
                  `}
                  aria-hidden="true"
                />
              </Link>
            ))}
            <div className="flex items-center space-x-4 pl-8 border-l border-zinc-200">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    aria-current={isActive('/dashboard') ? 'page' : undefined}
                    className="h-10 inline-flex items-center justify-center rounded-full px-6 text-primary hover:text-white hover:bg-primary transition-all duration-200 ease-in-out gap-2 font-ui text-sm uppercase tracking-[0.15em]"
                  >
                    <UserCircle className="w-4 h-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    title="Logout"
                    aria-label="Logout from your account"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="h-10 inline-flex items-center justify-center rounded-full px-6 text-primary hover:text-white hover:bg-primary transition-all duration-200 ease-in-out font-ui text-sm uppercase tracking-[0.15em] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/services"
                    className="h-11 inline-flex items-center justify-center rounded-full bg-[#173B57] px-8 text-white hover:bg-[#bb9644] shadow-xl shadow-[#173B57]/20 transition-all duration-200 ease-in-out active:scale-95 font-ui text-[10px] font-bold uppercase tracking-[0.15em] focus-visible:ring-2 focus-visible:ring-[#173B57] focus-visible:ring-offset-2"
                  >
                    Get Support
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            ref={toggleRef}
            className="md:hidden p-2 text-zinc-500 hover:text-primary transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="md:hidden border-t border-zinc-100 bg-white backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300 pb-[env(safe-area-inset-bottom)]"
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  role="menuitem"
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="text-base font-medium text-primary hover:text-accent hover:underline underline-offset-4 transition-all duration-200 ease-in-out font-ui uppercase tracking-[0.15em]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="grid gap-3 pt-6 border-t border-zinc-100">
                {user ? (
                  <>
                    <Link
                      role="menuitem"
                      className="h-12 w-full inline-flex items-center justify-center rounded-lg border border-zinc-200 text-base font-medium text-primary hover:text-white hover:bg-primary transition-all duration-200 ease-in-out font-ui uppercase tracking-[0.15em]"
                      href="/dashboard"
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </Link>
                    <button
                      role="menuitem"
                      className="h-12 w-full inline-flex items-center justify-center rounded-lg bg-red-50 border border-red-200 text-base font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 ease-in-out font-ui uppercase tracking-[0.15em] focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      role="menuitem"
                      className="h-12 w-full inline-flex items-center justify-center rounded-lg border border-zinc-200 text-base font-medium text-primary hover:text-white hover:bg-primary transition-all duration-200 ease-in-out font-ui uppercase tracking-[0.15em]"
                      href="/login"
                      onClick={handleLinkClick}
                    >
                      Sign In
                    </Link>
                    <Link
                      role="menuitem"
                      className="h-12 w-full inline-flex items-center justify-center rounded-lg bg-[#173B57] text-base font-medium text-white hover:bg-[#bb9644] transition-all duration-200 ease-in-out font-ui text-[10px] font-bold uppercase tracking-[0.15em] focus-visible:ring-2 focus-visible:ring-[#173B57] focus-visible:ring-offset-2"
                      href="/services"
                      onClick={handleLinkClick}
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

      {/* Spacer div - height must match navbar height */}
      <div
        aria-hidden="true"
        className="h-[var(--navbar-height,5rem)]"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      />
    </>
  );
});