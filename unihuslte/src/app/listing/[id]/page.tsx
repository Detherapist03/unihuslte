'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Calendar, MapPin, User, School, Share2, Eye, Tag, Phone, Mail } from 'lucide-react'

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
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    university: string
    createdAt: string
  }
}

export default function ListingDetailPage() {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string)
    }
  }, [params.id])

  const fetchListing = async (id: string) => {
    try {
      const response = await fetch(`/api/listings/${id}`)
      if (response.ok) {
        const data = await response.json()
        setListing(data.listing)
      } else if (response.status === 404) {
        setError('Listing not found')
      } else {
        setError('Failed to load listing')
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
      setError('An error occurred while loading the listing')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getTags = (tagsString: string): string[] => {
    try {
      return tagsString ? JSON.parse(tagsString) : []
    } catch {
      return tagsString ? tagsString.split(',').map(tag => tag.trim()) : []
    }
  }

  const handleContact = () => {
    if (!listing) return

    if (listing.contact.includes('@')) {
      // Email
      window.open(`mailto:${listing.contact}?subject=Interested in ${listing.title}`)
    } else {
      // WhatsApp
      const message = `Hi! I'm interested in your listing: ${listing.title} (₦${listing.price.toLocaleString()})`
      window.open(`https://wa.me/${listing.contact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`)
    }
  }

  const handleShare = async () => {
    if (!listing) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this listing on UniHuslte: ${listing.title} - ${formatPrice(listing.price)}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Listing not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="mx-auto h-24 w-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                      {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                    </span>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {listing.campus}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(listing.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatPrice(listing.price)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    listing.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : listing.status === 'sold'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Tags */}
              {getTags(listing.tags).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Tag size={20} className="mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getTags(listing.tags).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleShare}
                  className="btn-secondary inline-flex items-center"
                >
                  <Share2 size={20} className="mr-2" />
                  Share Listing
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              
              <div className="flex items-center mb-4">
                <div className="bg-green-600 text-white p-3 rounded-full mr-4">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{listing.user.name}</h4>
                  <p className="text-sm text-gray-600">
                    Member since {new Date(listing.user.createdAt).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <School size={16} className="mr-3" />
                  <span className="text-sm">{listing.user.university}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-3" />
                  <span className="text-sm">{listing.campus}</span>
                </div>
              </div>

              {/* Contact Button */}
              {listing.status === 'active' && (
                <button
                  onClick={handleContact}
                  className="w-full btn-primary flex items-center justify-center mb-3"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Contact Seller
                </button>
              )}

              {/* Contact Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center">
                  {listing.contact.includes('@') ? (
                    <>
                      <Mail size={14} className="mr-2" />
                      <span>Email contact</span>
                    </>
                  ) : (
                    <>
                      <Phone size={14} className="mr-2" />
                      <span>WhatsApp contact</span>
                    </>
                  )}
                </div>
                <p>
                  Always meet in public places and verify items before payment.
                </p>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Meet in public, well-lit areas on campus
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Inspect items thoroughly before paying
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Don't share personal financial information
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Trust your instincts if something feels wrong
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}