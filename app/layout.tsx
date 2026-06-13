import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ReviewZerZ — Buy Google Reviews | #1 Reviews Marketplace',
    template: '%s | ReviewZerZ',
  },
  description: 'Where can I buy reviews? ReviewZerZ is the #1 marketplace to buy Google, Yelp & Facebook reviews from real writers. Boost your business ratings fast. 10,000+ verified reviewers worldwide.',
  keywords: ['buy reviews', 'buy Google reviews', 'where can I buy reviews', 'buy Yelp reviews', 'buy Facebook reviews', 'reviews marketplace', 'buy online reviews', 'boost Google rating', 'purchase reviews', 'review writers for hire'],
  authors: [{ name: 'ReviewZerZ' }],
  creator: 'ReviewZerZ',
  metadataBase: new URL('https://reviewzerz.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reviewzerz.com',
    siteName: 'ReviewZerZ',
    title: 'ReviewZerZ — Buy Google, Yelp & Facebook Reviews | #1 Marketplace',
    description: 'Buy reviews from 10,000+ real writers. Boost your Google, Yelp & Facebook ratings today. Trusted by thousands of businesses worldwide.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ReviewZerZ — Buy Reviews Marketplace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReviewZerZ — Buy Google Reviews | #1 Reviews Marketplace',
    description: 'Buy reviews from real writers. Boost your Google, Yelp & Facebook ratings fast.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
