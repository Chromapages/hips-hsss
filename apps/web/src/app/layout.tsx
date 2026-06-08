import type { Metadata } from "next";
import { DM_Sans, Source_Sans_3, Montserrat } from "next/font/google";
import { ToastProvider } from "@/components/polish/ToastProvider";
import { GlobalFooter } from "@/components/polish/GlobalFooter";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import "./globals.css";
import "./trust-strip-animations.css";

/**
 * Inline pre-paint script: reads the persisted theme from localStorage and
 * applies data-theme to <html> BEFORE first paint, preventing a flash of
 * the wrong theme. Runs synchronously in the document <head> and is
 * intentionally minimal. Must stay in sync with ThemeProvider.STORAGE_KEY.
 *
 * Also sets data-theme-ready="" so the smooth theme transition (defined in
 * globals.css on html) is suppressed until the body has mounted. The
 * ThemeProvider then clears/re-sets data-theme-ready on every user-driven
 * theme change so transitions only animate when the user clicks the toggle.
 */
const themeBootstrapScript = `
(function(){
  try {
    var stored = localStorage.getItem('hips-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = (stored === 'dark' || stored === 'light') ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  // Mark first paint complete so the transition kicks in on subsequent toggles.
  document.documentElement.setAttribute('data-theme-ready', '');
})();
`.trim();

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "H.I.P.S. Foundation Platform",
  description: "Anonymous peer support with hard anonymity boundaries.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${sourceSans3.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="min-h-full flex flex-col pb-[env(safe-area-inset-bottom)] font-body text-text-primary" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AnalyticsTracker />
              {children}
              <GlobalFooter />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
