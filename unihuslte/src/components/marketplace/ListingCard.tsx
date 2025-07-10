// Listing card component for UniHuslte marketplace
'use client'
import React from 'react'
import Image from 'next/image'
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
  onContact: (listing: Listing) => void
}

export default function ListingCard({ listing, onContact }: ListingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Card hover className="overflow-hidden">
      {/* Image */}
      <div className="aspect-w-16 aspect-h-12 bg-gray-200 mb-4">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-400 text-6xl font-bold">
              {listing.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and Price */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {listing.title}
          </h3>
          <div className="text-xl font-bold text-blue-600 ml-2">
            {formatPrice(listing.price)}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {listing.description}
        </p>

        {/* Category and Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {listing.category}
          </span>
          {listing.tags && listing.tags.split(',').slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {listing.user ? getInitials(listing.user.fullName) : 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {listing.user?.fullName || 'Student'}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={12} className="mr-1" />
                {listing.user?.university?.name || 'University'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            {formatDate(new Date(listing.createdAt))}
          </div>
        </div>

        {/* Contact Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => onContact(listing)}
          className="w-full"
        >
          <MessageCircle size={16} className="mr-2" />
          Contact Seller
        </Button>
      </div>
    </Card>
  )
}