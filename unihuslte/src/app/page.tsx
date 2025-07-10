'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, BookOpen, Laptop, Car, Home, Shirt, Gamepad2, ArrowRight, TrendingUp } from 'lucide-react'
import ListingCard from '@/components/ListingCard'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  tags: string
  imageUrl?: string
  contact: string
  campus: string
  createdAt: string
  user: {
    name: string
  }
}

const categories = [
  { name: 'Books', icon: BookOpen, color: 'bg-blue-500' },
  { name: 'Electronics', icon: Laptop, color: 'bg-purple-500' },
  { name: 'Transportation', icon: Car, color: 'bg-red-500' },
  { name: 'Accommodation', icon: Home, color: 'bg-green-500' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-500' },
  { name: 'Gaming', icon: Gamepad2, color: 'bg-indigo-500' },
]

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedListings()
  }, [])

  const fetchFeaturedListings = async () => {
    try {
      const response = await fetch('/api/listings?limit=6')
      if (response.ok) {
        const data = await response.json()
        setFeaturedListings(data.listings)
      }
    } catch (error) {
      console.error('Error fetching featured listings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            UniHuslte
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            The Student Marketplace for Nigeria
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            Buy and sell products and services with fellow students. 
            From textbooks to electronics, find everything you need on campus.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/marketplace"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Search className="mr-2" size={20} />
              Browse Marketplace
            </Link>
            <Link
              href="/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
            >
              <TrendingUp className="mr-2" size={20} />
              Start Hustling Now
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, services, or categories..."
                className="w-full px-4 py-3 pl-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = e.currentTarget.value
                    if (query.trim()) {
                      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`
                    }
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our popular categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/marketplace?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon size={32} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Listings
              </h2>
              <p className="text-gray-600">
                Check out the latest products and services from your fellow students
              </p>
            </div>
            <Link
              href="/marketplace"
              className="btn-outline hidden md:flex items-center"
            >
              View All
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No listings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to post a listing on UniHuslte!
              </p>
              <Link href="/add-listing" className="btn-primary">
                Create Listing
              </Link>
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="text-center mt-8 md:hidden">
            <Link href="/marketplace" className="btn-outline inline-flex items-center">
              View All Listings
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How UniHuslte Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start buying and selling with fellow students in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sign Up & Verify
              </h3>
              <p className="text-gray-600">
                Create your account with your university email and verify it with OTP
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                List or Browse
              </h3>
              <p className="text-gray-600">
                Create listings for items you want to sell or browse what others are offering
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect & Trade
              </h3>
              <p className="text-gray-600">
                Contact sellers directly via WhatsApp or email to make the deal
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
