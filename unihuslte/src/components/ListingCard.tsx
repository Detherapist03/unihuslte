'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, MapPin, Calendar, User, ExternalLink } from 'lucide-react'

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

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isImageError, setIsImageError] = useState(false)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
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
    if (listing.contact.includes('@')) {
      // Email
      window.open(`mailto:${listing.contact}?subject=Interested in ${listing.title}`)
    } else {
      // WhatsApp
      const message = `Hi! I'm interested in your listing: ${listing.title}`
      window.open(`https://wa.me/${listing.contact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {listing.imageUrl && !isImageError ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={() => setIsImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {listing.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {listing.title}
          </h3>
          <span className="text-lg font-bold text-green-600 whitespace-nowrap">
            {formatPrice(listing.price)}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        {/* Tags */}
        {getTags(listing.tags).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {getTags(listing.tags).slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {getTags(listing.tags).length > 3 && (
              <span className="text-gray-400 text-xs px-2 py-1">
                +{getTags(listing.tags).length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <MapPin size={12} className="mr-1" />
            <span>{listing.campus}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            <span>{formatDate(listing.createdAt)}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User size={16} className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{listing.user.name}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/listing/${listing.id}`}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            <ExternalLink size={16} className="mr-2" />
            View Details
          </Link>
          <button
            onClick={handleContact}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
          >
            <MessageCircle size={16} className="mr-2" />
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}

// CSS for line-clamp (add to globals.css)
const styles = `
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`