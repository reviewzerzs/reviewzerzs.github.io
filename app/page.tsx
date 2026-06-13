import type { Metadata } from 'next';
import HomeClient from '@/components/home-client';

export const metadata: Metadata = {
  title: 'Buy Google Reviews | #1 Reviews Marketplace — ReviewZerZ',
  description: 'Where can I buy reviews? ReviewZerZ lets you buy Google, Yelp & Facebook reviews from 10,000+ real writers. Boost your business ratings fast. Trusted by thousands worldwide.',
  alternates: { canonical: 'https://reviewzerz.com' },
  openGraph: {
    title: 'Buy Google, Yelp & Facebook Reviews | ReviewZerZ',
    description: 'Buy reviews from real writers. Boost your Google, Yelp & Facebook ratings today. 10,000+ verified reviewers. Secure payments.',
    url: 'https://reviewzerz.com',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
