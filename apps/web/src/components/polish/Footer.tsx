import Link from "next/link";
import { EyeOff, Mail } from "lucide-react";

const FOOTER_LINKS = {
  Services: [
    { label: "Peer Support", href: "/services/peer-support-1on1" },
    { label: "Group Coaching", href: "/services/group-coaching-stress" },
    { label: "Workshops", href: "/services/career-transition-workshop" },
    { label: "Scholarship", href: "/scholarship" },
  ],
  Organization: [
    { label: "About", href: "/about" },
    { label: "Organizations", href: "/opportunities" },
    { label: "Donate", href: "/donate" },
    { label: "Crisis Resources", href: "/crisis" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Compliance", href: "/compliance" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      className="border-t border-border bg-surface"
    >
      <div className="container mx-auto px-6 max-w-6xl py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center motion-safe:group-hover:rotate-6 transition-all">
                <EyeOff
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-bold tracking-tight text-xl text-text-primary font-heading">
                  HSSS
                </span>
                <span className="text-[9px] font-bold uppercase tracking-brand text-text-muted">
                  Sanctuary
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-xs">
              Anonymous peer support with mathematical identity decoupling.
              Built for crisis, designed for trust.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <nav
              key={heading}
              aria-label={`${heading} links`}
              className="flex flex-col gap-3"
            >
              <h2 className="text-[10px] font-bold uppercase tracking-brand text-text-muted">
                {heading}
              </h2>
              <ul className="space-y-2 list-none p-0">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {year} H.I.P.S. Foundation. All rights reserved.
          </p>
          <Link
            href="mailto:support@hips.foundation"
            className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            data-analytics="footer-email"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            support@hips.foundation
          </Link>
        </div>
      </div>
    </footer>
  );
}
