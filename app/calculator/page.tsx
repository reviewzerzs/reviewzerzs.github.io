'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Zap,
  CheckCircle,
} from 'lucide-react';

interface CalculatorState {
  reviewCount: number;
  platforms: string[];
  location: string;
  rating: string;
  speed: string;
}

const COST_CONFIG = {
  platforms: {
    Google: 1.0,
    Facebook: 0.8,
    Yelp: 1.2,
    'App Store': 1.3,
  },
  location: {
    Local: 1.0,
    National: 1.3,
    International: 1.6,
  },
  speed: {
    'Standard (7 days)': 1.0,
    'Express (5 days)': 1.2,
    'Rush (3 days)': 1.5,
  },
};

const BASE_COST_PER_REVIEW = 10;
const SERVICE_FEE_PERCENT = 15;

export default function CalculatorPage() {
  const [calculator, setCalculator] = useState<CalculatorState>({
    reviewCount: 10,
    platforms: ['Google'],
    location: 'Local',
    rating: '5',
    speed: 'Standard (7 days)',
  });

  const handleReviewCountChange = (value: number) => {
    setCalculator((prev) => ({ ...prev, reviewCount: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setCalculator((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleLocationChange = (location: string) => {
    setCalculator((prev) => ({ ...prev, location }));
  };

  const handleRatingChange = (rating: string) => {
    setCalculator((prev) => ({ ...prev, rating }));
  };

  const handleSpeedChange = (speed: string) => {
    setCalculator((prev) => ({ ...prev, speed }));
  };

  // Calculate costs
  const platformMultiplier =
    calculator.platforms.length > 0
      ? calculator.platforms.reduce(
          (sum, platform) =>
            sum + (COST_CONFIG.platforms[platform as keyof typeof COST_CONFIG.platforms] || 1),
          0
        ) / calculator.platforms.length
      : 1;

  const locationMultiplier =
    COST_CONFIG.location[calculator.location as keyof typeof COST_CONFIG.location] || 1;
  const speedMultiplier =
    COST_CONFIG.speed[calculator.speed as keyof typeof COST_CONFIG.speed] || 1;

  const costPerReview =
    BASE_COST_PER_REVIEW * platformMultiplier * locationMultiplier * speedMultiplier;
  const subtotal = costPerReview * calculator.reviewCount;
  const serviceFee = subtotal * (SERVICE_FEE_PERCENT / 100);
  const totalCost = subtotal + serviceFee;

  // Estimate timeline based on speed
  const timelineMap: Record<string, string> = {
    'Standard (7 days)': '7-10 days',
    'Express (5 days)': '5-7 days',
    'Rush (3 days)': '3-5 days',
  };
  const estimatedTimeline = timelineMap[calculator.speed] || '7-10 days';

  // ROI projection (rough estimate)
  const visibilityImprovement = Math.min(calculator.reviewCount * 2, 100);
  const estimatedNewCustomers = Math.ceil((calculator.reviewCount / 5) * 3);
  const estimatedRevenue = estimatedNewCustomers * 150;
  const roi = ((estimatedRevenue - totalCost) / totalCost) * 100;

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 border-b border-gray-200">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#333333' }}>
              Reviews Calculator
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Estimate your review investment and see potential ROI
            </p>
          </div>
        </div>
      </section>

      {/* Main Calculator Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="lg:col-span-1">
              <div
                className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6"
                style={{ borderTop: '4px solid #007BFF' }}
              >
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-8" style={{ color: '#333333' }}>
                    Configure Your Package
                  </h2>

                  {/* Number of Reviews */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block font-semibold" style={{ color: '#333333' }}>
                        Number of Reviews
                      </label>
                      <span
                        className="text-sm font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#E8F3FF', color: '#007BFF' }}
                      >
                        {calculator.reviewCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={calculator.reviewCount}
                      onChange={(e) => handleReviewCountChange(parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        accentColor: '#007BFF',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1</span>
                      <span>100</span>
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <div className="mb-8">
                    <label className="block font-semibold mb-4" style={{ color: '#333333' }}>
                      Platforms
                    </label>
                    <div className="space-y-3">
                      {Object.keys(COST_CONFIG.platforms).map((platform) => (
                        <label
                          key={platform}
                          className="flex items-center p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition"
                        >
                          <input
                            type="checkbox"
                            checked={calculator.platforms.includes(platform)}
                            onChange={() => handlePlatformToggle(platform)}
                            className="w-5 h-5 rounded cursor-pointer"
                            style={{ accentColor: '#007BFF' }}
                          />
                          <span className="ml-3 text-sm font-medium" style={{ color: '#333333' }}>
                            {platform}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Targeting */}
                  <div className="mb-8">
                    <label className="block font-semibold mb-4" style={{ color: '#333333' }}>
                      Location Targeting
                    </label>
                    <div className="space-y-3">
                      {Object.keys(COST_CONFIG.location).map((location) => (
                        <label
                          key={location}
                          className="flex items-center p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition"
                        >
                          <input
                            type="radio"
                            name="location"
                            value={location}
                            checked={calculator.location === location}
                            onChange={() => handleLocationChange(location)}
                            className="w-5 h-5 cursor-pointer"
                            style={{ accentColor: '#007BFF' }}
                          />
                          <span className="ml-3 text-sm font-medium" style={{ color: '#333333' }}>
                            {location}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating Target */}
                  <div className="mb-8">
                    <label className="block font-semibold mb-4" style={{ color: '#333333' }}>
                      Rating Target
                    </label>
                    <select
                      value={calculator.rating}
                      onChange={(e) => handleRatingChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition font-medium"
                      style={{ color: '#333333' }}
                    >
                      <option value="3">3-4 Stars</option>
                      <option value="4">4-5 Stars</option>
                      <option value="5">5 Stars Only</option>
                    </select>
                  </div>

                  {/* Delivery Speed */}
                  <div className="mb-8">
                    <label className="block font-semibold mb-4" style={{ color: '#333333' }}>
                      Delivery Speed
                    </label>
                    <select
                      value={calculator.speed}
                      onChange={(e) => handleSpeedChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition font-medium"
                      style={{ color: '#333333' }}
                    >
                      <option value="Standard (7 days)">Standard (7 days)</option>
                      <option value="Express (5 days)">Express (5 days)</option>
                      <option value="Rush (3 days)">Rush (3 days)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cost Breakdown Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>
                  Cost Breakdown
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span style={{ color: '#6c757d' }}>Cost per Review</span>
                    <span className="font-semibold" style={{ color: '#333333' }}>
                      ${costPerReview.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span style={{ color: '#6c757d' }}>
                      Subtotal ({calculator.reviewCount} reviews × ${costPerReview.toFixed(2)})
                    </span>
                    <span className="font-semibold" style={{ color: '#333333' }}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span style={{ color: '#6c757d' }}>Service Fee ({SERVICE_FEE_PERCENT}%)</span>
                    <span className="font-semibold" style={{ color: '#333333' }}>
                      ${serviceFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold" style={{ color: '#333333' }}>
                      Total Cost
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: '#007BFF' }}
                    >
                      ${totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/auth/register?role=advertiser">
                  <button className="btn-primary w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Place an Order
                  </button>
                </Link>
              </div>

              {/* Timeline & ROI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timeline Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6" style={{ color: '#007BFF' }} />
                    <h4 className="font-bold text-lg" style={{ color: '#333333' }}>
                      Estimated Timeline
                    </h4>
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: '#007BFF' }}
                  >
                    {estimatedTimeline}
                  </p>
                  <p className="text-sm mt-3" style={{ color: '#6c757d' }}>
                    Based on {calculator.speed.toLowerCase()} delivery
                  </p>
                </div>

                {/* Visibility Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6" style={{ color: '#007BFF' }} />
                    <h4 className="font-bold text-lg" style={{ color: '#333333' }}>
                      Visibility Boost
                    </h4>
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: '#007BFF' }}
                  >
                    +{visibilityImprovement}%
                  </p>
                  <p className="text-sm mt-3" style={{ color: '#6c757d' }}>
                    Estimated increase in search visibility
                  </p>
                </div>
              </div>

              {/* ROI Projection Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 border-2" style={{ borderColor: '#007BFF' }}>
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-7 h-7" style={{ color: '#007BFF' }} />
                  <h4 className="font-bold text-xl" style={{ color: '#333333' }}>
                    ROI Projection
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#6c757d' }}>
                      Estimated New Customers
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#007BFF' }}>
                      {estimatedNewCustomers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#6c757d' }}>
                      Estimated Revenue
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#007BFF' }}>
                      ${estimatedRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#6c757d' }}>
                      ROI Return
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#007BFF' }}>
                      {roi.toFixed(0)}%
                    </p>
                  </div>
                </div>

                <p className="text-xs mt-6" style={{ color: '#6c757d' }}>
                  * Projections based on industry averages. Actual results may vary based on business type, industry, and market conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-white section-padding border-t border-gray-200">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#333333' }}>
            Tips for Maximum Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 mt-1" style={{ color: '#007BFF' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#333333' }}>
                  Multiple Platforms
                </h3>
                <p style={{ color: '#6c757d' }}>
                  Distribute reviews across multiple platforms to increase your online visibility and reach more potential customers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 mt-1" style={{ color: '#007BFF' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#333333' }}>
                  Target Your Audience
                </h3>
                <p style={{ color: '#6c757d' }}>
                  Choose location targeting that matches your service area to attract customers from your most profitable markets.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 mt-1" style={{ color: '#007BFF' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#333333' }}>
                  Consistent Delivery
                </h3>
                <p style={{ color: '#6c757d' }}>
                  Standard delivery performs best for sustainable growth. Reserve rush delivery for peak seasons or special promotions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
