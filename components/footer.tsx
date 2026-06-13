import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/Screenshot_2026-06-07_145557.png"
                alt="ReviewZerZ"
                width={140}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              ReviewZerZ is a marketplace that connects companies that are looking to
              improve their online ranking score with reviews writers for hire.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#007BFF]" />
                <span>support@reviewzerz.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-[#007BFF] transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#007BFF] transition-colors">How It Works (Companies)</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#007BFF] transition-colors">How It Works (Reviewers)</Link></li>
              <li><Link href="/contact" className="hover:text-[#007BFF] transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Explore More</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/auth/register?role=advertiser" className="hover:text-[#007BFF] transition-colors">Buy Google Reviews</Link></li>
              <li><Link href="/auth/register?role=advertiser" className="hover:text-[#007BFF] transition-colors">Buy Facebook Reviews</Link></li>
              <li><Link href="/auth/register?role=advertiser" className="hover:text-[#007BFF] transition-colors">Buy Web Traffic</Link></li>
              <li><Link href="/auth/register?role=advertiser" className="hover:text-[#007BFF] transition-colors">Buy ORM Traffic</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms" className="hover:text-[#007BFF] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-[#007BFF] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="container-custom py-6">
          <p className="text-sm text-gray-400 text-center">
            ReviewZerZ &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
