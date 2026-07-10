'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import './navbar.css';

/**
 * Marketing / app Navbar — three-slot sticky bar.
 *
 *  [logo]                        [center nav (>=1024px)]            [theme toggle] [CTA / hamburger]
 *
 * Spec coverage:
 *   (1) responsive three-slot layout, sticky, backdrop-blur, scroll-elevated
 *   (2) desktop nav links with animated underline + active state
 *   (3) dropdown menus with full keyboard support
 *   (4) mobile drawer with backdrop, body scroll lock, focus trap
 *   (5) CTA with 44px touch target, hidden <768px in top bar (rendered in drawer)
 *   (6) .hips-nav--scrolled class toggled on scroll
 *   (7) sun/moon theme toggle, 20x20, 44px hit area
 *   (8) ARIA + focus-visible + WCAG AA contrast (set via :root tokens)
 *   (9) all motion is transform/opacity, single canonical easing token
 */

type NavChild = { label: string; href: string };
type NavLink = { label: string; href: string; children?: NavChild[] };

// Stable nav data — defined outside the component so referential identity
// is preserved across renders.
const navLinks: ReadonlyArray<NavLink> = [
  { label: 'Services', href: '/services' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Story', href: '/about#mission' },
      { label: 'Contact', href: '/contact' },
      { label: 'Get Involved', href: '/opportunities' },
    ],
  },
  { label: 'Organizations', href: '/opportunities' },
  { label: 'Donate', href: '/donate' },
];

const roleLabels: Record<string, string> = {
  ORGBUYER: 'Partner',
  ADMIN: 'Admin',
  FACILITATOR: 'Facilitator',
  COORDINATOR: 'Coordinator',
};

const SCROLL_THRESHOLD = 0; // px — spec says "past 0px"

