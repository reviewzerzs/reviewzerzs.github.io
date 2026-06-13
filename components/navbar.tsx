"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Reviews' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/calculator', label: 'Calculator' },
    { href: '/blog', label: 'Blog' },
  ];

  const dashboardPath = profile?.role === 'reviewer' ? '/dashboard/reviewer' : '/dashboard/advertiser';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/Screenshot_2026-06-07_145557.png"
              alt="ReviewZerZ"
              width={140}
              height={48}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <React.Fragment key={link.href}>
                  {i > 0 && <span className="text-gray-300 select-none">|</span>}
                  <Link
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-[#333333]' : 'text-[#555555] hover:text-[#333333]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF6B6B] rounded-full" />
                    )}
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#007BFF] transition-colors text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-[#007BFF] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-[#333333]">
                    {profile?.full_name || profile?.email}
                  </span>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href={dashboardPath}
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#333333] hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut(); setProfileMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-5 py-2 rounded text-white text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#FF6B6B' }}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 rounded text-white text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#007BFF' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#333333]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4">
            <nav className="flex flex-col pt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-sm font-medium border-l-4 transition-colors ${
                      isActive
                        ? 'border-[#FF6B6B] text-[#333333] bg-gray-50'
                        : 'border-transparent text-[#555555] hover:text-[#333333] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-2 px-4 pt-4 border-t border-gray-100 mt-2">
              {user ? (
                <>
                  <Link
                    href={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded text-white text-sm font-bold"
                    style={{ backgroundColor: '#007BFF' }}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="py-3 rounded text-sm font-bold text-red-600 border border-red-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center py-3 rounded text-white text-sm font-bold uppercase tracking-wide"
                    style={{ backgroundColor: '#FF6B6B' }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center py-3 rounded text-white text-sm font-bold uppercase tracking-wide"
                    style={{ backgroundColor: '#007BFF' }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
