"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LifeBuoy, Menu, UserCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import "./navbar.css";

const DESKTOP_NAV_QUERY = "(min-width: 1280px)";
const NAVIGATION_LOGO_SIZES = "(max-width: 1535px) 192px, 216px";

type NavLink = { label: string; href: string };

const navLinks: ReadonlyArray<NavLink> = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Privacy", href: "/privacy" },
  { label: "About", href: "/about" },
];

type InertSnapshot = {
  element: HTMLElement;
  inert: string | null;
  ariaHidden: string | null;
};

function makeBackgroundInert(header: HTMLElement): () => void {
  const snapshots: InertSnapshot[] = [];
  let branch: HTMLElement = header;

  while (branch.parentElement) {
    const parent = branch.parentElement;
    for (const sibling of Array.from(parent.children)) {
      if (!(sibling instanceof HTMLElement) || sibling === branch) continue;
      snapshots.push({
        element: sibling,
        inert: sibling.getAttribute("inert"),
        ariaHidden: sibling.getAttribute("aria-hidden"),
      });
      sibling.setAttribute("inert", "");
      sibling.setAttribute("aria-hidden", "true");
    }
    if (parent === document.body) break;
    branch = parent;
  }

  return () => {
    for (const snapshot of snapshots) {
      if (snapshot.inert === null) snapshot.element.removeAttribute("inert");
      else snapshot.element.setAttribute("inert", snapshot.inert);
      if (snapshot.ariaHidden === null) snapshot.element.removeAttribute("aria-hidden");
      else snapshot.element.setAttribute("aria-hidden", snapshot.ariaHidden);
    }
  };
}

