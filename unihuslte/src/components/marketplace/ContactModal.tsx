// Contact modal component for UniHuslte
'use client'
import React from 'react'
import { Mail, MessageSquare, ExternalLink } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Listing } from '@/types'

interface ContactModalProps {
  listing: Listing
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ listing, isOpen, onClose }: ContactModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price)
  }

  const handleEmailContact = () => {
    const subject = `Interested in: ${listing.title}`
    const body = `Hi ${listing.user?.fullName},\n\nI'm interested in your listing "${listing.title}" posted on UniHuslte.\n\nPrice: ${formatPrice(listing.price)}\n\nPlease let me know if it's still available.\n\nThanks!`
    
    const emailUrl = `mailto:${listing.user?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(emailUrl, '_blank')
  }

  const handleWhatsAppContact = () => {
    // For demo purposes, we'll use a generic WhatsApp message
    // In a real app, you'd have the user's phone number in the database
    const message = `Hi! I'm interested in your listing "${listing.title}" on UniHuslte. Is it still available?`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Seller"
      size="md"
    >
      <div className="space-y-6">
        {/* Listing Preview */}
        <Card className="bg-gray-50">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {listing.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{listing.title}</h3>
              <p className="text-blue-600 font-semibold">{formatPrice(listing.price)}</p>
              <p className="text-sm text-gray-600 mt-1">{listing.category}</p>
            </div>
          </div>
        </Card>

        {/* Seller Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {listing.user ? getInitials(listing.user.fullName) : 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {listing.user?.fullName || 'Student'}
            </h4>
            <p className="text-sm text-gray-600">
              {listing.user?.university?.name || 'University Student'}
            </p>
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Choose how to contact:</h4>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handleEmailContact}
            className="w-full justify-start"
          >
            <Mail size={20} className="mr-3" />
            <div className="text-left">
              <div className="font-medium">Send Email</div>
              <div className="text-sm opacity-90">
                Opens your email app with a pre-filled message
              </div>
            </div>
            <ExternalLink size={16} className="ml-auto" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleWhatsAppContact}
            className="w-full justify-start"
          >
            <MessageSquare size={20} className="mr-3" />
            <div className="text-left">
              <div className="font-medium">WhatsApp Message</div>
              <div className="text-sm text-gray-600">
                Opens WhatsApp with a pre-filled message
              </div>
            </div>
            <ExternalLink size={16} className="ml-auto" />
          </Button>
        </div>

        {/* Safety Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-medium text-yellow-800 mb-2">Safety Tips:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Meet in public places on campus</li>
            <li>• Inspect items before payment</li>
            <li>• Use secure payment methods</li>
            <li>• Trust your instincts</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}