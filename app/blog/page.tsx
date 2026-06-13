'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, Tag, ArrowRight, MessageCircle, FileText } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  created_at?: string;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'What Are The Benefits Of Having Positive Google Reviews For Your Company?',
    excerpt: 'Discover how positive Google reviews can transform your business reputation and drive customer trust.',
    category: 'Google Reviews',
    slug: 'benefits-google-reviews',
  },
  {
    id: '2',
    title: 'How To Optimize Your Google Business Profile Page',
    excerpt: 'Learn the best practices to optimize your Google Business Profile and improve visibility.',
    category: 'Local SEO',
    slug: 'optimize-google-business-profile',
  },
  {
    id: '3',
    title: 'Google Reviews 101',
    excerpt: 'A comprehensive guide to understanding Google Reviews and how they impact your business.',
    category: 'Guides',
    slug: 'google-reviews-101',
  },
  {
    id: '4',
    title: 'Why Are Google Reviews So Important?',
    excerpt: 'Explore the critical role Google Reviews play in modern business success.',
    category: 'Google Reviews',
    slug: 'why-google-reviews-important',
  },
  {
    id: '5',
    title: 'How Can Google Local Guides Get Paid For Their Reviews?',
    excerpt: 'Understand the opportunities for Google Local Guides to earn rewards.',
    category: 'Local Guides',
    slug: 'local-guides-paid-reviews',
  },
  {
    id: '6',
    title: 'The Importance of Local SEO',
    excerpt: 'Master local SEO strategies to dominate your local search market.',
    category: 'Local SEO',
    slug: 'importance-local-seo',
  },
  {
    id: '7',
    title: 'Buy Google Reviews by Location in the USA',
    excerpt: 'Learn about location-based strategies for building your review portfolio.',
    category: 'Google Reviews',
    slug: 'buy-reviews-location-usa',
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt, category, slug, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading blog posts:', error);
          setPosts(SAMPLE_POSTS);
        } else if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(SAMPLE_POSTS);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setPosts(SAMPLE_POSTS);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const popularPosts = posts.slice(0, 3);
  const latestPosts = posts.slice(3);

  const categories = Array.from(new Set(posts.map(post => post.category))).sort();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#333333' }}>
              Blog
            </h1>
            <p className="text-xl" style={{ color: '#6c757d' }}>
              Insights on reviews, reputation management, and local SEO
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p style={{ color: '#6c757d' }}>Loading blog posts...</p>
                </div>
              ) : (
                <>
                  {/* Popular Articles */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-8" style={{ color: '#333333' }}>
                      Popular Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      {popularPosts.map((post) => (
                        <div
                          key={post.id}
                          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        >
                          {/* Thumbnail */}
                          <div
                            className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"
                          >
                            <FileText className="w-16 h-16 text-white" />
                          </div>

                          {/* Card Content */}
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Tag className="w-4 h-4" style={{ color: '#007BFF' }} />
                              <span
                                className="text-sm font-semibold"
                                style={{ color: '#007BFF' }}
                              >
                                {post.category}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold mb-3 line-clamp-2" style={{ color: '#333333' }}>
                              {post.title}
                            </h3>

                            <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6c757d' }}>
                              {post.excerpt}
                            </p>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                              style={{ color: '#007BFF' }}
                            >
                              Read More
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Articles */}
                  {latestPosts.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-bold mb-8" style={{ color: '#333333' }}>
                        Latest Articles
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {latestPosts.map((post) => (
                          <div
                            key={post.id}
                            className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0"
                          >
                            {/* Thumbnail */}
                            <div
                              className="w-24 h-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"
                            >
                              <FileText className="w-10 h-10 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-3 h-3" style={{ color: '#007BFF' }} />
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: '#007BFF' }}
                                >
                                  {post.category}
                                </span>
                              </div>

                              <h3 className="font-bold mb-2 line-clamp-2" style={{ color: '#333333' }}>
                                {post.title}
                              </h3>

                              <p className="text-sm mb-3 line-clamp-2" style={{ color: '#6c757d' }}>
                                {post.excerpt}
                              </p>

                              <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
                                style={{ color: '#007BFF' }}
                              >
                                Read More
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Categories */}
              <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#f8f9fa' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#333333' }}>
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg transition-colors hover:bg-white"
                      style={{ color: '#6c757d' }}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{category}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Write for Us CTA */}
              <div
                className="rounded-lg p-6 text-white"
                style={{ backgroundColor: '#007BFF' }}
              >
                <MessageCircle className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">Write for Us</h3>
                <p className="text-sm mb-4 opacity-90">
                  Have insights to share? We'd love to feature your expertise.
                </p>
                <Link
                  href="/contact"
                  className="inline-block py-2 px-4 bg-white text-blue-600 font-semibold rounded-lg transition-opacity hover:opacity-90"
                >
                  Get in Touch
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