function TrustFirstHeaderImpl() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  const isCurrentPage = React.useCallback((href: string) => {
    if (href.includes("#")) return false;
    const path = href.split("#")[0] || "/";
    return path === "/" ? pathname === "/" : pathname === path || pathname?.startsWith(`${path}/`) === true;
  }, [pathname]);

  const closeDrawerAndRestoreFocus = React.useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);
  const handleLinkClick = React.useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleDrawerLinkClick = React.useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  const toggleDrawer = React.useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 0);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const header = navRef.current?.closest<HTMLElement>(".hips-header");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restoreBackground = header ? makeBackgroundInert(header) : () => undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawerAndRestoreFocus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreBackground();
    };
  }, [closeDrawerAndRestoreFocus, isOpen]);

  React.useEffect(() => {
    navRef.current?.toggleAttribute("inert", isOpen);
    drawerRef.current?.toggleAttribute("inert", !isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || !drawerRef.current) return;
    const drawer = drawerRef.current;
    const focusable = Array.from(drawer.querySelectorAll<HTMLElement>('a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])'))
      .filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    drawer.addEventListener("keydown", onKeyDown);
    return () => drawer.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  React.useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_NAV_QUERY);
    const closeTransientNavigation = () => {
      setIsOpen(false);
    };
    desktopQuery.addEventListener("change", closeTransientNavigation);
    return () => desktopQuery.removeEventListener("change", closeTransientNavigation);
  }, []);

  return (
    <>
      <header className="hips-header">
      <nav ref={navRef} aria-label="Primary" aria-hidden={isOpen || undefined} className={`hips-nav${isScrolled ? " hips-nav--scrolled" : ""}`}>
        <div className="hips-nav-content hips-layout-container">
          <Link href="/" className="hips-brand" aria-label="H.I.P.S. Foundation — return to homepage" onClick={handleLinkClick}>
            <Image src="/hipslogo.png" alt="" width={220} height={220} className="hips-brand-logo" priority sizes={NAVIGATION_LOGO_SIZES} />
          </Link>

          <ul className="hips-nav-main" aria-label="Orientation links">
            {navLinks.map((link) => (
              <li key={link.label} className="hips-nav-item">
                <Link href={link.href} className="hips-nav-link" data-active={isCurrentPage(link.href) ? "true" : "false"} aria-current={isCurrentPage(link.href) ? "page" : undefined} onClick={handleLinkClick}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <div className="hips-nav-actions" data-has-crisis={!isHomepage ? "true" : "false"}>
            {!isHomepage && <Link href="/crisis" className="hips-crisis-link" aria-label="Crisis resources" aria-current={pathname === "/crisis" ? "page" : undefined}><LifeBuoy className="h-4 w-4" aria-hidden="true" /><span className="hips-crisis-label-long" aria-hidden="true">Crisis resources</span><span className="hips-crisis-label-short" aria-hidden="true">Crisis</span></Link>}
            <Link href="/services" className="hips-support-link">Find support</Link>
            <div className="hips-account-actions" role="group" aria-label="Account and display settings">
              {user ? <Link href="/dashboard" className="hips-login-link"><UserCircle className="h-4 w-4" aria-hidden="true" />Dashboard</Link> : <Link href="/login" className="hips-login-link">Login</Link>}
              <ThemeToggle showLabel />
            </div>
          </div>

          <div className="hips-mobile-actions">
            {!isHomepage && <Link href="/crisis" className="hips-mobile-crisis" aria-label="Crisis resources"><LifeBuoy className="h-4 w-4" aria-hidden="true" /><span>Crisis resources</span></Link>}
            <button ref={menuButtonRef} type="button" className="hips-menu-button" onClick={toggleDrawer} aria-expanded={isOpen} aria-controls="hips-mobile-drawer" aria-label={isOpen ? "Close menu" : "Open menu"}>{isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}</button>
          </div>
        </div>
      </nav>
      <div className="hips-drawer-backdrop" data-open={isOpen ? "true" : "false"} onClick={closeDrawerAndRestoreFocus} aria-hidden="true" />
      <div ref={drawerRef} id="hips-mobile-drawer" className="hips-drawer" data-open={isOpen ? "true" : "false"} role="dialog" aria-modal="true" aria-labelledby="hips-mobile-drawer-title" aria-hidden={!isOpen}>
        <div className="hips-drawer-header"><span id="hips-mobile-drawer-title">Menu</span><button type="button" className="hips-menu-button" onClick={closeDrawerAndRestoreFocus} aria-label="Close menu" tabIndex={isOpen ? 0 : -1}><X className="h-5 w-5" aria-hidden="true" /></button></div>
        <div className="hips-drawer-body">
          <Link href="/services" className="hips-drawer-support" onClick={handleDrawerLinkClick} tabIndex={isOpen ? 0 : -1}>Find support</Link>
          <nav aria-label="Mobile menu">
          <ul className="hips-drawer-links">
            <li><Link href="/#how-it-works" className="hips-drawer-link" onClick={handleDrawerLinkClick} tabIndex={isOpen ? 0 : -1}>How it works</Link></li>
            <li><Link href="/privacy" className="hips-drawer-link" data-active={isCurrentPage("/privacy") ? "true" : "false"} aria-current={isCurrentPage("/privacy") ? "page" : undefined} onClick={handleDrawerLinkClick} tabIndex={isOpen ? 0 : -1}>Privacy</Link></li>
            <li><Link href="/about" className="hips-drawer-link" data-active={isCurrentPage("/about") ? "true" : "false"} aria-current={isCurrentPage("/about") ? "page" : undefined} onClick={handleDrawerLinkClick} tabIndex={isOpen ? 0 : -1}>About</Link></li>
            <li><Link href="/crisis" className="hips-drawer-link hips-drawer-crisis" data-active={isCurrentPage("/crisis") ? "true" : "false"} aria-current={isCurrentPage("/crisis") ? "page" : undefined} onClick={handleDrawerLinkClick} tabIndex={isOpen ? 0 : -1}>Crisis options</Link></li>
            <li><Link href={user ? "/dashboard" : "/login"} className="hips-drawer-link" onClick={handleDrawerLinkClick} tabIndex={isOpen ? 0 : -1}>{user ? "Dashboard" : "Login"}</Link></li>
          </ul>
          </nav>
        </div>
        <div className="hips-drawer-utilities"><ThemeToggle tabIndex={isOpen ? 0 : -1} /><span>Theme</span></div>
      </div>
      </header>
    </>
  );
}

export const TrustFirstHeader = React.memo(TrustFirstHeaderImpl);
export const Navbar = TrustFirstHeader;