export const Navbar = React.memo(function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  // Theme is rendered via <ThemeToggle /> which calls useTheme() internally,
  // so we don't need to destructure it here.

  // --- state ---
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  // --- refs ---
  const navRef = React.useRef<HTMLElement>(null);
  const hamburgerRef = React.useRef<HTMLButtonElement>(null);
  const drawerRef = React.useRef<HTMLElement>(null);
  const dropdownTriggerRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const dropdownItemRefs = React.useRef<Map<string, HTMLAnchorElement>>(new Map());

  const closeDrawer = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const closeDropdown = React.useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // --- path helpers ---
  const isActive = React.useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/';
      return pathname === href || pathname?.startsWith(`${href}/`) === true;
    },
    [pathname],
  );

  const dropdownId = React.useCallback(
    (label: string) => `hips-dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`,
    [],
  );

  // --- effect: close transient UI on route change ---
  React.useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // --- effect: scroll listener — toggles elevation class ---
  React.useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // --- effect: drawer open — body scroll lock + Escape handler ---
  React.useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // --- effect: drawer open — focus trap ---
  React.useEffect(() => {
    if (!isOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    drawer.addEventListener('keydown', onTab);
    first.focus();
    return () => drawer.removeEventListener('keydown', onTab);
  }, [isOpen]);

  // --- effect: dropdown open — outside click + Escape ---
  React.useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        dropdownTriggerRefs.current.get(openDropdown)?.focus();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openDropdown]);

  // --- dropdown keyboard handler (trigger) ---
  const handleDropdownTriggerKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, label: string, childCount: number) => {
      const open = openDropdown === label;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) setOpenDropdown(label);
        requestAnimationFrame(() => {
          dropdownItemRefs.current.get(`${label}-0`)?.focus();
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) setOpenDropdown(label);
        requestAnimationFrame(() => {
          dropdownItemRefs.current.get(`${label}-${childCount - 1}`)?.focus();
        });
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpenDropdown(null);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpenDropdown(open ? null : label);
        if (!open) {
          requestAnimationFrame(() => {
            dropdownItemRefs.current.get(`${label}-0`)?.focus();
          });
        }
      }
    },
    [openDropdown],
  );

  // --- dropdown keyboard handler (item) ---
  const handleDropdownItemKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>, label: string, index: number, total: number) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        dropdownItemRefs.current.get(`${label}-${(index + 1) % total}`)?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        dropdownItemRefs.current.get(`${label}-${(index - 1 + total) % total}`)?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        dropdownItemRefs.current.get(`${label}-0`)?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        dropdownItemRefs.current.get(`${label}-${total - 1}`)?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpenDropdown(null);
        dropdownTriggerRefs.current.get(label)?.focus();
      }
    },
    [],
  );

  // --- handlers ---
  const handleToggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLinkClick = React.useCallback(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, []);

  const handleLogout = React.useCallback(() => {
    void logout();
    setIsOpen(false);
  }, [logout]);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className={`hips-nav${isScrolled ? ' hips-nav--scrolled' : ''}`}
        style={{ top: 'var(--global-disclaimer-height, 0px)' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* ----- Left slot: logo ----- */}
          <Link
            href="/"
            className="relative flex items-center space-x-3 shrink-0"
            aria-label="H.I.P.S. Foundation — Return to homepage"
          >
            <Image
              src="/hipslogo.png"
              alt="H.I.P.S. Logo"
              width={220}
              height={220}
              className="object-contain"
              quality={85}
              sizes="(max-width: 768px) 80px, 220px"
              priority
            />
            {role && role !== 'PARTICIPANT' && (
              <span className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-primary brand-caps">
                {roleLabels[role] ?? role}
              </span>
            )}
          </Link>

          {/* ----- Center slot: desktop nav (>=768px) ----- */}
          <ul className="hidden md:flex items-center gap-8 font-ui text-base tracking-[0.05em] list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href} className="relative">
                {link.children ? (
                  <>
                    <button
                      ref={(el) => {
                        if (el) dropdownTriggerRefs.current.set(link.label, el);
                      }}
                      type="button"
                      className="hips-nav-link"
                      data-active={isActive(link.href) ? 'true' : 'false'}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === link.label}
                      aria-controls={dropdownId(link.label)}
                      onClick={() =>
                        setOpenDropdown((prev) => (prev === link.label ? null : link.label))
                      }
                      onKeyDown={(e) =>
                        handleDropdownTriggerKeyDown(e, link.label, link.children!.length)
                      }
                    >
                      {link.label}
                      <ChevronDown
                        className="ml-1 w-3 h-3 transition-transform duration-200"
                        style={{
                          transform:
                            openDropdown === link.label ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={dropdownId(link.label)}
                      role="menu"
                      aria-label={`${link.label} submenu`}
                      className="hips-dropdown"
                      data-open={openDropdown === link.label ? 'true' : 'false'}
                    >
                      {link.children.map((child, i) => (
                        <Link
                          key={child.href}
                          ref={(el) => {
                            if (el) dropdownItemRefs.current.set(`${link.label}-${i}`, el);
                          }}
                          href={child.href}
                          role="menuitem"
                          className="hips-dropdown-item"
                          onClick={closeDropdown}
                          onKeyDown={(e) =>
                            handleDropdownItemKeyDown(
                              e,
                              link.label,
                              i,
                              link.children!.length,
                            )
                          }
                          tabIndex={openDropdown === link.label ? 0 : -1}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="hips-nav-link"
                    data-active={isActive(link.href) ? 'true' : 'false'}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    onClick={closeDropdown}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ----- Right slot: theme toggle + CTA (desktop) / + hamburger (mobile) ----- */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ThemeToggle />

            {/* CTA visible >=768px in top bar; below that it lives in the drawer */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="hips-top-cta"
                  aria-current={isActive('/dashboard') ? 'page' : undefined}
                >
                  <UserCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 h-11 flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-zinc-850 hover:text-white hover:border-zinc-700 transition-all font-ui cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="hips-top-cta hidden md:inline-flex">
                Login
              </Link>
            )}

            {/* Hamburger — <768px */}
            <button
              ref={hamburgerRef}
              type="button"
              className="hips-theme-toggle md:hidden"
              onClick={handleToggle}
              aria-expanded={isOpen}
              aria-controls="mobile-drawer"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ----- Mobile drawer backdrop ----- */}
      <div
        className="hips-drawer-backdrop md:hidden"
        data-open={isOpen ? 'true' : 'false'}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ----- Mobile drawer ----- */}
      <nav
        ref={drawerRef}
        id="mobile-drawer"
        className="hips-drawer md:hidden"
        data-open={isOpen ? 'true' : 'false'}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-divider)]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] font-ui font-bold">
            Menu
          </span>
          <button
            type="button"
            className="hips-theme-toggle"
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            tabIndex={isOpen ? 0 : -1}
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="hips-drawer-link"
                data-active={isActive(link.href) ? 'true' : 'false'}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={handleLinkClick}
                tabIndex={isOpen ? 0 : -1}
              >
                <span className="font-ui tracking-[0.05em] text-base font-semibold">
                  {link.label}
                </span>
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="hips-drawer-link pl-8 text-sm"
                  onClick={handleLinkClick}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className="text-[var(--color-text-muted)] font-body font-medium">{child.label}</span>
                </Link>
              ))}
            </div>
          ))}

          {/* Staff Portals Section (Mobile Drawer only) */}
          <div className="border-t border-[var(--color-divider)] mt-2">
            <div className="hips-drawer-link select-none pointer-events-none bg-surface-alt/30 border-b border-[var(--color-divider)]">
              <span className="font-ui tracking-[0.05em] text-base font-bold text-primary">
                Staff Portals
              </span>
            </div>
            <Link
              href="/login/facilitator"
              className="hips-drawer-link pl-8 text-sm"
              onClick={handleLinkClick}
              tabIndex={isOpen ? 0 : -1}
            >
              <span className="text-[var(--color-text-muted)] font-body font-medium">Facilitator Portal</span>
            </Link>
            <Link
              href="/login/admin"
              className="hips-drawer-link pl-8 text-sm"
              onClick={handleLinkClick}
              tabIndex={isOpen ? 0 : -1}
            >
              <span className="text-[var(--color-text-muted)] font-body font-medium">Admin Console</span>
            </Link>
          </div>
        </div>

        <div className="p-4 space-y-3 border-t border-[var(--color-divider)]">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hips-drawer-cta"
                onClick={handleLinkClick}
                tabIndex={isOpen ? 0 : -1}
              >
                <UserCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hips-drawer-link w-full text-center"
                tabIndex={isOpen ? 0 : -1}
              >
                <span className="font-ui tracking-[0.05em] text-base font-semibold text-[var(--color-danger)]">
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/services"
                className="hips-drawer-cta"
                onClick={handleLinkClick}
                tabIndex={isOpen ? 0 : -1}
              >
                Get Support
              </Link>
              <Link
                href="/login"
                className="hips-drawer-link text-center"
                onClick={handleLinkClick}
                tabIndex={isOpen ? 0 : -1}
              >
                <span className="font-ui tracking-[0.05em] text-base font-semibold">
                  Sign In
                </span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
